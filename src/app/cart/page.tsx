import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CartPage() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[60vh]">
        <h1 className="text-4xl font-bold text-center text-neutral-800 dark:text-neutral-100">Shopping Cart</h1>
        <div className="mt-12 text-center text-neutral-500 dark:text-neutral-400">
          <p>Your cart is currently empty.</p>
          <p>Products added to the cart will appear here.</p>
        </div>
      </div>
      <Footer />
    </>
  );
}
