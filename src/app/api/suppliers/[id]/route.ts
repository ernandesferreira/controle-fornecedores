import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type CatalogInput = {
  title?: string
  url?: string
}

type PricesInput = {
  currentModel?: string | number | null
  retroModel?: string | number | null
  kidsModel?: string | number | null
  nflModel?: string | number | null
  nbaModel?: string | number | null
  customModel?: string | number | null
  patchPrice?: string | number | null
  longSleeve?: string | number | null
  tracksuit?: string | number | null
  fanVersion?: string | number | null
  playerVersion?: string | number | null
}

function toNullableNumber(value: string | number | null | undefined) {
  if (value === '' || value === null || value === undefined) return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params

    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        catalogs: true,
        prices: true,
      },
    })

    if (!supplier) {
      return NextResponse.json({ error: 'Fornecedor não encontrado.' }, { status: 404 })
    }

    return NextResponse.json(supplier)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar fornecedor.' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json()

    const catalogs = ((body.catalogs || []) as CatalogInput[])
      .filter((item) => item.url?.trim())
      .map((item) => ({
        title: item.title?.trim() || null,
        url: item.url!.trim(),
      }))

    const prices = (body.prices || {}) as PricesInput

    await prisma.catalog.deleteMany({
      where: { supplierId: id },
    })

    const supplier = await prisma.supplier.update({
      where: { id },
      data: {
        name: String(body.name || '').trim(),
        phone: String(body.phone || '').trim(),
        notes: String(body.notes || '').trim() || null,
        dropshipping: Boolean(body.dropshipping),
        catalogs: {
          create: catalogs,
        },
        prices: {
          upsert: {
            create: {
              currentModel: toNullableNumber(prices.currentModel),
              retroModel: toNullableNumber(prices.retroModel),
              kidsModel: toNullableNumber(prices.kidsModel),
              nflModel: toNullableNumber(prices.nflModel),
              nbaModel: toNullableNumber(prices.nbaModel),
              customModel: toNullableNumber(prices.customModel),
              patchPrice: toNullableNumber(prices.patchPrice),
              longSleeve: toNullableNumber(prices.longSleeve),
              tracksuit: toNullableNumber(prices.tracksuit),
              fanVersion: toNullableNumber(prices.fanVersion),
              playerVersion: toNullableNumber(prices.playerVersion),
            },
            update: {
              currentModel: toNullableNumber(prices.currentModel),
              retroModel: toNullableNumber(prices.retroModel),
              kidsModel: toNullableNumber(prices.kidsModel),
              nflModel: toNullableNumber(prices.nflModel),
              nbaModel: toNullableNumber(prices.nbaModel),
              customModel: toNullableNumber(prices.customModel),
              patchPrice: toNullableNumber(prices.patchPrice),
              longSleeve: toNullableNumber(prices.longSleeve),
              tracksuit: toNullableNumber(prices.tracksuit),
              fanVersion: toNullableNumber(prices.fanVersion),
              playerVersion: toNullableNumber(prices.playerVersion),
            },
          },
        },
      },
      include: {
        catalogs: true,
        prices: true,
      },
    })

    return NextResponse.json(supplier)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao atualizar fornecedor.' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = await params

    await prisma.supplier.delete({
      where: { id },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao excluir fornecedor.' }, { status: 500 })
  }
}
