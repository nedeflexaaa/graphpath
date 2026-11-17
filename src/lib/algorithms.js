export const ALGORITHM_ORDER = ['bfs', 'dfs', 'dijkstra'];

export const ALGORITHMS = {
  bfs: {
    id: 'bfs',
    shortName: 'BFS',
    name: 'Пошук у ширину',
    tagline: 'Рівень за рівнем',
    description:
      'Обходить граф хвилями: спочатку всі сусіди стартової вершини, потім їхні сусіди. Гарантує найкоротший шлях у незваженому графі.',
    complexity: 'O(V + E)',
    memory: 'O(V)',
    structure: 'Черга',
    weighted: false,
    useCases: [
      'найкоротший шлях у незваженому графі',
      'перевірка зв’язності компонент',
      'пошук у лабіринтах і на сітках',
    ],
    pseudocode: [
      'procedure BFS(G, start, goal)',
      '  queue ← [start]',
      '  visited ← {start}',
      '  parent[start] ← null',
      '  while queue is not empty do',
      '    u ← queue.dequeue()',
      '    if u = goal then',
      '      return reconstruct(parent, start, goal)',
      '    for each neighbor v of u do',
      '      if v ∉ visited then',
      '        visited.add(v)',
      '        parent[v] ← u',
      '        queue.enqueue(v)',
      '  return "no path"',
    ],
  },
  dfs: {
    id: 'dfs',
    shortName: 'DFS',
    name: 'Пошук у глибину',
    tagline: 'Глибше й глибше',
    description:
      'Іде якомога глибше, поки не дійде до глухого кута, а потім повертається назад. Добре підходить для обходу та перевірки структури графа, але не гарантує найкоротший шлях.',
    complexity: 'O(V + E)',
    memory: 'O(V)',
    structure: 'Стек',
    weighted: false,
    useCases: [
      'обхід усіх вершин графа',
      'пошук компонент зв’язності',
      'аналіз залежностей і циклів',
    ],
    pseudocode: [
      'procedure DFS(G, start, goal)',
      '  stack ← [start]',
      '  visited ← {start}',
      '  parent[start] ← null',
      '  while stack is not empty do',
      '    u ← stack.pop()',
      '    if u = goal then',
      '      return reconstruct(parent, start, goal)',
      '    for each neighbor v of u do',
      '      if v ∉ visited then',
      '        visited.add(v)',
      '        parent[v] ← u',
      '        stack.push(v)',
      '  return "no path"',
    ],
  },
  dijkstra: {
    id: 'dijkstra',
    shortName: 'Dijkstra',
    name: 'Алгоритм Дейкстри',
    tagline: 'Найдешевший шлях',
    description:
      'Поступово уточнює найменшу вартість шляху до кожної вершини. Працює з додатними вагами ребер і гарантує оптимальний маршрут за сумарною вагою.',
    complexity: 'O((V + E) log V)',
    memory: 'O(V)',
    structure: 'Пріоритетна черга',
    weighted: true,
    useCases: [
      'навігація та маршрутизація',
      'логістика й транспортні мережі',
      'мережеві протоколи та пошук шляхів',
    ],
    pseudocode: [
      'procedure Dijkstra(G, start, goal)',
      '  dist[start] ← 0',
      '  PQ ← {(start, 0)}',
      '  while PQ is not empty do',
      '    u ← PQ.extractMin()',
      '    if u = goal then',
      '      return reconstruct(parent, start, goal)',
      '    for each neighbor v of u do',
      '      alt ← dist[u] + weight(u, v)',
      '      if alt < dist[v] then',
      '        dist[v] ← alt',
      '        parent[v] ← u',
      '        PQ.insert(v, alt)',
      '  return "no path"',
    ],
  },
};

export function buildAdjacency(nodes, edges) {
  const adjacency = new Map(nodes.map((node) => [node.id, []]));

  edges.forEach((edge) => {
    if (!adjacency.has(edge.source) || !adjacency.has(edge.target)) {
      return;
    }

    adjacency.get(edge.source).push({
      to: edge.target,
      weight: Number(edge.weight) || 1,
      edgeId: edge.id,
    });
    adjacency.get(edge.target).push({
      to: edge.source,
      weight: Number(edge.weight) || 1,
      edgeId: edge.id,
    });
  });

  return adjacency;
}

export function formatPath(nodes, path) {
  if (!path || path.length === 0) {
    return '';
  }

  const labels = new Map(nodes.map((node) => [node.id, node.label]));
  return path.map((id) => labels.get(id) ?? id).join(' → ');
}

export function reconstructPath(previous, startId, endId) {
  if (startId === endId) {
    return [startId];
  }

  const path = [];
  const seen = new Set();
  let current = endId;

  while (current != null && !seen.has(current)) {
    seen.add(current);
    path.push(current);

    if (current === startId) {
      return path.reverse();
    }

    current = previous[current];
  }

  return null;
}

