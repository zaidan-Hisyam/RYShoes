import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/formatters";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";

export default async function ProductOrdersPage({ searchParams }: { searchParams: { productId?: string } }) {
  const session = await getSession();

  if (!session.isLoggedIn || session.role !== 'ADMIN') {
    redirect('/login'); // Redirect to login page if not admin
  }

  const productId = searchParams.productId;

  if (!productId) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-8">Product Orders</h1>
        <p>No product ID provided.</p>
      </div>
    );
  }

  const orders = await prisma.order.findMany({
    where: { productId: parseInt(productId) },
    include: {
      product: true,
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Orders for Product ID: {productId}</h1>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Shipping Address</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Payment Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No orders found for this product.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.user.email}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    {(() => {
                      const address = JSON.parse(order.shippingAddress as string);
                      return (
                        <>
                          <p>{address.recipientName}</p>
                          <p>{address.fullAddress}, {address.district}, {address.city}, {address.province}, {address.postalCode}</p>
                        </>
                      );
                    })()}
                  </TableCell>
                  <TableCell>{order.phoneNumber}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
