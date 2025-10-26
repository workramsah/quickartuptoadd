import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';

export async function GET(request) {
  try {
    // Parse URL safely to avoid Invalid URL in edge cases
    const url = new URL(request.url, process.env.NEXTAUTH_URL || 'http://localhost:3000');

    // Optional: filter by date/status in future via searchParams

    const orders = await prisma.order.findMany({
      include: {
        address: true,
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
      orderBy: { date: 'desc' },
    });

    const formatted = orders.map((order) => ({
      id: order.id,
      amount: order.amount,
      date: order.date,
      status: order.status,
      address: order.address || {},
      user: {
        id: order.user.id,
        name: order.user.name,
        email: order.user.email,
      },
      items: order.items.map((item) => ({
        quantity: item.quantity,
        product: item.product || {},
      })),
    }));

    return NextResponse.json({ success: true, orders: formatted });
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch seller orders' }, { status: 500 });
  }
}