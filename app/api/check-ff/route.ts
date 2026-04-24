import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { userId, zoneId } = await req.json()

  if (!userId) {
    return NextResponse.json({ success: false, message: 'ID tidak boleh kosong' })
  }

  // Pakai endpoint resmi Garena (sama yang dipakai Codashop, UniPin, dll)
  const regions = ['ID', 'SG', 'ME', 'TH', 'VN']
  
  for (const region of regions) {
    try {
      const params = new URLSearchParams({
        app_id: '100067',
        login: userId,
        server_name: region === 'ID' ? 'garena_id' : region === 'SG' ? 'garena_sg' : `garena_${region.toLowerCase()}`,
      })
      
      const res = await fetch(
        `https://shop.garena.my/api/auth/player_id_login?${params}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Origin': 'https://shop.garena.my',
            'Referer': 'https://shop.garena.my/',
          },
          signal: AbortSignal.timeout(8000),
        }
      )
      
      const data = await res.json()
      if (data?.nickname) {
        return NextResponse.json({ success: true, data: { name: data.nickname, region, uid: userId } })
      }
    } catch {}
  }

  // Fallback: coba API publik lain
  try {
    const res = await fetch(
      `https://api.gametools.network/freefire/stats/?playerid=${userId}&platform=pc&server=SG`,
      { signal: AbortSignal.timeout(8000) }
    )
    const data = await res.json()
    if (data?.name) {
      return NextResponse.json({ success: true, data: { name: data.name, uid: userId } })
    }
  } catch {}

  return NextResponse.json({ success: false, message: 'ID tidak ditemukan. Pastikan ID dan region benar.' })
}

