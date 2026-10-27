import type { Category, Product } from '../lib/shop'
import { publicAsset } from '../lib/assets'

export const categories: { id: Category; label: string; shortLabel: string }[] = [
  { id: 'all', label: 'All products', shortLabel: 'All' },
  { id: 'home', label: 'Home & living', shortLabel: 'Home' },
  { id: 'carry', label: 'Everyday carry', shortLabel: 'Carry' },
  { id: 'tech', label: 'Tech & accessories', shortLabel: 'Tech' },
  { id: 'wellness', label: 'Wellness', shortLabel: 'Wellness' },
]

export const products: Product[] = [
  {
    id: 'arc-lamp', name: 'Arc table lamp', category: 'home', categoryLabel: 'Home & living',
    price: 6900, originalPrice: 8900, rating: 4.9, reviews: 128,
    image: publicAsset('images/pleat-lamp.jpg'),
    description: 'A little light, a lot of atmosphere. A sculptural shade and warm, diffused glow make this the perfect companion for a quiet evening or your favorite reading corner.',
    colors: [{ name: 'Charcoal', hex: '#4a4c49' }, { name: 'Forest', hex: '#405747' }, { name: 'Warm white', hex: '#dfd8c9' }],
    stock: 12, badge: 'Bestseller', material: 'Powder-coated steel, solid wood base. LED bulb included. 14 in tall.', isNew: false, bestseller: true,
  },
  {
    id: 'everyday-bottle', name: 'The everyday bottle', category: 'wellness', categoryLabel: 'Wellness',
    price: 3200, rating: 4.8, reviews: 96, image: publicAsset('images/everyday-bottle.jpg'),
    description: 'Cold water on a long walk. Hot coffee on the early train. A beautifully simple, double-wall bottle that keeps your daily ritual at just the right temperature.',
    colors: [{ name: 'Sage', hex: '#8c9c83' }, { name: 'Chalk', hex: '#ddd8c9' }, { name: 'Midnight', hex: '#313e48' }],
    stock: 24, badge: 'New', material: 'BPA-free stainless steel. 20 oz / 600 ml. Hand wash recommended.', isNew: true, bestseller: true,
  },
  {
    id: 'daypack', name: 'Go-anywhere daypack', category: 'carry', categoryLabel: 'Everyday carry',
    price: 7800, rating: 4.9, reviews: 84, image: publicAsset('images/everyday-backpack.jpg'),
    description: 'For the office, the weekend, and everything between. Thoughtful pockets, a padded laptop sleeve, and lightweight canvas keep your day neatly together.',
    colors: [{ name: 'Navy', hex: '#384353' }, { name: 'Black', hex: '#31322e' }, { name: 'Stone', hex: '#c6bdae' }],
    stock: 16, material: 'Water-resistant recycled canvas. 18 L capacity. Fits a 15 in laptop.', isNew: false, bestseller: true,
  },
  {
    id: 'studio-headphones', name: 'Studio wireless headphones', category: 'tech', categoryLabel: 'Tech & accessories',
    price: 12900, originalPrice: 15900, rating: 4.8, reviews: 212, image: publicAsset('images/studio-headphones.jpg'),
    description: 'Your own little world of sound. Soft over-ear cushions, rich balanced audio, and all-day battery life for getting into your flow or switching off completely.',
    colors: [{ name: 'Graphite', hex: '#303336' }, { name: 'Oat', hex: '#c5b9a6' }],
    stock: 10, badge: 'Save $30', material: 'Bluetooth 5.3. Active noise cancellation. Up to 40 hours of listening. USB-C.', isNew: false, bestseller: true,
  },
  {
    id: 'slow-morning-mug', name: 'Slow morning mug', category: 'home', categoryLabel: 'Home & living',
    price: 2400, rating: 4.9, reviews: 67, image: publicAsset('images/ceramic-mug.jpg'),
    description: 'Some moments deserve a slower pace. A tactile stoneware mug with a comfortable handle and a hand-finished glaze, made for the first sip of the day.',
    colors: [{ name: 'Cloud', hex: '#e7e1d6' }, { name: 'Clay', hex: '#b47761' }, { name: 'Moss', hex: '#797c64' }],
    stock: 30, badge: 'New', material: 'Hand-glazed stoneware. 12 oz / 350 ml. Dishwasher and microwave safe.', isNew: true, bestseller: false,
  },
  {
    id: 'weekend-tote', name: 'The weekend tote', category: 'carry', categoryLabel: 'Everyday carry',
    price: 3800, rating: 4.7, reviews: 52, image: publicAsset('images/canvas-tote.jpg'),
    description: 'Farmers market flowers, a book for the park, a few things for later. An easygoing, roomy companion for days without a plan.',
    colors: [{ name: 'Natural', hex: '#cbbd9f' }, { name: 'Ink', hex: '#424d59' }],
    stock: 18, material: 'Heavyweight cotton canvas. Interior zip pocket. 16 x 14 in.', isNew: false, bestseller: false,
  },
  {
    id: 'pocket-speaker', name: 'Little sound speaker', category: 'tech', categoryLabel: 'Tech & accessories',
    price: 5900, rating: 4.8, reviews: 104, image: publicAsset('images/pocket-speaker.jpg'),
    description: 'Good company for every room. Small enough to take along, with a surprisingly full sound and a tactile finish that feels right at home.',
    colors: [{ name: 'Charcoal', hex: '#424340' }, { name: 'Sand', hex: '#baad93' }],
    stock: 15, badge: 'Bestseller', material: 'Bluetooth 5.2. 12-hour battery. Water-resistant IPX5. USB-C charging.', isNew: false, bestseller: true,
  },
  {
    id: 'still-candle', name: 'Sunday scented candle', category: 'wellness', categoryLabel: 'Wellness',
    price: 2800, rating: 4.8, reviews: 76, image: publicAsset('images/candle.jpg'),
    description: 'An invitation to do a little less. Cedar, bergamot, and a hint of wild fig fill your space with the quiet feeling of a Sunday morning.',
    colors: [{ name: 'Cedar & fig', hex: '#b4a68a' }, { name: 'Sea salt', hex: '#aebcc1' }],
    stock: 22, badge: 'New', material: 'Natural soy wax, cotton wick, reusable glass vessel. 8 oz. 45-hour burn time.', isNew: true, bestseller: false,
  },
  {
    id: 'lounge-chair', name: 'The reading chair', category: 'home', categoryLabel: 'Home & living',
    price: 22900, rating: 4.9, reviews: 34, image: publicAsset('images/lounge-chair.jpg'),
    description: 'A seat worth slowing down for. A generous shape and thoughtful proportions bring a little calm to any corner of your home.',
    colors: [{ name: 'Pebble grey', hex: '#a6a29a' }, { name: 'Oat', hex: '#c7bfae' }],
    stock: 5, material: 'Linen upholstery with a solid oak frame. 28 x 30 x 31 in.', isNew: false, bestseller: false,
  },
  {
    id: 'daily-journal', name: 'A little daily journal', category: 'carry', categoryLabel: 'Everyday carry',
    price: 1800, rating: 4.7, reviews: 48, image: publicAsset('images/notebook.jpg'),
    description: 'A place for passing thoughts, big ideas, and things worth remembering. Open-flat pages and a satisfyingly tactile cover for whatever comes next.',
    colors: [{ name: 'Ochre', hex: '#b98d40' }, { name: 'Forest', hex: '#45594a' }, { name: 'Rose', hex: '#b78f8d' }],
    stock: 40, badge: 'New', material: 'FSC-certified paper. 192 dotted pages. A5 hardcover with ribbon marker.', isNew: true, bestseller: false,
  },
  {
    id: 'movement-mat', name: 'Everyday movement mat', category: 'wellness', categoryLabel: 'Wellness',
    price: 6400, rating: 4.8, reviews: 63, image: publicAsset('images/yoga-mat.jpg'),
    description: 'Room to move, space to breathe. A supportive, naturally grippy mat for morning stretches, mindful movement, and finding your balance.',
    colors: [{ name: 'Moss', hex: '#78866c' }, { name: 'Dusty pink', hex: '#be9e98' }],
    stock: 0, badge: 'Back soon', material: 'Responsibly sourced natural rubber. 5 mm cushion. 72 x 24 in. Carry strap included.', isNew: false, bestseller: false,
  },
  {
    id: 'ceramic-cup-set', name: 'Coffee for two', category: 'home', categoryLabel: 'Home & living',
    price: 4200, originalPrice: 4800, rating: 4.9, reviews: 55, image: publicAsset('images/coffee-edit.jpg'),
    description: 'Better when shared. A pair of perfectly imperfect ceramic cups for catching up, sitting quietly, and making an ordinary morning feel special.',
    colors: [{ name: 'Porcelain', hex: '#e3ddd1' }, { name: 'Terracotta', hex: '#ba8164' }],
    stock: 20, material: 'Set of two hand-finished stoneware cups. 8 oz / 240 ml each. Dishwasher safe.', isNew: false, bestseller: true,
  },
]
