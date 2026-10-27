import { Minus, Plus } from 'lucide-react'

interface QuantityControlProps {
  value: number
  max: number
  min?: number
  onChange: (value: number) => void
  label: string
  testId?: string
}

/** Bounded quantity stepper; the caller explicitly controls whether zero removes a line. */
export function QuantityControl({ value, max, min = 1, onChange, label, testId }: QuantityControlProps) {
  return (
    <div className="quantity-control" data-test-id={testId}>
      <button className="icon-button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Decrease ${label} quantity`}><Minus size={15} /></button>
      <output aria-label={`${label} quantity`}>{value}</output>
      <button className="icon-button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`Increase ${label} quantity`}><Plus size={15} /></button>
    </div>
  )
}
