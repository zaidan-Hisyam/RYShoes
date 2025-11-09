'use client'

import React from 'react';

const Header = () => {
  const scrollToCatalog = () => {
    const catalog = document.getElementById('catalog');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="text-center py-20 sm:py-28 md:py-32 lg:py-40 bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800/50">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-neutral-800 dark:text-neutral-100 mb-6 leading-tight">
          Find Your Perfect Pair, Pre-Loved.
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 mb-10">
          Discover our curated collection of authentic, second-hand New Balance sneakers. Quality and style, guaranteed.
        </p>
        <button 
          onClick={scrollToCatalog}
          className="bg-cyan-500 text-white font-bold py-3 px-8 rounded-full text-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:bg-cyan-600 active:bg-cyan-700 shadow-lg hover:shadow-cyan-500/50 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
        >
          Lihat Katalog
        </button>
      </div>
    </header>
  );
};

export default Header;
