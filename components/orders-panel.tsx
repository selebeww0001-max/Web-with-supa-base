'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { X, Check, XCircle, Clock, ExternalLink, MessageSquare } from 'lucide-react'
import Image from 'next/image'

interface OrdersPanelProps {
  onClose: () => void
}

export function OrdersPanel({ onClose }: OrdersPanelProps) {
  const { orders, updateOrderStatus, messages, markMessageRead, deleteMessage, fetchAll } = useStore()
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAll()
  }, [])
  const [activeTab, setActiveTab] = useState<'orders' | 'messages'>('orders')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const pendingOrders = orders.filter(o => o.status === 'pending').slice(0, 50)
  const processedOrders = orders.filter(o => o.status !== 'pending').slice(0, 50)
  const unreadMessages = messages.filter(m => !m.read)

  const handleReject = async (orderId: string) => {
    if (rejectionReason.trim()) {
      await updateOrderStatus(orderId, 'rejected', rejectionReason)
      setRejectingOrderId(null)
      setRejectionReason('')
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
        className="w-full max-w-3xl max-h-[90vh] bg-zinc-900 rounded-2xl border border-zinc-700 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
          <div>
            <h2 className="text-2xl font-bold text-white">Inbox Moderator</h2>
            <p className="text-zinc-400 text-sm">Kelola pesanan dan pesan</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {error && (
          <div className="px-6 py-2 bg-red-500/20 border-b border-red-500/30">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        {/* Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/50">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-4 transition-colors relative ${
              activeTab === 'orders'
                ? 'text-white border-b-2 border-white'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            <Clock className="w-5 h-5" />
            Pesanan
            {pendingOrders.length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500 text-black text-xs font-medium">
                {pendingOrders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-6 py-4 transition-colors relative ${
              activeTab === 'messages'
                ? 'text-white border-b-2 border-white'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Pesan
            {unreadMessages.length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500 text-black text-xs font-medium">
                {unreadMessages.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] bg-zinc-950">
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Pending orders */}
              {pendingOrders.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Menunggu Konfirmasi</h3>
                  <div className="space-y-3">
                    {pendingOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{order.productName}</h4>
                            <p className="text-amber-400 text-sm">@{order.telegramUsername}</p>
                            <p className="text-zinc-500 text-xs mt-1">
                              via {order.paymentMethod} - {new Date(order.createdAt).toLocaleString('id-ID')}
                            </p>
                          </div>
                          {rejectingOrderId !== order.id && (
                            <div className="flex gap-2">
                              <button
                                onClick={async () => { try { await updateOrderStatus(order.id, 'approved') } catch { setError('Gagal approve, coba lagi') } }}
                                className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                title="Approve"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setRejectingOrderId(order.id)}
                                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Rejection reason input */}
                        {rejectingOrderId === order.id && (
                          <div className="mt-4 p-3 rounded-lg bg-zinc-900 border border-zinc-700">
                            <p className="text-sm text-zinc-400 mb-2">Alasan penolakan:</p>
                            <textarea
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              placeholder="Masukkan alasan penolakan..."
                              className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-sm resize-none focus:outline-none focus:border-zinc-600"
                              rows={2}
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleReject(order.id)}
                                disabled={!rejectionReason.trim()}
                                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => {
                                  setRejectingOrderId(null)
                                  setRejectionReason('')
                                }}
                                className="px-4 py-2 rounded-lg bg-zinc-700 text-white text-sm hover:bg-zinc-600 transition-colors"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        )}

                        {order.paymentProof && (
                          <button
                            onClick={() => setSelectedImage(order.paymentProof)}
                            className="mt-3 block"
                          >
                            <Image
                              src={order.paymentProof}
                              alt="Bukti transfer"
                              width={200}
                              height={150}
                              className="rounded-lg object-cover hover:opacity-80 transition-opacity border border-zinc-700"
                            />
                          </button>
                        )}
                        <a
                          href={`https://t.me/${order.telegramUsername.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 mt-3 text-zinc-400 text-sm hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Chat di Telegram
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Processed orders */}
              {processedOrders.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Riwayat</h3>
                  <div className="space-y-3">
                    {processedOrders.map((order) => (
                      <div
                        key={order.id}
                        className={`p-4 rounded-xl border ${
                          order.status === 'approved'
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : 'bg-red-500/10 border-red-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium">{order.productName}</h4>
                            <p className="text-zinc-400 text-sm">@{order.telegramUsername}</p>
                            {order.status === 'rejected' && order.rejectionReason && (
                              <p className="text-red-400 text-sm mt-1">
                                Alasan: {order.rejectionReason}
                              </p>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {order.status === 'approved' ? 'Approved' : 'Rejected'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {orders.length === 0 && (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500">Belum ada pesanan</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-3">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-xl border ${
                      message.read
                        ? 'bg-zinc-900 border-zinc-800'
                        : 'bg-zinc-800 border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium">{message.from}</p>
                        <p className="text-zinc-300 mt-1">{message.content}</p>
                        <p className="text-zinc-600 text-xs mt-2">
                          {new Date(message.createdAt).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!message.read && (
                          <button
                            onClick={() => markMessageRead(message.id)}
                            className="p-2 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteMessage(message.id)}
                          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500">Belum ada pesan</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Image modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/90"
            onClick={() => setSelectedImage(null)}
          >
            <Image
              src={selectedImage}
              alt="Bukti transfer"
              width={500}
              height={500}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

