import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import GraphWorkspace from './components/GraphWorkspace.jsx';
import AlgorithmsSection from './components/AlgorithmsSection.jsx';
import ApplicationsSection from './components/ApplicationsSection.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import AboutSection from './components/AboutSection.jsx';
import Footer from './components/Footer.jsx';

const THEME_KEY = 'graphpath-theme';

function getInitialTheme() {
  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {
    // Storage can be unavailable in private mode; fall back to the system theme.
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      // The app still works without persisted theme preference.
    }
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#101613' : '#f7f8f6');
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Перейти до основного вмісту
      </a>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main id="main-content">
        <Hero />
        <GraphWorkspace />
        <AlgorithmsSection />
        <ApplicationsSection />
        <HowItWorks />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
