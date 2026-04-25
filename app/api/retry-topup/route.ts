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

export async function GET(req: NextRequest) {
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('pakasir_status', 'completed')
    .eq('topup_status', 'failed')
    .eq('status', 'approved')

  if (!orders || orders.length === 0) {
    return NextResponse.json({ ok: true, message: 'No failed orders' })
  }

  const results = []

  for (const order of orders) {
    try {
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', order.product_id)
        .single()

      if (!product || product.product_type !== 'topup_ff') continue

      const topupRes = await fetch('https://api.vip-reseller.co.id/api/game/top-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member_id: MEMBER_ID,
          signature: generateSignature(),
          service: order.vipayment_code || product.vipayment_code,
          data_no: order.ff_id,
          data_zone: order.ff_zone || '',
          order_id: `RETRY-${order.id}-${Date.now()}`,
        }),
        signal: AbortSignal.timeout(15000),
      })

      const topupData = await topupRes.json()
      const success = topupData?.data?.status === 'success' || topupData?.status === 'success'

      await supabase
        .from('orders')
        .update({ topup_status: success ? 'success' : 'failed' })
        .eq('id', order.id)

      results.push({ orderId: order.id, success })
    } catch {
      results.push({ orderId: order.id, success: false })
    }
  }

  return NextResponse.json({ ok: true, retried: results.length, results })
}

