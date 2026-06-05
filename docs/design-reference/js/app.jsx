// Entry — composes everything

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useEffect(() => { applyTweaks(tweaks); }, [tweaks]);
  return (
    <React.Fragment>
      {tweaks.showStatusBar && <StatusBar />}
      <NavBar />
      <main id="app">
        <Hero density={tweaks.density} palette={tweaks.palette} />
        <NowPlaying />
        {tweaks.showAbout && <About />}
        <LivePlayground />
        <Projects />
        {tweaks.showExperience && <Experience />}
        <Certifications />
        {tweaks.showSkills && <Skills />}
        <Contact />
        <Footer />
      </main>
      <CommandPalette />
      <PortfolioTweaks tweaks={tweaks} setTweak={setTweak} />
    </React.Fragment>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
