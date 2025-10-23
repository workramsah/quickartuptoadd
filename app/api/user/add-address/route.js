import { prisma } from "@/prisma/client"
import { NextResponse } from "next/server"

export async function POST(request){
try {
    const { address, userId } = await request.json()
    
    // First get the user's ID from their email
    const user = await prisma.user.findUnique({
        where: {
            email: userId
        }
    });

    if (!user) {
        return NextResponse.json({success:false, message:"User not found"}, { status: 404 });
    }

    const newAddress = await prisma.address.create({
        data: {
            userId: user.id,  // Use the actual user ID from the database
            fullName: address.fullName,
            phoneNumber: address.phoneNumber,
            pincode: address.pincode,
            area: address.area,
            city: address.city,
            state: address.state
        }
    })
    return NextResponse.json({success:true, message:"Address added successfully", newAddress})
} catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({success:false, message:error.message}, { status: 500 })
    
}
}