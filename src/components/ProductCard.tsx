import { useState } from 'react'
import { Check, Heart, Plus, Star } from 'lucide-react'
import { formatMoney } from '../lib/shop'
import type { Product } from '../lib/shop'

interface ProductCardProps {
  product: Product
  saved: boolean
  onSave: () => void
  onOpen: (color: string) => void
  onAdd: (color: string) => void
  remainingStock: number
  testId: string
}

/** Product preview with an independent wishlist control and a variant-aware quick add. */
export function ProductCard({ product, saved, onSave, onOpen, onAdd, remainingStock, testId }: ProductCardProps) {
  const [color, setColor] = useState(product.colors[0].name)
  const unavailable = remainingStock <= 0

  return (
    <article className="product-card" data-test-id={testId}>
      <div className={`product-image-wrap image-${product.id}`}>
        <button className="product-image-button" onClick={() => onOpen(color)} aria-label={`View ${product.name}`} data-test-id={`${testId}-detail-button`}>
          <img src={product.image} alt={product.name} loading="lazy" width="600" height="640" />
        </button>
        {product.badge && <span className={`product-badge ${product.badge === 'New' ? 'badge-new' : ''} ${product.originalPrice ? 'badge-sale' : ''}`}>{product.badge}</span>}
        <button className={`favorite-button ${saved ? 'is-saved' : ''}`} aria-label={`${saved ? 'Remove' : 'Save'} ${product.name} ${saved ? 'from' : 'to'} wishlist`} aria-pressed={saved} title={saved ? 'Remove from wishlist' : 'Save to wishlist'} onClick={onSave} data-test-id={`${testId}-save-button`}>
          <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <button className="quick-add" aria-label={unavailable ? `${product.name} ${product.stock === 0 ? 'sold out' : 'stock limit reached'}` : `Add ${product.name} to bag`} title={unavailable ? 'Currently unavailable' : `Add to bag · ${color}`} onClick={() => onAdd(color)} disabled={unavailable} data-test-id={`${testId}-add-button`}>
          {unavailable && product.stock > 0 ? <Check size={19} /> : <Plus size={21} />}
        </button>
      </div>
      <div className="product-meta">
        <p className="product-category">{product.categoryLabel}</p>
        <button className="product-name" onClick={() => onOpen(color)}>{product.name}</button>
        <div className="product-price">
          <span>{formatMoney(product.price)}</span>
          {product.originalPrice && <del>{formatMoney(product.originalPrice)}</del>}
        </div>
        <div className="product-bottom">
          <span className="product-rating" aria-label={`Rated ${product.rating} out of 5 from ${product.reviews} reviews`}><Star size={12} fill="currentColor" strokeWidth={0} />{product.rating.toFixed(1)}<span>({product.reviews})</span></span>
          <div className="color-swatches" role="group" aria-label={`${product.name} color`}>
            {product.colors.map(option => <button key={option.name} className={`swatch ${color === option.name ? 'selected' : ''}`} style={{ '--swatch-color': option.hex } as React.CSSProperties} aria-label={`${option.name} ${product.name}`} aria-pressed={color === option.name} title={option.name} onClick={() => setColor(option.name)}><span /></button>)}
          </div>
        </div>
      </div>
    </article>
  )
}
