import heroImage from '../assets/images/hero-code.jpg';
import Icon from './Icon.jsx';

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">STEM-проєкт · Frontend</p>
          <h1>Алгоритми на графах — покроково, без магії.</h1>
          <p className="hero__lead">
            GraphPath — навчальний веб-застосунок, у якому можна зібрати граф, обрати
            стартову та цільову вершини й подивитися, як BFS, DFS або Dijkstra
            досліджують мережу.
          </p>

          <div className="hero__actions">
            <a className="btn btn--primary" href="#visualizer">
              Відкрити візуалізатор
              <Icon name="arrow" size={17} />
            </a>
            <a className="btn btn--ghost" href="#algorithms">
              Про алгоритми
            </a>
          </div>

          <dl className="hero__facts" aria-label="Короткі факти про застосунок">
            <div>
              <dt>Алгоритми</dt>
              <dd>3</dd>
            </div>
            <div>
              <dt>Набори даних</dt>
              <dd>3 + власний</dd>
            </div>
            <div>
              <dt>Обчислення</dt>
              <dd>у браузері</dd>
            </div>
          </dl>

          <p className="hero__stack">
            <span className="tag">React</span>
            <span className="tag">Vite</span>
            <span className="tag">Sass</span>
            <span className="tag">SVG</span>
          </p>
        </div>

        <figure className="hero__media">
          <img
            src={heroImage}
            alt="Ноутбук із відкритим редактором коду на світлому робочому столі"
            width="1200"
            height="799"
            loading="eager"
            decoding="async"
          />
          <figcaption>
            Робоче місце розробника. Реальне фото — Unsplash.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
