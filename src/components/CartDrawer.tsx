import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, LockKeyhole, PackageCheck, ShoppingBag, Trash2, Truck } from 'lucide-react'
import { products } from '../data/products'
import { FREE_SHIPPING_THRESHOLD, formatMoney, getCartTotals } from '../lib/shop'
import type { CartAction, CartLine } from '../lib/shop'
import { Modal } from './Modal'
import { QuantityControl } from './QuantityControl'

interface CartDrawerProps {
  cart: CartLine[]
  dispatch: (action: CartAction) => void
  onClose: () => void
}

/** Editable cart and an explicitly non-transactional checkout preview. */
export function CartDrawer({ cart, dispatch, onClose }: CartDrawerProps) {
  const [checkout, setCheckout] = useState(false)
  const totals = getCartTotals(cart, products)
  const progress = Math.min(totals.subtotal / FREE_SHIPPING_THRESHOLD, 1)
  return (
    <Modal open onClose={onClose} title={checkout ? 'Checkout preview' : 'Your shopping bag'} description="Review your selected products, quantities, delivery, and total." className="cart-drawer" testId="cart-modal">
      <div className="drawer-heading"><h2>{checkout ? 'One step closer.' : 'Your bag'}{!checkout && <span>{totals.count}</span>}</h2><p>{checkout ? 'Your everyday favorites, all together.' : 'Good things you have your eye on.'}</p></div>
      {cart.length === 0 ? (
        <div className="cart-empty"><div className="empty-icon"><ShoppingBag size={37} strokeWidth={1.3} /></div><h3>A little room for good things.</h3><p>Your bag is empty. Let’s find something you’ll love.</p><button className="button button-primary" onClick={onClose}>Explore the collection <ArrowRight size={17} /></button></div>
      ) : (
        <>
          {checkout ? (
            <div className="checkout-notice"><PackageCheck size={25} /><div><strong>You’re viewing a demo checkout</strong><p>No payment will be taken and no order will be placed. Your bag stays saved for later.</p></div></div>
          ) : (
            <div className="shipping-progress"><p>{totals.remainingForFreeShipping > 0 ? <><Truck size={17} />You’re <strong>{formatMoney(totals.remainingForFreeShipping)}</strong> away from free shipping.</> : <><CheckCircle2 size={17} />Your order ships free. A little extra joy.</>}</p><div className="shipping-track"><span style={{ transform: `scaleX(${progress})` }} /></div></div>
          )}
          <div className="cart-lines">
            {cart.map(line => {
              const product = products.find(item => item.id === line.productId)!
              const otherQuantity = cart.filter(item => item.productId === product.id && item.color !== line.color).reduce((sum, item) => sum + item.quantity, 0)
              return (
                <div className="cart-line" key={`${line.productId}-${line.color}`} data-test-id={`cart-item-${line.productId}-${line.color.toLowerCase().replaceAll(' ', '-')}`}>
                  <img src={product.image} alt={product.name} width="100" height="115" />
                  <div className="cart-line-content"><div className="cart-line-title"><h3>{product.name}</h3>{!checkout && <button className="icon-button" title="Remove item" aria-label={`Remove ${product.name} ${line.color} from bag`} onClick={() => dispatch({ type: 'remove', productId: product.id, color: line.color })}><Trash2 size={16} /></button>}</div><p>{line.color}</p><div className="cart-line-bottom">{checkout ? <span className="checkout-quantity">Qty {line.quantity}</span> : <QuantityControl value={line.quantity} min={1} max={product.stock - otherQuantity} label={`${product.name} ${line.color}`} onChange={quantity => dispatch({ type: 'quantity', product, color: line.color, quantity })} testId={`cart-${product.id}-quantity-input-number`} />}<strong>{formatMoney(product.price * line.quantity)}</strong></div></div>
                </div>
              )
            })}
          </div>
          {checkout && <div className="checkout-delivery"><Truck size={20} /><div><strong>Standard delivery · United States</strong><p>3–7 business days · Tracked from door to door</p></div><Check size={18} /></div>}
          <div className="cart-summary">
            <div><span>Subtotal</span><span>{formatMoney(totals.subtotal)}</span></div>
            <div><span>Shipping</span><span className={totals.shipping === 0 ? 'free-label' : ''}>{totals.shipping === 0 ? 'On us' : formatMoney(totals.shipping)}</span></div>
            <p className="tax-note">Taxes and duties calculated at checkout.</p>
            <div className="cart-total"><span>{checkout ? 'Estimated total' : 'Total'}</span><span><small>USD</small>{formatMoney(totals.total)}</span></div>
            {checkout ? <button className="button button-primary" onClick={onClose}>Keep exploring <ArrowRight size={18} /></button> : <button className="button button-primary" onClick={() => setCheckout(true)} data-test-id="checkout-button">Continue to checkout <ArrowRight size={18} /></button>}
            {checkout ? <button className="back-to-bag" onClick={() => setCheckout(false)}><ArrowLeft size={16} />Back to your bag</button> : <p className="secure-note"><LockKeyhole size={13} /> Safe, secure, and a little more considered.</p>}
          </div>
        </>
      )}
    </Modal>
  )
}
