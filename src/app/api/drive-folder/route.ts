import { NextRequest, NextResponse } from 'next/server'

export type DriveFile = {
  id: string
  name: string
  mimeType: string
}

type DriveListResponse = {
  files?: DriveFile[]
  nextPageToken?: string
}

const DRIVE_FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder'
const MAX_TRAVERSED_FOLDERS = 2000
const MAX_RETURNED_IMAGES = 3000

const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/svg+xml',
]

async function listFolderItems(folderId: string, apiKey: string): Promise<DriveFile[]> {
  const items: DriveFile[] = []
  let pageToken: string | undefined

  do {
    const q = encodeURIComponent(`'${folderId}' in parents and trashed = false`)
    const fields = encodeURIComponent('files(id,name,mimeType),nextPageToken')
    const pageTokenParam = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''
    const driveUrl =
      `https://www.googleapis.com/drive/v3/files` +
      `?q=${q}&key=${apiKey}&fields=${fields}&pageSize=200&orderBy=name` +
      '&includeItemsFromAllDrives=true&supportsAllDrives=true' +
      pageTokenParam

    const driveRes = await fetch(driveUrl, { next: { revalidate: 300 } })

    if (!driveRes.ok) {
      const body = await driveRes.json().catch(() => ({}))
      const message: string = body?.error?.message ?? 'Erro ao consultar o Google Drive.'
      throw new Error(message)
    }

    const data = (await driveRes.json()) as DriveListResponse
    items.push(...(data.files ?? []))
    pageToken = data.nextPageToken
  } while (pageToken)

  return items
}

export async function GET(req: NextRequest) {
  const folderId = req.nextUrl.searchParams.get('folderId')

  if (!folderId) {
    return NextResponse.json({ error: 'Parâmetro folderId ausente.' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_DRIVE_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'GOOGLE_DRIVE_API_KEY não configurada no servidor.' },
      { status: 500 },
    )
  }

  try {
    const pendingFolderIds: string[] = [folderId]
    const visited = new Set<string>()
    const images: DriveFile[] = []

    while (pendingFolderIds.length > 0) {
      if (visited.size >= MAX_TRAVERSED_FOLDERS) {
        // Fallback: do not block catalog rendering for very deep structures.
        break
      }

      const currentFolderId = pendingFolderIds.shift()
      if (!currentFolderId || visited.has(currentFolderId)) {
        continue
      }

      visited.add(currentFolderId)

      const items = await listFolderItems(currentFolderId, apiKey)

      for (const item of items) {
        if (item.mimeType === DRIVE_FOLDER_MIME_TYPE) {
          if (!visited.has(item.id)) {
            pendingFolderIds.push(item.id)
          }
          continue
        }

        if (IMAGE_MIME_TYPES.includes(item.mimeType)) {
          images.push(item)
          if (images.length >= MAX_RETURNED_IMAGES) {
            return NextResponse.json(images)
          }
        }
      }
    }

    return NextResponse.json(images)
  } catch {
    return NextResponse.json({ error: 'Falha de rede ao acessar o Google Drive.' }, { status: 502 })
  }
}
