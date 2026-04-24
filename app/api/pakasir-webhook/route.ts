import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  'https://dwkyawthyweanbfcrfrd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3a3lhd3RoeXdlYW5iZmNyZnJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MzcxMDUsImV4cCI6MjA5MjQxMzEwNX0.6Y-V9mFSMcNy349dRUFUkiHJ_MtqRwoSNI_SojJFGnw'
)

const MEMBER_ID = 'Renjir'
const API_KEY = 'fseuLObpxvk1PYgP4istpilWhIpme06JEssTidwRttW96E6taxVJreshNWviCe0r'

function generateSignature() {
  return crypto.createHash('md5').update(MEMBER_ID + API_KEY).digest('hex')
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { amount, order_id, status } = body

  if (status !== 'completed') {
    return NextResponse.json({ ok: true })
  }

  // Cari order berdasarkan pakasir_order_id
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('pakasir_order_id', order_id)
    .single()

  if (!order) return NextResponse.json({ ok: false, message: 'Order not found' })

  // Verifikasi amount
  if (order.amount && Number(order.amount) !== Number(amount)) {
    return NextResponse.json({ ok: false, message: 'Amount mismatch' })
  }

  // Update order pakasir_status = completed
  await supabase.from('orders').update({ pakasir_status: 'completed', status: 'approved' }).eq('id', order.id)

  // Cari produk untuk dapat vipayment_code
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', order.product_id)
    .single()

  if (!product || product.product_type !== 'topup_ff') {
    return NextResponse.json({ ok: true, message: 'Regular product, no topup needed' })
  }

  // Lakukan top up otomatis via Vipayment
  try {
    const topupRes = await fetch('https://api.vip-reseller.co.id/api/game/top-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        member_id: MEMBER_ID,
        signature: generateSignature(),
        service: product.vipayment_code,
        data_no: order.ff_id,
        data_zone: order.ff_zone || '',
        order_id: `TOPUP-${order.id}`,
      }),
    })
    const topupData = await topupRes.json()
    
    const topupStatus = topupData.data?.status === 'success' ? 'success' : 'processing'
    await supabase.from('orders').update({ topup_status: topupStatus }).eq('id', order.id)
  } catch {
    await supabase.from('orders').update({ topup_status: 'failed' }).eq('id', order.id)
  }

  return NextResponse.json({ ok: true })
}

