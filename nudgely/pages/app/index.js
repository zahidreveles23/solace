import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { migrate } from "../../lib/db";
import { loadDashboard } from "../../lib/dashboard-data";
import { post } from "../../lib/api";
import { APP_NAME } from "../../lib/site";

export async function getServerSideProps({ req }) {
  await migrate();
  return loadDashboard(req);
}

function Copy({ text }) {
  const [done, setDone] = useState(false);
  return (
    <button className="btn ghost small" type="button" onClick={async () => {
      try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); } catch {}
    }}>{done ? "Copied!" : "Copy"}</button>
  );
}

function Setup({ business }) {
  const router = useRouter();
  const [name, setName] = useState(business?.name || "");
  const [googleUrl, setGoogleUrl] = useState(business?.googleUrl || "");
  const [state, setState] = useState({ busy: false, error: "" });
  async function save(e) {
    e.preventDefault();
    setState({ busy: true, error: "" });
    try {
      await post("/api/business", { name, googleUrl });
      router.replace(router.asPath);
      setState({ busy: false, error: "" });
    } catch (err) {
      setState({ busy: false, error: err.message });
    }
  }
  return (
    <form className="card" onSubmit={save}>
      <h2>{business ? "Business details" : "Step 1: set up your review link"}</h2>
      <label htmlFor="bn">Business name</label>
      <input id="bn" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Fresh Cuts Barbershop" />
      <label htmlFor="gu">Your Google review link</label>
      <input id="gu" required value={googleUrl} onChange={(e) => setGoogleUrl(e.target.value)} placeholder="https://g.page/r/.../review" />
      <details style={{ marginTop: 8 }}>
        <summary className="small" style={{ cursor: "pointer" }}>How do I find my Google review link?</summary>
        <ol className="small muted" style={{ marginTop: 8, paddingLeft: 18 }}>
          <li>Sign in to the Google account that manages your business.</li>
          <li>Search Google for your business name. Your Business Profile appears at the top.</li>
          <li>Click <b>Ask for reviews</b> (or <b>Read reviews → Get more reviews</b>).</li>
          <li>Copy the link and paste it here.</li>
        </ol>
      </details>
      <button className="btn" style={{ marginTop: 16 }} disabled={state.busy}>{state.busy ? "Saving…" : "Save"}</button>
      {state.error && <p className="err">{state.error}</p>}
    </form>
  );
}

export default function Dashboard(p) {
  const [billingError, setBillingError] = useState("");
  const b = p.business;
  const sms = b && `Hi! Thanks for choosing ${b.name}. If you have 30 seconds, a quick Google review would really help us out: ${b.link}`;
  const emailBody = b && `Hi,\n\nThank you for choosing ${b.name}! If you were happy with us, would you mind leaving a quick review on Google? It takes about 30 seconds and really helps our small business:\n\n${b.link}\n\nThank you!\n${b.name}`;

  async function billing(path) {
    setBillingError("");
    try { window.location.href = (await post(path)).url; } catch (e) { setBillingError(e.message); }
  }

  return (
    <>
      <Head><title>{`Dashboard · ${APP_NAME}`}</title></Head>
      <header className="top"><div className="wrap">
        <Link href="/app" className="logo">{APP_NAME}</Link>
        <nav>
          {p.hasBilling && <a href="#" onClick={(e) => { e.preventDefault(); billing("/api/billing/portal"); }}>Billing</a>}
          <a href="/api/auth/logout">Log out</a>
        </nav>
      </div></header>

      <main className="wrap" style={{ paddingBottom: 60 }}>
        {!p.paid && p.active && (
          <div className="banner trial">
            <span><b>{p.trialDays} {p.trialDays === 1 ? "day" : "days"} left</b> in your free trial.</span>
            <button className="btn small" onClick={() => billing("/api/billing/checkout")}>Subscribe for $19/month</button>
          </div>
        )}
        {!p.active && (
          <div className="banner expired">
            <span><b>Your trial has ended.</b> Your review page is paused until you subscribe.</span>
            <button className="btn small" onClick={() => billing("/api/billing/checkout")}>Subscribe for $19/month</button>
          </div>
        )}
        {billingError && <p className="err">{billingError}</p>}

        {!b ? <Setup /> : (
          <>
            <div className="card">
              <h2>Last 30 days</h2>
              <div className="stats">
                <div className="stat"><b>{b.stats.visits}</b><span className="muted small">people opened your link</span></div>
                <div className="stat"><b>{b.stats.clicks}</b><span className="muted small">went to your Google review form</span></div>
                <div className="stat"><b>{b.stats.feedback}</b><span className="muted small">private messages</span></div>
              </div>
            </div>

            <div className="card">
              <h2>Your review link</h2>
              <div className="linkbox"><input readOnly value={b.link} onFocus={(e) => e.target.select()} /><Copy text={b.link} /></div>
              <p className="muted small" style={{ marginTop: 8 }}>
                <a href={b.link} target="_blank" rel="noreferrer">Preview what customers see →</a>
              </p>
            </div>

            <div className="grid2">
              <div className="card">
                <h2>Text a customer</h2>
                <p className="muted small">Send this right after the job, while they're happy.</p>
                <textarea readOnly rows={4} value={sms} style={{ marginTop: 10 }} />
                <div className="row" style={{ marginTop: 10 }}>
                  <Copy text={sms} />
                  <a className="btn small" href={`sms:?&body=${encodeURIComponent(sms)}`}>Open in Messages</a>
                </div>
              </div>
              <div className="card">
                <h2>Email a customer</h2>
                <p className="muted small">Works well for bookings and invoices.</p>
                <textarea readOnly rows={4} value={emailBody} style={{ marginTop: 10 }} />
                <div className="row" style={{ marginTop: 10 }}>
                  <Copy text={emailBody} />
                  <a className="btn small" href={`mailto:?subject=${encodeURIComponent(`Thanks for choosing ${b.name}!`)}&body=${encodeURIComponent(emailBody)}`}>Open in email</a>
                </div>
              </div>
            </div>

            <div className="card row" style={{ alignItems: "flex-start", gap: 24 }}>
              <img src={b.qr} alt="QR code for your review link" width={160} height={160} style={{ borderRadius: 8, border: "1px solid var(--line)" }} />
              <div style={{ flex: 1, minWidth: 220 }}>
                <h2>Counter QR code</h2>
                <p className="muted">Print it and put it by the register, on tables, or on receipts. Customers scan it and land on your review page.</p>
                <Link className="btn" href="/app/poster" target="_blank" style={{ marginTop: 12 }}>Open printable poster</Link>
              </div>
            </div>

            <div className="card">
              <h2>Private messages from customers</h2>
              {b.feedback.length === 0 ? <p className="muted">None yet. When customers message you privately, they'll show up here.</p> :
                b.feedback.map((f, i) => (
                  <div className="fb" key={i}>
                    <p>{f.message}</p>
                    <p className="muted small">{[f.name, f.contact].filter(Boolean).join(" · ") || "Anonymous"} · {new Date(f.created_at).toLocaleString()}</p>
                  </div>
                ))}
            </div>

            <Setup business={b} />
          </>
        )}
      </main>
    </>
  );
}
