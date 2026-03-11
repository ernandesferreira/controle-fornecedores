'use client'

import { useState } from 'react'
import { toEmbedUrl, isGoogleUrl, isFolderUrl, extractFolderId } from '@/utils/googleDriveEmbed'
import CatalogGallery from '@/components/CatalogGallery'

type Catalog = {
  id: string
  title: string | null
  url: string
}

export default function CatalogViewer({ catalogs }: { catalogs: Catalog[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  if (!catalogs.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
        Nenhum catálogo cadastrado para este fornecedor.
      </div>
    )
  }

  const active = catalogs[activeIndex]
  const isFolder = isFolderUrl(active.url)
  const folderId = isFolder ? extractFolderId(active.url) : null
  const embedUrl = !isFolder ? toEmbedUrl(active.url) : null

  function handleTabChange(index: number) {
    setActiveIndex(index)
    setIframeLoaded(false)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Tabs — only shown when multiple catalogs */}
      {catalogs.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {catalogs.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => handleTabChange(i)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                i === activeIndex
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.title || `Catálogo ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
        <p className="text-xs text-slate-500">Abertura direta pelo link cadastrado</p>
        <a
          href={active.url}
          target="_blank"
          rel="noreferrer"
          className="cta-primary px-4 py-2 text-xs"
        >
          Abrir catálogo
        </a>
      </div>

      {/* Viewer card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
          <p className="text-sm font-semibold text-slate-800">
            {active.title || 'Catálogo'}
          </p>
          <a
            href={active.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-blue-600"
          >
            Link original
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Embed or fallback */}
        {isFolder && folderId ? (
          /* Google Drive folder → image gallery */
          <div className="p-4">
            <CatalogGallery folderId={folderId} />
          </div>
        ) : embedUrl ? (
          <div className="relative min-h-[500px] bg-slate-100 lg:min-h-[680px]">
            {!iframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-50">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
                <p className="text-xs text-slate-400">Carregando catálogo…</p>
              </div>
            )}
            <iframe
              key={embedUrl}
              src={embedUrl}
              title={active.title || 'Catálogo'}
              className="h-full min-h-[500px] w-full lg:min-h-[680px]"
              allow="autoplay"
              allowFullScreen
              onLoad={() => setIframeLoaded(true)}
            />
          </div>
        ) : isGoogleUrl(active.url) ? (
          /* Google URL that is not a folder and cannot be embedded */
          <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-50">
              <svg className="h-7 w-7 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Não foi possível incorporar</p>
              <p className="mt-1 text-sm text-slate-500">Este link do Google Drive não pode ser exibido diretamente.</p>
            </div>
            <a href={active.url} target="_blank" rel="noreferrer" className="cta-primary px-5 py-2.5 text-sm">
              Abrir no Drive
            </a>
          </div>
        ) : (
          /* Non-Google URL */
          <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <svg className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Link externo</p>
              <p className="mt-1 text-sm text-slate-500">Este link não pode ser incorporado diretamente.</p>
            </div>
            <a href={active.url} target="_blank" rel="noreferrer" className="cta-primary px-5 py-2.5 text-sm">
              Abrir catálogo
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
