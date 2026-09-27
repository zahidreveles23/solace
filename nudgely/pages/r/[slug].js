import Head from "next/head";
import { useState } from "react";
import { sql, migrate, isActive } from "../../lib/db";
import { post } from "../../lib/api";

export async function getServerSideProps({ params }) {
  await migrate();
  const [biz] = await sql`
    SELECT b.id, b.name, b.slug, u.trial_ends, u.sub_status
    FROM businesses b JOIN users u ON u.id = b.user_id WHERE b.slug = ${params.slug}`;
  if (!biz || !isActive(biz)) return { notFound: true };
  await sql`INSERT INTO events (business_id, type) VALUES (${biz.id}, 'visit')`;
  return { props: { name: biz.name, slug: biz.slug } };
}

export default function ReviewPage({ name, slug }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", message: "", website: "" });
  const [state, setState] = useState({ sending: false, sent: false, error: "" });

  async function send(e) {
    e.preventDefault();
    setState({ sending: true, sent: false, error: "" });
    try {
      await post("/api/feedback", { slug, ...form });
      setState({ sending: false, sent: true, error: "" });
    } catch (err) {
      setState({ sending: false, sent: false, error: err.message });
    }
  }

  return (
    <main className="center" style={{ padding: "0 20px" }}>
      <Head>
        <title>{`Review ${name}`}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 44 }}>⭐⭐⭐⭐⭐</div>
        <h1 style={{ fontSize: 28, marginTop: 10 }}>Thanks for choosing {name}!</h1>
        <p className="muted" style={{ marginTop: 10 }}>
          Would you take 30 seconds to leave us a review on Google? It helps other people find us and means a lot to our team.
        </p>
        <a className="btn" href={`/api/go/${slug}`} style={{ display: "block", marginTop: 22, padding: 16, fontSize: 18 }}>
          Leave a Google review
        </a>
        {!showForm && !state.sent && (
          <button className="btn ghost small" style={{ marginTop: 14 }} onClick={() => setShowForm(true)}>
            Or send a private message to the owner
          </button>
        )}
      </div>

      {showForm && !state.sent && (
        <form className="card" onSubmit={send}>
          <h2>Message the owner</h2>
          <p className="muted small">This goes straight to {name}. It is not posted publicly.</p>
          <label htmlFor="m">Your message</label>
          <textarea id="m" rows={4} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <label htmlFor="n">Name (optional)</label>
          <input id="n" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label htmlFor="c">Phone or email, if you'd like a reply (optional)</label>
          <input id="c" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })} style={{ position: "absolute", left: -9999 }} />
          <button className="btn" style={{ marginTop: 16 }} disabled={state.sending}>{state.sending ? "Sending…" : "Send"}</button>
          {state.error && <p className="err">{state.error}</p>}
        </form>
      )}
      {state.sent && <div className="card" style={{ textAlign: "center" }}><p className="ok" style={{ fontSize: 16 }}>Thank you! Your message was sent to the owner.</p></div>}
    </main>
  );
}
