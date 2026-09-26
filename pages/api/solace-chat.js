import Anthropic from "@anthropic-ai/sdk";
import { readSession, writeSession } from "../../lib/session";
import { hasActiveSubscription } from "../../lib/stripe";
import { freeLimit, today, usedToday } from "../../lib/usage";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-6";
const MAX_HISTORY = 20;
const MAX_CHARS = 4000;

const systemPrompt = `You are a compassionate, trained mental health coach. Your role is to:
- Listen with empathy and without judgment
- Provide support based on CBT (Cognitive Behavioral Therapy) and mindfulness principles
- Suggest coping strategies and grounding techniques when appropriate
- Encourage journaling and self-reflection
- Always remind users to seek professional help if they're in crisis
- Be warm, genuine, and supportive

Important: You are NOT a replacement for therapy. You're a supportive companion on their healing journey. If someone mentions self-harm or suicide, always encourage them to call 988 or text HOME to 741741.`;

// Keep only well-formed turns, starting with a user turn, capped in size.
function cleanHistory(messages) {
  const turns = (Array.isArray(messages) ? messages : [])
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim()
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
    .slice(-MAX_HISTORY);
  while (turns.length && turns[0].role !== "user") turns.shift();
  return turns;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const messages = cleanHistory(req.body?.messages);
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return res.status(400).json({ error: "Message required" });
  }

  const session = readSession(req);
  const pro = await hasActiveSubscription(session.cid).catch(() => false);
  const used = usedToday(session);

  if (!pro && used >= freeLimit()) {
    return res.status(402).json({
      error: "limit_reached",
      response:
        "You've used today's free messages. Upgrade to Solace Pro for unlimited conversations, or come back tomorrow. If you're struggling right now, please call or text 988.",
    });
  }

  try {
    const message_response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const response_text =
      message_response.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim() ||
      "I'm not able to respond to that, but I'm still here. If you're in crisis, please call or text 988.";

    let remaining = null;
    if (!pro) {
      writeSession(res, { ...session, day: today(), used: used + 1 });
      remaining = Math.max(0, freeLimit() - used - 1);
    }

    res.status(200).json({ response: response_text, remaining });
  } catch (error) {
    console.error("Error in chat:", error);
    res.status(500).json({
      response: "I had trouble responding. Please try again.",
    });
  }
}
