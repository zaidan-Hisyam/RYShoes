'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { formatCurrency } from '@/lib/formatters';
import { Product } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserProfile {
  name: string;
  address: string;
  phone: string;
}

const ConfirmBuyPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get('productId');

  const [product, setProduct] = useState<Product | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [recipientName, setRecipientName] = useState('');
  const [recipientPhoneNumber, setRecipientPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');

  useEffect(() => {
    if (!productId) {
      setError('Product ID is missing.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch product details
        const productRes = await fetch(`/api/products/${productId}`);
        if (!productRes.ok) {
          throw new Error('Failed to fetch product details.');
        }
        const productData: Product = await productRes.json();
        setProduct(productData);

        // Fetch user profile (assuming an API endpoint for user profile)
        const userProfileRes = await fetch('/api/user/profile');
        if (userProfileRes.ok) {
          const userProfileData: UserProfile = await userProfileRes.json();
          setUserProfile(userProfileData);
          setRecipientName(userProfileData.name || '');
          setFullAddress(userProfileData.address || '');
          setRecipientPhoneNumber(userProfileData.phone || '');
        } else {
          console.warn('Failed to fetch user profile. User might not be logged in or profile not set.');
          // For now, use dummy data if profile not found
          setUserProfile({
            name: 'Guest User',
            address: 'Please enter your address',
            phone: 'Please enter your phone number',
          });
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const handleConfirmPurchase = async () => {
    if (!product) {
      setError('Product data is missing.');
      return;
    }

    // Basic validation
    if (!recipientName || !recipientPhoneNumber || !email || !province || !city || !district || !fullAddress || !postalCode) {
      setError('Please fill out all shipping details.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          shippingAddress: {
            recipientName,
            recipientPhoneNumber,
            email,
            province,
            city,
            district,
            fullAddress,
            postalCode,
          },
          paymentMethod,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Order created successfully! Order ID: ${data.orderId}`);
        router.push('/order-success'); // Redirect to a success page
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to create order.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during purchase.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading order details...</p>
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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold mb-8">Confirm Your Purchase</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Details */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                <Image src={product.catalogImageUrl} alt={product.name} fill className="object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{product.name}</h3>
                {product.size && <p className="text-neutral-600">Size: {product.size}</p>}
                <p className="text-lg font-bold text-cyan-500">{formatCurrency(product.price)}</p>
              </div>
            </div>
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 mt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{formatCurrency(product.price)}</span>
              </div>
            </div>
          </div>

          {/* Shipping and Payment Details */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Rincian Pesanan</h2>
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md mb-6 space-y-4">
              <div>
                <Label htmlFor="recipientName">Nama Penerima</Label>
                <Input id="recipientName" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="recipientPhoneNumber">Nomor Telepon Penerima</Label>
                <Input id="recipientPhoneNumber" value={recipientPhoneNumber} onChange={(e) => setRecipientPhoneNumber(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="province">Provinsi</Label>
                <Input id="province" value={province} onChange={(e) => setProvince(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="city">Kota / Kabupaten</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="district">Kecamatan</Label>
                <Input id="district" value={district} onChange={(e) => setDistrict(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="fullAddress">Alamat Lengkap</Label>
                <Input id="fullAddress" value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="postalCode">Kode Pos</Label>
                <Input id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md mb-6">
              <p>Payment via: [Placeholder for selected payment method]</p>
              {/* Payment method selection options here */}
            </div>

            <Button
              onClick={handleConfirmPurchase}
              className="w-full bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg text-xl transform transition-all duration-300 ease-in-out hover:scale-105 hover:bg-cyan-600 active:bg-cyan-700 shadow-lg hover:shadow-cyan-500/50"
            >
              Confirm Purchase
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ConfirmBuyPage;
