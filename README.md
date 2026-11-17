# GraphPath

GraphPath — навчальний веб-застосунок для інтерактивної візуалізації алгоритмів пошуку шляхів на графах. Реалізовано як односторінковий клієнтський застосунок без бекенду.

## Можливості

- три демонстраційні набори даних: «Місто», «Мережа», «Навчальний»;
- створення власного графа: додавання вершин, перетягування, з’єднання ребер із вагою;
- BFS, DFS і Dijkstra з покроковим виконанням;
- синхронне підсвічування графа, псевдокоду, черги або стека та таблиці відстаней;
- керування швидкістю, пауза, один крок, скидання;
- світла й темна теми зі збереженням вибору;
- адаптивна верстка та клавіатурна навігація.

## Стек

- React 18;
- Vite 5;
- Sass;
- SVG і Pointer Events;
- `localStorage` для збереження теми.

## Запуск

Потрібен Node.js 18 або новіший.

```bash
npm install
npm run dev
```

Vite відкриє застосунок за адресою `http://localhost:5173`.

Production-збірка:

```bash
npm run build
npm run preview
```

## Структура

```text
StemProject/
├── src/
│   ├── components/       # React-компоненти інтерфейсу
│   ├── data/graphs.js    # демонстраційні набори графів
│   ├── lib/algorithms.js # BFS, DFS, Dijkstra і знімки стану
│   ├── styles/           # Sass-частини
│   └── assets/images/    # реальні фотографії
├── docs/
│   ├── diagrams/         # User Flow, State Diagram, wireframes
│   ├── report/           # звіт DOCX
│   ├── presentation/     # презентація PPTX
│   └── defense/          # сценарій захисту та Q&A
├── screenshots/          # світла й темна теми, десктоп і мобільний
└── scripts/              # генератори звіту, презентації та скриншотів
```

## Алгоритми

- **BFS** — черга, `O(V + E)`, мінімізує кількість ребер у незваженому графі.
- **DFS** — стек, `O(V + E)`, обходить граф углиб; не гарантує найкоротший шлях.
- **Dijkstra** — пріоритетна черга, `O((V + E) log V)`, мінімізує суму додатних ваг.

Кожен алгоритм повертає масив знімків стану, тому інтерфейс може відтворювати процес покроково без повторного запуску.

## Матеріали

- `docs/report/GraphPath_Report.docx` — звіт;
- `docs/presentation/GraphPath_Presentation.pptx` — презентація на 10 слайдів;
- `docs/defense/GraphPath_Defense.md` — сценарій захисту та відповіді на запитання.

## Фотографії

Фотографії взято з [Unsplash](https://unsplash.com/) і використано згідно з [Unsplash License](https://unsplash.com/license). Усі зображення є реальними фотографіями, без генеративних ілюстрацій.

## Репозиторій і демо

- Код: [github.com/nedeflexaaa/graphpath](https://github.com/nedeflexaaa/graphpath)
- Демо: [nedeflexaaa.github.io/graphpath](https://nedeflexaaa.github.io/graphpath/)
