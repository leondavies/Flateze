import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const flatId = searchParams.get('flatId')

    if (!flatId) {
      return NextResponse.json({ error: 'Flat ID is required' }, { status: 400 })
    }

    const member = await prisma.flatMember.findUnique({
      where: {
        flatId_userId: {
          flatId,
          userId: session.user.id,
        },
      },
    })

    if (!member) {
      return NextResponse.json({ error: 'Not a member of this flat' }, { status: 403 })
    }

    const bills = await prisma.bill.findMany({
      where: {
        flatId,
      },
      include: {
        payments: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(bills)
  } catch (error) {
    console.error('Error fetching bills:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { flatId, companyName, billType, amount, dueDate, billDate, referenceId } = await request.json()

    if (!flatId || !companyName || !billType || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const member = await prisma.flatMember.findUnique({
      where: {
        flatId_userId: {
          flatId,
          userId: session.user.id,
        },
      },
    })

    if (!member) {
      return NextResponse.json({ error: 'Not a member of this flat' }, { status: 403 })
    }

    const bill = await prisma.bill.create({
      data: {
        flatId,
        companyName,
        billType,
        amount,
        dueDate: dueDate ? new Date(dueDate) : null,
        billDate: billDate ? new Date(billDate) : new Date(),
        referenceId,
      },
    })

    return NextResponse.json(bill)
  } catch (error) {
    console.error('Error creating bill:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}