import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: session.userId }, // Assuming orders are linked to a user
      include: {
        product: {
          select: { name: true, catalogImageUrl: true, price: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderDate: order.createdAt.toISOString(),
      totalAmount: order.totalAmount,
      status: order.status,
      items: [
        {
          id: order.productId, // Assuming one product per order for simplicity
          productName: order.product.name,
          quantity: 1, // Assuming quantity is 1 for simplicity
          price: order.product.price,
          imageUrl: order.product.catalogImageUrl,
        },
      ],
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session.isLoggedIn) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { productId, shippingAddress, paymentMethod } = body;

    if (!productId || !shippingAddress || !paymentMethod) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    const newOrder = await prisma.order.create({
      data: {
        productId: productId,
        userId: session.userId,
        totalAmount: product.price,
        status: "Pending",
        shippingAddress: JSON.stringify(shippingAddress),
        paymentMethod: paymentMethod,
        phoneNumber: shippingAddress.recipientPhoneNumber,
      },
    });

    return NextResponse.json({ orderId: newOrder.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}