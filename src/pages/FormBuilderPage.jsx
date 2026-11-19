import { useRef, useState } from 'react'
import Button from '../components/Button/Button.jsx'
import Card from '../components/Card/Card.jsx'
import Container from '../components/Container/Container.jsx'
import CustomInput from '../components/CustomInput/CustomInput.jsx'
import FormBuilder from '../components/FormBuilder/FormBuilder.jsx'
import FormPreview from '../components/FormPreview/FormPreview.jsx'
import FormProvider from '../components/FormProvider/FormProvider.jsx'
import { FORM_ACTIONS } from '../components/FormProvider/formReducer.js'
import { useForm } from '../components/FormProvider/useForm.js'
import Input from '../components/Input/Input.jsx'
import SearchInput from '../components/SearchInput/SearchInput.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import './FormBuilderPage.css'

const MAX_FIELDS = 6

// Анкета зрителя для закрытого показа — стартовая структура формы
const initialFields = [
  { id: 'name', name: 'name', label: 'Имя', type: 'text', required: true },
  { id: 'email', name: 'email', label: 'Email', type: 'email', required: true },
  { id: 'guests', name: 'guests', label: 'Количество гостей', type: 'number', required: false },
  { id: 'city', name: 'city', label: 'Город', type: 'select', required: false, options: ['Алматы', 'Астана', 'Шымкент'] },
]

/**
 * State Reducer Pattern: внешний reducer меняет одно действие — не даёт добавить поле сверх лимита.
 * Всё остальное делает стандартный reducer (третий аргумент).
 */
function limitFieldsReducer(state, action, defaultReducer) {
  if (action.type === FORM_ACTIONS.ADD_FIELD && state.fields.length >= MAX_FIELDS) return state
  return defaultReducer(state, action)
}

/** Панель управления и рабочая область — внутри FormProvider, поэтому видят состояние формы. */
function Workspace({ mode, isLimited }) {
  const { fields, undo, redo, canUndo, canRedo, resetForm } = useForm()
  const notice =
    isLimited && fields.length >= MAX_FIELDS ? (
      <p className="form-builder-page__notice" role="status">
        Достигнут лимит: {MAX_FIELDS} полей
      </p>
    ) : null

  return (
    <>
      <div className="form-builder-page__toolbar">
        <Button variant="secondary" disabled={!canUndo} onClick={undo}>
          Undo
        </Button>
        <Button variant="secondary" disabled={!canRedo} onClick={redo}>
          Redo
        </Button>
        <Button variant="outline" onClick={resetForm}>
          Сбросить форму
        </Button>
      </div>

      {mode === 'edit' ? (
        <div className="form-builder-page__edit">
          <FormBuilder notice={notice} />
          <Card as="aside" title="Структура формы" size="small" className="form-builder-page__structure">
            <pre data-testid="form-structure">{JSON.stringify(fields, null, 2)}</pre>
          </Card>
        </div>
      ) : (
        <FormPreview />
      )}
    </>
  )
}

/** Секция с тремя вариантами полей ввода из задания. */
function InputComponentsDemo() {
  const [controlledName, setControlledName] = useState('')
  const [query, setQuery] = useState('')
  const searchRef = useRef(null)
  const promoRef = useRef(null)
  const [promoValue, setPromoValue] = useState('')

  return (
    <div className="form-builder-page__inputs">
      <Card title="Controlled и Uncontrolled" size="small">
        <div className="form-builder-page__stack">
          <Input label="Controlled: имя" value={controlledName} onChange={setControlledName} placeholder="Введите имя" />
          <p className="form-builder-page__hint">Родитель хранит: «{controlledName}»</p>
          <Input label="Uncontrolled: имя" defaultValue="Адильжан" />
          <p className="form-builder-page__hint">Значение живёт в самом поле (DOM), родитель его не хранит.</p>
        </div>
      </Card>

      <Card title="SearchInput — forwardRef" size="small">
        <div className="form-builder-page__stack">
          <SearchInput ref={searchRef} value={query} onChange={setQuery} placeholder="Найти фильм…" />
          <Button variant="secondary" onClick={() => searchRef.current.focus()}>
            Focus search
          </Button>
        </div>
      </Card>

      <Card title="CustomInput — useImperativeHandle" size="small">
        <div className="form-builder-page__stack">
          <CustomInput ref={promoRef} label="Промокод" placeholder="Например, CINEVIBE10" />
          <div className="form-builder-page__row">
            <Button variant="secondary" onClick={() => promoRef.current.focus()}>
              Focus
            </Button>
            <Button variant="secondary" onClick={() => promoRef.current.clear()}>
              Clear
            </Button>
            <Button variant="secondary" onClick={() => setPromoValue(promoRef.current.getValue())}>
              Get value
            </Button>
          </div>
          <p className="form-builder-page__hint" aria-live="polite">
            Значение: {promoValue}
          </p>
        </div>
      </Card>
    </div>
  )
}

/**
 * Страница «/form-builder» (ДЗ №13) — конструктор формы: Edit и Preview,
 * Undo / Redo, State Reducer и компоненты ввода с ref.
 */
function FormBuilderPage() {
  useDocumentTitle('Конструктор форм')
  const [mode, setMode] = useState('edit')
  const [isLimited, setIsLimited] = useState(false)

  return (
    <section className="page form-builder-page">
      <Container maxWidth={1200}>
        <h1 className="form-builder-page__title">Конструктор форм</h1>
        <p className="form-builder-page__subtitle">
          Анкета зрителя для закрытого показа. Соберите форму в режиме Edit и проверьте её в Preview.
        </p>

        <div className="form-builder-page__controls">
          <div className="form-builder-page__modes" role="group" aria-label="Режим">
            <Button variant={mode === 'edit' ? 'primary' : 'outline'} aria-pressed={mode === 'edit'} onClick={() => setMode('edit')}>
              Edit
            </Button>
            <Button
              variant={mode === 'preview' ? 'primary' : 'outline'}
              aria-pressed={mode === 'preview'}
              onClick={() => setMode('preview')}
            >
              Preview
            </Button>
          </div>
          <label className="dynamic-field__choice">
            <input type="checkbox" checked={isLimited} onChange={(event) => setIsLimited(event.target.checked)} />
            <span>Ограничить {MAX_FIELDS} полями</span>
          </label>
        </div>

        <FormProvider initialFields={initialFields} reducer={isLimited ? limitFieldsReducer : undefined}>
          <Workspace mode={mode} isLimited={isLimited} />
        </FormProvider>

        <h2 className="form-builder-page__section-title">Компоненты ввода</h2>
        <InputComponentsDemo />
      </Container>
    </section>
  )
}

export default FormBuilderPage
