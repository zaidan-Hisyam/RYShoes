'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { Product } from '@prisma/client';
import { formatCurrency } from '@/lib/formatters';

interface ProductCardProps {
  product: Product;
  isLoggedIn: boolean;
  onShowAuthModal: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isLoggedIn, onShowAuthModal }) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const router = useRouter();

  const toggleLike = () => {
    if (!isLoggedIn) {
      onShowAuthModal();
      return;
    }
    setIsLiked(!isLiked);
    // In a real app, you'd also make an API call here
  };

  const handleContactNow = () => {
    const message = `Hello, I'm interested in the product: ${product.name} (${product.id})`;
    const whatsappUrl = `https://wa.me/6285956319555?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white dark:bg-neutral-800/50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-cyan-500/20 dark:hover:shadow-cyan-400/20 transition-all duration-300 group border border-transparent hover:border-cyan-500/50">
      <Link href={`/pembelian/${product.id}`} className="block">
        <div className="relative w-full h-64">
          <Image
            src={product.catalogImageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <div className="p-5">
        <Link href={`/pembelian/${product.id}`} className="block">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 truncate group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.size && <p className="text-neutral-500 dark:text-neutral-400 mt-1">{product.size}</p>}
        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-bold text-cyan-500 dark:text-cyan-400">{formatCurrency(product.price)}</p>
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleLike}
              className={`p-2 rounded-full transition-colors duration-300 ${isLiked ? 'text-red-500 bg-red-100/50 dark:bg-neutral-700' : 'text-neutral-500 hover:text-red-500 hover:bg-red-100 dark:hover:bg-neutral-700'}`}>
              {isLiked ? <FaHeart size={22} /> : <FiHeart size={22} />}
            </button>
            <button
              onClick={handleContactNow}
              className="bg-neutral-800 dark:bg-neutral-100 text-white dark:text-black font-bold py-2 px-5 rounded-full transform transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              Contact Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
