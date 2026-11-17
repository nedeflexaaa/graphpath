import { ALGORITHMS } from '../lib/algorithms.js';

export default function Pseudocode({ algorithm, codeLine }) {
  const info = ALGORITHMS[algorithm];

  return (
    <div className="pseudocode-block">
      <div className="pseudocode" aria-label={`Псевдокод алгоритму ${info.shortName}`}>
        {info.pseudocode.map((line, index) => (
          <span
            key={`${info.id}-${index}`}
            className={`pseudocode__line ${codeLine === index ? 'is-active' : ''}`}
          >
            <span className="pseudocode__number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <code>{line || ' '}</code>
          </span>
        ))}
      </div>
      <p className="pseudocode__meta">
        Складність: <strong>{info.complexity}</strong> · Пам'ять: <strong>{info.memory}</strong>
      </p>
    </div>
  );
}
