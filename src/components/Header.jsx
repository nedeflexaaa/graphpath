import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';

const NAV_ITEMS = [
  { href: '#visualizer', label: 'Візуалізатор' },
  { href: '#algorithms', label: 'Алгоритми' },
  { href: '#how-it-works', label: 'Як працює' },
  { href: '#about', label: 'Про проєкт' },
];

export default function Header({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header" id="top">
      <div className="container site-header__inner">
        <a className="brand" href="#top" aria-label="GraphPath — на початок сторінки">
          <span className="brand__mark">
            <Icon name="graph" size={22} />
          </span>
          <span className="brand__text">
            <strong>GraphPath</strong>
            <small>алгоритми на графах</small>
          </span>
        </a>

        <nav
          id="main-navigation"
          className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`}
          aria-label="Основна навігація"
        >
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <button
            type="button"
            className="icon-button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
            title={theme === 'dark' ? 'Світла тема' : 'Темна тема'}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
          </button>

          <button
            type="button"
            className="icon-button menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Закрити меню' : 'Відкрити меню'}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
