import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Globe2, Heart, Leaf, LockKeyhole, PackageCheck, Search, ShieldCheck, Sprout, Star, Truck, X } from 'lucide-react'
import { Header } from './components/Header'
import { ProductCard } from './components/ProductCard'
import { ProductDialog } from './components/ProductDialog'
import { CartDrawer } from './components/CartDrawer'
import { Filters } from './components/Filters'
import { Modal } from './components/Modal'
import { categories, products } from './data/products'
import { useShop } from './hooks/useShop'
import { CENTS_PER_DOLLAR, filterProducts, getCartTotals, MAX_CATALOG_PRICE } from './lib/shop'
import type { Category, Collection, Product, SortOrder } from './lib/shop'
import { preferredScrollBehavior, scrollToTop } from './lib/scroll'
import { publicAsset } from './lib/assets'

const TOAST_DURATION_MS = 4200

const infoContent: Record<string, { title: string; intro: string; sections: { title: string; text: string }[] }> = {
  story: {
    title: 'Less, but a little better.',
    intro: 'We believe the things you surround yourself with should earn their place in your everyday.',
    sections: [
      { title: 'A good thing has a purpose.', text: 'Form & Field brings together useful, well-made objects for your home, your daily rituals, and wherever the day takes you. No endless aisles. Just things we would choose for ourselves.' },
      { title: 'Thoughtfully chosen.', text: 'We look for honest materials, considered details, and design that makes ordinary moments a little more enjoyable. Good form. Real function.' },
    ],
  },
  shipping: {
    title: 'Good things are on their way.',
    intro: 'Carefully packed. Tracked all the way to your door.',
    sections: [
      { title: 'United States delivery', text: 'Orders ship within 1–2 business days. Standard delivery takes 3–7 business days and costs $5.95. Orders of $100 or more ship free.' },
      { title: 'International orders', text: 'This demonstration uses our United States storefront and USD pricing. International shipping rates and destinations will be available when the store launches.' },
    ],
  },
  returns: {
    title: 'Find your fit, without the worry.',
    intro: 'Good things should feel right. If they don’t, we’ll help.',
    sections: [
      { title: '30-day easy returns', text: 'Return unused items in their original packaging within 30 days of delivery. Keep the packaging until you are sure your new find is a keeper.' },
      { title: 'Here to help', text: 'For a damaged item or a question about an order, contact hello@formandfield.example with your order number and a description. This is a demonstration store; no real orders are processed.' },
    ],
  },
  contact: {
    title: 'A little help from us.',
    intro: 'Questions about a product, delivery, or finding just the right thing?',
    sections: [
      { title: 'Say hello', text: 'hello@formandfield.example · Monday–Friday, 9 am–5 pm ET. This is a demonstration address for the sample storefront.' },
      { title: 'Before you reach out', text: 'You can find dimensions and materials in each product’s details. Delivery and return information is available in the links below.' },
    ],
  },
  destination: {
    title: 'A little closer to home.',
    intro: 'You’re browsing the United States store.',
    sections: [
      { title: 'Delivery destination', text: 'United States · All prices in US dollars (USD).' },
      { title: 'Shipping, simply', text: 'Standard shipping is $5.95, or free on orders $100+. International destinations will be added when the store launches.' },
    ],
  },
}

