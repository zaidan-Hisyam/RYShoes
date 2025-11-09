'use client';

import React, { useState } from 'react';

interface ProductFiltersProps {
  onFilterChange: (filters: { size?: string; minPrice?: number; maxPrice?: number }) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilterChange }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number | string>('');
  const [maxPrice, setMaxPrice] = useState<number | string>('');

  const handleSizeChange = (value: string) => {
    setSelectedSize(value);
    onFilterChange({ size: value === '' ? undefined : value, minPrice: minPrice === '' ? undefined : Number(minPrice), maxPrice: maxPrice === '' ? undefined : Number(maxPrice) });
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPrice(value);
    onFilterChange({ size: selectedSize === '' ? undefined : selectedSize, minPrice: value === '' ? undefined : Number(value), maxPrice: maxPrice === '' ? undefined : Number(maxPrice) });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPrice(value);
    onFilterChange({ size: selectedSize === '' ? undefined : selectedSize, minPrice: minPrice === '' ? undefined : Number(minPrice), maxPrice: value === '' ? undefined : Number(value) });
  };

  // Dummy sizes for now, these could come from a database or config
  const availableSizes = ['S', 'M', 'L', 'XL'];

  return (
    <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-md space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Shoe Size</h3>
        <input
          type="number"
          placeholder="Enter size (e.g., 42)"
          value={selectedSize}
          onChange={(e) => handleSizeChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Price Range</h3>
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={handleMinPriceChange}
            className="w-1/2 px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            className="w-1/2 px-3 py-2 border rounded-lg dark:bg-neutral-700 dark:border-neutral-600"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
