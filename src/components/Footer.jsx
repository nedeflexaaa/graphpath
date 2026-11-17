import Icon from './Icon.jsx';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <a className="brand" href="#top" aria-label="GraphPath — на початок сторінки">
            <span className="brand__mark">
              <Icon name="graph" size={20} />
            </span>
            <span className="brand__text">
              <strong>GraphPath</strong>
              <small>алгоритми на графах</small>
            </span>
          </a>
          <p>
            Навчальний інструмент для покрокового розбору BFS, DFS і Dijkstra.
            Усі обчислення виконуються на клієнті.
          </p>
        </div>

        <nav className="footer__nav" aria-label="Навігація у підвалі">
          <a href="#visualizer">Візуалізатор</a>
          <a href="#algorithms">Алгоритми</a>
          <a href="#how-it-works">Як працює</a>
          <a href="#about">Про проєкт</a>
        </nav>

        <div className="footer__meta">
          <p>
            <strong>Василець Олександр Миколайович</strong>
            <br />
            ІПЗ-33, підгрупа 8 · 2026
          </p>
          <p>
            КНУ імені Тараса Шевченка
            <br />
            Факультет інформаційних технологій
          </p>
          <p className="footer__credits">
            Фото: Unsplash. Ліцензія:{' '}
            <a href="https://unsplash.com/license" target="_blank" rel="noreferrer">
              unsplash.com/license
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