/** Main storefront coordinates discovery state and the locally persisted shopping session. */
export default function App() {
  const { cart, dispatch, savedIds, toggleSaved } = useShop()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category>('all')
  const [collection, setCollection] = useState<Collection>('all')
  const [sort, setSort] = useState<SortOrder>('featured')
  const [maxPrice, setMaxPrice] = useState(MAX_CATALOG_PRICE)
  const [inStock, setInStock] = useState(false)
  const [savedOnly, setSavedOnly] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedColor, setSelectedColor] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [infoTopic, setInfoTopic] = useState<string | null>(null)
  const [toast, setToast] = useState<{ name: string; message: string } | null>(null)
  const catalogRef = useRef<HTMLElement>(null)
  const totals = getCartTotals(cart, products)

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), TOAST_DURATION_MS)
    return () => window.clearTimeout(timeout)
  }, [toast])

  function scrollToCatalog(): void {
    catalogRef.current?.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'start' })
  }

  function resetFilters(): void {
    setQuery('')
    setCategory('all')
    setCollection('all')
    setMaxPrice(MAX_CATALOG_PRICE)
    setInStock(false)
    setSavedOnly(false)
  }

  function navigate(nextCategory: Category, nextCollection: Collection = 'all'): void {
    resetFilters()
    setCategory(nextCategory)
    setCollection(nextCollection)
    scrollToCatalog()
  }

  function remainingStock(product: Product): number {
    return product.stock - cart.filter(line => line.productId === product.id).reduce((sum, line) => sum + line.quantity, 0)
  }

  function addToBag(product: Product, color: string, quantity = 1): void {
    const available = remainingStock(product)
    if (available <= 0) return
    const actualQuantity = Math.min(quantity, available)
    dispatch({ type: 'add', product, color, quantity: actualQuantity })
    setToast({ name: product.name, message: `${actualQuantity > 1 ? `${actualQuantity} items` : color} added to your bag` })
  }

  function changeQuery(value: string): void {
    setQuery(value)
    if (value && catalogRef.current && catalogRef.current.getBoundingClientRect().top > window.innerHeight) {
      catalogRef.current.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'start' })
    }
  }

  function showSaved(): void {
    resetFilters()
    setSavedOnly(!savedOnly)
    scrollToCatalog()
  }

  const visibleProducts = filterProducts(products, { query, category, collection, maxPrice, inStock, sort, savedOnly, savedIds })
  const categoryName = categories.find(item => item.id === category)?.label ?? 'All products'
  const catalogTitle = savedOnly ? 'Your good-things wishlist.' : query.trim() ? `Finds for “${query.trim()}”` : collection === 'new' ? 'Fresh finds, just for you.' : collection === 'bestsellers' ? 'Well-loved for a reason.' : category !== 'all' ? `${categoryName}, considered.` : 'Find your everyday favorites.'
  const info = infoTopic ? infoContent[infoTopic] : null

  return (
    <div className="storefront" data-test-id="storefront-page">
      <a href="#catalog" className="skip-link">Skip to products</a>
      <Header query={query} onQuery={changeQuery} category={category} collection={collection} onNavigate={navigate} savedOnly={savedOnly} savedCount={savedIds.length} onSaved={showSaved} cartCount={totals.count} onCart={() => setCartOpen(true)} onInfo={setInfoTopic} />
      <main>
        <section className="hero" aria-labelledby="hero-heading">
          <img className="hero-image" src={publicAsset('images/hero-living.jpg')} alt="Sunlit living room with considered furniture, plants, and natural materials" width="2000" height="1500" fetchPriority="high" />
          <div className="hero-wash" />
          <div className="page-width hero-inner">
            <div className="hero-copy">
              <span className="hero-label"><span /> The everyday edit</span>
              <h1 id="hero-heading">Good things for<br />everyday living.</h1>
              <p>Thoughtful design. Everyday essentials.<br />Little things that make a big difference.</p>
              <button className="button button-primary hero-cta" onClick={() => navigate('all')}>Discover your next favorite <ArrowRight size={18} /></button>
              <div className="hero-social-proof"><div className="avatar-stack"><img src={publicAsset('images/avatar-1.jpg')} alt="" width="30" height="30" /><img src={publicAsset('images/avatar-2.jpg')} alt="" width="30" height="30" /><img src={publicAsset('images/avatar-3.jpg')} alt="" width="30" height="30" /></div><div><span className="hero-stars">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={11} fill="currentColor" strokeWidth={0} />)}</span><span>Loved by the everyday-minded</span></div></div>
            </div>
            <button className="hero-image-link" onClick={() => navigate('home')}><span>Make yourself at home</span><ArrowUpRight size={18} /></button>
          </div>
        </section>
        <div className="benefits-band">
          <div className="page-width benefits">
            <div><Truck size={20} strokeWidth={1.5} /><span><strong>A little joy, delivered</strong><small>Free shipping on orders $100+</small></span></div>
            <div><Leaf size={20} strokeWidth={1.5} /><span><strong>Thoughtfully chosen</strong><small>Good design. Honest materials.</small></span></div>
            <div><PackageCheck size={20} strokeWidth={1.5} /><span><strong>Love it, or send it back</strong><small>Easy returns within 30 days</small></span></div>
            <div><ShieldCheck size={20} strokeWidth={1.5} /><span><strong>Shop with peace of mind</strong><small>Secure from start to finish</small></span></div>
          </div>
        </div>
        <section className="page-width catalog-section" id="catalog" ref={catalogRef} aria-labelledby="catalog-heading">
          <div className="section-heading">
            <div>{(category !== 'all' || savedOnly) && <div className="breadcrumb"><button onClick={() => { resetFilters(); scrollToTop() }}>Home</button><ChevronRight size={11} /><span>{savedOnly ? 'Wishlist' : categoryName}</span></div>}<h2 id="catalog-heading">{catalogTitle}</h2><p>{savedOnly ? 'A few favorites, saved for a little later.' : 'Beautifully useful. Quietly different. Chosen for you.'}</p></div>
            <span className="catalog-heading-note"><Sprout size={17} /> Fewer things. Better choices.</span>
          </div>
          <Filters category={category} onCategory={setCategory} count={visibleProducts.length} filterOpen={filterOpen} onFilterToggle={() => setFilterOpen(current => !current)} maxPrice={maxPrice} onMaxPrice={setMaxPrice} inStock={inStock} onInStock={setInStock} collection={collection} onCollection={setCollection} sort={sort} onSort={setSort} onReset={resetFilters} />
          {(query || collection !== 'all' || maxPrice < MAX_CATALOG_PRICE || inStock || savedOnly) && <div className="active-filters">{query && <button onClick={() => setQuery('')}>Search: {query}<X size={13} /></button>}{collection !== 'all' && <button onClick={() => setCollection('all')}>{collection === 'new' ? 'New arrivals' : 'Bestsellers'}<X size={13} /></button>}{maxPrice < MAX_CATALOG_PRICE && <button onClick={() => setMaxPrice(MAX_CATALOG_PRICE)}>Under ${maxPrice / CENTS_PER_DOLLAR}<X size={13} /></button>}{inStock && <button onClick={() => setInStock(false)}>In stock<X size={13} /></button>}{savedOnly && <button onClick={() => setSavedOnly(false)}>Saved products<Heart size={13} /></button>}<button className="clear-all" onClick={resetFilters}>Clear all</button></div>}
          {visibleProducts.length > 0 ? (
            <div className="product-grid" data-test-id="product-list-table">
              {visibleProducts.map(product => <ProductCard key={product.id} product={product} saved={savedIds.includes(product.id)} onSave={() => toggleSaved(product.id)} onOpen={color => { setSelectedColor(color); setSelectedProduct(product) }} onAdd={color => addToBag(product, color)} remainingStock={remainingStock(product)} testId={`product-${product.id}`} />)}
            </div>
          ) : (
            <div className="no-results"><div className="empty-icon">{savedOnly ? <Heart size={32} strokeWidth={1.3} /> : <Search size={32} strokeWidth={1.3} />}</div><h3>{savedOnly && savedIds.length === 0 ? 'Make a little room for favorites.' : 'No finds this time.'}</h3><p>{savedOnly && savedIds.length === 0 ? 'Tap the heart on something you love. It’ll be waiting here.' : 'Try another search or loosen your filters. There’s a good thing waiting for you.'}</p><button className="button button-primary" onClick={resetFilters} data-test-id="empty-reset-button">Explore all products <ArrowRight size={17} /></button></div>
          )}
          {visibleProducts.length > 0 && <div className="catalog-end"><span /> <p>A small collection. A lot to love.</p> <span /></div>}
        </section>
        <section className="collection-section" aria-labelledby="collections-heading">
          <div className="page-width">
            <div className="collection-heading"><div><span className="eyebrow">A little inspiration</span><h2 id="collections-heading">For the way you live.</h2></div><p>Considered collections for ordinary, lovely days.</p></div>
            <div className="collection-grid">
              <button className="collection-tile" onClick={() => navigate('home')}><img src={publicAsset('images/home-edit.jpg')} alt="Thoughtfully arranged living room with a lounge chair and natural textures" loading="lazy" width="1000" height="600" /><div><span>Home, a little happier.</span><span className="collection-tile-link">Discover home & living <ArrowUpRight size={19} /></span></div></button>
              <button className="collection-tile collection-tile-carry" onClick={() => navigate('carry')}><img src={publicAsset('images/everyday-backpack.jpg')} alt="A thoughtfully made backpack for daily adventures" loading="lazy" width="1000" height="600" /><div><span>Take the good things with you.</span><span className="collection-tile-link">Explore everyday carry <ArrowUpRight size={19} /></span></div></button>
            </div>
          </div>
        </section>
        <section className="brand-note"><div className="page-width brand-note-inner"><div className="brand-note-icon"><Sprout size={29} strokeWidth={1.4} /></div><div><h2>A little more intention. A little more everyday joy.</h2><p>We believe in fewer, better things. Beautiful to look at. A pleasure to use. Made to be part of your day.</p></div><button className="text-link" onClick={() => setInfoTopic('story')}>Meet Form & Field <ArrowUpRight size={17} /></button></div></section>
      </main>
      <footer className="site-footer">
        <div className="page-width footer-main"><div className="footer-brand"><a href={import.meta.env.BASE_URL} onClick={event => { event.preventDefault(); resetFilters(); scrollToTop() }} className="wordmark">form<span className="brand-amp">&</span>field.</a><p>Good things for the everyday.<br />Thoughtfully chosen, just for you.</p></div><div className="footer-column"><h3>Find your good thing</h3><button onClick={() => navigate('all')}>Shop all</button><button onClick={() => navigate('all', 'new')}>New arrivals</button><button onClick={() => navigate('all', 'bestsellers')}>Bestsellers</button></div><div className="footer-column"><h3>A little help</h3><button onClick={() => setInfoTopic('shipping')}>Shipping & delivery</button><button onClick={() => setInfoTopic('returns')}>Returns & exchanges</button><button onClick={() => setInfoTopic('contact')}>Contact us</button></div><div className="footer-last"><span className="footer-leaf"><Leaf size={20} /> Good by design.</span><p>Considered objects.<br />Everyday possibilities.</p><button className="text-link" onClick={() => setInfoTopic('story')}>Our story <ArrowUpRight size={16} /></button></div></div>
        <div className="page-width footer-bottom"><span>© {new Date().getFullYear()} Form & Field. A thoughtfully made demo.</span><span><Globe2 size={13} /> United States · USD</span><span className="payment-methods"><span>VISA</span><span>mastercard</span><span>AMEX</span><LockKeyhole size={15} /></span></div>
      </footer>
      {selectedProduct && <ProductDialog key={selectedProduct.id} product={selectedProduct} initialColor={selectedColor} remainingStock={remainingStock(selectedProduct)} saved={savedIds.includes(selectedProduct.id)} onSave={() => toggleSaved(selectedProduct.id)} onClose={() => setSelectedProduct(null)} onAdd={(color, quantity) => { addToBag(selectedProduct, color, quantity); setSelectedProduct(null) }} />}
      {cartOpen && <CartDrawer cart={cart} dispatch={dispatch} onClose={() => setCartOpen(false)} />}
      <Modal open={Boolean(info)} onClose={() => setInfoTopic(null)} title={info?.title ?? 'Store information'} description={info?.intro ?? ''} className="info-modal" testId="store-info-modal">{info && <><div className="info-leaf"><Sprout size={30} strokeWidth={1.3} /></div><h2>{info.title}</h2><p className="info-intro">{info.intro}</p>{info.sections.map(section => <div className="info-section" key={section.title}><h3>{section.title}</h3><p>{section.text}</p></div>)}<button className="button button-primary" onClick={() => setInfoTopic(null)}>Back to the good things <ArrowRight size={17} /></button></>}</Modal>
      <div className="toast-container" aria-live="polite" aria-atomic="true">{toast && <div className="cart-toast" role="status"><span className="toast-check"><Check size={18} /></span><div><strong>{toast.name}</strong><p>{toast.message}</p></div><button onClick={() => { setToast(null); setSelectedProduct(null); setCartOpen(true) }}>View bag <ArrowRight size={15} /></button><button className="icon-button" aria-label="Dismiss notification" onClick={() => setToast(null)}><X size={16} /></button></div>}</div>
    </div>
  )
}
