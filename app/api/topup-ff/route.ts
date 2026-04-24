import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const MEMBER_ID = 'Renjir'
const API_KEY = 'fseuLObpxvk1PYgP4istpilWhIpme06JEssTidwRttW96E6taxVJreshNWviCe0r'

function generateSignature() {
  return crypto.createHash('md5').update(MEMBER_ID + API_KEY).digest('hex')
}

export async function POST(req: NextRequest) {
  const { orderId, userId, zoneId, vipaymentCode } = await req.json()

  try {
    const res = await fetch('https://api.vip-reseller.co.id/api/game/top-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        member_id: MEMBER_ID,
        signature: generateSignature(),
        service: vipaymentCode,
        data_no: userId,
        data_zone: zoneId || '',
        order_id: orderId,
      }),
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Gagal top up' }, { status: 500 })
  }
}

