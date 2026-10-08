import { cookies } from "next/headers";
import { getPrisma } from "@/../lib/prisma";

const CART_COOKIE = "cart_id";

export async function getOrCreateCart() {
  const cookieStore = await cookies();
  const existingCartId = cookieStore.get(CART_COOKIE)?.value;

  const prisma = await getPrisma();

  if (existingCartId) {
    const existingCart = await prisma.cart.findUnique({
      where: {
        id: existingCartId,
      },
    });

    if (existingCart) {
      return existingCart;
    }
  }

  const cart = await prisma.cart.create({
    data: {},
  });

  cookieStore.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return cart;
}

export async function getCartItemQuantity(productId) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;

  if (!cartId) {
    return 0;
  }

  const prisma = await getPrisma();

  const item = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId,
        productId,
      },
    },
  });

  return item?.quantity ?? 0;
}
