import { ProductForm } from "../_components/ProductForm";

export default function NewProductPage() {
  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-8">Add a New Product</h1>
      <ProductForm />
    </div>
  );
}
