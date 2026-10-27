export type Category = 'all' | 'home' | 'carry' | 'tech' | 'wellness'
export type Collection = 'all' | 'new' | 'bestsellers'
export type SortOrder = 'featured' | 'price-low' | 'price-high' | 'rating'

export interface ProductColor {
  name: string
  hex: string
}

/** Catalog prices use integer USD cents; stock is shared by all color variants. */
export interface Product {
  id: string
  name: string
  category: Exclude<Category, 'all'>
  categoryLabel: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  description: string
  colors: ProductColor[]
  stock: number
  badge?: string
  material: string
  isNew: boolean
  bestseller: boolean
}

export interface CartLine {
  productId: string
  color: string
  quantity: number
}

export interface ProductFilters {
  query?: string
  category?: Category
  collection?: Collection
  maxPrice?: number
  inStock?: boolean
  sort?: SortOrder
  savedOnly?: boolean
  savedIds?: string[]
}

export type CartAction =
  | { type: 'add'; product: Product; color: string; quantity: number }
  | { type: 'quantity'; product: Product; color: string; quantity: number }
  | { type: 'remove'; productId: string; color: string }
  | { type: 'clear' }

export const FREE_SHIPPING_THRESHOLD = 10000
export const STANDARD_SHIPPING = 595
export const CENTS_PER_DOLLAR = 100
export const MAX_CATALOG_PRICE = 25000
export const STORAGE_KEYS = { cart: 'form-field-cart-v1', saved: 'form-field-saved-v1' } as const

const moneyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

/** Formats integer USD cents consistently in the catalog, details, and checkout. */
export function formatMoney(cents: number): string {
  return moneyFormatter.format(cents / CENTS_PER_DOLLAR)
}

/** Applies all active discovery constraints before sorting a copy of the catalog. */
export function filterProducts(products: Product[], filters: ProductFilters = {}): Product[] {
  const query = filters.query?.trim().toLocaleLowerCase() ?? ''
  const matching = products.filter(product => {
    const searchable = `${product.name} ${product.categoryLabel} ${product.description}`.toLocaleLowerCase()
    return (!query || searchable.includes(query))
      && (!filters.category || filters.category === 'all' || product.category === filters.category)
      && (filters.maxPrice === undefined || product.price <= filters.maxPrice)
      && (!filters.inStock || product.stock > 0)
      && (!filters.savedOnly || filters.savedIds?.includes(product.id))
      && (filters.collection !== 'new' || product.isNew)
      && (filters.collection !== 'bestsellers' || product.bestseller)
  })
  switch (filters.sort) {
    case 'price-low': return matching.sort((a, b) => a.price - b.price)
    case 'price-high': return matching.sort((a, b) => b.price - a.price)
    case 'rating': return matching.sort((a, b) => b.rating - a.rating)
    default: return matching
  }
}

function isSameLine(line: CartLine, productId: string, color: string): boolean {
  return line.productId === productId && line.color === color
}

/** Validates variants and caps quantities against stock across every color of a product. */
export function cartReducer(cart: CartLine[], action: CartAction): CartLine[] {
  if (action.type === 'clear') return []
  if (action.type === 'remove') {
    return cart.filter(line => !isSameLine(line, action.productId, action.color))
  }
  const { product, color, quantity } = action
  if (!Number.isInteger(quantity) || quantity < 0 || !product.colors.some(option => option.name === color)) return cart
  const existing = cart.find(line => isSameLine(line, product.id, color))
  const otherColorsQuantity = cart
    .filter(line => line.productId === product.id && line.color !== color)
    .reduce((sum, line) => sum + line.quantity, 0)
  const available = Math.max(0, product.stock - otherColorsQuantity)
  const requested = action.type === 'add' ? (existing?.quantity ?? 0) + quantity : quantity
  const nextQuantity = Math.min(requested, available)
  if (nextQuantity === 0) {
    return cart.filter(line => !isSameLine(line, product.id, color))
  }
  if (existing) {
    return cart.map(line => isSameLine(line, product.id, color) ? { ...line, quantity: nextQuantity } : line)
  }
  if (action.type === 'quantity') return cart
  return [...cart, { productId: product.id, color, quantity: nextQuantity }]
}

/** Computes totals exclusively in cents to avoid floating-point rounding errors. */
export function getCartTotals(cart: CartLine[], products: Product[]) {
  const subtotal = cart.reduce((sum, line) => sum + (products.find(product => product.id === line.productId)?.price ?? 0) * line.quantity, 0)
  const count = cart.reduce((sum, line) => sum + line.quantity, 0)
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING
  return {
    count,
    subtotal,
    shipping,
    total: subtotal + shipping,
    remainingForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
  }
}

/** Treats persisted data as untrusted and restores only currently purchasable lines. */
export function parseSavedCart(raw: string | null, products: Product[]): CartLine[] {
  try {
    const decoded: unknown = raw ? JSON.parse(raw) : []
    if (!Array.isArray(decoded)) return []
    return decoded.reduce<CartLine[]>((cart, value: unknown) => {
      if (!value || typeof value !== 'object') return cart
      const line = value as Partial<CartLine>
      const product = products.find(item => item.id === line.productId)
      if (!product || typeof line.color !== 'string' || typeof line.quantity !== 'number' || line.quantity <= 0) return cart
      return cartReducer(cart, { type: 'add', product, color: line.color, quantity: line.quantity })
    }, [])
  } catch {
    return []
  }
}