function createInitialState(nodes, startId) {
  const distances = Object.fromEntries(nodes.map((node) => [node.id, Infinity]));
  const previous = Object.fromEntries(nodes.map((node) => [node.id, null]));
  distances[startId] = 0;
  return { distances, previous };
}

function makeSnapshot({
  algorithm,
  nodes,
  endId,
  visited,
  discovered,
  frontier,
  distances,
  previous,
  current,
  activeEdge,
  path,
  type,
  codeLine,
  message,
}) {
  const visitedArray = [...visited];
  const frontierArray = frontier.map((item) => ({ ...item }));
  const distancesCopy = { ...distances };
  const previousCopy = { ...previous };
  const pathCopy = path ? [...path] : null;

  return {
    type,
    algorithm,
    current,
    activeEdge: activeEdge ? [...activeEdge] : null,
    visited: visitedArray,
    discovered: [...discovered],
    frontier: frontierArray,
    distances: distancesCopy,
    previous: previousCopy,
    path: pathCopy,
    codeLine,
    message,
    stats: {
      visited: visitedArray.length,
      frontier: frontierArray.length,
      pathCost:
        pathCopy && Number.isFinite(distancesCopy[endId]) ? distancesCopy[endId] : null,
    },
  };
}

function queueFrontier(queue, distances) {
  return queue.map((id) => ({ id, distance: distances[id] }));
}

function stackFrontier(stack, distances) {
  return stack.map((id) => ({ id, distance: distances[id] }));
}

function priorityFrontier(queue, distances, visited) {
  const best = new Map();

  queue.forEach((item) => {
    if (visited.has(item.id) || item.distance !== distances[item.id]) {
      return;
    }

    const currentBest = best.get(item.id);
    if (currentBest == null || item.distance < currentBest) {
      best.set(item.id, item.distance);
    }
  });

  return [...best.entries()]
    .sort((a, b) => a[1] - b[1])
    .map(([id, distance]) => ({ id, distance }));
}

function labelOf(nodes, id) {
  return nodes.find((node) => node.id === id)?.label ?? id;
}

export function runBfs(nodes, edges, startId, endId) {
  const adjacency = buildAdjacency(nodes, edges);
  const { distances, previous } = createInitialState(nodes, startId);
  const visited = new Set();
  const discovered = new Set([startId]);
  const queue = [startId];
  const steps = [];

  const push = (patch) =>
    steps.push(
      makeSnapshot({
        algorithm: 'bfs',
        nodes,
        endId,
        visited,
        discovered,
        frontier: queueFrontier(queue, distances),
        distances,
        previous,
        ...patch,
      }),
    );

  push({
    type: 'init',
    current: null,
    activeEdge: null,
    path: null,
    codeLine: 1,
    message: `Ініціалізація: вершина ${labelOf(nodes, startId)} додана в чергу.`,
  });

  while (queue.length > 0) {
    const current = queue.shift();
    visited.add(current);

    push({
      type: 'visit',
      current,
      activeEdge: null,
      path: null,
      codeLine: 5,
      message: `Беремо з черги вершину ${labelOf(nodes, current)}.`,
    });

    if (current === endId) {
      const path = reconstructPath(previous, startId, endId);
      push({
        type: 'done',
        current,
        activeEdge: null,
        path,
        codeLine: 7,
        message: `Ціль ${labelOf(nodes, endId)} знайдено. Шлях: ${formatPath(nodes, path)}.`,
      });
      return steps;
    }

    const neighbors = adjacency.get(current) ?? [];
    neighbors.forEach(({ to }) => {
      if (discovered.has(to)) {
        return;
      }

      discovered.add(to);
      distances[to] = distances[current] + 1;
      previous[to] = current;
      queue.push(to);

      push({
        type: 'discover',
        current,
        activeEdge: [current, to],
        path: null,
        codeLine: 10,
        message: `Знайдено сусіда ${labelOf(nodes, to)}; додано в чергу.`,
      });
    });
  }

  push({
    type: 'done',
    current: null,
    activeEdge: null,
    path: null,
    codeLine: 13,
    message: `Шлях від ${labelOf(nodes, startId)} до ${labelOf(nodes, endId)} не знайдено.`,
  });

  return steps;
}

