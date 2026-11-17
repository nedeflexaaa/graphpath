const STEPS = [
  {
    number: '01',
    title: 'Оберіть граф',
    text: 'Почніть із набору «Місто», «Мережа» або «Навчальний». За потреби додайте вершини, з’єднайте їх ребрами чи перетягніть на полотні.',
  },
  {
    number: '02',
    title: 'Задайте старт і фініш',
    text: 'Клік по вершині задає старт, Shift+клік — фініш. Те саме можна зробити через списки в панелі параметрів.',
  },
  {
    number: '03',
    title: 'Керуйте розбором',
    text: 'Запустіть анімацію, зупиняйте її, робіть окремі кроки та змінюйте швидкість. Псевдокод і таблиця оновлюються синхронно.',
  },
];

const DETAILS = [
  {
    title: 'Кольори станів',
    text: 'Старт, фініш, поточна вершина, черга, відвідані вершини та знайдений шлях мають різні позначення.',
  },
  {
    title: 'Псевдокод',
    text: 'Підсвічується рядок, який виконується на поточному кроці. Це допомагає зіставити код і візуалізацію.',
  },
  {
    title: 'Структура даних',
    text: 'Для BFS показується черга, для DFS — стек, для Dijkstra — пріоритетна черга з поточними відстанями.',
  },
  {
    title: 'Таблиця вершин',
    text: 'У таблиці видно статус, відстань або глибину та попередника кожної вершини.',
  },
];

export default function HowItWorks() {
  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Інструкція</p>
            <h2>Як це працює</h2>
          </div>
          <p className="section-head__note">
            Три кроки до першого прогону. Далі можна експериментувати з графом,
            алгоритмом і швидкістю.
          </p>
        </div>

        <div className="steps-grid">
          {STEPS.map((step) => (
            <article className="step-card" key={step.number}>
              <span className="step-card__number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>

        <div className="how-details">
          <div className="how-details__head">
            <h3>Що видно на екрані</h3>
            <p>Не просто анімація, а повний зліпок стану алгоритму.</p>
          </div>
          <ul className="how-list">
            {DETAILS.map((detail) => (
              <li key={detail.title}>
                <strong>{detail.title}</strong>
                <span>{detail.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
