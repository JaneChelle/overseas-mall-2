import { useEffect, useReducer, useState } from 'react'
import { products } from '../data/products'
import { cartReducer, parseSavedCart, STORAGE_KEYS } from '../lib/shop'

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function readSaved(): string[] {
  try {
    const decoded: unknown = JSON.parse(readStorage(STORAGE_KEYS.saved) ?? '[]')
    return Array.isArray(decoded)
      ? [...new Set(decoded.filter((id): id is string => typeof id === 'string' && products.some(product => product.id === id)))]
      : []
  } catch {
    return []
  }
}

/** Keeps the current session usable even when browser storage is disabled or full. */
function persist(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Browser storage is optional; in-memory shopping remains available.
  }
}

/** Owns locally persisted cart and wishlist state for the storefront. */
export function useShop() {
  const [cart, dispatch] = useReducer(cartReducer, undefined, () => parseSavedCart(readStorage(STORAGE_KEYS.cart), products))
  const [savedIds, setSavedIds] = useState<string[]>(readSaved)

  useEffect(() => persist(STORAGE_KEYS.cart, cart), [cart])
  useEffect(() => persist(STORAGE_KEYS.saved, savedIds), [savedIds])

  function toggleSaved(id: string): void {
    setSavedIds(current => current.includes(id) ? current.filter(savedId => savedId !== id) : [...current, id])
  }

  return { cart, dispatch, savedIds, toggleSaved }
}
