

import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
    try {
        // Get user session for authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, message: "Authentication required" });
        }

        const { address, items } = await request.json();
        
        if (!address || !items || items.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid data" });
        }

        // Find user by email from session
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" });
        }

        // Calculate amount using items with proper async handling
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: {
                    id: item.productId
                }
            });

            if (!product) {
                return NextResponse.json({ 
                    success: false, 
                    message: `Product with ID ${item.productId} not found` 
                });
            }

            const itemTotal = parseFloat(product.price) * item.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                productId: item.productId,
                quantity: item.quantity
            });
        }

        // Add tax (2%)
        const tax = Math.floor(totalAmount * 0.02);
        const finalAmount = totalAmount + tax;

        // Create the order
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                addressId: address.id || null, // Use address ID if available
                amount: finalAmount,
                status: "Order Placed",
                items: {
                    create: orderItems
                }
            },
            include: {
                items: true,
                user: true,
                address: true
            }
        });

        // Clear user cart
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                cartItems: {}
            }
        });

        return NextResponse.json({ 
            success: true, 
            message: "Order Placed Successfully",
            orderId: order.id
        });

    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || "Failed to create order" 
        });
    }
}