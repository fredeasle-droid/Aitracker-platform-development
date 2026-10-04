import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { NextResponse } from 'next/server'

const execFileAsync = promisify(execFile)

export async function GET() {
  const apiKey = process.env.SPORTSGAMEODDS_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'SPORTSGAMEODDS_API_KEY mangler i projektets miljø.' }, { status: 503 })

  try {
    const { stdout, stderr } = await execFileAsync('/vercel/share/v0-project/.venv/bin/python', ['/vercel/share/v0-project/arb_calculator.py'], {
      env: { ...process.env, SPORTSGAMEODDS_KEY: apiKey },
      timeout: 120000,
      maxBuffer: 2 * 1024 * 1024,
    })
    return NextResponse.json({ ok: true, stdout, stderr })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.stderr || error?.message || 'Calculator failed' }, { status: 500 })
  }
}
