'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ProductFilters from './ProductFilters';
import ProductGridClient from '@/app/ProductGridClient'; // Adjust path if necessary
import { Product } from '@prisma/client'; // Assuming Product type is available from Prisma client
import AuthModal from '@/components/AuthModal';

interface ProductPageWithFiltersClientProps {
  initialProducts: Product[];
}

const ProductPageWithFiltersClient: React.FC<ProductPageWithFiltersClientProps> = ({ initialProducts }) => {
  const [filters, setFilters] = useState({
    size: undefined as string | undefined,
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
  });
  const [showFilters, setShowFilters] = useState(false);
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

  const handleFilterChange = (newFilters: { size?: string; minPrice?: number; maxPrice?: number }) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setShowAuthModal(false);
    // Optionally, re-check session or refresh page to reflect login status
    // window.location.reload();
  };

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      let matches = true;

      if (filters.size && product.size !== filters.size) {
        matches = false;
      }

      if (filters.minPrice !== undefined && product.price < filters.minPrice) {
        matches = false;
      }

      if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
        matches = false;
      }

      return matches;
    });
  }, [initialProducts, filters]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg shadow-md hover:bg-cyan-600 transition-colors"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="mb-8">
          <ProductFilters onFilterChange={handleFilterChange} />
        </div>
      )}

      <main className="flex-1">
        <ProductGridClient initialProducts={filteredProducts} isLoggedIn={isLoggedIn} onShowAuthModal={() => setShowAuthModal(true)} />
      </main>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />
    </div>
  );
};

export default ProductPageWithFiltersClient;
