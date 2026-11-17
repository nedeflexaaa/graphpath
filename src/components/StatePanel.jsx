import { ALGORITHMS } from '../lib/algorithms.js';
import Pseudocode from './Pseudocode.jsx';
import FrontierPanel from './FrontierPanel.jsx';

export default function StatePanel({
  currentStep,
  steps,
  stepIndex,
  algorithm,
  hasRun,
  isFinished,
  result,
  nodes,
}) {
  const info = ALGORITHMS[algorithm];
  const visitedCount = currentStep?.visited.length ?? 0;
  const frontierCount = currentStep?.frontier.length ?? 0;
  const pathCost = result?.path
    ? algorithm === 'dijkstra'
      ? result.stats.pathCost
      : result.path.length - 1
    : null;
  const logSteps = steps
    .slice(Math.max(0, stepIndex - 5), stepIndex + 1)
    .map((step, index) => ({
      ...step,
      number: Math.max(0, stepIndex - 5) + index + 1,
    }))
    .reverse();

  return (
    <aside className="state-panel" aria-label="Стан алгоритму">
      <div className="state-panel__head">
        <div>
          <h3>Стан алгоритму</h3>
          <p>{info.name}</p>
        </div>
        <span className="badge">{info.shortName}</span>
      </div>

      <div className="metrics-grid">
        <div className="metric">
          <span>Крок</span>
          <strong>{hasRun ? `${stepIndex + 1}/${steps.length}` : `0/${steps.length}`}</strong>
        </div>
        <div className="metric">
          <span>Відвідано</span>
          <strong>{visitedCount}</strong>
        </div>
        <div className="metric">
          <span>{info.structure}</span>
          <strong>{frontierCount}</strong>
        </div>
        <div className="metric">
          <span>{algorithm === 'dijkstra' ? 'Вартість' : 'Ребер'}</span>
          <strong>{pathCost ?? '—'}</strong>
        </div>
      </div>

      <div className="state-message" role="status" aria-live="polite">
        {currentStep?.message ?? 'Натисніть «Запустити», щоб почати покроковий розбір.'}
      </div>

      <section className="state-section" aria-label="Псевдокод">
        <div className="state-section__head">
          <h4>Псевдокод</h4>
          {isFinished && <span className="state-section__done">готово</span>}
        </div>
        <Pseudocode algorithm={algorithm} codeLine={currentStep?.codeLine} />
      </section>

      <FrontierPanel
        algorithm={algorithm}
        frontier={currentStep?.frontier ?? []}
        nodes={nodes}
      />

      <section className="state-section" aria-label="Журнал кроків">
        <div className="state-section__head">
          <h4>Журнал кроків</h4>
          <span>{hasRun ? stepIndex + 1 : 0}</span>
        </div>
        {logSteps.length === 0 ? (
          <p className="empty-state">Кроків ще немає.</p>
        ) : (
          <ol className="step-log">
            {logSteps.map((step) => (
              <li key={`${step.number}-${step.type}`}>
                <span className="step-log__number">{step.number}</span>
                <span>{step.message}</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </aside>
  );
}