export function runDfs(nodes, edges, startId, endId) {
  const adjacency = buildAdjacency(nodes, edges);
  const { distances, previous } = createInitialState(nodes, startId);
  const visited = new Set();
  const discovered = new Set([startId]);
  const stack = [startId];
  const steps = [];

  const push = (patch) =>
    steps.push(
      makeSnapshot({
        algorithm: 'dfs',
        nodes,
        endId,
        visited,
        discovered,
        frontier: stackFrontier(stack, distances),
        distances,
        previous,
        ...patch,
      }),
    );

  push({
    type: 'init',
    current: null,
    activeEdge: null,
    path: null,
    codeLine: 1,
    message: `Ініціалізація: вершина ${labelOf(nodes, startId)} додана в стек.`,
  });

  while (stack.length > 0) {
    const current = stack.pop();

    if (visited.has(current)) {
      continue;
    }

    visited.add(current);

    push({
      type: 'visit',
      current,
      activeEdge: null,
      path: null,
      codeLine: 5,
      message: `Знімаємо зі стека вершину ${labelOf(nodes, current)}.`,
    });

    if (current === endId) {
      const path = reconstructPath(previous, startId, endId);
      push({
        type: 'done',
        current,
        activeEdge: null,
        path,
        codeLine: 7,
        message: `Ціль ${labelOf(nodes, endId)} знайдено. Шлях: ${formatPath(nodes, path)}.`,
      });
      return steps;
    }

    const neighbors = adjacency.get(current) ?? [];
    for (let index = neighbors.length - 1; index >= 0; index -= 1) {
      const { to } = neighbors[index];

      if (discovered.has(to)) {
        continue;
      }

      discovered.add(to);
      distances[to] = distances[current] + 1;
      previous[to] = current;
      stack.push(to);

      push({
        type: 'discover',
        current,
        activeEdge: [current, to],
        path: null,
        codeLine: 10,
        message: `Додаємо ${labelOf(nodes, to)} у стек для подальшого обходу.`,
      });
    }
  }

  push({
    type: 'done',
    current: null,
    activeEdge: null,
    path: null,
    codeLine: 13,
    message: `Шлях від ${labelOf(nodes, startId)} до ${labelOf(nodes, endId)} не знайдено.`,
  });

  return steps;
}

export function runDijkstra(nodes, edges, startId, endId) {
  const adjacency = buildAdjacency(nodes, edges);
  const { distances, previous } = createInitialState(nodes, startId);
  const visited = new Set();
  const discovered = new Set([startId]);
  const queue = [{ id: startId, distance: 0 }];
  const steps = [];

  const push = (patch) =>
    steps.push(
      makeSnapshot({
        algorithm: 'dijkstra',
        nodes,
        endId,
        visited,
        discovered,
        frontier: priorityFrontier(queue, distances, visited),
        distances,
        previous,
        ...patch,
      }),
    );

  push({
    type: 'init',
    current: null,
    activeEdge: null,
    path: null,
    codeLine: 1,
    message: `Ініціалізація: dist[${labelOf(nodes, startId)}] = 0, решта — ∞.`,
  });

  while (queue.length > 0) {
    queue.sort((a, b) => a.distance - b.distance || a.id.localeCompare(b.id));
    const item = queue.shift();
    const current = item.id;

    if (visited.has(current) || item.distance !== distances[current]) {
      continue;
    }

    visited.add(current);

    push({
      type: 'visit',
      current,
      activeEdge: null,
      path: null,
      codeLine: 4,
      message: `Беремо з пріоритетної черги ${labelOf(nodes, current)} (dist = ${item.distance}).`,
    });

    if (current === endId) {
      const path = reconstructPath(previous, startId, endId);
      push({
        type: 'done',
        current,
        activeEdge: null,
        path,
        codeLine: 6,
        message: `Ціль ${labelOf(nodes, endId)} знайдено. Шлях: ${formatPath(nodes, path)}; вартість: ${distances[endId]}.`,
      });
      return steps;
    }

    const neighbors = adjacency.get(current) ?? [];
    neighbors.forEach(({ to, weight }) => {
      if (visited.has(to)) {
        return;
      }

      const alternative = distances[current] + weight;
      if (alternative >= distances[to]) {
        return;
      }

      distances[to] = alternative;
      previous[to] = current;
      discovered.add(to);
      queue.push({ id: to, distance: alternative });

      push({
        type: 'relax',
        current,
        activeEdge: [current, to],
        path: null,
        codeLine: 10,
        message: `Оновлено dist[${labelOf(nodes, to)}] = ${alternative} через ${labelOf(nodes, current)}.`,
      });
    });
  }

  push({
    type: 'done',
    current: null,
    activeEdge: null,
    path: null,
    codeLine: 13,
    message: `Шлях від ${labelOf(nodes, startId)} до ${labelOf(nodes, endId)} не знайдено.`,
  });

  return steps;
}

export function runAlgorithm(algorithm, nodes, edges, startId, endId) {
  if (!nodes.length || !startId || !endId) {
    return [];
  }

  switch (algorithm) {
    case 'bfs':
      return runBfs(nodes, edges, startId, endId);
    case 'dfs':
      return runDfs(nodes, edges, startId, endId);
    case 'dijkstra':
      return runDijkstra(nodes, edges, startId, endId);
    default:
      return [];
  }
}
