export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ ok: true })
  } catch (e) {
    const err = e as Error
    console.error('DB ERR:', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
