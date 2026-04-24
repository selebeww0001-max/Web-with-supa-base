'use client'

import { Product } from '@/lib/store'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface ProductCardProps {
  product: Product
  onClick: () => void
  isModeratorMode?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function ProductCard({ product, onClick, isModeratorMode, onEdit, onDelete }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative group cursor-pointer bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors"
      onClick={onClick}
    >
      {/* Stock badge */}
      <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-zinc-800 rounded-full border border-zinc-700">
        <span className="text-zinc-300 text-xs font-medium">Stok: {product.stock}</span>
      </div>

      {/* FF Badge */}
      {product.productType === 'topup_ff' && (
        <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-yellow-500/20 rounded-full border border-yellow-500/30">
          <span className="text-yellow-400 text-xs font-bold">⚡ Auto</span>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10" />
        {product.image ? (
          <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <span className="text-4xl">{product.productType === 'topup_ff' ? '💎' : '📦'}</span>
          </div>
        )}
      </div>

      {/* Content — tanpa harga */}
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm truncate">{product.name}</h3>
        <p className="text-zinc-500 text-xs line-clamp-2 mt-0.5">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-zinc-400 text-xs">
            {product.productType === 'topup_ff' ? '⚡ QRIS Otomatis' : 'Tap untuk beli'}
          </span>
          <span className="px-2 py-0.5 bg-zinc-800 rounded-full text-zinc-500 text-xs border border-zinc-700">
            Digital
          </span>
        </div>
      </div>

      {/* Moderator controls */}
      {isModeratorMode && (
        <div className="absolute bottom-3 right-3 z-20 flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button onClick={onEdit} className="p-1.5 bg-amber-500/20 rounded-lg border border-amber-500/30 hover:bg-amber-500/30 transition-colors">
            <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={onDelete} className="p-1.5 bg-red-500/20 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-colors">
            <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </motion.div>
  )
}

