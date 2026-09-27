import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { addProduct, updateProduct, deleteProduct, getProducts } from "@/lib/db/store";
import { productAdminSchema } from "@/lib/validations";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/auth/admin";

async function isAuthorized() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Admin products GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthorized())) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const validation = productAdminSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const d = validation.data;
    const newProduct = await addProduct({
      name: d.name,
      category_id: d.categoryId,
      sku: d.sku,
      description: d.description,
      price: d.price,
      compare_at_price: d.compareAtPrice,
      stock: d.stock,
      is_active: d.isActive,
      is_featured: d.isFeatured,
      is_best_seller: d.isBestSeller,
      is_new_arrival: d.isNewArrival,
      images: d.imageUrl
        ? [{ id: `img-${Date.now()}`, product_id: "", image_url: d.imageUrl, alt_text: d.name, sort_order: 0 }]
        : undefined,
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Admin product create error:", error);
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!(await isAuthorized())) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    const updated = await updateProduct(id, data);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Admin product update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAuthorized())) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    const deleted = await deleteProduct(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error("Admin product delete error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}
