import { NextRequest, NextResponse } from 'next/server'

type RouteContext = {
  params: Promise<{ id: string }>
}

function responseFromUpstream(upstream: Response) {
  const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream'
  const contentLength = upstream.headers.get('content-length')

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      'content-type': contentType,
      ...(contentLength ? { 'content-length': contentLength } : {}),
      'cache-control': 'public, max-age=300, s-maxage=300',
    },
  })
}

async function tryPublicDriveEndpoints(id: string) {
  const publicUrls = [
    `https://drive.google.com/uc?export=view&id=${encodeURIComponent(id)}`,
    `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w2000`,
  ]

  for (const publicUrl of publicUrls) {
    const res = await fetch(publicUrl, { next: { revalidate: 300 } })
    if (res.ok) {
      return responseFromUpstream(res)
    }
  }

  return null
}

export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY

  if (!id) {
    return NextResponse.json({ error: 'ID do arquivo ausente.' }, { status: 400 })
  }

  // If API key is missing, still try public Drive endpoints.
  if (!apiKey) {
    const fallback = await tryPublicDriveEndpoints(id)
    if (fallback) return fallback
    return NextResponse.json(
      { error: 'GOOGLE_DRIVE_API_KEY não configurada no servidor.' },
      { status: 500 },
    )
  }

  const sourceUrl =
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}` +
    `?alt=media&key=${encodeURIComponent(apiKey)}&supportsAllDrives=true`

  try {
    const upstream = await fetch(sourceUrl, { next: { revalidate: 300 } })

    if (!upstream.ok) {
      if (upstream.status === 401 || upstream.status === 403 || upstream.status === 404) {
        const fallback = await tryPublicDriveEndpoints(id)
        if (fallback) return fallback
      }

      const maybeJson = await upstream.json().catch(() => ({}))
      const message = maybeJson?.error?.message ?? 'Falha ao buscar imagem no Google Drive.'
      return NextResponse.json({ error: message }, { status: upstream.status })
    }

    return responseFromUpstream(upstream)
  } catch {
    const fallback = await tryPublicDriveEndpoints(id)
    if (fallback) return fallback
    return NextResponse.json({ error: 'Falha de rede ao buscar imagem no Drive.' }, { status: 502 })
  }
}
