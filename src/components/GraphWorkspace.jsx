import { useEffect, useState } from 'react';
import { ALGORITHMS, ALGORITHM_ORDER, formatPath, runAlgorithm } from '../lib/algorithms.js';
import { GRAPH_PRESETS, PRESET_LIST, cloneGraph } from '../data/graphs.js';
import ControlPanel from './ControlPanel.jsx';
import GraphCanvas from './GraphCanvas.jsx';
import StatePanel from './StatePanel.jsx';
import DistanceTable from './DistanceTable.jsx';

const DEFAULT_PRESET = 'city';
const DEFAULT_ALGORITHM = 'dijkstra';

function getFreePosition(nodes) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const x = 70 + Math.random() * 560;
    const y = 70 + Math.random() * 320;
    const free = nodes.every((node) => Math.hypot(node.x - x, node.y - y) > 86);

    if (free) {
      return { x: Math.round(x), y: Math.round(y) };
    }
  }

  return { x: 350, y: 230 };
}

function createRandomGraph() {
  const count = 7;
  const nodes = Array.from({ length: count }, (_, index) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    return {
      id: `r${index + 1}`,
      label: String.fromCharCode(65 + index),
      x: Math.round(350 + Math.cos(angle) * 230 + (Math.random() * 28 - 14)),
      y: Math.round(230 + Math.sin(angle) * 145 + (Math.random() * 28 - 14)),
    };
  });

  const edges = [];
  const seen = new Set();

  function addEdge(source, target, weight) {
    const key = [source, target].sort().join('|');
    if (key.split('|')[0] === key.split('|')[1] || seen.has(key)) {
      return;
    }

    seen.add(key);
    edges.push({
      id: `r-${source}-${target}-${edges.length}`,
      source,
      target,
      weight,
    });
  }

  for (let index = 0; index < count; index += 1) {
    addEdge(nodes[index].id, nodes[(index + 1) % count].id, 1 + Math.floor(Math.random() * 9));
  }

  for (let index = 0; index < 4; index += 1) {
    const first = Math.floor(Math.random() * count);
    let second = Math.floor(Math.random() * count);

    if (first === second) {
      second = (second + 1) % count;
    }

    addEdge(nodes[first].id, nodes[second].id, 1 + Math.floor(Math.random() * 9));
  }

  return {
    nodes,
    edges,
    start: nodes[0].id,
    end: nodes[count - 1].id,
  };
}

