import './Counter.css'

/**
 * @typedef {Object} CounterProps
 * @property {string} label — что считаем
 * @property {number} value — текущее значение
 * @property {() => void} onDecrement — кнопка −
 * @property {() => void} onIncrement — кнопка +
 * @property {number} [min=1]
 * @property {number} [max=20]
 */

/**
 * Счётчик с кнопками − и +. Значение хранит родитель: каждое нажатие меняет его state
 * и перерисовывает родителя — на этом в ДЗ №9 видно, кого из детей задевает такой рендер.
 * @param {CounterProps} props
 */
function Counter({ label, value, onDecrement, onIncrement, min = 1, max = 20 }) {
  console.log('Counter render')

  return (
    <div className="counter">
      <span className="counter__label">{label}</span>
      <div className="counter__controls">
        <button
          type="button"
          className="counter__button"
          aria-label="Уменьшить"
          disabled={value <= min}
          onClick={onDecrement}
        >
          −
        </button>
        <output className="counter__value" aria-live="polite">
          {value}
        </output>
        <button
          type="button"
          className="counter__button"
          aria-label="Увеличить"
          disabled={value >= max}
          onClick={onIncrement}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default Counter
