'use client'

import React, { useState, useEffect } from 'react';
import ProductCard from "@/components/ProductCard";
import { FiSearch } from 'react-icons/fi';
import { Product } from '@prisma/client';

interface ProductGridClientProps {
  initialProducts: Product[];
  isLoggedIn: boolean;
  onShowAuthModal: () => void;
}

export default function ProductGridClient({ initialProducts, isLoggedIn, onShowAuthModal }: ProductGridClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = initialProducts.filter(product =>
      product.name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredProducts(filtered);
  }, [searchQuery, initialProducts]);

  return (
    <main id="catalog" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center text-neutral-800 dark:text-neutral-100 mb-6">
          Our Collection
        </h2>
        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for your favorite pair..."
            className="w-full px-5 py-3 pr-12 text-lg rounded-full bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 focus:border-cyan-500 dark:focus:border-cyan-500 outline-none transition-colors duration-300"
          />
          <FiSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400" size={22} />
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} isLoggedIn={isLoggedIn} onShowAuthModal={onShowAuthModal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">No Results Found</h3>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">Try adjusting your search, or explore our full collection.</p>
        </div>
      )}
    </main>
  );
}
