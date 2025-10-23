import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";


export async function GET(request){
    try {
        const products = await prisma.product.findMany()
        return NextResponse.json({products,success:true})
        
    } catch (error) {
        return NextResponse.json({message:error.message,success:false})

        
    }
}