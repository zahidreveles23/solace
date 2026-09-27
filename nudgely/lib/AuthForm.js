import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { post } from "./api";
import { APP_NAME } from "./site";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState({ busy: false, error: "" });
  const signup = mode === "signup";

  async function submit(e) {
    e.preventDefault();
    setState({ busy: true, error: "" });
    try {
      await post(`/api/auth/${mode}`, { email, password });
      router.push("/app");
    } catch (err) {
      setState({ busy: false, error: err.message });
    }
  }

  return (
    <main className="center" style={{ padding: "0 20px" }}>
      <Head><title>{`${signup ? "Start free" : "Log in"} · ${APP_NAME}`}</title></Head>
      <Link href="/" className="logo">{APP_NAME}</Link>
      <form className="card" onSubmit={submit}>
        <h2>{signup ? "Start your free 14-day trial" : "Log in"}</h2>
        {signup && <p className="muted small">No card needed.</p>}
        <label htmlFor="e">Email</label>
        <input id="e" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        <label htmlFor="p">Password</label>
        <input id="p" type="password" required minLength={signup ? 8 : undefined} value={password}
          onChange={(e) => setPassword(e.target.value)} autoComplete={signup ? "new-password" : "current-password"} />
        <button className="btn" style={{ width: "100%", marginTop: 18 }} disabled={state.busy}>
          {state.busy ? "Please wait…" : signup ? "Create account" : "Log in"}
        </button>
        {state.error && <p className="err">{state.error}</p>}
        <p className="muted small" style={{ marginTop: 14 }}>
          {signup ? <>Already have an account? <Link href="/login">Log in</Link></> : <>New here? <Link href="/signup">Start free</Link></>}
        </p>
      </form>
    </main>
  );
}
