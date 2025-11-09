import prisma from "@/lib/prisma";
import { ProductForm } from "../_components/ProductForm";

export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: { images: true },
  });

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-8">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
}
