'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore, Product } from '@/lib/store'
import { ProductCard } from '@/components/product-card'
import { CheckoutModal } from '@/components/checkout-modal'
import { ModeratorPanel } from '@/components/moderator-panel'
import { OrdersPanel } from '@/components/orders-panel'
import { LoginModal } from '@/components/login-modal'
import { Chatbot } from '@/components/chatbot'
import { ReviewsSection } from '@/components/reviews-section'
import { BuyerInbox } from '@/components/buyer-inbox'
import { Lock, Settings, MessageSquare, ExternalLink, ShoppingBag, Zap, Shield, Inbox } from 'lucide-react'

export default function HomePage() {
  const { products, categories, isModeratorMode, orders, loading } = useStore()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [showModeratorPanel, setShowModeratorPanel] = useState(false)
  const [showOrdersPanel, setShowOrdersPanel] = useState(false)
  const [showBuyerInbox, setShowBuyerInbox] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    useStore.getState().fetchAll()
  }, [])

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Subtle grid pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white italic">Ren grocery</h1>
                <p className="text-[10px] text-zinc-500 -mt-1">Digital Store</p>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Buyer Inbox */}
              <button
                onClick={() => setShowBuyerInbox(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <Inbox className="w-4 h-4" />
                Cek Pesanan
              </button>

              {/* Telegram CS */}
              <a
                href="https://t.me/RENan_notdev1"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Customer Service
              </a>

              {/* Moderator controls */}
              {isModeratorMode && (
                <>
                  <button
                    onClick={() => setShowOrdersPanel(true)}
                    className="relative p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    {pendingOrdersCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-black text-xs flex items-center justify-center font-medium">
                        {pendingOrdersCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setShowModeratorPanel(true)}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Lock/Login button */}
              <button
                onClick={() => setShowLogin(true)}
                className={`p-2 rounded-xl transition-colors ${
                  isModeratorMode
                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Lock className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Hero Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm mb-6">
              Digital Products Store
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Produk Digital Terpercaya
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto mb-8">
              Dapatkan berbagai produk digital berkualitas dengan harga terbaik. Pengiriman instan, layanan 24/7.
            </p>
            
            {/* Features */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-zinc-400">
                <Zap className="w-5 h-5 text-amber-400" />
                Pengiriman Instan
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Shield className="w-5 h-5 text-emerald-400" />
                100% Aman
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <MessageSquare className="w-5 h-5 text-zinc-400" />
                Support 24/7
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="relative z-10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex items-center justify-between"
          >
            <h3 className="text-2xl font-bold text-white">
              Produk Unggulan
            </h3>
            <span className="text-zinc-600 text-sm">{products.length} produk tersedia</span>
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-zinc-700 border-t-white animate-spin" />
              <p className="text-zinc-400 text-sm">Mohon tunggu, sedang memuat... 💫</p>
            </div>
          ) : (
            <>
              {/* Produk tanpa kategori */}
              {(() => {
                const uncategorized = products.filter(p => !p.categoryId || p.categoryId === '')
                if (uncategorized.length === 0 && categories.length > 0) return null
                return (
                  <div className="mb-12">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {uncategorized.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onClick={() => setSelectedProduct(product)}
                          isModeratorMode={isModeratorMode}
                          onEdit={() => setShowModeratorPanel(true)}
                          onDelete={() => { if (confirm('Hapus produk ini?')) useStore.getState().deleteProduct(product.id) }}
                        />
                      ))}
                    </div>
                    {uncategorized.length === 0 && categories.length === 0 && (
                      <div className="text-center py-20">
                        <ShoppingBag className="w-16 h-16 text-zinc-800 mx-auto mb-4" />
                        <p className="text-zinc-600">Belum ada produk tersedia</p>
                        {isModeratorMode && (
                          <button onClick={() => setShowModeratorPanel(true)} className="mt-4 px-6 py-2 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-colors">
                            Tambah Produk
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })()}

              {/* Produk per kategori */}
              {categories.map((category) => {
                const catProducts = products.filter(p => p.categoryId === category.id)
                return (
                  <div key={category.id} className="mb-14">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                      <span className="text-zinc-600 text-sm">{catProducts.length} produk</span>
                    </div>
                    {catProducts.length === 0 ? (
                      <div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl">
                        <p className="text-zinc-600 text-sm">Belum ada produk di kategori ini</p>
                        {isModeratorMode && (
                          <button onClick={() => setShowModeratorPanel(true)} className="mt-3 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors">
                            Tambah Produk
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {catProducts.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onClick={() => setSelectedProduct(product)}
                            isModeratorMode={isModeratorMode}
                            onEdit={() => setShowModeratorPanel(true)}
                            onDelete={() => { if (confirm('Hapus produk ini?')) useStore.getState().deleteProduct(product.id) }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-900 bg-zinc-950 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-black" />
                </div>
                <h4 className="text-xl font-bold text-white italic">Ren grocery</h4>
              </div>
              <p className="text-zinc-500 text-sm">
                Toko digital terpercaya dengan layanan terbaik. Produk berkualitas, pengiriman instan.
              </p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Layanan</h5>
              <ul className="space-y-2 text-zinc-500 text-sm">
                <li>Akun Premium</li>
                <li>Game Credits</li>
                <li>Digital License</li>
                <li>VIP Membership</li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Kontak</h5>
              <a
                href="https://t.me/RENan_notdev1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-zinc-400 text-sm hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Telegram: @RENan_notdev1
              </a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-zinc-900 text-center text-zinc-600 text-sm">
            2024 Ren Grocery. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />

      {/* Buyer Inbox Button (mobile) */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setShowBuyerInbox(true)}
        className="sm:hidden fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 shadow-lg flex items-center justify-center"
      >
        <Inbox className="w-5 h-5 text-white" />
      </motion.button>

      {/* Moderator Inbox Button (floating) */}
      {isModeratorMode && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setShowOrdersPanel(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center"
        >
          <MessageSquare className="w-6 h-6 text-black" />
          {pendingOrdersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-black text-xs flex items-center justify-center border-2 border-black font-medium">
              {pendingOrdersCount}
            </span>
          )}
        </motion.button>
      )}

      {/* Modals */}
      <AnimatePresence>
        {selectedProduct && (
          <CheckoutModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}

        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onSuccess={() => setShowModeratorPanel(true)}
          />
        )}

        {showModeratorPanel && isModeratorMode && (
          <ModeratorPanel onClose={() => setShowModeratorPanel(false)} />
        )}

        {showOrdersPanel && isModeratorMode && (
          <OrdersPanel onClose={() => setShowOrdersPanel(false)} />
        )}

        {showBuyerInbox && (
          <BuyerInbox onClose={() => setShowBuyerInbox(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

