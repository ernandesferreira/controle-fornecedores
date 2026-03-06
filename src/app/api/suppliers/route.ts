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

export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        catalogs: true,
        prices: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(suppliers)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar fornecedores.' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const catalogs = ((body.catalogs || []) as CatalogInput[])
      .filter((item) => item.url?.trim())
      .map((item) => ({
        title: item.title?.trim() || null,
        url: item.url!.trim(),
      }))

    const prices = (body.prices || {}) as PricesInput

    const supplier = await prisma.supplier.create({
      data: {
        name: String(body.name || '').trim(),
        phone: String(body.phone || '').trim(),
        notes: String(body.notes || '').trim() || null,
        dropshipping: Boolean(body.dropshipping),
        catalogs: {
          create: catalogs,
        },
        prices: {
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
        },
      },
      include: {
        catalogs: true,
        prices: true,
      },
    })

    return NextResponse.json(supplier, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao criar fornecedor.' }, { status: 500 })
  }
}
