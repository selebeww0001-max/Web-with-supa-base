'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { Star, Quote, Send, Trash2 } from 'lucide-react'

function getTimeAgo(dateString: string) {
  const now = new Date()
  const date = new Date(dateString)
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Hari ini'
  if (diffInDays === 1) return 'Kemarin'
  if (diffInDays < 7) return `${diffInDays} hari lalu`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu lalu`
  return `${Math.floor(diffInDays / 30)} bulan lalu`
}

export function ReviewsSection() {
  const { reviews, addReview, deleteReview, isModeratorMode } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && comment.trim()) {
      addReview({ name, rating, comment })
      setName('')
      setRating(5)
      setComment('')
      setShowForm(false)
    }
  }

  return (
    <section className="py-20 px-4 bg-zinc-950/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ulasan Pelanggan
          </h2>
          <p className="text-zinc-500 max-w-2xl mx-auto mb-6">
            Apa kata mereka yang sudah berbelanja di Ren Grocery
          </p>
          
          {/* Add review button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-colors"
          >
            {showForm ? 'Tutup Form' : 'Tulis Ulasan'}
          </button>
        </motion.div>

        {/* Review Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto mb-12 p-6 rounded-2xl bg-zinc-900 border border-zinc-800"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Tulis Ulasan Kamu</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Nama</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama kamu"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                  required
                />
              </div>
              
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 text-sm mb-2">Ulasan</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ceritakan pengalaman kamu..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-colors"
              >
                <Send className="w-4 h-4" />
                Kirim Ulasan
              </button>
            </form>
          </motion.div>
        )}

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors group"
            >
              {/* Delete button for moderator */}
              {isModeratorMode && (
                <button
                  onClick={() => deleteReview(review.id)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* Quote icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-zinc-800 group-hover:text-zinc-700 transition-colors" />
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                &ldquo;{review.comment}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                    <span className="text-white font-semibold text-sm">
                      {review.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{review.name}</p>
                    <p className="text-zinc-600 text-xs">{getTimeAgo(review.createdAt)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <Quote className="w-16 h-16 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-500">Belum ada ulasan. Jadilah yang pertama!</p>
          </div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '1000+', label: 'Transaksi Sukses' },
            { value: '4.9', label: 'Rating Rata-rata' },
            { value: '500+', label: 'Pelanggan Aktif' },
            { value: '24/7', label: 'Support Online' },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-zinc-900 border border-zinc-800"
            >
              <p className="text-2xl md:text-3xl font-bold text-white">
                {stat.value}
              </p>
              <p className="text-zinc-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
