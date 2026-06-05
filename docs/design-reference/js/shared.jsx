// Shared building blocks used across the portfolio.

const { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } = React;

function SectionHead({ num, title, meta }) {
  return (
    <div className="sec-head">
      <span className="sec-num mono">{num}</span>
      <span className="sec-title">{title}</span>
      <span className="sec-flex" />
      {meta && <span className="sec-meta">{meta}</span>}
    </div>
  );
}

function Chip({ children, alive, style }) {
  return <span className={"chip " + (alive ? "alive" : "")} style={style}>{children}</span>;
}

// useElementSize -- track size of an element via ResizeObserver
function useElementSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, size];
}

// useInView -- intersection observer
function useInView(opts = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.isIntersecting && setInView(true));
    }, { threshold: 0.12, ...opts });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

// Typewriter -- types out a string of text
function Typewriter({ text, speed = 18, onDone, start = true }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (i >= text.length) { onDone && onDone(); return; }
    const t = setTimeout(() => setI(i + 1), speed);
    return () => clearTimeout(t);
  }, [i, text, speed, start]);
  return <span>{text.slice(0, i)}{i < text.length && <span className="caret">▋</span>}</span>;
}

// SeededRandom -- tiny deterministic PRNG (mulberry32)
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Status pill — green dot + label
function StatusPill({ label }) {
  return <span className="chip alive">{label}</span>;
}

// Icon helpers (tiny inline SVGs)
function Icon({ name, size = 14 }) {
  const s = { width: size, height: size, display: "inline-block", verticalAlign: "-2px" };
  switch (name) {
    case "arrow":
      return <svg viewBox="0 0 16 16" style={s} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 8h12M9 3l5 5-5 5"/></svg>;
    case "github":
      return <svg viewBox="0 0 24 24" style={s} fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.11.79-.25.79-.55 0-.27-.01-.99-.02-1.95-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.04 11.04 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.55C20.21 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>;
    case "linkedin":
      return <svg viewBox="0 0 24 24" style={s} fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>;
    case "external":
      return <svg viewBox="0 0 16 16" style={s} fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M6 3H3v10h10v-3M9 3h4v4M8 8l5-5"/></svg>;
    case "download":
      return <svg viewBox="0 0 16 16" style={s} fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M8 2v9m0 0l3.5-3.5M8 11L4.5 7.5M2.5 13.5h11"/></svg>;
    case "mail":
      return <svg viewBox="0 0 16 16" style={s} fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="2" y="3.5" width="12" height="9" rx="1.5"/><path d="M2.5 4.5l5.5 4 5.5-4"/></svg>;
    case "send":
      return <svg viewBox="0 0 16 16" style={s} fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 8l12-5-5 12-2-5z"/></svg>;
    case "cmd":
      return <svg viewBox="0 0 16 16" style={s} fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5.5 2.5a2 2 0 1 0 0 4h5a2 2 0 1 0 0-4 2 2 0 0 0-2 2v7a2 2 0 0 1-2 2 2 2 0 1 1 0-4h7a2 2 0 1 1-2 2v-7a2 2 0 0 1 2-2"/></svg>;
    case "sparkle":
      return <svg viewBox="0 0 16 16" style={s} fill="currentColor"><path d="M8 1l1.7 4.3L14 7l-4.3 1.7L8 13l-1.7-4.3L2 7l4.3-1.7zM13 1l.7 1.8L15.5 3.5l-1.8.7L13 6l-.7-1.8L10.5 3.5l1.8-.7z"/></svg>;
    default: return null;
  }
}

Object.assign(window, {
  SectionHead, Chip, Icon, StatusPill, Typewriter,
  useElementSize, useInView, mulberry32,
});
