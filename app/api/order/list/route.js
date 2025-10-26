

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/prisma/client';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        // Parse URL robustly to allow fallback params in non-session contexts
        const url = new URL(request.url, process.env.NEXTAUTH_URL || 'http://localhost:3000');
        const emailParam = url.searchParams.get('email');
        const userIdParam = url.searchParams.get('userId');

        // Resolve user: prefer session; fallback to email or userId param
        let user = null;
        if (session?.user?.email) {
            user = await prisma.user.findUnique({ where: { email: session.user.email } });
        }
        if (!user && emailParam) {
            user = await prisma.user.findUnique({ where: { email: emailParam } });
        }
        if (!user && userIdParam) {
            user = await prisma.user.findUnique({ where: { id: userIdParam } });
        }

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found or unauthenticated' }, { status: 404 });
        }

        // Get orders with related data
        const orders = await prisma.order.findMany({
            where: { userId: user.id },
            include: {
                address: true,
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        });

        // Format orders to match frontend expectations
        const formattedOrders = orders.map(order => ({
            id: order.id,
            amount: order.amount,
            date: order.date,
            address: order.address || {},
            items: order.items.map(item => ({
                quantity: item.quantity,
                product: item.product || {}
            }))
        }));

        return NextResponse.json({ success: true, orders: formattedOrders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch orders' }, { status: 500 });
    }
}