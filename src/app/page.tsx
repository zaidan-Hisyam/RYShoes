import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductPageWithFiltersClient from "@/components/ProductPageWithFiltersClient";
import prisma from "@/lib/prisma";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Navbar />
      <Header />
      <ProductPageWithFiltersClient initialProducts={products} />
      <Footer />
    </div>
  );
}