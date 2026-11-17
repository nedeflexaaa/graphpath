import { ALGORITHMS, ALGORITHM_ORDER } from '../lib/algorithms.js';
import Icon from './Icon.jsx';

export default function AlgorithmsSection() {
  return (
    <section className="section" id="algorithms">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Теорія</p>
            <h2>Три способи обійти граф</h2>
          </div>
          <p className="section-head__note">
            Усі три алгоритми реалізовано в застосунку. Вони відрізняються порядком
            обходу, структурою даних і тим, що саме гарантують.
          </p>
        </div>

        <div className="algorithms-grid">
          {ALGORITHM_ORDER.map((id) => {
            const info = ALGORITHMS[id];
            return (
              <article className={`algo-card algo-card--${id}`} key={id}>
                <div className="algo-card__top">
                  <span className="algo-card__badge">{info.shortName}</span>
                  <span className="algo-card__tagline">{info.tagline}</span>
                </div>
                <h3>{info.name}</h3>
                <p>{info.description}</p>

                <dl className="algo-card__facts">
                  <div>
                    <dt>Структура</dt>
                    <dd>{info.structure}</dd>
                  </div>
                  <div>
                    <dt>Складність</dt>
                    <dd>{info.complexity}</dd>
                  </div>
                  <div>
                    <dt>Ваги</dt>
                    <dd>{info.weighted ? 'враховує' : 'не враховує'}</dd>
                  </div>
                </dl>

                <ul className="algo-card__uses">
                  {info.useCases.map((useCase) => (
                    <li key={useCase}>{useCase}</li>
                  ))}
                </ul>

                <a className="text-link" href="#visualizer">
                  Спробувати в демо
                  <Icon name="arrow" size={15} />
                </a>
              </article>
            );
          })}
        </div>

        <div className="comparison-panel">
          <div className="comparison-panel__head">
            <h3>Коротко про різницю</h3>
            <p>Одна таблиця, щоб швидко згадати, який алгоритм обрати.</p>
          </div>
          <div className="table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th scope="col">Алгоритм</th>
                  <th scope="col">Структура</th>
                  <th scope="col">Ваги</th>
                  <th scope="col">Що гарантує</th>
                  <th scope="col">Складність</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">BFS</th>
                  <td>Черга</td>
                  <td>Ні</td>
                  <td>Найкоротший шлях за кількістю ребер</td>
                  <td>O(V + E)</td>
                </tr>
                <tr>
                  <th scope="row">DFS</th>
                  <td>Стек</td>
                  <td>Ні</td>
                  <td>Повний обхід, але не найкоротший шлях</td>
                  <td>O(V + E)</td>
                </tr>
                <tr>
                  <th scope="row">Dijkstra</th>
                  <td>Пріоритетна черга</td>
                  <td>Так, додатні</td>
                  <td>Мінімальна сумарна вага шляху</td>
                  <td>O((V + E) log V)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
