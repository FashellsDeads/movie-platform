import { useRef, useState } from 'react'
import { getPromoDiscount } from '../../../utils/helpers.js'
import Button from '../../common/Button/Button.jsx'
import CustomInput from '../../common/CustomInput/CustomInput.jsx'
import Toggle from '../../common/Toggle/Toggle.jsx'
import './PromoCode.css'

/**
 * Промокод в корзине. Поле спрятано за «Есть промокод?» (Toggle), а само поле — CustomInput:
 * через ref берём значение (getValue), очищаем (clear) и ставим фокус при ошибке (focus).
 * @param {{ discountPercent: number, onApply: (percent: number) => void }} props
 */
function PromoCode({ discountPercent, onApply }) {
  const inputRef = useRef(null)
  const [message, setMessage] = useState('')

  const apply = () => {
    const percent = getPromoDiscount(inputRef.current.getValue())
    onApply(percent)
    if (percent > 0) {
      setMessage(`Скидка ${percent}% применена`)
    } else {
      setMessage('Промокод не найден')
      inputRef.current.focus()
    }
  }

  const clear = () => {
    inputRef.current.clear()
    onApply(0)
    setMessage('')
  }

  return (
    <div className="promo-code">
      <Toggle defaultOpen={discountPercent > 0}>
        <Toggle.Button>Есть промокод?</Toggle.Button>
        <Toggle.Content>
          <div className="promo-code__row">
            <CustomInput ref={inputRef} label="Промокод" placeholder="Например, CINEVIBE10" />
            <Button variant="secondary" onClick={apply}>
              Применить
            </Button>
            <Button variant="outline" onClick={clear}>
              Очистить
            </Button>
          </div>
          {message && (
            <p className={`promo-code__message${discountPercent > 0 ? ' promo-code__message--ok' : ''}`} role="status">
              {message}
            </p>
          )}
        </Toggle.Content>
      </Toggle>
    </div>
  )
}

export default PromoCode
