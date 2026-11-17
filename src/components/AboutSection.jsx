import notesImage from '../assets/images/project-notes.jpg';

const STACK = ['React 18', 'Vite', 'Sass (SCSS)', 'SVG', 'Pointer Events', 'localStorage'];

export default function AboutSection() {
  return (
    <section className="section section--alt" id="about">
      <div className="container about-grid">
        <div className="about-copy">
          <p className="eyebrow">Про проєкт</p>
          <h2>Навчальний інструмент, а не чорна скринька</h2>
          <p>
            GraphPath — індивідуальний STEM-проєкт з дисципліни «Розробка фронтенду
            програмних систем». Мета — показати, як класичні алгоритми працюють у
            браузері: без сервера, прихованих бібліотек і магії за кадром.
          </p>
          <p>
            Дані графа зберігаються у стані React, а всі обчислення виконуються на
            клієнті. Візуалізація побудована на SVG: вершини можна перетягувати,
            ребра мають ваги, а кожен крок алгоритму змінює стан інтерфейсу.
          </p>

          <div className="stack-list" aria-label="Технології проєкту">
            {STACK.map((item) => (
              <span className="tag" key={item}>
                {item}
              </span>
            ))}
          </div>

          <div className="about-note">
            <strong>Обмеження демо.</strong> Графи неорієнтовані, ваги ребер
            додатні, стан не зберігається між сесіями. Це фронтенд-прототип без
            серверної частини.
          </div>
        </div>

        <figure className="about-media">
          <img
            src={notesImage}
            alt="Стікери та нотатки на дошці під час планування інтерфейсу"
            width="900"
            height="600"
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            Планування структури застосунку. Реальне фото — Unsplash.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
