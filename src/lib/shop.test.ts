import { describe, expect, it } from 'vitest'
import {
  cartReducer,
  filterProducts,
  getCartTotals,
  parseSavedCart,
} from './shop'
import type { CartLine, Product } from './shop'

const products: Product[] = [
  { id: 'lamp', name: 'Pleat table lamp', category: 'home', categoryLabel: 'Home & living', price: 6900, originalPrice: 8900, rating: 4.8, reviews: 124, image: '/lamp.jpg', description: 'A warm linen shade for your reading corner.', colors: [{ name: 'Sand', hex: '#b8ac92' }, { name: 'Olive', hex: '#535d43' }], stock: 3, badge: 'Bestseller', material: 'Linen and oak', isNew: false, bestseller: true },
  { id: 'bag', name: 'Everyday backpack', category: 'carry', categoryLabel: 'Everyday carry', price: 4800, rating: 4.9, reviews: 72, image: '/bag.jpg', description: 'Water-resistant canvas for daily adventures.', colors: [{ name: 'Black', hex: '#232323' }], stock: 8, material: 'Recycled canvas', isNew: true, bestseller: false },
  { id: 'speaker', name: 'Pocket speaker', category: 'tech', categoryLabel: 'Tech & accessories', price: 3500, rating: 4.6, reviews: 43, image: '/speaker.jpg', description: 'Portable sound.', colors: [{ name: 'Blue', hex: '#385881' }], stock: 0, material: 'Aluminum', isNew: false, bestseller: false },
]

describe('product discovery', () => {
  it('combines case-insensitive description search, category, price, and availability', () => {
    const result = filterProducts(products, { query: '  LINEN ', category: 'home', maxPrice: 7000, inStock: true, sort: 'featured', collection: 'all' })
    expect(result.map(product => product.id)).toEqual(['lamp'])
  })

  it('sorts by numeric price rather than formatted strings', () => {
    expect(filterProducts(products, { sort: 'price-low' }).map(product => product.id)).toEqual(['speaker', 'bag', 'lamp'])
  })

  it('limits new arrivals and saved products without mutating the catalog', () => {
    expect(filterProducts(products, { collection: 'new', savedOnly: true, savedIds: ['bag', 'lamp'] }).map(product => product.id)).toEqual(['bag'])
    expect(products[0].id).toBe('lamp')
  })

  it('returns an empty collection for contradictory filters', () => {
    expect(filterProducts(products, { query: 'lamp', category: 'tech' })).toEqual([])
  })
})

describe('cart behavior', () => {
  it('merges the same variant and keeps different colors separate', () => {
    let cart: CartLine[] = []
    cart = cartReducer(cart, { type: 'add', product: products[0], color: 'Sand', quantity: 1 })
    cart = cartReducer(cart, { type: 'add', product: products[0], color: 'Sand', quantity: 1 })
    cart = cartReducer(cart, { type: 'add', product: products[0], color: 'Olive', quantity: 1 })
    expect(cart).toEqual([
      { productId: 'lamp', color: 'Sand', quantity: 2 },
      { productId: 'lamp', color: 'Olive', quantity: 1 },
    ])
  })

  it('enforces stock across all colors and rejects unavailable products', () => {
    const cart: CartLine[] = [{ productId: 'lamp', color: 'Sand', quantity: 2 }]
    expect(cartReducer(cart, { type: 'add', product: products[0], color: 'Olive', quantity: 5 })).toEqual([
      { productId: 'lamp', color: 'Sand', quantity: 2 },
      { productId: 'lamp', color: 'Olive', quantity: 1 },
    ])
    expect(cartReducer([], { type: 'add', product: products[2], color: 'Blue', quantity: 1 })).toEqual([])
  })

  it('rejects unrecognized colors and invalid quantities', () => {
    expect(cartReducer([], { type: 'add', product: products[0], color: 'Pink', quantity: 1 })).toEqual([])
    expect(cartReducer([], { type: 'add', product: products[0], color: 'Sand', quantity: Number.NaN })).toEqual([])
  })

  it('updates quantities and removes a line at zero', () => {
    const cart: CartLine[] = [{ productId: 'bag', color: 'Black', quantity: 2 }]
    const updated = cartReducer(cart, { type: 'quantity', product: products[1], color: 'Black', quantity: 3 })
    expect(updated[0].quantity).toBe(3)
    expect(cartReducer(updated, { type: 'quantity', product: products[1], color: 'Black', quantity: 0 })).toEqual([])
  })

  it('calculates in cents and applies the free shipping threshold', () => {
    expect(getCartTotals([{ productId: 'lamp', color: 'Sand', quantity: 1 }], products)).toEqual({ count: 1, subtotal: 6900, shipping: 595, total: 7495, remainingForFreeShipping: 3100 })
    expect(getCartTotals([{ productId: 'lamp', color: 'Sand', quantity: 2 }], products)).toEqual({ count: 2, subtotal: 13800, shipping: 0, total: 13800, remainingForFreeShipping: 0 })
    expect(getCartTotals([], products).total).toBe(0)
  })
})

describe('saved cart recovery', () => {
  it('recovers from malformed JSON and incorrect top-level values', () => {
    expect(parseSavedCart('{broken', products)).toEqual([])
    expect(parseSavedCart('{"items":[]}', products)).toEqual([])
    expect(parseSavedCart(null, products)).toEqual([])
  })

  it('validates products, colors and quantities and merges duplicates within stock', () => {
    const saved = JSON.stringify([
      { productId: 'lamp', color: 'Sand', quantity: 2 },
      { productId: 'lamp', color: 'Sand', quantity: 5 },
      { productId: 'bag', color: 'Pink', quantity: 1 },
      { productId: 'missing', color: 'Black', quantity: 1 },
      { productId: 'bag', color: 'Black', quantity: -2 },
    ])
    expect(parseSavedCart(saved, products)).toEqual([{ productId: 'lamp', color: 'Sand', quantity: 3 }])
  })
})
