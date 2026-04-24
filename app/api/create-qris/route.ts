import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { orderId, amount } = await req.json()
  
  try {
    const res = await fetch('https://app.pakasir.com/api/transactioncreate/qris', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project: 'qris_ren',
        order_id: orderId,
        amount: amount,
        api_key: 'eWYbGw90T4UqSnOVCHYOL1x0H7G5lVab',
      }),
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal buat QRIS' }, { status: 500 })
  }
}

