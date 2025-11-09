'use client'

import React from 'react';
import Image from 'next/image';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-neutral-100 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Us */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">Tentang Kami</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-2">
              RYS Shoes adalah platform terpercaya untuk jual beli sepatu New Balance original bekas berkualitas.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              <span className="font-semibold">Store:</span> Ngemplak, Donohudan, Kec. Ngemplak, Kab. Boyolali, Surakarta (Belakang TK Bina Pratama).
            </p>
          </div>

          {/* Contact & Payments */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Contact */}
            <div>
              <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">Kontak Kami</h3>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/rys.shoessolo/" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-pink-500 transition-colors duration-300">
                  <FaInstagram size={30} />
                </a>
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-green-500 transition-colors duration-300">
                  <FaWhatsapp size={30} />
                </a>
              </div>
            </div>

            {/* Payments */}
            <div>
              <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">Pembayaran</h3>
              <div className="flex flex-wrap items-center gap-4">
                {['BCA.png', 'DANA.png', 'GOPAY.png', 'SPAY.png', 'COD.png'].map((logo) => (
                  <div key={logo} className="relative h-8 w-14 p-1 bg-white rounded-md">
                    <Image
                      src={`/icons/${logo}`}
                      alt={logo.split('.')[0]}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                ))}
              </div>
               <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">Logo hanya untuk tujuan informasi.</p>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-200 dark:border-neutral-700 mt-8 pt-6 text-center text-neutral-500 dark:text-neutral-400">
          <p>&copy; {new Date().getFullYear()} RYS Shoes. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
