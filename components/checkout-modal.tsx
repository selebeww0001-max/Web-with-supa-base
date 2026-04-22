'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product, PaymentMethod, useStore } from '@/lib/store'
import { X, Upload, ExternalLink, Check } from 'lucide-react'
import Image from 'next/image'

interface CheckoutModalProps {
  product: Product
  onClose: () => void
}

export function CheckoutModal({ product, onClose }: CheckoutModalProps) {
  const { paymentMethods, addOrder, fetchAll } = useStore()

  useEffect(() => {
    fetchAll()
  }, [])
  const [step, setStep] = useState<'payment' | 'upload' | 'success'>('payment')
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null)
  const [telegramUsername, setTelegramUsername] = useState('')
  const [paymentProof, setPaymentProof] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPaymentProof(reader.result as string)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (selectedPayment && telegramUsername && paymentProof) {
      addOrder({
        productId: product.id,
        productName: product.name,
        telegramUsername,
        paymentProof,
        paymentMethod: selectedPayment.name
      })
      setStep('success')
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-6 border-b border-zinc-800">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
            <h2 className="text-xl font-bold text-white">Checkout</h2>
            <p className="text-zinc-400 mt-1">{product.name}</p>
            <p className="text-2xl font-bold text-white mt-2">
              Rp {product.price.toLocaleString('id-ID')}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto bg-zinc-950">
            {step === 'payment' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="text-white font-semibold mb-4">Pilih Metode Pembayaran</h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method)}
                      className={`w-full p-4 rounded-xl border transition-all text-left ${
                        selectedPayment?.id === method.id
                          ? 'border-white bg-zinc-800'
                          : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{method.name}</p>
                          <p className="text-zinc-500 text-sm">{method.value}</p>
                        </div>
                        {selectedPayment?.id === method.id && (
                          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                            <Check className="w-4 h-4 text-black" />
                          </div>
                        )}
                      </div>
                      {method.type === 'qris' && method.qrisImage && selectedPayment?.id === method.id && (
                        <div className="mt-4 flex justify-center">
                          <Image
                            src={method.qrisImage}
                            alt="QRIS"
                            width={200}
                            height={200}
                            className="rounded-lg"
                          />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                
                <p className="text-center text-zinc-500 text-sm mt-4">
                  Pengiriman Instan via Telegram
                </p>

                <button
                  onClick={() => selectedPayment && setStep('upload')}
                  disabled={!selectedPayment}
                  className="w-full mt-6 py-4 rounded-xl bg-white text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-200 transition-colors"
                >
                  Lanjutkan
                </button>
              </motion.div>
            )}

            {step === 'upload' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="text-white font-semibold mb-4">Upload Bukti Pembayaran</h3>
                
                {/* Payment info */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 mb-4">
                  <p className="text-zinc-500 text-sm">Transfer ke:</p>
                  <p className="text-white font-semibold">{selectedPayment?.name}</p>
                  <p className="text-zinc-300">{selectedPayment?.value}</p>
                  {selectedPayment?.type === 'qris' && selectedPayment?.qrisImage && (
                    <div className="mt-3 flex justify-center">
                      <Image
                        src={selectedPayment.qrisImage}
                        alt="QRIS"
                        width={180}
                        height={180}
                        className="rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Username input */}
                <div className="mb-4">
                  <label className="block text-zinc-400 text-sm mb-2">
                    Username Telegram (untuk pengiriman)
                  </label>
                  <input
                    type="text"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    placeholder="@username"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none transition-colors"
                  />
                </div>

                {/* File upload */}
                <div className="mb-4">
                  <label className="block text-zinc-400 text-sm mb-2">
                    Bukti Transfer
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-700 transition-colors bg-zinc-900">
                    {paymentProof ? (
                      <Image
                        src={paymentProof}
                        alt="Payment proof"
                        width={120}
                        height={120}
                        className="object-contain rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-10 h-10 text-zinc-600 mb-2" />
                        <p className="text-zinc-500 text-sm">
                          {isUploading ? 'Mengupload...' : 'Klik untuk upload'}
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                  <p className="text-amber-400 text-sm">
                    Mohon ditunggu ya, pembayaran akan di-ACC manual oleh admin setelah transfer masuk.
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!telegramUsername || !paymentProof}
                  className="w-full py-4 rounded-xl bg-white text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-200 transition-colors"
                >
                  Kirim Bukti Pembayaran
                </button>

                {/* Telegram shortcut */}
                <a
                  href="https://t.me/RENan_notdev1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full mt-4 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Hubungi via Telegram
                </a>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white flex items-center justify-center">
                  <Check className="w-10 h-10 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Berhasil!</h3>
                <p className="text-zinc-500 mb-6">
                  Bukti pembayaran telah dikirim. Mohon tunggu konfirmasi dari admin.
                </p>
                <a
                  href="https://t.me/RENan_notdev1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Chat Admin di Telegram
                </a>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

