import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { userId, zoneId } = await req.json()

  // Coba beberapa region FF Indonesia
  const regions = ['ID', 'SG', 'ME']
  
  for (const region of regions) {
    try {
      const res = await fetch(
        `https://free-ff-api-src-5plp.onrender.com/api/v1/account?region=${region}&uid=${userId}`,
        { headers: { 'Accept': 'application/json' }, next: { revalidate: 0 } }
      )
      const data = await res.json()
      
      // Cek apakah ada nama player
      const name = data?.basicInfo?.nickname || data?.nickname || data?.name
      if (name) {
        return NextResponse.json({ success: true, data: { name, region, uid: userId } })
      }
    } catch {}
  }

  return NextResponse.json({ success: false, message: 'ID tidak ditemukan' })
}

