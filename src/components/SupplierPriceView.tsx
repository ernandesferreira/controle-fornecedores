import { formatBRL } from '@/lib/currency'

type SupplierPriceViewProps = {
  prices?: {
    currentModel?: number | null
    retroModel?: number | null
    kidsModel?: number | null
    nflModel?: number | null
    nbaModel?: number | null
    customModel?: number | null
    patchPrice?: number | null
    longSleeve?: number | null
    tracksuit?: number | null
    fanVersion?: number | null
    playerVersion?: number | null
  } | null
}

export default function SupplierPriceView({ prices }: SupplierPriceViewProps) {
  const rows = [
    ['Modelo atual', prices?.currentModel],
    ['Modelo retrô', prices?.retroModel],
    ['Modelo infantil', prices?.kidsModel],
    ['Modelo NFL', prices?.nflModel],
    ['Modelo NBA', prices?.nbaModel],
    ['Modelo personalizado', prices?.customModel],
    ['Valor do patch', prices?.patchPrice],
    ['Manga longa', prices?.longSleeve],
    ['Agasalho', prices?.tracksuit],
    ['Torcedor', prices?.fanVersion],
    ['Jogador', prices?.playerVersion],
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {rows.map(([label, value]) => (
        <div key={String(label)} className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-xl font-bold text-slate-900">{formatBRL(value as number | null | undefined)}</p>
        </div>
      ))}
    </div>
  )
}
