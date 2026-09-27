import Head from "next/head";
import { migrate } from "../../lib/db";
import { loadDashboard } from "../../lib/dashboard-data";

export async function getServerSideProps({ req }) {
  await migrate();
  const r = await loadDashboard(req);
  if (r.redirect) return r;
  if (!r.props.business) return { redirect: { destination: "/app", permanent: false } };
  return { props: { name: r.props.business.name, qr: r.props.business.qr } };
}

export default function Poster({ name, qr }) {
  return (
    <main style={{ maxWidth: 560, margin: "40px auto", textAlign: "center", padding: 20 }}>
      <Head><title>{`Review poster · ${name}`}</title></Head>
      <style>{"@media print{.noprint{display:none}body{background:#fff}}"}</style>
      <div style={{ border: "3px solid #1c2430", borderRadius: 24, padding: "40px 30px", background: "#fff" }}>
        <div style={{ fontSize: 48 }}>⭐⭐⭐⭐⭐</div>
        <h1 style={{ fontSize: 40, marginTop: 10 }}>Loved your visit?</h1>
        <p style={{ fontSize: 22, marginTop: 10 }}>Scan to leave <b>{name}</b> a quick Google review</p>
        <img src={qr} alt="Review QR code" width={300} height={300} style={{ marginTop: 24 }} />
        <p style={{ fontSize: 18, marginTop: 16, color: "#5d6878" }}>Point your phone camera at the code. It takes 30 seconds. Thank you!</p>
      </div>
      <button className="btn noprint" style={{ marginTop: 20 }} onClick={() => window.print()}>Print</button>
    </main>
  );
}
