import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";


export async function GET(resquest){
    try {
        const {userId} = await prisma.address.findUnique(
            {
                where:{userId: userId}
            }
        )
        return NextResponse.json({success:true,userId})
    } catch (error) {
        return NextResponse.json({success:false,message:error.message})
        
    }
}