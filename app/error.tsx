"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="sec">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-num">500</span>
          <span className="sec-title">Runtime error</span>
          <span className="sec-flex" />
        </div>
        <h1>Something failed to render.</h1>
        <p className="dim">Retry the page before falling back to local commands.</p>
        <p style={{ marginTop: 24 }}>
          <button className="btn primary" type="button" onClick={reset}>Retry</button>
        </p>
      </div>
    </main>
  );
}
