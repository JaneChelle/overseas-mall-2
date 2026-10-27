import { useState } from 'react'
import { ArrowUpRight, ChevronDown, Globe2, Heart, Menu, Search, ShoppingBag, Sprout, Truck, X } from 'lucide-react'
import type { Category, Collection } from '../lib/shop'
import { Modal } from './Modal'
import { scrollToTop } from '../lib/scroll'

interface HeaderProps {
  query: string
  onQuery: (value: string) => void
  category: Category
  collection: Collection
  onNavigate: (category: Category, collection?: Collection) => void
  savedOnly: boolean
  savedCount: number
  onSaved: () => void
  cartCount: number
  onCart: () => void
  onInfo: (topic: string) => void
}

const navigation: { label: string; category: Category; collection?: Collection }[] = [
  { label: 'Shop all', category: 'all' },
  { label: 'New arrivals', category: 'all', collection: 'new' },
  { label: 'Bestsellers', category: 'all', collection: 'bestsellers' },
  { label: 'Home & living', category: 'home' },
  { label: 'Everyday carry', category: 'carry' },
  { label: 'Tech & accessories', category: 'tech' },
  { label: 'Wellness', category: 'wellness' },
]

/** Persistent discovery and shopping controls, adapted to narrow screens. */
export function Header(props: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  function navigate(item: typeof navigation[number]): void {
    props.onNavigate(item.category, item.collection)
    setMenuOpen(false)
  }

  const navItems = navigation.map(item => {
    const active = !props.savedOnly && props.category === item.category && props.collection === (item.collection ?? 'all')
    return (
      <button key={item.label} className={`nav-link ${active ? 'active' : ''}`} onClick={() => navigate(item)} aria-current={active ? 'page' : undefined}>
        {item.label}{item.collection === 'new' && <span className="nav-new-dot" />}
      </button>
    )
  })

  return (
    <>
      <div className="announcement">
        <div className="page-width announcement-inner">
          <span className="announcement-note">Thoughtfully chosen. Happily delivered.</span>
          <span className="announcement-offer"><Truck size={15} /> Free shipping on orders $100+</span>
          <button className="destination-button" onClick={() => props.onInfo('destination')}><Globe2 size={14} /> United States · USD <ChevronDown size={12} /></button>
        </div>
      </div>
      <header className="site-header">
        <div className="page-width header-main">
          <div className="brand-group">
            <button className="icon-button mobile-menu-button" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu size={23} /></button>
            <a className="wordmark" href={import.meta.env.BASE_URL} onClick={event => { event.preventDefault(); props.onNavigate('all'); scrollToTop() }} aria-label="Form and Field home">
              form<span className="brand-amp">&</span>field<span className="brand-period">.</span>
            </a>
          </div>
          <div className="header-search" role="search" data-test-id="catalog-search-toolbar">
            <Search size={19} aria-hidden="true" />
            <label className="sr-only" htmlFor="product-search">Search products</label>
            <input id="product-search" data-test-id="catalog-search-input" type="search" placeholder="Find your next favorite thing..." value={props.query} onChange={event => props.onQuery(event.target.value)} />
            {props.query && <button className="search-clear" aria-label="Clear search" onClick={() => props.onQuery('')}><X size={16} /></button>}
          </div>
          <div className="header-actions">
            <button className={`header-action saved-action ${props.savedOnly ? 'selected' : ''}`} aria-label={`Wishlist, ${props.savedCount} saved products`} aria-pressed={props.savedOnly} onClick={props.onSaved} data-test-id="wishlist-button">
              <Heart size={21} fill={props.savedOnly ? 'currentColor' : 'none'} /><span>Wishlist</span>{props.savedCount > 0 && <span className="small-count">{props.savedCount}</span>}
            </button>
            <span className="header-action-divider" />
            <button className="header-action" onClick={props.onCart} aria-label={`Shopping bag, ${props.cartCount} items`} data-test-id="cart-open-button">
              <ShoppingBag size={21} /><span>Bag</span><span className="bag-count">{props.cartCount}</span>
            </button>
          </div>
        </div>
        <div className="nav-border">
          <nav className="page-width desktop-nav" aria-label="Main navigation">
            <div className="nav-links">{navItems}</div>
            <button className="story-link" onClick={() => props.onInfo('story')}><Sprout size={16} /> A more considered everyday <ArrowUpRight size={14} /></button>
          </nav>
        </div>
      </header>
      <Modal open={menuOpen} onClose={() => setMenuOpen(false)} title="Navigation" description="Browse our collections and categories." className="navigation-sheet" testId="navigation-modal">
        <p className="wordmark">form<span className="brand-amp">&</span>field.</p>
        <nav className="mobile-navigation" aria-label="Mobile navigation">{navItems}</nav>
        <button className="text-link" onClick={() => { setMenuOpen(false); props.onSaved() }}><Heart size={18} /> Your wishlist ({props.savedCount})</button>
      </Modal>
    </>
  )
}
