import {cookies} from "next/headers";
import { getPrisma, disconnectPrisma } from "../../../../lib/prisma";
import { translateCart } from "../../../lib/translate";

const CART_COOKIE = "cart_id";

//Used to Get the unique Cart associated with the user cookies
async function getCart(prisma){
  const cookie = await cookies();
  const cartId = cookie.get(CART_COOKIE)?.value;

   if (cartId) {
    const cart = await prisma.cart.findUnique({
      where: {
        id: cartId,
      },
    });

    if (cart) {
      return cart;
    }
  }

  const cart = await prisma.cart.create({
    data: {},
  });

   cookie.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return cart;
}

//Used to determine what products are in the specific users cart
export async function GET(){
  const prisma = await getPrisma();

  try {
    const cart = await getCart(prisma);

    const fullCart = await prisma.cart.findUnique({
  where: {
    id: cart.id,
  },
  include: {
    items: {
      orderBy: {
        createdAt: "asc",
      },
      include: {
        product: {
          select: {
            id: true,
            itemId: true,
            itemName: true,
            brand: true,
            color: true,

            images: {
              orderBy: {
                displayOrder: "asc",
              },
              select: {
                type: true,
                displayOrder: true,
                image: {
                  select: {
                    id: true,
                    width: true,
                    height: true,
                    path: true,
                    storageKey: true,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
});


    return Response.json(translateCart(fullCart));

  } catch (error) {
    console.error("GET /api/cart error:", error);

    return Response.json(
      {
        error: "Failed to get cart",
      },
      {
        status: 500,
      }
    );
} finally {
    await disconnectPrisma();
  }
}

//Used to Add an item to a users cart or increase quanitity
export async function POST(request){
  const prisma = await getPrisma();

  try{
    const body = await request.json();
    const productId = body?.productId;

    if (!productId) {
      return Response.json(
        {
          error: "productId is required",
        },
        {
          status: 400,
        }
      );
    }

    // Make sure the product actually exists.
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return Response.json(
        {
          error: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    const cart = await getCart(prisma);

    // If the product is already in the cart,
    // increase its quantity.
    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },

      update: {
        quantity: {
          increment: 1,
        },
      },

      create: {
        cartId: cart.id,
        productId,
        quantity: 1,
      },
    });

    return Response.json({
      cartId: cart.id,
      productId,
      quantity: cartItem.quantity,
    });
  } catch (error) {
      console.error("POST /api/cart error:", error);

      return Response.json(
        {
          error: "Failed to add product to cart",
        },
        {
          status: 500,
        }
      );
} finally {
    await disconnectPrisma();
  }
}

//Used to reduce the quantity of an item from a users cart
export async function DELETE(request) {
  const prisma = await getPrisma();

  try {
    const body = await request.json();
    const productId = body?.productId;

    if (!productId) {
      return Response.json(
        {
          error: "productId is required",
        },
        {
          status: 400,
        }
      );
    }

    const cart = await getCart(prisma);

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    // The product isn't in the cart.
    if (!cartItem) {
      return Response.json({
        cartId: cart.id,
        productId,
        quantity: 0,
      });
    }

    // If there is more than one,
    // subtract one.
    if (cartItem.quantity > 1) {
      const updatedCartItem =
        await prisma.cartItem.update({
          where: {
            id: cartItem.id,
          },
          data: {
            quantity: {
              decrement: 1,
            },
          },
        });

      return Response.json({
        cartId: cart.id,
        productId,
        quantity: updatedCartItem.quantity,
      });
    }

    // Quantity is 1, so remove the item
    // completely from the cart.
    await prisma.cartItem.delete({
      where: {
        id: cartItem.id,
      },
    });

    return Response.json({
      cartId: cart.id,
      productId,
      quantity: 0,
    });
  } catch (error) {
    console.error("DELETE /api/cart error:", error);

    return Response.json(
      {
        error: "Failed to remove product from cart",
      },
      {
        status: 500,
      }
    );
  } finally {
    await disconnectPrisma();
  }
}

//Clears Cart of entire list. Used in the Cart Tab when user Clicks Checkout
export async function PATCH() {
  const prisma = await getPrisma();

  try {
    const cart = await getCart(prisma);

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return Response.json({
      success: true,
      message: "Purchase completed successfully",
    });
  } catch (error) {
    console.error("PATCH /api/cart error:", error);

    return Response.json(
      {
        error: "Failed to complete purchase",
      },
      {
        status: 500,
      }
    );
  } finally {
    await disconnectPrisma();
  }
}