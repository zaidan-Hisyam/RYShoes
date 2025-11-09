import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductDetailClient from '@/components/ProductDetailClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const awaitedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(awaitedParams.id) },
    include: { images: true },
  });

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <ProductDetailClient product={product} />
      <Footer />
    </>
  );
}
