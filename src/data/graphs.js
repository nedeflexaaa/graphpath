export const GRAPH_PRESETS = {
  city: {
    id: 'city',
    name: 'Місто',
    note: '7 вершин · 10 ребер · ваги в хвилинах',
    start: 'a',
    end: 'e',
    nodes: [
      { id: 'a', label: 'Вокзал', x: 88, y: 236 },
      { id: 'b', label: 'Центр', x: 226, y: 118 },
      { id: 'c', label: 'Універ', x: 402, y: 82 },
      { id: 'd', label: 'Парк', x: 356, y: 258 },
      { id: 'e', label: 'Лікарня', x: 578, y: 158 },
      { id: 'f', label: 'Стадіон', x: 198, y: 354 },
      { id: 'g', label: 'Житло', x: 520, y: 362 },
    ],
    edges: [
      { id: 'a-b', source: 'a', target: 'b', weight: 4 },
      { id: 'a-f', source: 'a', target: 'f', weight: 2 },
      { id: 'b-c', source: 'b', target: 'c', weight: 3 },
      { id: 'b-d', source: 'b', target: 'd', weight: 5 },
      { id: 'c-e', source: 'c', target: 'e', weight: 4 },
      { id: 'd-e', source: 'd', target: 'e', weight: 2 },
      { id: 'd-f', source: 'd', target: 'f', weight: 3 },
      { id: 'd-g', source: 'd', target: 'g', weight: 7 },
      { id: 'f-g', source: 'f', target: 'g', weight: 6 },
      { id: 'e-g', source: 'e', target: 'g', weight: 2 },
    ],
  },
  network: {
    id: 'network',
    name: 'Мережа',
    note: '7 вершин · 9 ребер · ваги в мілісекундах',
    start: 'core',
    end: 'pc',
    nodes: [
      { id: 'core', label: 'Ядро', x: 92, y: 232 },
      { id: 'fw', label: 'FW', x: 106, y: 372 },
      { id: 'sw1', label: 'SW-1', x: 272, y: 104 },
      { id: 'sw2', label: 'SW-2', x: 276, y: 292 },
      { id: 'srv1', label: 'SRV-1', x: 482, y: 72 },
      { id: 'srv2', label: 'SRV-2', x: 502, y: 212 },
      { id: 'pc', label: 'PC', x: 526, y: 360 },
    ],
    edges: [
      { id: 'core-sw1', source: 'core', target: 'sw1', weight: 2 },
      { id: 'core-sw2', source: 'core', target: 'sw2', weight: 3 },
      { id: 'core-fw', source: 'core', target: 'fw', weight: 1 },
      { id: 'sw1-srv1', source: 'sw1', target: 'srv1', weight: 4 },
      { id: 'sw1-srv2', source: 'sw1', target: 'srv2', weight: 6 },
      { id: 'sw2-srv2', source: 'sw2', target: 'srv2', weight: 2 },
      { id: 'sw2-pc', source: 'sw2', target: 'pc', weight: 5 },
      { id: 'fw-sw2', source: 'fw', target: 'sw2', weight: 4 },
      { id: 'srv2-pc', source: 'srv2', target: 'pc', weight: 3 },
    ],
  },
  training: {
    id: 'training',
    name: 'Навчальний',
    note: '7 вершин · 9 ребер · без ваг (умовно 1)',
    start: 'a',
    end: 'g',
    nodes: [
      { id: 'a', label: 'A', x: 92, y: 96 },
      { id: 'b', label: 'B', x: 244, y: 62 },
      { id: 'c', label: 'C', x: 404, y: 92 },
      { id: 'd', label: 'D', x: 146, y: 266 },
      { id: 'e', label: 'E', x: 312, y: 236 },
      { id: 'f', label: 'F', x: 486, y: 284 },
      { id: 'g', label: 'G', x: 604, y: 154 },
    ],
    edges: [
      { id: 'a-b', source: 'a', target: 'b', weight: 1 },
      { id: 'a-d', source: 'a', target: 'd', weight: 1 },
      { id: 'b-c', source: 'b', target: 'c', weight: 1 },
      { id: 'b-e', source: 'b', target: 'e', weight: 1 },
      { id: 'c-g', source: 'c', target: 'g', weight: 1 },
      { id: 'c-f', source: 'c', target: 'f', weight: 1 },
      { id: 'd-e', source: 'd', target: 'e', weight: 1 },
      { id: 'e-f', source: 'e', target: 'f', weight: 1 },
      { id: 'f-g', source: 'f', target: 'g', weight: 1 },
    ],
  },
};

export const PRESET_LIST = Object.values(GRAPH_PRESETS).map(({ id, name, note }) => ({
  id,
  name,
  note,
}));

export function cloneGraph(graph) {
  return {
    ...graph,
    nodes: graph.nodes.map((node) => ({ ...node })),
    edges: graph.edges.map((edge) => ({ ...edge })),
  };
}
