import { useRef } from 'react';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function midpoint(first, second) {
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
  };
}

function isSameEdge(edge, source, target) {
  return (
    (edge.source === source && edge.target === target) ||
    (edge.source === target && edge.target === source)
  );
}

export default function GraphCanvas({
  nodes,
  edges,
  startId,
  endId,
  currentStep,
  mode,
  connectFrom,
  onNodeSelect,
  onNodeMove,
  onNodeDragEnd,
}) {
  const svgRef = useRef(null);
  const dragRef = useRef(null);

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  function toSvgPoint(clientX, clientY) {
    const svg = svgRef.current;
    if (!svg) {
      return { x: 0, y: 0 };
    }

    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const matrix = svg.getScreenCTM();

    if (!matrix) {
      return { x: 0, y: 0 };
    }

    const transformed = point.matrixTransform(matrix.inverse());
    return { x: transformed.x, y: transformed.y };
  }

  function nodeState(nodeId) {
    if (currentStep) {
      if (currentStep.path?.includes(nodeId)) {
        return 'path';
      }

      if (currentStep.current === nodeId) {
        return 'current';
      }

      if (currentStep.visited?.includes(nodeId)) {
        return 'visited';
      }

      if (currentStep.frontier?.some((item) => item.id === nodeId)) {
        return 'frontier';
      }
    }

    if (nodeId === startId) {
      return 'start';
    }

    if (nodeId === endId) {
      return 'end';
    }

    return 'default';
  }

  function edgeState(edge) {
    if (currentStep?.activeEdge && isSameEdge(edge, ...currentStep.activeEdge)) {
      return 'active';
    }

    if (currentStep?.path) {
      for (let index = 0; index < currentStep.path.length - 1; index += 1) {
        if (isSameEdge(edge, currentStep.path[index], currentStep.path[index + 1])) {
          return 'path';
        }
      }
    }

    return 'default';
  }

  function handlePointerDown(event, node) {
    event.stopPropagation();
    const point = toSvgPoint(event.clientX, event.clientY);

    dragRef.current = {
      id: node.id,
      offsetX: point.x - node.x,
      offsetY: point.y - node.y,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
      pointerId: event.pointerId,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    const drag = dragRef.current;
    if (!drag) {
      return;
    }

    const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
    if (!drag.moved && distance > 3) {
      drag.moved = true;
    }

    if (!drag.moved) {
      return;
    }

    const point = toSvgPoint(event.clientX, event.clientY);
    onNodeMove(
      drag.id,
      Math.round(clamp(point.x - drag.offsetX, 34, 666)),
      Math.round(clamp(point.y - drag.offsetY, 34, 426)),
    );
  }

  function handlePointerUp(event) {
    const drag = dragRef.current;
    if (!drag) {
      return;
    }

    dragRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (drag.moved) {
      onNodeDragEnd();
    } else {
      onNodeSelect(drag.id, event.shiftKey);
    }
  }

  function handlePointerCancel(event) {
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleKeyDown(event, node) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onNodeSelect(node.id, event.shiftKey);
      return;
    }

    const arrows = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };

    if (arrows[event.key]) {
      event.preventDefault();
      const step = event.shiftKey ? 12 : 6;
      const [dx, dy] = arrows[event.key];
      onNodeMove(
        node.id,
        Math.round(clamp(node.x + dx * step, 34, 666)),
        Math.round(clamp(node.y + dy * step, 34, 426)),
      );
      onNodeDragEnd();
    }
  }

  return (
    <div className={`graph-canvas ${mode === 'connect' ? 'graph-canvas--connect' : ''}`}>
      <svg
        ref={svgRef}
        viewBox="0 0 700 460"
        role="group"
        aria-label="Інтерактивний граф із вершинами та зваженими ребрами"
        preserveAspectRatio="xMidYMid meet"
      >
        <title>Інтерактивний граф</title>

        <g className="graph-edges">
          {edges.map((edge) => {
            const source = nodeMap.get(edge.source);
            const target = nodeMap.get(edge.target);
            if (!source || !target) {
              return null;
            }

            const middle = midpoint(source, target);
            const state = edgeState(edge);

            return (
              <g key={edge.id} className={`graph-edge graph-edge--${state}`}>
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  className="graph-edge__line"
                />
                <text x={middle.x} y={middle.y - 7} className="graph-edge__weight">
                  {edge.weight}
                </text>
              </g>
            );
          })}
        </g>

        <g className="graph-nodes">
          {nodes.map((node) => {
            const state = nodeState(node.id);
            const isStart = node.id === startId;
            const isEnd = node.id === endId;
            const isConnectFrom = connectFrom === node.id;

            return (
              <g
                key={node.id}
                className={`graph-node graph-node--${state} ${isConnectFrom ? 'is-connect-from' : ''}`}
                transform={`translate(${node.x} ${node.y})`}
                role="button"
                tabIndex="0"
                aria-label={`Вершина ${node.label}${isStart ? ', старт' : ''}${isEnd ? ', фініш' : ''}`}
                onPointerDown={(event) => handlePointerDown(event, node)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                onKeyDown={(event) => handleKeyDown(event, node)}
              >
                {isStart && <circle r="31" className="node-ring node-ring--start" />}
                {isEnd && <circle r="31" className="node-ring node-ring--end" />}
                <circle r="25" className="graph-node__circle" />
                <text className="graph-node__label" textAnchor="middle" dominantBaseline="middle">
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
