'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { MessageCircle, X, Send, ExternalLink, Bot } from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'bot' | 'user'
  content: string
}

const BOT_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['halo', 'hai', 'hi', 'hello', 'selamat'],
    response: 'Halo! Selamat datang di Ren Grocery. Ada yang bisa saya bantu? Silakan tanyakan tentang produk, pembayaran, atau pengiriman.'
  },
  {
    keywords: ['produk', 'jual', 'apa', 'ada'],
    response: 'Kami menjual berbagai produk digital seperti akun premium, voucher, game credits, dan lainnya. Silakan lihat katalog produk di halaman utama!'
  },
  {
    keywords: ['bayar', 'pembayaran', 'transfer', 'cara'],
    response: 'Untuk pembayaran, silakan pilih produk → pilih metode pembayaran (QRIS/Transfer) → upload bukti transfer → tunggu konfirmasi admin.'
  },
  {
    keywords: ['kirim', 'pengiriman', 'lama', 'berapa'],
    response: 'Karena produk kami digital, pengiriman dilakukan secara instan setelah pembayaran dikonfirmasi admin. Biasanya proses 5-30 menit saja!'
  },
  {
    keywords: ['admin', 'komplain', 'masalah', 'keluhan', 'refund'],
    response: 'Untuk keluhan atau masalah dengan pesanan, silakan hubungi admin langsung via Telegram. Klik tombol di bawah untuk menghubungi admin.'
  },
  {
    keywords: ['harga', 'murah', 'mahal', 'diskon'],
    response: 'Harga produk kami sudah sangat kompetitif! Untuk info diskon dan promo, silakan follow akun Telegram kami ya.'
  },
  {
    keywords: ['aman', 'terpercaya', 'penipuan', 'scam'],
    response: 'Ren Grocery adalah toko terpercaya dengan ribuan transaksi sukses. Semua pembayaran diverifikasi manual oleh admin untuk keamanan.'
  },
  {
    keywords: ['terima kasih', 'makasih', 'thanks'],
    response: 'Sama-sama! Senang bisa membantu. Jangan ragu untuk bertanya lagi ya!'
  }
]

export function Chatbot() {
  const { addMessage } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Halo! Saya adalah asisten virtual Ren Grocery. Ada yang bisa saya bantu? Tanyakan tentang produk, pembayaran, atau pengiriman!'
    }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    for (const item of BOT_RESPONSES) {
      if (item.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return item.response
      }
    }
    
    return 'Maaf, saya kurang mengerti pertanyaan Anda. Untuk pertanyaan lebih lanjut, silakan hubungi admin via Telegram. Atau coba tanyakan tentang: produk, pembayaran, pengiriman, atau komplain.'
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    
    // Save message for moderator
    addMessage({
      from: 'Customer',
      content: input
    })

    setInput('')

    // Bot response with delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getBotResponse(input)
      }
      setMessages(prev => [...prev, botResponse])
    }, 800)
  }

  return (
    <>
      {/* Toggle button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center"
      >
        <MessageCircle className="w-6 h-6 text-black" />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-6 z-50 w-80 sm:w-96 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 bg-zinc-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <Bot className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Customer Service</h3>
                    <p className="text-emerald-400 text-xs flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Online
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-zinc-950">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-white text-black'
                        : 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Admin link */}
            <div className="px-4 pb-2 bg-zinc-950">
              <a
                href="https://t.me/RENan_notdev1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Hubungi Admin via Telegram
              </a>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ketik pesan..."
                  className="flex-1 px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  className="p-2 rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
