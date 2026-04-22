import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from './supabase'

export interface Product {
  id: string
  name: string
  price: number
  image: string
  stock: string
  description: string
}

export interface PaymentMethod {
  id: string
  type: 'qris' | 'number'
  name: string
  value: string
  qrisImage?: string
}

export interface Order {
  id: string
  productId: string
  productName: string
  telegramUsername: string
  paymentProof: string
  paymentMethod: string
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
  createdAt: string
}

export interface Message {
  id: string
  from: string
  content: string
  createdAt: string
  read: boolean
}

export interface Review {
  id: string
  name: string
  rating: number
  comment: string
  createdAt: string
}

interface StoreState {
  isModeratorMode: boolean
  products: Product[]
  paymentMethods: PaymentMethod[]
  orders: Order[]
  messages: Message[]
  reviews: Review[]
  loading: boolean

  login: (password: string) => boolean
  logout: () => void

  fetchAll: () => Promise<void>

  addProduct: (product: Omit<Product, 'id'>) => Promise<void>
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>

  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => Promise<void>
  updatePaymentMethod: (id: string, method: Partial<PaymentMethod>) => Promise<void>
  deletePaymentMethod: (id: string) => Promise<void>

  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<void>
  updateOrderStatus: (id: string, status: Order['status'], rejectionReason?: string) => Promise<void>

  addMessage: (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => Promise<void>
  markMessageRead: (id: string) => Promise<void>
  deleteMessage: (id: string) => Promise<void>

  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>
  deleteReview: (id: string) => Promise<void>
}

const MODERATOR_PASSWORD = '852013'

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      isModeratorMode: false,
      products: [],
      paymentMethods: [],
      orders: [],
      messages: [],
      reviews: [],
      loading: false,

      login: (password) => {
        if (password === MODERATOR_PASSWORD) { set({ isModeratorMode: true }); return true }
        return false
      },
      logout: () => set({ isModeratorMode: false }),

      fetchAll: async () => {
        set({ loading: true })
        const [products, paymentMethods, orders, messages, reviews] = await Promise.all([
          supabase.from('products').select('*').order('created_at'),
          supabase.from('payment_methods').select('*').order('created_at'),
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('messages').select('*').order('created_at', { ascending: false }),
          supabase.from('reviews').select('*').order('created_at', { ascending: false }),
        ])
        set({
          products: products.data || [],
          paymentMethods: (paymentMethods.data || []).map((m: Record<string, unknown>) => ({ ...m, qrisImage: m.qris_image })),
          orders: orders.data || [],
          messages: messages.data || [],
          reviews: reviews.data || [],
          loading: false,
        })
      },

      // Products
      addProduct: async (product) => {
        const { data } = await supabase.from('products').insert([product]).select().single()
        if (data) set((s) => ({ products: [...s.products, data] }))
      },
      updateProduct: async (id, product) => {
        const { data } = await supabase.from('products').update(product).eq('id', id).select().single()
        if (data) set((s) => ({ products: s.products.map((p) => p.id === id ? data : p) }))
      },
      deleteProduct: async (id) => {
        await supabase.from('products').delete().eq('id', id)
        set((s) => ({ products: s.products.filter((p) => p.id !== id) }))
      },

      // Payment Methods
      addPaymentMethod: async (method) => {
        const payload = { type: method.type, name: method.name, value: method.value, qris_image: method.qrisImage || '' }
        const { data } = await supabase.from('payment_methods').insert([payload]).select().single()
        if (data) set((s) => ({ paymentMethods: [...s.paymentMethods, { ...data, qrisImage: data.qris_image }] }))
      },
      updatePaymentMethod: async (id, method) => {
        const payload: Record<string, unknown> = {}
        if (method.type !== undefined) payload.type = method.type
        if (method.name !== undefined) payload.name = method.name
        if (method.value !== undefined) payload.value = method.value
        if (method.qrisImage !== undefined) payload.qris_image = method.qrisImage
        const { data } = await supabase.from('payment_methods').update(payload).eq('id', id).select().single()
        if (data) set((s) => ({ paymentMethods: s.paymentMethods.map((m) => m.id === id ? { ...data, qrisImage: data.qris_image } : m) }))
      },
      deletePaymentMethod: async (id) => {
        await supabase.from('payment_methods').delete().eq('id', id)
        set((s) => ({ paymentMethods: s.paymentMethods.filter((m) => m.id !== id) }))
      },

      // Orders
      addOrder: async (order) => {
        const { data } = await supabase.from('orders').insert([{ ...order, status: 'pending' }]).select().single()
        if (data) set((s) => ({ orders: [data, ...s.orders] }))
      },
      updateOrderStatus: async (id, status, rejectionReason) => {
        const { data } = await supabase.from('orders').update({ status, rejection_reason: rejectionReason }).eq('id', id).select().single()
        if (data) set((s) => ({ orders: s.orders.map((o) => o.id === id ? data : o) }))
      },

      // Messages
      addMessage: async (message) => {
        const { data } = await supabase.from('messages').insert([{ ...message, read: false }]).select().single()
        if (data) set((s) => ({ messages: [data, ...s.messages] }))
      },
      markMessageRead: async (id) => {
        await supabase.from('messages').update({ read: true }).eq('id', id)
        set((s) => ({ messages: s.messages.map((m) => m.id === id ? { ...m, read: true } : m) }))
      },
      deleteMessage: async (id) => {
        await supabase.from('messages').delete().eq('id', id)
        set((s) => ({ messages: s.messages.filter((m) => m.id !== id) }))
      },

      // Reviews
      addReview: async (review) => {
        const { data } = await supabase.from('reviews').insert([review]).select().single()
        if (data) set((s) => ({ reviews: [data, ...s.reviews] }))
      },
      deleteReview: async (id) => {
        await supabase.from('reviews').delete().eq('id', id)
        set((s) => ({ reviews: s.reviews.filter((r) => r.id !== id) }))
      },
    }),
    {
      name: 'ren-grocery-store',
      partialize: (state) => ({ isModeratorMode: state.isModeratorMode }),
    }
  )
)

