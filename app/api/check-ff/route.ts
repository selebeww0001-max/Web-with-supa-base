import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { userId } = await req.json()

  if (!userId) {
    return NextResponse.json({ success: false, message: 'ID tidak boleh kosong' })
  }

  const servers = ['garena_id', 'garena_sg', 'garena_th', 'garena_vn', 'garena_my']

  for (const server of servers) {
    try {
      const res = await fetch('https://shop.garena.my/api/auth/player_id_login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Origin': 'https://shop.garena.my',
          'Referer': 'https://shop.garena.my/',
        },
        body: JSON.stringify({
          app_id: 100067,
          login: userId,
          server_name: server,
        }),
        signal: AbortSignal.timeout(8000),
      })

      const data = await res.json()
      if (data?.nickname) {
        return NextResponse.json({ success: true, data: { name: data.nickname, uid: userId } })
      }
    } catch {}
  }

  return NextResponse.json({ success: false, message: 'ID tidak ditemukan. Pastikan ID benar.' })
}

