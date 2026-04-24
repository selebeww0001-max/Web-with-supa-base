import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const MEMBER_ID = 'Renjir'
const API_KEY = 'fseuLObpxvk1PYgP4istpilWhIpme06JEssTidwRttW96E6taxVJreshNWviCe0r'

function generateSignature() {
  return crypto.createHash('md5').update(MEMBER_ID + API_KEY).digest('hex')
}

export async function POST(req: NextRequest) {
  const { userId, ffVersion } = await req.json()

  if (!userId) {
    return NextResponse.json({ success: false, message: 'ID tidak boleh kosong' })
  }

  try {
    const res = await fetch('https://api.vip-reseller.co.id/api/game-feature/check-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        member_id: MEMBER_ID,
        signature: generateSignature(),
        game: 'free-fire',
        user_id: userId,
      }),
      signal: AbortSignal.timeout(10000),
    })

    const data = await res.json()
    
    if (data?.data?.name || data?.data?.username || data?.username || data?.name) {
      const name = data?.data?.name || data?.data?.username || data?.username || data?.name
      return NextResponse.json({ success: true, data: { name, uid: userId } })
    }

    return NextResponse.json({ success: false, message: 'ID tidak ditemukan. Pastikan ID benar.' })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Gagal cek ID, coba lagi.' })
  }
}

