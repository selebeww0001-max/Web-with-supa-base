import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { userId, zoneId } = await req.json()
  
  try {
    const res = await fetch('https://api.vip-reseller.co.id/api/game-feature/check-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        member_id: 'Renjir',
        signature: generateSignature('Renjir', 'fseuLObpxvk1PYgP4istpilWhIpme06JEssTidwRttW96E6taxVJreshNWviCe0r'),
        game: 'free-fire',
        user_id: userId,
        zone_id: zoneId || '',
      }),
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal cek ID' }, { status: 500 })
  }
}

function generateSignature(memberId: string, apiKey: string) {
  const crypto = require('crypto')
  return crypto.createHash('md5').update(memberId + apiKey).digest('hex')
}

