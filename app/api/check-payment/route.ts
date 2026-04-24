import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get('order_id')
  const amount = searchParams.get('amount')

  try {
    const res = await fetch(
      `https://app.pakasir.com/api/transactiondetail?project=qris_ren&amount=${amount}&order_id=${orderId}&api_key=eWYbGw90T4UqSnOVCHYOL1x0H7G5lVab`
    )
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

