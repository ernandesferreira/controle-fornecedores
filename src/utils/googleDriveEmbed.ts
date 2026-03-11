/**
 * Converts a Google Drive / Google Docs sharing URL into an embeddable preview URL.
 * Returns null if the URL cannot be embedded (e.g. folders or unknown hosts).
 */
export function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)

    // https://drive.google.com/file/d/{ID}/view  →  preview
    const fileMatch = u.pathname.match(/\/file\/d\/([^/]+)/)
    if (fileMatch) {
      return `https://drive.google.com/file/d/${fileMatch[1]}/preview`
    }

    // https://drive.google.com/open?id={ID}
    const openId = u.hostname === 'drive.google.com' && u.searchParams.get('id')
    if (openId) {
      return `https://drive.google.com/file/d/${openId}/preview`
    }

    // https://docs.google.com/document/d/{ID}/...
    const docMatch = u.pathname.match(/\/document\/d\/([^/]+)/)
    if (docMatch) {
      return `https://docs.google.com/document/d/${docMatch[1]}/preview`
    }

    // https://docs.google.com/spreadsheets/d/{ID}/...
    const sheetMatch = u.pathname.match(/\/spreadsheets\/d\/([^/]+)/)
    if (sheetMatch) {
      return `https://docs.google.com/spreadsheets/d/${sheetMatch[1]}/preview`
    }

    // https://docs.google.com/presentation/d/{ID}/...
    const slideMatch = u.pathname.match(/\/presentation\/d\/([^/]+)/)
    if (slideMatch) {
      return `https://docs.google.com/presentation/d/${slideMatch[1]}/embed`
    }

    return null
  } catch {
    return null
  }
}

export function isGoogleUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname
    return host === 'drive.google.com' || host === 'docs.google.com'
  } catch {
    return false
  }
}

/** Returns true if the URL points to a Google Drive *folder*. */
export function isFolderUrl(url: string): boolean {
  try {
    return /\/folders\//.test(new URL(url).pathname)
  } catch {
    return false
  }
}

/** Extracts the folder ID from a Google Drive folder URL, or null if not found. */
export function extractFolderId(url: string): string | null {
  try {
    const match = new URL(url).pathname.match(/\/folders\/([a-zA-Z0-9_-]+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}
