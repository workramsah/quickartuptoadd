

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/prisma/client';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user) {
            return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
        }
        
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });
        
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
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