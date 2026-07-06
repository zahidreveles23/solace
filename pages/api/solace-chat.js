import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, userId } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  try {
    const systemPrompt = `You are a compassionate, trained mental health coach. Your role is to:
- Listen with empathy and without judgment
- Provide support based on CBT (Cognitive Behavioral Therapy) and mindfulness principles
- Suggest coping strategies and grounding techniques when appropriate
- Encourage journaling and self-reflection
- Always remind users to seek professional help if they're in crisis
- Be warm, genuine, and supportive

Important: You are NOT a replacement for therapy. You're a supportive companion on their healing journey. If someone mentions self-harm or suicide, always encourage them to call 988 or text HOME to 741741.`;

    const message_response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 500,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    const response_text = message_response.content[0].text;

    res.status(200).json({
      response: response_text,
      userId: userId,
    });
  } catch (error) {
    console.error("Error in chat:", error);
    res.status(500).json({
      response: "I had trouble responding. Please try again.",
      error: error.message,
    });
  }
}
