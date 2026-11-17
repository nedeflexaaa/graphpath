import { ALGORITHMS } from '../lib/algorithms.js';

function formatDistance(value) {
  return Number.isFinite(value) ? value : '∞';
}

export default function DistanceTable({ nodes, currentStep, algorithm, startId, endId }) {
  const labels = new Map(nodes.map((node) => [node.id, node.label]));
  const distanceLabel =
    algorithm === 'dfs'
      ? 'Глибина'
      : algorithm === 'bfs'
        ? 'Відстань (ребра)'
        : 'Відстань';

  function statusFor(node) {
    if (currentStep) {
      if (currentStep.path?.includes(node.id)) {
        return { label: 'шлях', className: 'path' };
      }

      if (currentStep.current === node.id) {
        return { label: 'поточна', className: 'current' };
      }

      if (currentStep.visited?.includes(node.id)) {
        return { label: 'відвідана', className: 'visited' };
      }

      if (currentStep.frontier?.some((item) => item.id === node.id)) {
        return { label: 'у черзі', className: 'frontier' };
      }
    }

    if (node.id === startId) {
      return { label: 'старт', className: 'start' };
    }

    if (node.id === endId) {
      return { label: 'фініш', className: 'end' };
    }

    return { label: 'не відвідана', className: 'default' };
  }

  function distanceFor(node) {
    if (!currentStep) {
      return node.id === startId ? 0 : Infinity;
    }

    return currentStep.distances[node.id] ?? Infinity;
  }

  function previousFor(node) {
    const previousId = currentStep?.previous[node.id];
    return previousId ? labels.get(previousId) ?? previousId : '—';
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <caption className="sr-only">
          Стан вершин графа для алгоритму {ALGORITHMS[algorithm].name}
        </caption>
        <thead>
          <tr>
            <th scope="col">Вершина</th>
            <th scope="col">Статус</th>
            <th scope="col">{distanceLabel}</th>
            <th scope="col">Попередник</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((node) => {
            const status = statusFor(node);
            return (
              <tr key={node.id}>
                <th scope="row">{node.label}</th>
                <td>
                  <span className={`status-badge status-badge--${status.className}`}>
                    <i className={`status-dot status-dot--${status.className}`} />
                    {status.label}
                  </span>
                </td>
                <td className="data-table__number">{formatDistance(distanceFor(node))}</td>
                <td>{previousFor(node)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
