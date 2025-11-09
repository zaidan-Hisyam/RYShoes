import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OrdersPage() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[60vh]">
        <h1 className="text-4xl font-bold text-center text-neutral-800 dark:text-neutral-100">My Orders</h1>
        <div className="mt-12 text-center text-neutral-500 dark:text-neutral-400">
          <p>You must be logged in to view your orders.</p>
          <p>Order history will be displayed here.</p>
        </div>
      </div>
      <Footer />
    </>
  );
}
