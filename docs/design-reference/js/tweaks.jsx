// Tweaks panel — palette + theme/section toggles

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "phosphor",
  "density": 1.0,
  "scanlines": false,
  "showAbout": true,
  "showExperience": true,
  "showSkills": true,
  "showStatusBar": true,
  "font": "space-grotesk"
}/*EDITMODE-END*/;

const PALETTES = {
  phosphor: { accent: "oklch(0.86 0.18 145)", glow: "oklch(0.86 0.18 145 / 0.35)", soft: "oklch(0.86 0.18 145 / 0.12)", a2: "oklch(0.82 0.16 75)" },
  cyan:     { accent: "oklch(0.82 0.16 220)", glow: "oklch(0.82 0.16 220 / 0.35)", soft: "oklch(0.82 0.16 220 / 0.12)", a2: "oklch(0.8 0.14 290)" },
  amber:    { accent: "oklch(0.82 0.16 78)",  glow: "oklch(0.82 0.16 78 / 0.35)",  soft: "oklch(0.82 0.16 78 / 0.12)",  a2: "oklch(0.78 0.14 32)" },
  magenta:  { accent: "oklch(0.78 0.20 340)", glow: "oklch(0.78 0.20 340 / 0.35)", soft: "oklch(0.78 0.20 340 / 0.12)", a2: "oklch(0.85 0.16 80)" },
};

const FONTS = {
  "space-grotesk": { display: '"Space Grotesk", sans-serif', body: '"IBM Plex Sans", sans-serif' },
  "jetbrains":     { display: '"JetBrains Mono", monospace', body: '"IBM Plex Sans", sans-serif' },
  "plex":          { display: '"IBM Plex Sans", sans-serif', body: '"IBM Plex Sans", sans-serif' },
};

function applyTweaks(t) {
  const root = document.documentElement;
  const p = PALETTES[t.palette] || PALETTES.phosphor;
  root.style.setProperty("--accent", p.accent);
  root.style.setProperty("--accent-glow", p.glow);
  root.style.setProperty("--accent-soft", p.soft);
  root.style.setProperty("--accent-2", p.a2);
  const f = FONTS[t.font] || FONTS["space-grotesk"];
  root.style.setProperty("--f-display", f.display);
  root.style.setProperty("--f-body", f.body);
  if (t.scanlines) document.body.classList.add("scanlines");
  else document.body.classList.remove("scanlines");
}

function PortfolioTweaks({ tweaks, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection label="Theme" />
      <TweakRadio
        label="Palette"
        value={tweaks.palette}
        options={["phosphor", "cyan", "amber", "magenta"]}
        onChange={(v) => setTweak("palette", v)}
      />
      <TweakRadio
        label="Type"
        value={tweaks.font}
        options={["space-grotesk", "jetbrains", "plex"]}
        onChange={(v) => setTweak("font", v)}
      />
      <TweakToggle
        label="CRT scanlines"
        value={tweaks.scanlines}
        onChange={(v) => setTweak("scanlines", v)}
      />
      <TweakSection label="Hero canvas" />
      <TweakSlider
        label="Embedding density"
        value={tweaks.density}
        min={0.3} max={2.0} step={0.1}
        onChange={(v) => setTweak("density", v)}
      />
      <TweakSection label="Sections" />
      <TweakToggle label="Status bar" value={tweaks.showStatusBar}
        onChange={(v) => setTweak("showStatusBar", v)}/>
      <TweakToggle label="About" value={tweaks.showAbout}
        onChange={(v) => setTweak("showAbout", v)}/>
      <TweakToggle label="Experience" value={tweaks.showExperience}
        onChange={(v) => setTweak("showExperience", v)}/>
      <TweakToggle label="Skills graph" value={tweaks.showSkills}
        onChange={(v) => setTweak("showSkills", v)}/>
    </TweaksPanel>
  );
}

Object.assign(window, { TWEAK_DEFAULTS, PortfolioTweaks, applyTweaks });
