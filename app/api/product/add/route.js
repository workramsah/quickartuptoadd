import { prisma } from "@/prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Read and sanitize env values
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const CLOUD_API_KEY = process.env.CLOUDINARY_API_KEY?.trim();
const CLOUD_API_SECRET = process.env.CLOUDINARY_API_SECRET?.trim();

// configure cloudinary
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

export async function POST(request) {
  try {
    // Validate Cloudinary env vars
    if (!CLOUD_NAME || !CLOUD_API_KEY || !CLOUD_API_SECRET) {
      return NextResponse.json({ success: false, message: "Cloudinary is not configured" }, { status: 500 });
    }
    // Cloudinary API keys are numeric; guard obvious misconfigurations
    if (!/^\d+$/.test(CLOUD_API_KEY)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid Cloudinary API key format. Use the numeric API key from Cloudinary Dashboard → Settings → API Keys.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const category = formData.get("category");
    const price = formData.get("price");
    const offerPrice = formData.get("offerPrice");

    const files = formData.getAll("images");
    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: "No files uploaded" }, { status: 400 });
    }

    const result = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          stream.end(buffer);
        });
      })
    );

    const image = result.map((r) => r.secure_url);

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        category,
        price: price.toString(),
        offerPrice: offerPrice.toString(),
        image: JSON.stringify(image),
        date: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: "Upload successful", newProduct });
  } catch (error) {
    const message =
      error?.http_code === 401
        ? "Cloudinary authentication failed (401). Verify CLOUDINARY_CLOUD_NAME, API key, and secret."
        : error?.message || "Upload failed";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}