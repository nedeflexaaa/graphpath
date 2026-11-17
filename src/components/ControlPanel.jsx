import Icon from './Icon.jsx';

export default function ControlPanel({
  nodes,
  startId,
  endId,
  onStartChange,
  onEndChange,
  speed,
  onSpeedChange,
  isPlaying,
  hasRun,
  isFinished,
  canRun,
  onPlayPause,
  onStep,
  onReset,
  mode,
  connectFrom,
  newEdgeWeight,
  onNewEdgeWeightChange,
  onToggleConnect,
  onAddNode,
  onRandomGraph,
  onResetGraph,
}) {
  const playLabel = isPlaying
    ? 'Пауза'
    : isFinished
      ? 'Ще раз'
      : hasRun
        ? 'Продовжити'
        : 'Запустити';

  return (
    <aside className="control-panel" aria-label="Керування візуалізатором">
      <div className="control-group">
        <div className="control-group__head">
          <h3>Параметри</h3>
          <span className="control-group__badge">{nodes.length} вершин</span>
        </div>

        <label className="field">
          <span>Стартова вершина</span>
          <select value={startId} onChange={onStartChange}>
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Цільова вершина</span>
          <select value={endId} onChange={onEndChange}>
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.label}
              </option>
            ))}
          </select>
        </label>

        {!canRun && (
          <p className="field-error" role="alert">
            Стартова та цільова вершини мають відрізнятися.
          </p>
        )}

        <div className="control-actions">
          <button
            type="button"
            className="btn btn--primary btn--block"
            onClick={onPlayPause}
            disabled={!canRun}
          >
            <Icon name={isPlaying ? 'pause' : 'play'} size={17} />
            {playLabel}
          </button>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onStep}
            disabled={!canRun}
            title="Зробити один крок"
          >
            <Icon name="step" size={16} />
            Крок
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onReset}
            disabled={!hasRun}
            title="Скинути поточний прогін"
          >
            <Icon name="reset" size={16} />
            Скинути
          </button>
        </div>
      </div>

      <div className="control-group">
        <label className="field field--range">
          <span>
            Швидкість <strong>{Number(speed).toFixed(1)}×</strong>
          </span>
          <input
            type="range"
            min="0.5"
            max="4"
            step="0.5"
            value={speed}
            onChange={onSpeedChange}
            aria-label="Швидкість анімації"
          />
        </label>
      </div>

      <div className="control-group">
        <div className="control-group__head">
          <h3>Редактор графа</h3>
        </div>
        <p className="hint">
          Перетягуйте вершини. Клік по вершині задає старт, Shift+клік — фініш.
        </p>

        <div className="editor-actions">
          <button type="button" className="btn btn--secondary btn--small" onClick={onAddNode}>
            <Icon name="plus" size={15} />
            Вершина
          </button>
          <button
            type="button"
            className={`btn btn--secondary btn--small ${mode === 'connect' ? 'is-active' : ''}`}
            onClick={onToggleConnect}
            aria-pressed={mode === 'connect'}
          >
            <Icon name="link" size={15} />
            З'єднати
          </button>
          <button type="button" className="btn btn--secondary btn--small" onClick={onRandomGraph}>
            <Icon name="shuffle" size={15} />
            Випадковий
          </button>
          <button type="button" className="btn btn--ghost btn--small" onClick={onResetGraph}>
            <Icon name="reset" size={15} />
            Скинути граф
          </button>
        </div>

        {mode === 'connect' && (
          <div className="connect-box">
            <p>
              {connectFrom
                ? `Перша вершина: ${nodes.find((node) => node.id === connectFrom)?.label ?? '—'}. Оберіть другу.`
                : 'Оберіть першу вершину на полотні.'}
            </p>
            <label className="field field--inline">
              <span>Вага ребра</span>
              <input
                type="number"
                min="1"
                max="99"
                value={newEdgeWeight}
                onChange={onNewEdgeWeightChange}
              />
            </label>
          </div>
        )}
      </div>

      <p className="control-note">
        BFS і DFS не враховують ваги ребер. Для Dijkstra ваги мають бути
        додатними — у демо це так.
      </p>
    </aside>
  );
}