export default function GraphWorkspace() {
  const [initialGraph] = useState(() => cloneGraph(GRAPH_PRESETS[DEFAULT_PRESET]));
  const [presetId, setPresetId] = useState(DEFAULT_PRESET);
  const [sourcePresetId, setSourcePresetId] = useState(DEFAULT_PRESET);
  const [nodes, setNodes] = useState(initialGraph.nodes);
  const [edges, setEdges] = useState(initialGraph.edges);
  const [startId, setStartId] = useState(initialGraph.start);
  const [endId, setEndId] = useState(initialGraph.end);
  const [algorithm, setAlgorithm] = useState(DEFAULT_ALGORITHM);
  const [speed, setSpeed] = useState(1);
  const [mode, setMode] = useState('select');
  const [connectFrom, setConnectFrom] = useState(null);
  const [newEdgeWeight, setNewEdgeWeight] = useState(1);
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const currentStep = hasRun ? steps[stepIndex] ?? null : null;
  const isFinished = hasRun && steps.length > 0 && stepIndex === steps.length - 1;
  const result = isFinished ? currentStep : null;
  const canRun = nodes.length > 1 && startId !== endId;
  const activePreset = presetId === 'custom' ? null : GRAPH_PRESETS[presetId];

  useEffect(() => {
    if (!isPlaying || !hasRun || steps.length === 0) {
      return undefined;
    }

    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return undefined;
    }

    const delay = Math.max(140, 850 / speed);
    const timer = window.setTimeout(() => {
      setStepIndex((current) => Math.min(current + 1, steps.length - 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [hasRun, isPlaying, speed, stepIndex, steps.length]);

  function resetRun() {
    setSteps([]);
    setStepIndex(0);
    setIsPlaying(false);
    setHasRun(false);
    setConnectFrom(null);
  }

  function markCustom() {
    setPresetId('custom');
  }

  function loadPreset(id) {
    const preset = GRAPH_PRESETS[id];
    if (!preset) {
      return;
    }

    const graph = cloneGraph(preset);
    setPresetId(id);
    setSourcePresetId(id);
    setNodes(graph.nodes);
    setEdges(graph.edges);
    setStartId(graph.start);
    setEndId(graph.end);
    setMode('select');
    resetRun();
  }

  function handlePresetChange(event) {
    const nextId = event.target.value;
    if (nextId === 'custom') {
      return;
    }

    loadPreset(nextId);
  }

  function handleAlgorithmChange(nextAlgorithm) {
    setAlgorithm(nextAlgorithm);
    resetRun();
  }

  function handleStartChange(event) {
    const nextId = event.target.value;
    setStartId(nextId);

    if (nextId === endId) {
      const fallback = nodes.find((node) => node.id !== nextId);
      if (fallback) {
        setEndId(fallback.id);
      }
    }

    resetRun();
  }

  function handleEndChange(event) {
    const nextId = event.target.value;
    setEndId(nextId);

    if (nextId === startId) {
      const fallback = nodes.find((node) => node.id !== nextId);
      if (fallback) {
        setStartId(fallback.id);
      }
    }

    resetRun();
  }

  function addOrUpdateEdge(source, target, weight) {
    if (source === target) {
      return;
    }

    const numericWeight = Math.min(99, Math.max(1, Number(weight) || 1));
    const existing = edges.find(
      (edge) =>
        (edge.source === source && edge.target === target) ||
        (edge.source === target && edge.target === source),
    );

    if (existing) {
      setEdges((current) =>
        current.map((edge) =>
          edge.id === existing.id ? { ...edge, weight: numericWeight } : edge,
        ),
      );
    } else {
      setEdges((current) => [
        ...current,
        {
          id: `e-${source}-${target}-${Date.now()}`,
          source,
          target,
          weight: numericWeight,
        },
      ]);
    }

    markCustom();
    resetRun();
  }

  function handleNodeSelect(nodeId, shiftKey) {
    if (mode === 'connect') {
      if (!connectFrom) {
        setConnectFrom(nodeId);
        return;
      }

      if (connectFrom === nodeId) {
        setConnectFrom(null);
        return;
      }

      addOrUpdateEdge(connectFrom, nodeId, newEdgeWeight);
      setConnectFrom(null);
      return;
    }

    if (shiftKey) {
      setEndId(nodeId);
      if (nodeId === startId) {
        setStartId(endId);
      }
    } else {
      setStartId(nodeId);
      if (nodeId === endId) {
        setEndId(startId);
      }
    }

    resetRun();
  }

  function handleNodeMove(nodeId, x, y) {
    setNodes((current) =>
      current.map((node) => (node.id === nodeId ? { ...node, x, y } : node)),
    );
  }

  function handleNodeDragEnd() {
    markCustom();
    resetRun();
  }

  function handleAddNode() {
    const position = getFreePosition(nodes);
    const id = `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const label = `V${nodes.length + 1}`;

    setNodes((current) => [...current, { id, label, ...position }]);
    markCustom();
    resetRun();
  }

  function handleRandomGraph() {
    const graph = createRandomGraph();
    setNodes(graph.nodes);
    setEdges(graph.edges);
    setStartId(graph.start);
    setEndId(graph.end);
    setMode('select');
    markCustom();
    resetRun();
  }

  function handleResetGraph() {
    loadPreset(sourcePresetId);
  }

  function handleToggleConnect() {
    setMode((current) => (current === 'connect' ? 'select' : 'connect'));
    setConnectFrom(null);
  }

  function startRun() {
    const generated = runAlgorithm(algorithm, nodes, edges, startId, endId);
    setSteps(generated);
    setStepIndex(0);
    setHasRun(true);
    setIsPlaying(generated.length > 1);
  }

  function handlePlayPause() {
    if (!canRun) {
      return;
    }

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    if (!hasRun || stepIndex >= steps.length - 1) {
      startRun();
      return;
    }

    setIsPlaying(true);
  }

  function handleStep() {
    if (!canRun) {
      return;
    }

    if (!hasRun || stepIndex >= steps.length - 1) {
      const generated = runAlgorithm(algorithm, nodes, edges, startId, endId);
      setSteps(generated);
      setStepIndex(0);
      setHasRun(true);
      setIsPlaying(false);
      return;
    }

    setIsPlaying(false);
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function handleReset() {
    resetRun();
  }

  const presetName = activePreset ? activePreset.name : 'Власний граф';
  const statusLabel = isPlaying
    ? 'Виконується'
    : isFinished
      ? 'Завершено'
      : hasRun
        ? 'Пауза'
        : 'Готово';

  return (
    <section className="section workspace-section" id="visualizer">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Робочий простір</p>
            <h2>Візуалізатор</h2>
          </div>
          <p className="section-head__note">
            Оберіть набір даних або зберіть власний граф. Керуйте анімацією,
            читайте псевдокод і порівнюйте стани вершин.
          </p>
        </div>

        <div className="workspace">
          <div className="workspace__toolbar">
            <label className="toolbar-select">
              <span>Набір даних</span>
              <select value={presetId} onChange={handlePresetChange}>
                {PRESET_LIST.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
                {presetId === 'custom' && <option value="custom">Власний граф</option>}
              </select>
            </label>

            <div className="algorithm-switch" aria-label="Вибір алгоритму">
              {ALGORITHM_ORDER.map((id) => (
                <button
                  key={id}
                  type="button"
                  className={algorithm === id ? 'is-active' : ''}
                  onClick={() => handleAlgorithmChange(id)}
                  aria-pressed={algorithm === id}
                  title={ALGORITHMS[id].name}
                >
                  {ALGORITHMS[id].shortName}
                </button>
              ))}
            </div>

            <span className={`status-pill status-pill--${isPlaying ? 'running' : isFinished ? 'done' : 'idle'}`}>
              <span className="status-pill__dot" />
              {statusLabel}
            </span>
          </div>

          <div className="workspace__body">
            <ControlPanel
              nodes={nodes}
              startId={startId}
              endId={endId}
              onStartChange={handleStartChange}
              onEndChange={handleEndChange}
              speed={speed}
              onSpeedChange={(event) => setSpeed(Number(event.target.value))}
              isPlaying={isPlaying}
              hasRun={hasRun}
              isFinished={isFinished}
              canRun={canRun}
              onPlayPause={handlePlayPause}
              onStep={handleStep}
              onReset={handleReset}
              mode={mode}
              connectFrom={connectFrom}
              newEdgeWeight={newEdgeWeight}
              onNewEdgeWeightChange={(event) => setNewEdgeWeight(Number(event.target.value))}
              onToggleConnect={handleToggleConnect}
              onAddNode={handleAddNode}
              onRandomGraph={handleRandomGraph}
              onResetGraph={handleResetGraph}
            />

            <div className="graph-area">
              <div className="graph-toolbar">
                <span>
                  <strong>{presetName}</strong> · {nodes.length} вершин · {edges.length} ребер
                </span>
                <span className="graph-toolbar__hint">
                  {mode === 'connect'
                    ? connectFrom
                      ? 'Оберіть другу вершину'
                      : 'Оберіть першу вершину'
                    : 'Клік — старт · Shift+клік — фініш'}
                </span>
              </div>

              <GraphCanvas
                nodes={nodes}
                edges={edges}
                startId={startId}
                endId={endId}
                currentStep={currentStep}
                mode={mode}
                connectFrom={connectFrom}
                onNodeSelect={handleNodeSelect}
                onNodeMove={handleNodeMove}
                onNodeDragEnd={handleNodeDragEnd}
              />

              <div className="graph-legend" aria-label="Позначення кольорів">
                <span><i className="legend-dot legend-dot--start" />старт</span>
                <span><i className="legend-dot legend-dot--end" />фініш</span>
                <span><i className="legend-dot legend-dot--current" />поточна</span>
                <span><i className="legend-dot legend-dot--frontier" />у черзі</span>
                <span><i className="legend-dot legend-dot--visited" />відвідана</span>
                <span><i className="legend-dot legend-dot--path" />шлях</span>
              </div>

              {result && (
                <div
                  className={`result-banner ${result.path ? 'result-banner--success' : 'result-banner--warning'}`}
                  role="status"
                >
                  <div>
                    <strong>{result.path ? 'Шлях знайдено' : 'Шлях не знайдено'}</strong>
                    <span className="result-banner__path">
                      {result.path
                        ? formatPath(nodes, result.path)
                        : 'Спробуйте іншу стартову або цільову вершину.'}
                    </span>
                  </div>
                  {result.path && (
                    <span className="result-banner__cost">
                      {algorithm === 'dijkstra' ? 'Сума ваг' : 'Ребер'}:{' '}
                      <strong>
                        {algorithm === 'dijkstra'
                          ? result.stats.pathCost
                          : result.path.length - 1}
                      </strong>
                    </span>
                  )}
                </div>
              )}
            </div>

            <StatePanel
              currentStep={currentStep}
              steps={steps}
              stepIndex={stepIndex}
              algorithm={algorithm}
              hasRun={hasRun}
              isFinished={isFinished}
              result={result}
              nodes={nodes}
            />
          </div>
        </div>

        <div className="data-panel">
          <div className="data-panel__head">
            <div>
              <h3>Стан вершин</h3>
              <p>Таблиця оновлюється на кожному кроці алгоритму.</p>
            </div>
            <span className="data-panel__badge">
              {algorithm === 'dfs' ? 'глибина' : 'відстань'}
            </span>
          </div>
          <DistanceTable
            nodes={nodes}
            currentStep={currentStep}
            algorithm={algorithm}
            startId={startId}
            endId={endId}
          />
        </div>
      </div>
    </section>
  );
}
