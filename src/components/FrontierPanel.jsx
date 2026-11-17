import { ALGORITHMS } from '../lib/algorithms.js';

export default function FrontierPanel({ algorithm, frontier, nodes }) {
  const info = ALGORITHMS[algorithm];
  const labels = new Map(nodes.map((node) => [node.id, node.label]));

  return (
    <section className="state-section" aria-label={info.structure}>
      <div className="state-section__head">
        <h4>{info.structure}</h4>
        <span>{frontier.length}</span>
      </div>

      {frontier.length === 0 ? (
        <p className="empty-state">Порожньо</p>
      ) : (
        <div className="chip-list" role="list">
          {frontier.map((item) => (
            <span className="chip chip--frontier" role="listitem" key={`${item.id}-${item.distance}`}>
              {labels.get(item.id) ?? item.id}
              {algorithm === 'dijkstra' && (
                <span className="chip__meta">{item.distance}</span>
              )}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
