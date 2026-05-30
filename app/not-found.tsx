import Link from "next/link";

export default function NotFound() {
  return (
    <main className="sec">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-num">404</span>
          <span className="sec-title">Route not found</span>
          <span className="sec-flex" />
        </div>
        <h1>Nothing at this path.</h1>
        <p className="dim">The portfolio is a single-page system. Head back to the main interface.</p>
        <p style={{ marginTop: 24 }}>
          <Link className="btn primary" href="/">Return home</Link>
        </p>
      </div>
    </main>
  );
}
