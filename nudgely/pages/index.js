import Head from "next/head";
import Link from "next/link";
import { APP_NAME } from "../lib/site";

export default function Home() {
  return (
    <>
      <Head>
        <title>{`${APP_NAME}: get more Google reviews`}</title>
        <meta name="description" content="Turn happy customers into 5-star Google reviews. A simple review link, text message templates and a counter QR code. $19/month." />
      </Head>
      <header className="top"><div className="wrap">
        <Link href="/" className="logo">{APP_NAME.slice(0, -2)}<b>{APP_NAME.slice(-2)}</b></Link>
        <nav><Link href="/login">Log in</Link><Link href="/signup">Start free</Link></nav>
      </div></header>

      <section className="wrap" style={{ padding: "64px 20px 30px", textAlign: "center" }}>
        <h1>Get more 5-star Google reviews.<br />Get more customers.</h1>
        <p className="muted" style={{ fontSize: 19, maxWidth: 640, margin: "18px auto 0" }}>
          Most happy customers never leave a review because nobody asks at the right moment.
          {" "}{APP_NAME} gives you a one-tap review link, ready-to-send text messages and a counter QR code, so asking takes five seconds.
        </p>
        <div className="row" style={{ justifyContent: "center", marginTop: 26 }}>
          <Link className="btn" href="/signup">Start your 14-day free trial</Link>
        </div>
        <p className="muted small" style={{ marginTop: 10 }}>No card needed to start · Set up in 3 minutes</p>
      </section>

      <section className="wrap grid2">
        <div className="card">
          <h2>Why reviews matter</h2>
          <ul className="check">
            <li>People compare businesses by star rating and review count before they call.</li>
            <li>More recent reviews help you show up higher in Google Maps.</li>
            <li>One new customer usually pays for months of {APP_NAME}.</li>
          </ul>
        </div>
        <div className="card">
          <h2>How it works</h2>
          <ul className="check">
            <li>Paste your Google review link once.</li>
            <li>Text or email your review link after each job, or put the QR code on your counter.</li>
            <li>Customers tap once and land right on your Google review form.</li>
            <li>Customers can also send you a private message, so you hear about problems first.</li>
            <li>See how many people visited and clicked through to Google.</li>
          </ul>
        </div>
      </section>

      <section className="wrap" style={{ textAlign: "center", padding: "20px 20px 60px" }}>
        <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
          <p className="muted">Simple pricing</p>
          <div className="price">$19<span className="muted" style={{ fontSize: 18, fontWeight: 500 }}>/month</span></div>
          <p className="muted small">Cancel anytime. Big review platforms charge $300+/month.</p>
          <Link className="btn" href="/signup" style={{ display: "block", marginTop: 16 }}>Try it free for 14 days</Link>
        </div>
      </section>
    </>
  );
}
