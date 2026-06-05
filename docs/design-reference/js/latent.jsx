// Latent-space canvas — animated scatter of "embedding" points with subtle connections.
// Reacts to mouse position with parallax + repulsion.

function LatentCanvas({ density = 1.0, palette = "phosphor" }) {
  const ref = useRef(null);
  const wrapRef = useRef(null);
  const stateRef = useRef({ pts: [], mx: 0, my: 0, w: 0, h: 0, raf: 0, t: 0 });

  useEffect(() => {
    const canvas = ref.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");

    const palettes = {
      phosphor:  ["#7dd87a", "#e8b54b", "#5e9c5b", "#9aa8c4"],
      cyan:      ["#5fc7f5", "#a78bff", "#4aa3d6", "#8eb1c4"],
      amber:     ["#f0b85a", "#e8804a", "#c47a45", "#8e7c5e"],
      magenta:   ["#e87bd8", "#7dd0f5", "#b569c4", "#8e90b8"],
    };
    const colors = palettes[palette] || palettes.phosphor;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = wrap.getBoundingClientRect();
      stateRef.current.w = r.width;
      stateRef.current.h = r.height;
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      canvas.style.width = r.width + "px";
      canvas.style.height = r.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const rng = mulberry32(42);
    const seed = () => {
      const { w, h } = stateRef.current;
      const count = Math.round((w * h) / 9000 * density);
      const arr = [];
      // 3-4 visible clusters representing skill domains
      const clusters = [
        { x: w * 0.22, y: h * 0.35, c: colors[0], r: Math.min(w, h) * 0.22, label: "LLM" },
        { x: w * 0.72, y: h * 0.28, c: colors[1], r: Math.min(w, h) * 0.18, label: "RecSys" },
        { x: w * 0.55, y: h * 0.72, c: colors[2], r: Math.min(w, h) * 0.20, label: "MLOps" },
        { x: w * 0.18, y: h * 0.80, c: colors[3], r: Math.min(w, h) * 0.16, label: "CV" },
      ];
      for (let i = 0; i < count; i++) {
        const cl = clusters[i % clusters.length];
        // gaussian-ish
        const ang = rng() * Math.PI * 2;
        const rad = Math.sqrt(rng()) * cl.r * (0.6 + rng() * 0.5);
        const x = cl.x + Math.cos(ang) * rad;
        const y = cl.y + Math.sin(ang) * rad;
        arr.push({
          x, y, ox: x, oy: y,
          vx: 0, vy: 0,
          r: 0.6 + rng() * 1.8,
          c: cl.c,
          phase: rng() * Math.PI * 2,
          speed: 0.0003 + rng() * 0.0007,
          a: 0.3 + rng() * 0.55,
          cluster: cl.label,
        });
      }
      stateRef.current.pts = arr;
      stateRef.current.clusters = clusters;
    };

    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      stateRef.current.mx = e.clientX - r.left;
      stateRef.current.my = e.clientY - r.top;
    };
    const onLeave = () => { stateRef.current.mx = -1000; stateRef.current.my = -1000; };

    const draw = () => {
      const { pts, mx, my, w, h, clusters } = stateRef.current;
      stateRef.current.t += 0.016;
      const t = stateRef.current.t;
      ctx.clearRect(0, 0, w, h);

      // Connections (only within cluster + close range)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          if (p.cluster !== q.cluster) continue;
          const dx = p.x - q.x, dy = p.y - q.y;
          const d2 = dx*dx + dy*dy;
          if (d2 < 4000) {
            const a = (1 - d2 / 4000) * 0.14 * Math.min(p.a, q.a);
            ctx.strokeStyle = p.c + Math.round(a * 255).toString(16).padStart(2, "0");
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      // Points (with mouse repulsion + drift)
      for (const p of pts) {
        // drift
        const dx0 = p.x - p.ox, dy0 = p.y - p.oy;
        const angle = t * 0.5 + p.phase;
        const driftX = Math.cos(angle) * 6 * p.speed * 200;
        const driftY = Math.sin(angle * 1.3) * 6 * p.speed * 200;
        // mouse repel
        const mdx = p.x - mx, mdy = p.y - my;
        const md2 = mdx*mdx + mdy*mdy;
        let fx = driftX - dx0 * 0.02;
        let fy = driftY - dy0 * 0.02;
        if (md2 < 14000) {
          const force = (1 - md2 / 14000) * 1.6;
          const md = Math.sqrt(md2) || 1;
          fx += (mdx / md) * force;
          fy += (mdy / md) * force;
        }
        p.vx = p.vx * 0.92 + fx * 0.05;
        p.vy = p.vy * 0.92 + fy * 0.05;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.a;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        // halo for larger points
        if (p.r > 1.4) {
          ctx.globalAlpha = p.a * 0.25;
          ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // Cluster labels
      if (clusters) {
        ctx.font = '10px "JetBrains Mono", monospace';
        for (const c of clusters) {
          ctx.fillStyle = c.c + "88";
          ctx.fillText("// " + c.label, c.x - c.r * 0.5, c.y - c.r * 0.5);
        }
      }

      stateRef.current.raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    resize();
    draw();
    return () => {
      cancelAnimationFrame(stateRef.current.raf);
      ro.disconnect();
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, [density, palette]);

  return (
    <div ref={wrapRef} className="latent-wrap">
      <style>{`
        .latent-wrap{position:absolute; inset:0; pointer-events:auto;
          mask-image: radial-gradient(ellipse 90% 80% at 60% 50%, #000 30%, transparent 95%);
          -webkit-mask-image: radial-gradient(ellipse 90% 80% at 60% 50%, #000 30%, transparent 95%);
        }
        .latent-wrap canvas{display:block; width:100%; height:100%}
      `}</style>
      <canvas ref={ref} />
    </div>
  );
}

// A tiny inline sparkline (used by status indicators)
function Sparkline({ points = 40, height = 24, width = 80, color, smooth = true, seed = 1 }) {
  const rng = useMemo(() => mulberry32(seed), [seed]);
  const data = useMemo(() => {
    let v = 0.7;
    const arr = [];
    for (let i = 0; i < points; i++) {
      v += (rng() - 0.5) * 0.08;
      v = Math.max(0.05, Math.min(0.95, v));
      // generally decreasing (loss)
      v -= 0.005;
      arr.push(v);
    }
    return arr;
  }, [points, seed]);
  const path = data.map((y, i) => {
    const x = (i / (points - 1)) * width;
    const yy = height - y * height;
    return (i === 0 ? "M" : "L") + x.toFixed(1) + "," + yy.toFixed(1);
  }).join(" ");
  return (
    <svg width={width} height={height} style={{display:"inline-block",verticalAlign:"middle"}}>
      <path d={path} fill="none" stroke={color || "var(--accent)"} strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  );
}

Object.assign(window, { LatentCanvas, Sparkline });
