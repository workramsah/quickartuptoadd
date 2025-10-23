import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";


export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        
        if (!userId) {
            return NextResponse.json({ success: false, message: "User ID is required" });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" });
        }

        // Parse the JSON string from cartItems
        const cartItems = typeof user.cartItems === 'string' 
            ? JSON.parse(user.cartItems) 
            : user.cartItems;

        return NextResponse.json({
            success: true,
            cartItems: cartItems
        });
    } catch (error) {
        console.error('Cart fetch error:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
}