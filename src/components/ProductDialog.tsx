import { useState } from 'react'
import { Check, Heart, Leaf, Package, ShieldCheck, ShoppingBag, Star, Truck } from 'lucide-react'
import { formatMoney } from '../lib/shop'
import type { Product } from '../lib/shop'
import { Modal } from './Modal'
import { QuantityControl } from './QuantityControl'

interface ProductDialogProps {
  product: Product
  initialColor: string
  saved: boolean
  remainingStock: number
  onClose: () => void
  onSave: () => void
  onAdd: (color: string, quantity: number) => void
}

/** Variant selection and product information before adding the requested quantity. */
export function ProductDialog({ product, initialColor, saved, remainingStock, onClose, onSave, onAdd }: ProductDialogProps) {
  const [color, setColor] = useState(initialColor)
  const [quantity, setQuantity] = useState(1)
  const available = remainingStock > 0
  const boundedQuantity = Math.min(quantity, Math.max(remainingStock, 1))

  return (
    <Modal open onClose={onClose} title={product.name} description={product.description} className="product-modal" testId="product-detail-modal">
      <div className={`detail-image image-${product.id}`}><img src={product.image} alt={product.name} width="800" height="900" /><span className="detail-image-note">Thoughtfully chosen by Form & Field</span></div>
      <div className="detail-content">
        <p className="eyebrow">{product.categoryLabel}</p>
        <h2>{product.name}</h2>
        <div className="detail-rating"><span className="stars">{Array.from({ length: 5 }, (_, index) => <Star size={14} key={index} fill="currentColor" strokeWidth={0} />)}</span><strong>{product.rating}</strong><span>{product.reviews} reviews</span></div>
        <div className="detail-price"><span>{formatMoney(product.price)}</span>{product.originalPrice && <del>{formatMoney(product.originalPrice)}</del>}{product.originalPrice && <span className="detail-saving">Save {formatMoney(product.originalPrice - product.price)}</span>}</div>
        <p className="detail-description">{product.description}</p>
        <div className="detail-color-label">Color <strong>{color}</strong></div>
        <div className="detail-swatches" role="group" aria-label="Choose a color">{product.colors.map(option => <button key={option.name} style={{ '--swatch-color': option.hex } as React.CSSProperties} className={`detail-swatch ${color === option.name ? 'selected' : ''}`} onClick={() => setColor(option.name)} aria-label={`Select ${option.name}`} aria-pressed={color === option.name} title={option.name}><span>{color === option.name && <Check size={15} color={['Cloud', 'Chalk', 'Warm white', 'Porcelain'].includes(option.name) ? '#254d3e' : '#fff'} />}</span></button>)}</div>
        <div className="stock-status">{available ? <><span className="stock-dot" /> In stock, ready for your everyday</> : <>Currently unavailable · check back soon</>}</div>
        <div className="detail-purchase">
          <QuantityControl label={product.name} value={boundedQuantity} max={Math.max(remainingStock, 1)} onChange={setQuantity} testId="detail-quantity-input-number" />
          <button className="button button-primary" onClick={() => onAdd(color, boundedQuantity)} disabled={!available} data-test-id="detail-add-button"><ShoppingBag size={18} />{available ? 'Add to bag' : 'Currently unavailable'}</button>
          <button className={`icon-button detail-save ${saved ? 'is-saved' : ''}`} onClick={onSave} aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'} aria-pressed={saved} title={saved ? 'Remove from wishlist' : 'Save to wishlist'}><Heart size={21} fill={saved ? 'currentColor' : 'none'} /></button>
        </div>
        <div className="detail-services"><span><Truck size={17} />Free shipping over $100</span><span><ShieldCheck size={17} />30-day easy returns</span></div>
        <details className="product-info-accordion" open><summary><Package size={17} />The details</summary><p>{product.material}</p></details>
        <details className="product-info-accordion"><summary><Leaf size={17} />Delivery & returns</summary><p>Ships within 1–2 business days. Standard delivery takes 3–7 business days in the United States. Return unused items in their original packaging within 30 days. This demo uses the United States store; international destinations will be added at launch.</p></details>
      </div>
    </Modal>
  )
}
