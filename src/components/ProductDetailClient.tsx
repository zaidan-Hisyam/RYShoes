'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiHeart, FiMessageSquare } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatters';
import AuthModal from '@/components/AuthModal';
import { Product } from '@prisma/client'; // Assuming Product type is available from Prisma client

interface ProductDetailClientProps {
  product: Product & { images: { id: number; url: string }[] };
}

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(data.isLoggedIn);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Failed to fetch session:', error);
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  const handleAction = (action: () => void) => {
    if (isLoggedIn) {
      action();
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setShowAuthModal(false);
    // Optionally, re-check session or refresh page to reflect login status
    // window.location.reload();
  };

  const handleAddToCart = () => {
    console.log('Add to Cart clicked for product:', product.id);
    // Implement actual add to cart logic here
  };

  const handleLikeProduct = () => {
    console.log('Like Product clicked for product:', product.id);
    // Implement actual like product logic here
  };

  const handleContactNow = () => {
    const message = `Hello, I'm interested in the product: ${product.name} (${product.id})`;
    const whatsappUrl = `https://wa.me/6285956319555?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Product Image Gallery */}
          <div className="space-y-4">
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={product.catalogImageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            {product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {product.images.map((img) => (
                  <div key={img.id} className="relative w-full h-24 rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={img.url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col h-full">
            <h1 className="text-4xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">{product.name}</h1>
            {product.size && (
              <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-2">
                Size: {product.size}
              </p>
            )}
            <p className="text-3xl font-semibold text-cyan-500 dark:text-cyan-400 mb-6">
              {formatCurrency(product.price)}
            </p>

            <div className="mb-8">
                <h3 className="font-semibold text-lg mb-2">Description:</h3>
                <p className="text-neutral-600 dark:text-neutral-300">{product.description}</p>
            </div>

            <div className="mt-auto pt-8">
                <div className="flex items-center space-x-4 mb-6">
                    <button
                      onClick={() => handleAction(handleAddToCart)}
                      className="p-4 rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors glow-on-hover"
                    >
                        <FiShoppingCart size={24} />
                    </button>
                    <button
                      onClick={() => handleAction(handleLikeProduct)}
                      className="p-4 rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors glow-on-hover"
                    >
                        <FiHeart size={24} />
                    </button>
                    <Button
                      onClick={() => handleAction(handleContactNow)}
                      className="flex-grow bg-cyan-500 text-white font-bold py-4 px-8 rounded-full text-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:bg-cyan-600 active:bg-cyan-700 shadow-lg hover:shadow-cyan-500/50"
                    >
                        Contact Now
                    </Button>
                </div>
            </div>
          </div>
        </div>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />
    </>
  );
};

export default ProductDetailClient;
