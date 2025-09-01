import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MemberRole } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, address } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Flat name is required' }, { status: 400 })
    }

    const emailAlias = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}@flateze.com`

    const flat = await prisma.flat.create({
      data: {
        name,
        address,
        emailAlias,
        members: {
          create: {
            userId: session.user.id,
            role: MemberRole.ADMIN,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    })

    return NextResponse.json(flat)
  } catch (error) {
    console.error('Error creating flat:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const flats = await prisma.flat.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        bills: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    })

    return NextResponse.json(flats)
  } catch (error) {
    console.error('Error fetching flats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}