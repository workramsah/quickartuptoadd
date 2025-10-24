import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const email = url.searchParams.get("email");

    let resolvedUserId = userId;

    // If email is provided, resolve to the actual user ID
    if (!resolvedUserId && email) {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, message: "User not found for given email" },
          { status: 404 }
        );
      }

      resolvedUserId = user.id;
    }

    if (!resolvedUserId) {
      return NextResponse.json(
        { success: false, message: "Missing userId or email" },
        { status: 400 }
      );
    }

    const addresses = await prisma.address.findMany({
      where: { userId: resolvedUserId },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    console.error("get-address error", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}