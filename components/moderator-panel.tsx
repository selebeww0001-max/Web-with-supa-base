'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore, Product, PaymentMethod, Category } from '@/lib/store'
import { X, Plus, Trash2, Edit2, Package, CreditCard, Image as ImageIcon, Upload, LayoutGrid } from 'lucide-react'
import Image from 'next/image'

interface ModeratorPanelProps {
  onClose: () => void
  defaultCategoryId?: string
}

export function ModeratorPanel({ onClose, defaultCategoryId = '' }: ModeratorPanelProps) {
  const {
    products, categories,
    paymentMethods,
    addProduct, updateProduct, deleteProduct,
    addPaymentMethod, updatePaymentMethod, deletePaymentMethod,
    addCategory, updateCategory, deleteCategory,
    logout
  } = useStore()

  const [activeTab, setActiveTab] = useState<'products' | 'payments' | 'categories'>('products')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [saving, setSaving] = useState(false)

  const [productForm, setProductForm] = useState({
    name: '', price: 0, image: '', stock: '', description: '', categoryId: defaultCategoryId
  })

  // Auto open tambah produk form kalau ada defaultCategoryId
  useEffect(() => {
    if (defaultCategoryId) {
      setActiveTab('products')
      setProductForm({ name: '', price: 0, image: '', stock: '', description: '', categoryId: defaultCategoryId })
      setEditingProduct(null)
      setIsAdding(true)
    }
  })
  const [paymentForm, setPaymentForm] = useState({
    type: 'qris' as 'qris' | 'number', name: '', value: '', qrisImage: ''
  })
  const [categoryName, setCategoryName] = useState('')

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setProductForm(prev => ({ ...prev, image: reader.result as string }))
      reader.readAsDataURL(file)
    }
  }

  const handleQrisImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPaymentForm(prev => ({ ...prev, qrisImage: reader.result as string }))
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProduct = async () => {
    setSaving(true)
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productForm)
      } else {
        await addProduct(productForm)
      }
      setProductForm({ name: '', price: 0, image: '', stock: '', description: '', categoryId: '' })
      setEditingProduct(null)
      setIsAdding(false)
    } finally { setSaving(false) }
  }

  const handleSavePayment = async () => {
    setSaving(true)
    try {
      if (editingPayment) {
        await updatePaymentMethod(editingPayment.id, paymentForm)
      } else {
        await addPaymentMethod(paymentForm)
      }
      setPaymentForm({ type: 'qris', name: '', value: '', qrisImage: '' })
      setEditingPayment(null)
      setIsAdding(false)
    } finally { setSaving(false) }
  }

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) return
    setSaving(true)
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryName)
      } else {
        await addCategory(categoryName)
      }
      setCategoryName('')
      setEditingCategory(null)
      setIsAdding(false)
    } finally { setSaving(false) }
  }

  const startEditProduct = (product: Product) => {
    setProductForm({ name: product.name, price: product.price, image: product.image, stock: product.stock, description: product.description, categoryId: product.categoryId || '' })
    setEditingProduct(product)
    setIsAdding(true)
  }

  const startEditPayment = (payment: PaymentMethod) => {
    setPaymentForm({ type: payment.type, name: payment.name, value: payment.value, qrisImage: payment.qrisImage || '' })
    setEditingPayment(payment)
    setIsAdding(true)
  }

  const startEditCategory = (cat: Category) => {
    setCategoryName(cat.name)
    setEditingCategory(cat)
    setIsAdding(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl max-h-[90vh] bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
          <div>
            <h2 className="text-2xl font-bold text-white">Moderator Panel</h2>
            <p className="text-zinc-500 text-sm">Kelola produk, kategori, dan pembayaran</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => { logout(); onClose(); }} className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors text-sm">
              Logout
            </button>
            <button onClick={onClose} className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors">
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/50 overflow-x-auto">
          {[
            { key: 'products', label: 'Produk', icon: <Package className="w-4 h-4" /> },
            { key: 'categories', label: 'Kategori', icon: <LayoutGrid className="w-4 h-4" /> },
            { key: 'payments', label: 'Pembayaran', icon: <CreditCard className="w-4 h-4" /> },
          ].map(tab => (
            <button key={tab.key}
              onClick={() => { setActiveTab(tab.key as typeof activeTab); setIsAdding(false) }}
              className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap transition-colors ${activeTab === tab.key ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-white'}`}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] bg-zinc-950">

          {/* ===== PRODUCTS TAB ===== */}
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Daftar Produk</h3>
                <button onClick={() => { setProductForm({ name: '', price: 0, image: '', stock: '', description: '', categoryId: '' }); setEditingProduct(null); setIsAdding(true) }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition-colors">
                  <Plus className="w-4 h-4" /> Tambah Produk
                </button>
              </div>

              {isAdding && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-6 rounded-xl bg-zinc-900 border border-zinc-800">
                  <h4 className="text-white font-semibold mb-4">{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 text-sm mb-2">Nama Produk</label>
                      <input type="text" value={productForm.name}
                        onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-600 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-sm mb-2">Harga (Rp)</label>
                      <input type="number" value={productForm.price}
                        onChange={(e) => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-600 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-sm mb-2">Stok</label>
                      <input type="text" value={productForm.stock}
                        onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                        placeholder="99+ atau angka"
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-600 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-sm mb-2">Kategori</label>
                      <select value={productForm.categoryId}
                        onChange={(e) => setProductForm(prev => ({ ...prev, categoryId: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-600 focus:outline-none">
                        <option value="">— Produk Unggulan (tanpa kategori) —</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-sm mb-2">Gambar Produk</label>
                      <label className="flex items-center justify-center w-full h-12 border border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-zinc-600 transition-colors bg-zinc-800">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-zinc-500" />
                          <span className="text-zinc-400 text-sm">{productForm.image ? 'Gambar dipilih ✓' : 'Upload gambar'}</span>
                        </div>
                        <input type="file" accept="image/*" onChange={handleProductImageUpload} className="hidden" />
                      </label>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-zinc-400 text-sm mb-2">Deskripsi</label>
                      <textarea value={productForm.description}
                        onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3} className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-600 focus:outline-none resize-none" />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleSaveProduct} disabled={saving}
                      className="px-6 py-2 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50">
                      {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button onClick={() => { setIsAdding(false); setEditingProduct(null) }}
                      className="px-6 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors">
                      Batal
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-zinc-800">
                        {product.image ? (
                          <Image src={product.image} alt={product.name} width={64} height={64} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{product.name}</h4>
                        <p className="text-zinc-400 text-sm">Rp {product.price.toLocaleString('id-ID')}</p>
                        <p className="text-zinc-600 text-xs">
                          Stok: {product.stock} · {product.categoryId ? (categories.find(c => c.id === product.categoryId)?.name || 'Kategori') : 'Produk Unggulan'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditProduct(product)} className="p-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteProduct(product.id)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== CATEGORIES TAB ===== */}
          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Kategori Produk</h3>
                <button onClick={() => { setCategoryName(''); setEditingCategory(null); setIsAdding(true) }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition-colors">
                  <Plus className="w-4 h-4" /> Tambah Kategori
                </button>
              </div>

              <div className="mb-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-zinc-400 text-sm">💡 Kategori akan muncul sebagai section tersendiri di halaman utama. Produk bisa dimasukkan ke kategori saat tambah/edit produk.</p>
              </div>

              {isAdding && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-6 rounded-xl bg-zinc-900 border border-zinc-800">
                  <h4 className="text-white font-semibold mb-4">{editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h4>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">Nama Kategori</label>
                    <input type="text" value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="contoh: Top Up Games, Akun Premium, dll"
                      className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-600 focus:outline-none" />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleSaveCategory} disabled={saving || !categoryName.trim()}
                      className="px-6 py-2 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50">
                      {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button onClick={() => { setIsAdding(false); setEditingCategory(null) }}
                      className="px-6 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors">
                      Batal
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="space-y-3">
                {categories.length === 0 && !isAdding && (
                  <div className="text-center py-10 text-zinc-600">Belum ada kategori. Tambah kategori baru!</div>
                )}
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div>
                      <h4 className="text-white font-medium">{cat.name}</h4>
                      <p className="text-zinc-600 text-xs">{products.filter(p => p.categoryId === cat.id).length} produk</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditCategory(cat)} className="p-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteCategory(cat.id)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== PAYMENTS TAB ===== */}
          {activeTab === 'payments' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Metode Pembayaran</h3>
                <button onClick={() => { setPaymentForm({ type: 'qris', name: '', value: '', qrisImage: '' }); setEditingPayment(null); setIsAdding(true) }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition-colors">
                  <Plus className="w-4 h-4" /> Tambah Metode
                </button>
              </div>

              {isAdding && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-6 rounded-xl bg-zinc-900 border border-zinc-800">
                  <h4 className="text-white font-semibold mb-4">{editingPayment ? 'Edit Metode' : 'Tambah Metode Baru'}</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-zinc-400 text-sm mb-2">Tipe</label>
                      <select value={paymentForm.type}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, type: e.target.value as 'qris' | 'number' }))}
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-600 focus:outline-none">
                        <option value="qris">QRIS</option>
                        <option value="number">Nomor (DANA/OVO/dll)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-sm mb-2">Nama</label>
                      <input type="text" value={paymentForm.name}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="QRIS / DANA / OVO"
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-600 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-sm mb-2">{paymentForm.type === 'qris' ? 'Deskripsi' : 'Nomor'}</label>
                      <input type="text" value={paymentForm.value}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, value: e.target.value }))}
                        placeholder={paymentForm.type === 'qris' ? 'Scan QR untuk bayar' : '081234567890'}
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-600 focus:outline-none" />
                    </div>
                    {paymentForm.type === 'qris' && (
                      <div>
                        <label className="block text-zinc-400 text-sm mb-2">Gambar QRIS</label>
                        <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-zinc-600 transition-colors bg-zinc-800">
                          {paymentForm.qrisImage ? (
                            <div className="flex flex-col items-center gap-2">
                              <Image src={paymentForm.qrisImage} alt="QRIS" width={80} height={80} className="object-contain" />
                              <span className="text-zinc-400 text-xs">Gambar dipilih ✓</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <Upload className="w-8 h-8 text-zinc-600 mb-2" />
                              <span className="text-zinc-500 text-sm">Upload QRIS</span>
                            </div>
                          )}
                          <input type="file" accept="image/*" onChange={handleQrisImageUpload} className="hidden" />
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleSavePayment} disabled={saving}
                      className="px-6 py-2 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50">
                      {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button onClick={() => { setIsAdding(false); setEditingPayment(null) }}
                      className="px-6 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors">
                      Batal
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-zinc-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{method.name}</h4>
                        <p className="text-zinc-500 text-sm">{method.value}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditPayment(method)} className="p-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deletePaymentMethod(method.id)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

