import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/auth/admin";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!verifyAdminSessionToken(token)) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "images", "products");
    await mkdir(uploadDir, { recursive: true });

    // Clean and sanitize filename
    const originalExt = path.extname(file.name) || ".jpg";
    const cleanExt = originalExt.toLowerCase();
    const rawName = path.basename(file.name, originalExt).replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
    const fileName = `${rawName || "product"}-${Date.now()}${cleanExt}`;

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const imageUrl = `/images/products/${fileName}`;
    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Admin image upload error:", error);
    return NextResponse.json({ success: false, error: "Failed to upload image" }, { status: 500 });
  }
}
