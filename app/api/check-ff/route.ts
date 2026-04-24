import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { userId } = await req.json()

  if (!userId) {
    return NextResponse.json({ success: false, message: 'ID tidak boleh kosong' })
  }

  // Coba API 1: FF Community (support ID region)
  try {
    const res = await fetch(
      `https://ffinfo-api.vercel.app/api/player?uid=${userId}&region=ID`,
      { signal: AbortSignal.timeout(8000) }
    )
    const data = await res.json()
    const name = data?.basicInfo?.nickname || data?.name
    if (name) return NextResponse.json({ success: true, data: { name, uid: userId } })
  } catch {}

  // Coba API 2: region SG (FF Indonesia juga bisa masuk SG)
  try {
    const res = await fetch(
      `https://ffinfo-api.vercel.app/api/player?uid=${userId}&region=SG`,
      { signal: AbortSignal.timeout(8000) }
    )
    const data = await res.json()
    const name = data?.basicInfo?.nickname || data?.name
    if (name) return NextResponse.json({ success: true, data: { name, uid: userId } })
  } catch {}

  // Coba API 3: alternatif endpoint
  try {
    const res = await fetch(
      `https://free-ff-api-src-5plp.onrender.com/api/v1/account?region=ID&uid=${userId}`,
      { signal: AbortSignal.timeout(10000) }
    )
    const data = await res.json()
    const name = data?.basicInfo?.nickname
    if (name) return NextResponse.json({ success: true, data: { name, uid: userId } })
  } catch {}

  return NextResponse.json({ success: false, message: 'ID tidak ditemukan. Pastikan ID benar dan coba lagi.' })
}

