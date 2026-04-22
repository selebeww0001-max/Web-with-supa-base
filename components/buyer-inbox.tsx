'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { X, Package, CheckCircle, XCircle, AlertTriangle, Inbox } from 'lucide-react'

interface BuyerInboxProps {
  onClose: () => void
}

export function BuyerInbox({ onClose }: BuyerInboxProps) {
  const { orders } = useStore()
  const [telegramFilter, setTelegramFilter] = useState('')
  
  const filteredOrders = telegramFilter.trim()
    ? orders.filter(o => 
        o.telegramUsername.toLowerCase().includes(telegramFilter.toLowerCase().replace('@', ''))
      )
    : []

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <Package className="w-5 h-5 text-amber-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Disetujui'
      case 'rejected':
        return 'Ditolak'
      default:
        return 'Menunggu'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg max-h-[90vh] bg-zinc-900 rounded-2xl border border-zinc-700 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Cek Status Pesanan</h2>
            <p className="text-zinc-400 text-sm">Masukkan username Telegram kamu</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-zinc-800">
          <input
            type="text"
            value={telegramFilter}
            onChange={(e) => setTelegramFilter(e.target.value)}
            placeholder="@username_telegram"
            className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          />
        </div>

        {/* Orders List */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          {telegramFilter.trim() === '' ? (
            <div className="text-center py-8">
              <Inbox className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">Masukkan username Telegram untuk melihat status pesanan</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">Tidak ada pesanan ditemukan untuk username ini</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 rounded-xl border ${
                    order.status === 'approved'
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : order.status === 'rejected'
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-amber-500/10 border-amber-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getStatusIcon(order.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium">{order.productName}</h4>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          order.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : order.status === 'rejected'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-zinc-500 text-sm mt-1">
                        {new Date(order.createdAt).toLocaleString('id-ID')}
                      </p>
                      <p className="text-zinc-400 text-sm mt-1">
                        via {order.paymentMethod}
                      </p>

                      {/* Rejection reason */}
                      {order.status === 'rejected' && order.rejectionReason && (
                        <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-red-400 text-sm font-medium">Alasan penolakan:</p>
                              <p className="text-red-300/80 text-sm mt-1">{order.rejectionReason}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Pending message */}
                      {order.status === 'pending' && (
                        <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <p className="text-amber-400 text-sm">
                            Pesanan sedang diproses. Mohon tunggu konfirmasi dari admin.
                          </p>
                        </div>
                      )}

                      {/* Approved message */}
                      {order.status === 'approved' && (
                        <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                          <p className="text-emerald-400 text-sm">
                            Pesanan disetujui! Produk akan segera dikirim via Telegram.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
