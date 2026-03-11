'use client'

import { useEffect, useState, useCallback } from 'react'

type DriveFile = {
  id: string
  name: string
  mimeType: string
}

const PAGE_SIZE = 60

function thumbUrl(id: string) {
  return `/api/drive-image/${id}`
}

export default function CatalogGallery({ folderId }: { folderId: string }) {
  const [files, setFiles] = useState<DriveFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [lightbox, setLightbox] = useState<DriveFile | null>(null)
  const [lightboxIdx, setLightboxIdx] = useState(0)
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setLoading(true)
    setError(null)
    setCurrentPage(1)
    setLightbox(null)
    setFailedImageIds(new Set())
    fetch(`/api/drive-folder?folderId=${encodeURIComponent(folderId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setFiles(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Falha de rede ao carregar o catálogo.')
        setLoading(false)
      })
  }, [folderId])

  function openLightbox(file: DriveFile, idx: number) {
    setLightbox(file)
    setLightboxIdx(idx)
  }

  const prevImage = useCallback(() => {
    setLightboxIdx((i) => {
      const next = (i - 1 + files.length) % files.length
      setLightbox(files[next])
      return next
    })
  }, [files])

  const nextImage = useCallback(() => {
    setLightboxIdx((i) => {
      const next = (i + 1) % files.length
      setLightbox(files[next])
      return next
    })
  }, [files])

  useEffect(() => {
    if (!lightbox) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prevImage()
      else if (e.key === 'ArrowRight') nextImage()
      else if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, prevImage, nextImage])

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
        <p className="text-sm text-slate-400">Carregando imagens do catálogo…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
        <p className="text-sm font-semibold text-red-700">Erro ao carregar catálogo</p>
        <p className="mt-1 text-xs text-red-500">{error}</p>
        {error.includes('GOOGLE_DRIVE_API_KEY') && (
          <p className="mt-3 text-xs text-slate-500">
            Configure a variável <code className="rounded bg-slate-100 px-1 py-0.5">GOOGLE_DRIVE_API_KEY</code>
            {' '}no <code className="rounded bg-slate-100 px-1 py-0.5">.env.local</code> (local)
            {' '}ou nas variáveis de ambiente do provedor (produção, ex.: Vercel).
          </p>
        )}
      </div>
    )
  }

  if (!files.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
        Nenhuma imagem encontrada nesta pasta do Google Drive.
      </div>
    )
  }

  const totalPages = Math.max(1, Math.ceil(files.length / PAGE_SIZE))
  const startIdx = (currentPage - 1) * PAGE_SIZE
  const endIdx = startIdx + PAGE_SIZE
  const visibleFiles = files.slice(startIdx, endIdx)

  function goToPreviousPage() {
    setCurrentPage((p) => Math.max(1, p - 1))
  }

  function goToNextPage() {
    setCurrentPage((p) => Math.min(totalPages, p + 1))
  }

  function markImageAsFailed(id: string) {
    setFailedImageIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  return (
    <>
      {/* Info bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-400">
          {files.length} imagem(ns) encontrada(s) • Página {currentPage} de {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {visibleFiles.map((file, idx) => (
          <button
            key={file.id}
            onClick={() => openLightbox(file, startIdx + idx)}
            className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {failedImageIds.has(file.id) ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-slate-100 px-2 text-center">
                <p className="text-[11px] font-semibold text-slate-500">Imagem indisponível</p>
                <p className="line-clamp-2 text-[10px] text-slate-400">{file.name}</p>
              </div>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={thumbUrl(file.id)}
                alt={file.name}
                loading="lazy"
                onError={() => markImageAsFailed(file.id)}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
              <p className="truncate p-2 text-[10px] font-medium text-white">{file.name}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightbox(null)}
        >
          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prevImage() }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/25"
            aria-label="Anterior"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {failedImageIds.has(lightbox.id) ? (
              <div className="flex h-[60vh] w-[80vw] max-w-[88vw] flex-col items-center justify-center rounded-xl bg-slate-900/80 px-6 text-center shadow-2xl">
                <p className="text-sm font-semibold text-white">Não foi possível carregar esta imagem</p>
                <p className="mt-1 text-xs text-white/60">{lightbox.name}</p>
              </div>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={lightbox.id}
                src={thumbUrl(lightbox.id)}
                alt={lightbox.name}
                onError={() => markImageAsFailed(lightbox.id)}
                className="max-h-[85vh] max-w-[88vw] rounded-xl object-contain shadow-2xl"
              />
            )}
            <p className="mt-2 text-center text-xs text-white/70">{lightbox.name}</p>
            <div className="mt-2 text-center text-xs text-white/40">
              {lightboxIdx + 1} / {files.length}
            </div>
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); nextImage() }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/25"
            aria-label="Próxima"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/25"
            aria-label="Fechar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Open in Drive */}
          <a
            href={`https://drive.google.com/file/d/${lightbox.id}/view`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-white/25"
          >
            Abrir original
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </>
  )
}
