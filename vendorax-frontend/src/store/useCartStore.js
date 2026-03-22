import { create } from 'zustand'

const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('cart')) || [],

  addToCart: (product) => {
    const items = get().items
    const existing = items.find(i => i._id === product._id)
    let updated
    if (existing) {
      updated = items.map(i =>
        i._id === product._id
          ? { ...i, qty: Math.min(i.qty + product.qty, product.stock) }
          : i
      )
    } else {
      updated = [...items, product]
    }
    localStorage.setItem('cart', JSON.stringify(updated))
    set({ items: updated })
  },

  removeFromCart: (id) => {
    const updated = get().items.filter(i => i._id !== id)
    localStorage.setItem('cart', JSON.stringify(updated))
    set({ items: updated })
  },

  updateQty: (id, qty) => {
    const updated = get().items.map(i => i._id === id ? { ...i, qty } : i)
    localStorage.setItem('cart', JSON.stringify(updated))
    set({ items: updated })
  },

  clearCart: () => {
    localStorage.removeItem('cart')
    set({ items: [] })
  },

  getTotal: () => {
    return get().items.reduce((sum, i) => sum + i.price * i.qty, 0)
  },

  getCount: () => {
    return get().items.reduce((sum, i) => sum + i.qty, 0)
  }
}))

export default useCartStore