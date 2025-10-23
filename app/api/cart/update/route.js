import { prisma } from "@/prisma/client"
import { NextResponse } from "next/server"


export async function POST(request) {
    try {
        const { cartData, userId } = await request.json();
        
        if (!userId) {
            return NextResponse.json({ success: false, message: "User ID is required" });
        }

        // Convert cart data to string if it's an object
        const cartDataToStore = typeof cartData === 'string' 
            ? cartData 
            : JSON.stringify(cartData);

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { cartItems: cartDataToStore }
        });

        if (!updatedUser) {
            return NextResponse.json({ success: false, message: "Failed to update cart" });
        }

        return NextResponse.json({ 
            success: true,
            message: "Cart updated successfully"
        });
    } catch (error) {
        console.error('Cart update error:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || "Error updating cart"
        });
    }
}
