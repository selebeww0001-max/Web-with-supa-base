'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product, useStore } from '@/lib/store'
import { X, Upload, ExternalLink, Check, ZoomIn, Loader2, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import QRCode from 'qrcode'

interface CheckoutModalProps {
  product: Product
  onClose: () => void
}

const MARKUP = 1.13 // 13% markup

// Paket FF (Basic) sampai 1080 DM
const FF_PACKAGES = [
  { diamonds: 5, label: '5 DM', code: 'FF5-S13', price: 853 },
  { diamonds: 10, label: '10 DM', code: 'FF10-S13', price: 1696 },
  { diamonds: 12, label: '12 DM', code: 'FF12-S13', price: 1861 },
  { diamonds: 15, label: '15 DM', code: 'FF15-S13', price: 2536 },
  { diamonds: 20, label: '20 DM', code: 'FF20-S13', price: 3378 },
  { diamonds: 25, label: '25 DM', code: 'FF25-S13', price: 4222 },
  { diamonds: 30, label: '30 DM', code: 'FF30-S13', price: 5066 },
  { diamonds: 40, label: '40 DM', code: 'FF40-S13', price: 6386 },
  { diamonds: 50, label: '50 DM', code: 'FF50-S13', price: 6663 },
  { diamonds: 55, label: '55 DM', code: 'FF55-S13', price: 7590 },
  { diamonds: 60, label: '60 DM', code: 'FF60-S13', price: 8410 },
  { diamonds: 70, label: '70 DM', code: 'FF70-S13', price: 9220 },
  { diamonds: 0, label: 'Level Up Pass', code: 'FFLUP-S13', price: 9235 },
  { diamonds: 75, label: '75 DM', code: 'FF75-S13', price: 10220 },
  { diamonds: 80, label: '80 DM', code: 'FF80-S13', price: 11149 },
  { diamonds: 90, label: '90 DM', code: 'FF90-S13', price: 12603 },
  { diamonds: 100, label: '100 DM', code: 'FF100-S13', price: 13577 },
  { diamonds: 120, label: '120 DM', code: 'FF120-S13', price: 15864 },
  { diamonds: 0, label: 'Member Mingguan Lite', code: 'FFMML-S13', price: 16933 },
  { diamonds: 130, label: '130 DM', code: 'FF130-S13', price: 17667 },
  { diamonds: 140, label: '140 DM', code: 'FF140-S13', price: 18295 },
  { diamonds: 150, label: '150 DM', code: 'FF150-S13', price: 19273 },
  { diamonds: 160, label: '160 DM', code: 'FF160-S13', price: 20967 },
  { diamonds: 170, label: '170 DM', code: 'FF170-S13', price: 22401 },
  { diamonds: 180, label: '180 DM', code: 'FF180-S13', price: 24405 },
  { diamonds: 200, label: '200 DM', code: 'FF200-S13', price: 27362 },
  { diamonds: 210, label: '210 DM', code: 'FF210-S13', price: 27870 },
  { diamonds: 0, label: 'Member Mingguan', code: 'FFMM-S13', price: 28259 },
  { diamonds: 250, label: '250 DM', code: 'FF250-S13', price: 32783 },
  { diamonds: 280, label: '280 DM', code: 'FF280-S13', price: 37172 },
  { diamonds: 300, label: '300 DM', code: 'FF300-S13', price: 39787 },
  { diamonds: 355, label: '355 DM', code: 'FF355-S13', price: 45151 },
  { diamonds: 420, label: '420 DM', code: 'FF420-S13', price: 55597 },
  { diamonds: 500, label: '500 DM', code: 'FF500-S13', price: 65960 },
  { diamonds: 520, label: '520 DM', code: 'FF520-S13', price: 69255 },
  { diamonds: 600, label: '600 DM', code: 'FF600-S13', price: 79005 },
  { diamonds: 0, label: 'Member Bulanan', code: 'FFMB-S13', price: 84727 },
  { diamonds: 720, label: '720 DM', code: 'FF720-S13', price: 92892 },
  { diamonds: 800, label: '800 DM', code: 'FF800-S13', price: 103542 },
  { diamonds: 860, label: '860 DM', code: 'FF860-S13', price: 111465 },
  { diamonds: 1000, label: '1.000 DM', code: 'FF1000-S13', price: 130038 },
  { diamonds: 1080, label: '1.080 DM', code: 'FF1080-S13', price: 139246 },
]

// Paket FF Max sampai 1080 DM
const FFMAX_PACKAGES = [
  { diamonds: 5, label: '5 DM', code: 'FFMAX5-S24', price: 928 },
  { diamonds: 10, label: '10 DM', code: 'FFMAX10-S24', price: 1856 },
  { diamonds: 50, label: '50 DM', code: 'FFMAX50-S24', price: 7426 },
  { diamonds: 55, label: '55 DM', code: 'FFMAX55-S24', price: 8354 },
  { diamonds: 70, label: '70 DM', code: 'FFMAX70-S24', price: 9231 },
  { diamonds: 80, label: '80 DM', code: 'FFMAX80-S24', price: 11138 },
  { diamonds: 100, label: '100 DM', code: 'FFMAX100-S24', price: 14851 },
  { diamonds: 120, label: '120 DM', code: 'FFMAX120-S24', price: 16708 },
  { diamonds: 130, label: '130 DM', code: 'FFMAX130-S24', price: 18564 },
  { diamonds: 140, label: '140 DM', code: 'FFMAX140-S24', price: 18462 },
  { diamonds: 150, label: '150 DM', code: 'FFMAX150-S24', price: 20420 },
  { diamonds: 190, label: '190 DM', code: 'FFMAX190-S24', price: 25990 },
  { diamonds: 200, label: '200 DM', code: 'FFMAX200-S24', price: 27846 },
  { diamonds: 210, label: '210 DM', code: 'FFMAX210-S24', price: 27846 },
  { diamonds: 0, label: 'Member Mingguan', code: 'FFMAXMINGGUAN-S24', price: 28236 },
  { diamonds: 280, label: '280 DM', code: 'FFMAX280-S24', price: 37128 },
  { diamonds: 0, label: '🎫 BP Card', code: 'FFMBPC-S24', price: 42353 },
  { diamonds: 355, label: '355 DM', code: 'FFMAX355-S24', price: 46410 },
  { diamonds: 420, label: '420 DM', code: 'FFMAX420-S24', price: 55692 },
  { diamonds: 500, label: '500 DM', code: 'FFMAX500-S24', price: 65902 },
  { diamonds: 510, label: '510 DM', code: 'FFMAX510-S24', price: 67759 },
  { diamonds: 565, label: '565 DM', code: 'FFMAX565-S24', price: 74256 },
  { diamonds: 635, label: '635 DM', code: 'FFMAX635-S24', price: 83538 },
  { diamonds: 0, label: 'Member Bulanan', code: 'FFMAXBULANAN-S24', price: 84706 },
  { diamonds: 720, label: '720 DM', code: 'FFMAX720-S24', price: 92820 },
  { diamonds: 800, label: '800 DM', code: 'FFMAX800-S24', price: 103958 },
  { diamonds: 860, label: '860 DM', code: 'FFMAX860-S24', price: 111384 },
  { diamonds: 1000, label: '1.000 DM', code: 'FFMAX1000-S24', price: 129948 },
  { diamonds: 1080, label: '1.080 DM', code: 'FFMAX1080-S24', price: 140158 },
]

export function CheckoutModal({ product, onClose }: CheckoutModalProps) {
  const { paymentMethods, addOrder, fetchAll } = useStore()
  const isTopupFF = product.productType === 'topup_ff'

  // Steps: ff_id | select_package | payment | qris_waiting | upload | success
  const [step, setStep] = useState<string>(isTopupFF ? 'ff_id' : 'payment')
  
  // FF State
  const [ffId, setFfId] = useState('')
  const [ffZone, setFfZone] = useState('')
  const [ffName, setFfName] = useState('')
  const [checkingFF, setCheckingFF] = useState(false)
  const [ffError, setFfError] = useState('')
  const [selectedPackage, setSelectedPackage] = useState<typeof FF_PACKAGES[0] | null>(null)
  const [ffVersion, setFfVersion] = useState<'ff' | 'ffmax'>('ff')

  // Regular payment state
  const [selectedPayment, setSelectedPayment] = useState<typeof paymentMethods[0] | null>(null)
  const [telegramUsername, setTelegramUsername] = useState('')
  const [paymentProof, setPaymentProof] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  // QRIS state
  const [qrisData, setQrisData] = useState<string>('')
  const [qrisImage, setQrisImage] = useState<string>('')
  const [orderId, setOrderId] = useState<string>('')
  const [qrisExpired, setQrisExpired] = useState<string>('')
  const [checkingPayment, setCheckingPayment] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [generatingQris, setGeneratingQris] = useState(false)
  const [dbOrderId, setDbOrderId] = useState<string>('')
  
  // Zoom
  const [zoomImage, setZoomImage] = useState<string | null>(null)
  
  const checkInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchAll()
    return () => { if (checkInterval.current) clearInterval(checkInterval.current) }
  }, [])

  // Cek nama player FF
  const checkFFId = async () => {
    if (!ffId.trim()) { setFfError('Masukkan ID FF kamu'); return }
    setCheckingFF(true)
    setFfError('')
    setFfName('')
    try {
      const res = await fetch('/api/check-ff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: ffId, zoneId: ffZone }),
      })
      const data = await res.json()
      if (data.data?.name || data.username) {
        setFfName(data.data?.name || data.username)
        setFfError('')
      } else {
        setFfError('ID tidak ditemukan, cek kembali')
      }
    } catch {
      setFfError('Gagal cek ID, coba lagi')
    } finally {
      setCheckingFF(false)
    }
  }

  // Generate QRIS
  const generateQRIS = async (pkg: typeof FF_PACKAGES[0] | null) => {
    const amount = pkg ? Math.ceil(pkg.price * MARKUP) : product.price
    setPaymentAmount(amount)
    setGeneratingQris(true)
    
    const newOrderId = `ORD-${Date.now()}`
    setOrderId(newOrderId)

    try {
      // Simpan order ke DB dulu
      const savedOrderId = await addOrder({
        productId: product.id,
        productName: pkg ? `${product.name} - ${pkg.label}` : product.name,
        telegramUsername: '',
        paymentProof: '',
        paymentMethod: 'QRIS Otomatis',
        ffId: ffId,
        ffName: ffName,
        diamondAmount: pkg?.diamonds || 0,
        pakasirOrderId: newOrderId,
        pakasirStatus: 'waiting',
        topupStatus: 'pending',
        vipaymentCode: pkg?.code || product.vipaymentCode,
      })
      setDbOrderId(savedOrderId)

      // Generate QRIS via Pakasir
      const res = await fetch('/api/create-qris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: newOrderId, amount }),
      })
      const data = await res.json()
      
      if (data.payment?.payment_number) {
        setQrisData(data.payment.payment_number)
        setQrisExpired(data.payment.expired_at)
        // Generate QR image dari string QRIS
        const qrImg = await QRCode.toDataURL(data.payment.payment_number, { width: 300, margin: 2 })
        setQrisImage(qrImg)
        setStep('qris_waiting')
        startPaymentCheck(newOrderId, amount)
      } else {
        alert('Gagal generate QRIS, coba lagi')
      }
    } catch {
      alert('Gagal generate QRIS')
    } finally {
      setGeneratingQris(false)
    }
  }

  // Auto cek status pembayaran tiap 10 detik
  const startPaymentCheck = (oid: string, amount: number) => {
    if (checkInterval.current) clearInterval(checkInterval.current)
    checkInterval.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/check-payment?order_id=${oid}&amount=${amount}`)
        const data = await res.json()
        if (data.transaction?.status === 'completed') {
          clearInterval(checkInterval.current!)
          setStep('success')
        }
      } catch {}
    }, 10000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onloadend = () => { setPaymentProof(reader.result as string); setIsUploading(false) }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitManual = async () => {
    if (selectedPayment && telegramUsername && paymentProof) {
      await addOrder({
        productId: product.id,
        productName: product.name,
        telegramUsername,
        paymentProof,
        paymentMethod: selectedPayment.name,
      })
      setStep('success')
    }
  }

  return (
    <>
      {/* Zoom overlay */}
      <AnimatePresence>
        {zoomImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setZoomImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 cursor-zoom-out p-4">
            <motion.img initial={{ scale: 0.8 }} animate={{ scale: 1 }} src={zoomImage} className="max-w-full max-h-full rounded-xl object-contain" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            
            {/* Header */}
            <div className="relative p-5 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {isTopupFF ? '⚡ Top Up Free Fire' : 'Checkout'}
                </h2>
                {isTopupFF && <p className="text-xs text-zinc-500">Pembayaran otomatis via QRIS</p>}
              </div>
              <button onClick={onClose} className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors">
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            <div className="p-5 max-h-[75vh] overflow-y-auto bg-zinc-950 space-y-4">
              
              {/* Product Info Card */}
              <div className="flex gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                {product.image ? (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 cursor-zoom-in group"
                    onClick={() => setZoomImage(product.image)}>
                    <Image src={product.image} alt={product.name} width={64} height={64} className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ZoomIn className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0 text-2xl">🎮</div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold">{product.name}</h3>
                  <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">{product.description}</p>
                  {!isTopupFF && <p className="text-white font-bold mt-1">Rp {product.price.toLocaleString('id-ID')}</p>}
                  {isTopupFF && selectedPackage && (
                    <p className="text-white font-bold mt-1">Rp {Math.ceil(selectedPackage.price * MARKUP).toLocaleString('id-ID')} · {selectedPackage.label}</p>
                  )}
                </div>
              </div>

              {/* ===== STEP: FF ID ===== */}
              {step === 'ff_id' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <h3 className="text-white font-semibold">Masukkan ID Free Fire</h3>
                  
                  {/* Pilih versi FF */}
                  <div className="flex gap-2">
                    <button onClick={() => setFfVersion('ff')}
                      className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${ffVersion === 'ff' ? 'border-white bg-zinc-800 text-white' : 'border-zinc-700 text-zinc-500'}`}>
                      🎮 Free Fire
                    </button>
                    <button onClick={() => setFfVersion('ffmax')}
                      className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${ffVersion === 'ffmax' ? 'border-yellow-400 bg-yellow-500/10 text-yellow-400' : 'border-zinc-700 text-zinc-500'}`}>
                      ⚡ FF Max
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">ID Player FF <span className="text-red-400">*</span></label>
                    <input type="text" value={ffId}
                      onChange={(e) => { setFfId(e.target.value); setFfName(''); setFfError('') }}
                      placeholder="Contoh: 123456789"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">Zone ID <span className="text-zinc-600">(jika ada)</span></label>
                    <input type="text" value={ffZone}
                      onChange={(e) => setFfZone(e.target.value)}
                      placeholder="Contoh: 1234 (kosongkan jika tidak tahu)"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none" />
                  </div>

                  <button onClick={checkFFId} disabled={checkingFF || !ffId.trim()}
                    className="w-full py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {checkingFF ? <><Loader2 className="w-4 h-4 animate-spin" /> Mengecek...</> : '🔍 Cek Nama Player'}
                  </button>

                  {ffError && <p className="text-red-400 text-sm text-center">{ffError}</p>}

                  {ffName && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
                      <p className="text-zinc-400 text-sm">Nama Player</p>
                      <p className="text-green-400 font-bold text-xl mt-1">{ffName}</p>
                      <p className="text-zinc-500 text-xs mt-1">ID: {ffId}{ffZone ? ` · Zone: ${ffZone}` : ''}</p>
                    </motion.div>
                  )}

                  <button onClick={() => setStep('select_package')} disabled={!ffName}
                    className="w-full py-4 rounded-xl bg-white text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-200 transition-colors">
                    Lanjut Pilih Paket →
                  </button>
                </motion.div>
              )}

              {/* ===== STEP: SELECT PACKAGE ===== */}
              {step === 'select_package' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Pilih Paket Diamond</h3>
                    <button onClick={() => setStep('ff_id')} className="text-zinc-500 text-sm hover:text-zinc-300">← Ganti ID</button>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <p className="text-zinc-400 text-xs">Player: <span className="text-white font-bold">{ffName}</span></p>
                    <p className="text-zinc-400 text-xs">ID: {ffId}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {(ffVersion === 'ffmax' ? FFMAX_PACKAGES : FF_PACKAGES).map((pkg) => (
                      <button key={pkg.code} onClick={() => setSelectedPackage(pkg)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          selectedPackage?.code === pkg.code
                            ? 'border-white bg-zinc-800 shadow-lg shadow-white/10'
                            : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'
                        }`}>
                        <p className="text-white font-bold text-sm">{pkg.diamonds > 0 ? '💎' : '🎫'}</p>
                        <p className="text-white text-xs font-semibold mt-1">{pkg.label}</p>
                        <p className="text-green-400 text-xs font-bold mt-0.5">Rp {Math.ceil(pkg.price * MARKUP).toLocaleString('id-ID')}</p>
                      </button>
                    ))}
                  </div>

                  <button onClick={() => selectedPackage && generateQRIS(selectedPackage)}
                    disabled={!selectedPackage || generatingQris}
                    className="w-full py-4 rounded-xl bg-white text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                    {generatingQris ? <><Loader2 className="w-4 h-4 animate-spin" /> Membuat QRIS...</> : '⚡ Bayar Sekarang'}
                  </button>
                </motion.div>
              )}

              {/* ===== STEP: QRIS WAITING ===== */}
              {step === 'qris_waiting' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-white font-semibold">Scan QRIS untuk Bayar</h3>
                    <p className="text-zinc-500 text-sm mt-1">Total: <span className="text-white font-bold">Rp {paymentAmount.toLocaleString('id-ID')}</span></p>
                  </div>

                  {qrisImage && (
                    <div className="flex justify-center cursor-zoom-in" onClick={() => setZoomImage(qrisImage)}>
                      <div className="relative group bg-white p-3 rounded-2xl">
                        <Image src={qrisImage} alt="QRIS" width={220} height={220} className="rounded-lg" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                          <ZoomIn className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menunggu pembayaran... (auto cek tiap 10 detik)</span>
                  </div>

                  {qrisExpired && (
                    <p className="text-center text-zinc-600 text-xs">
                      Expired: {new Date(qrisExpired).toLocaleTimeString('id-ID')}
                    </p>
                  )}

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-amber-400 text-xs text-center">
                      Setelah bayar, diamond akan otomatis dikirim ke ID FF kamu. Jangan tutup halaman ini!
                    </p>
                  </div>

                  <button onClick={() => {
                    setCheckingPayment(true)
                    fetch(`/api/check-payment?order_id=${orderId}&amount=${paymentAmount}`)
                      .then(r => r.json())
                      .then(d => {
                        if (d.transaction?.status === 'completed') setStep('success')
                        else alert('Pembayaran belum diterima')
                      })
                      .finally(() => setCheckingPayment(false))
                  }} disabled={checkingPayment}
                    className="w-full py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                    <RefreshCw className={`w-4 h-4 ${checkingPayment ? 'animate-spin' : ''}`} />
                    Cek Status Manual
                  </button>
                </motion.div>
              )}

              {/* ===== STEP: PAYMENT (Regular) ===== */}
              {step === 'payment' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                  <h3 className="text-white font-semibold">Pilih Metode Pembayaran</h3>
                  {paymentMethods.map((method) => (
                    <button key={method.id} onClick={() => setSelectedPayment(method)}
                      className={`w-full p-4 rounded-xl border transition-all text-left ${
                        selectedPayment?.id === method.id ? 'border-white bg-zinc-800' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                      }`}>
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
                        <div className="mt-3 flex justify-center cursor-zoom-in" onClick={(e) => { e.stopPropagation(); setZoomImage(method.qrisImage!) }}>
                          <Image src={method.qrisImage} alt="QRIS" width={180} height={180} className="rounded-lg" />
                        </div>
                      )}
                    </button>
                  ))}
                  <button onClick={() => selectedPayment && setStep('upload')} disabled={!selectedPayment}
                    className="w-full py-4 rounded-xl bg-white text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-200 transition-colors">
                    Lanjutkan →
                  </button>
                </motion.div>
              )}

              {/* ===== STEP: UPLOAD (Regular) ===== */}
              {step === 'upload' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <h3 className="text-white font-semibold">Upload Bukti Pembayaran</h3>
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                    <p className="text-zinc-500 text-sm">Transfer ke:</p>
                    <p className="text-white font-bold">{selectedPayment?.name}</p>
                    <p className="text-zinc-300">{selectedPayment?.value}</p>
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">Username Telegram</label>
                    <input type="text" value={telegramUsername} onChange={(e) => setTelegramUsername(e.target.value)}
                      placeholder="@username"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none" />
                  </div>
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-700 transition-colors bg-zinc-900">
                    {paymentProof ? (
                      <Image src={paymentProof} alt="Bukti" width={100} height={100} className="object-contain rounded-lg cursor-zoom-in"
                        onClick={(e) => { e.preventDefault(); setZoomImage(paymentProof) }} />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-zinc-600 mb-2" />
                        <p className="text-zinc-500 text-sm">{isUploading ? 'Mengupload...' : 'Klik untuk upload bukti'}</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-amber-400 text-xs">Pembayaran akan dikonfirmasi manual oleh admin.</p>
                  </div>
                  <button onClick={handleSubmitManual} disabled={!telegramUsername || !paymentProof}
                    className="w-full py-4 rounded-xl bg-white text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-200 transition-colors">
                    Kirim Bukti Pembayaran
                  </button>
                </motion.div>
              )}

              {/* ===== STEP: SUCCESS ===== */}
              {step === 'success' && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                    <Check className="w-10 h-10 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {isTopupFF ? '⚡ Top Up Berhasil!' : 'Pesanan Dikirim!'}
                    </h3>
                    <p className="text-zinc-500 mt-2 text-sm">
                      {isTopupFF
                        ? `Diamond sedang diproses ke ID FF: ${ffId}. Biasanya selesai dalam 1-5 menit.`
                        : 'Bukti pembayaran diterima. Mohon tunggu konfirmasi admin.'}
                    </p>
                  </div>
                  <a href="https://t.me/RENan_notdev1" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    Chat Admin Telegram
                  </a>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

