import { Check, SlidersHorizontal, X } from 'lucide-react'
import { categories, products } from '../data/products'
import { CENTS_PER_DOLLAR, MAX_CATALOG_PRICE, formatMoney } from '../lib/shop'
import type { Category, Collection, SortOrder } from '../lib/shop'

interface FiltersProps {
  category: Category
  onCategory: (category: Category) => void
  count: number
  filterOpen: boolean
  onFilterToggle: () => void
  maxPrice: number
  onMaxPrice: (price: number) => void
  inStock: boolean
  onInStock: (value: boolean) => void
  collection: Collection
  onCollection: (value: Collection) => void
  sort: SortOrder
  onSort: (value: SortOrder) => void
  onReset: () => void
}

/** Category navigation and combinable product filters with an explicit reset path. */
export function Filters(props: FiltersProps) {
  const filterCount = Number(props.maxPrice < MAX_CATALOG_PRICE) + Number(props.inStock) + Number(props.collection !== 'all')
  return (
    <div className="catalog-controls" data-test-id="catalog-filter-toolbar">
      <div className="catalog-toolbar">
        <div className="category-tabs" role="group" aria-label="Product categories" data-test-id="category-radio">
          {categories.map(category => <button key={category.id} className={`category-tab ${props.category === category.id ? 'active' : ''}`} aria-pressed={props.category === category.id} onClick={() => props.onCategory(category.id)} data-test-id={`category-radio-${category.id}`}>{category.label}{category.id === 'all' && <span className="category-count">{products.length}</span>}</button>)}
        </div>
        <button className={`filter-button ${props.filterOpen || filterCount ? 'active' : ''}`} onClick={props.onFilterToggle} aria-expanded={props.filterOpen} aria-controls="filter-panel" data-test-id="filter-toggle-button"><SlidersHorizontal size={16} />Filters{filterCount > 0 && <span>{filterCount}</span>}</button>
      </div>
      {props.filterOpen && <div className="filter-panel" id="filter-panel">
        <div className="price-filter"><label htmlFor="price-range">Price up to <strong>{formatMoney(props.maxPrice)}</strong></label><input id="price-range" type="range" min={0} max={MAX_CATALOG_PRICE} step={5 * CENTS_PER_DOLLAR} value={props.maxPrice} onChange={event => props.onMaxPrice(Number(event.target.value))} data-test-id="max-price-input-number" /><div className="range-labels"><span>$0</span><span>$250</span></div></div>
        <div className="collection-filter"><label htmlFor="collection-filter">Collection</label><select id="collection-filter" value={props.collection} onChange={event => props.onCollection(event.target.value as Collection)} data-test-id="collection-select"><option value="all">All collections</option><option value="new">New arrivals</option><option value="bestsellers">Bestsellers</option></select></div>
        <label className="stock-checkbox"><input type="checkbox" checked={props.inStock} onChange={event => props.onInStock(event.target.checked)} data-test-id="in-stock-checkbox" /><span className="custom-checkbox">{props.inStock && <Check size={13} />}</span>In stock only</label>
        <button className="reset-filters" onClick={props.onReset}><X size={15} />Reset filters</button>
      </div>}
      <div className="results-toolbar"><span aria-live="polite">{props.count} thoughtfully chosen {props.count === 1 ? 'find' : 'finds'}</span><div className="sort-control"><label htmlFor="sort-order">Sort by:</label><select id="sort-order" value={props.sort} onChange={event => props.onSort(event.target.value as SortOrder)} data-test-id="sort-select"><option value="featured">Recommended</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option></select></div></div>
    </div>
  )
}
