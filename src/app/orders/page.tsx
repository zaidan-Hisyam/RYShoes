'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { formatCurrency } from '@/lib/formatters';
import Link from 'next/link';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

interface ShippingAddress {
  recipientName: string;
  recipientPhoneNumber: string;
  email: string;
  province: string;
  city: string;
  district: string;
  fullAddress: string;
  postalCode: string;
}

interface Order {
  id: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Replace with your actual API endpoint for fetching orders
        const res = await fetch('/api/orders');
        if (!res.ok) {
          throw new Error('Failed to fetch orders.');
        }
        const data: Order[] = await res.json();
        const formattedData = data.map(order => ({
          ...order,
          shippingAddress: JSON.parse(order.shippingAddress as unknown as string),
        }));
        setOrders(formattedData);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

        {orders.length === 0 ? (
          <p className="text-center text-neutral-600 dark:text-neutral-400">You haven't placed any orders yet.</p>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Order ID: {order.id}</h2>
                  <span className="text-neutral-500 dark:text-neutral-400">{new Date(order.orderDate).toLocaleDateString()}</span>
                </div>
                <div className="mb-4">
                  <p className="text-lg font-medium">Status: {order.status}</p>
                  <p className="text-lg font-medium">Total: {formatCurrency(order.totalAmount)}</p>
                </div>
                <div className="mb-4 p-4 border rounded-md bg-neutral-50 dark:bg-neutral-700">
                  <h3 className="text-md font-semibold mb-2">Shipping Details:</h3>
                  <p><strong>Recipient:</strong> {order.shippingAddress.recipientName}</p>
                  <p><strong>Phone:</strong> {order.shippingAddress.recipientPhoneNumber}</p>
                  <p><strong>Email:</strong> {order.shippingAddress.email}</p>
                  <p><strong>Address:</strong> {order.shippingAddress.fullAddress}, {order.shippingAddress.district}, {order.shippingAddress.city}, {order.shippingAddress.province}, {order.shippingAddress.postalCode}</p>
                </div>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                        <img src={item.imageUrl} alt={item.productName} className="object-cover w-full h-full" />
                      </div>
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.quantity} x {formatCurrency(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <Link href={`/orders/${order.id}`} className="text-cyan-500 hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default OrdersPage;
