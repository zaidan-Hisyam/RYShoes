"use server";

import { z } from "zod";
import fs from "fs/promises";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/"),
  { message: "Must be an image file" }
);

const addSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().int().min(1),
  description: z.string().min(1),
  size: z.string().optional(),
  catalogImage: imageSchema.refine((file) => file.size > 0, "Required"),
  detailImages: z.union([z.array(imageSchema), imageSchema]).transform((files) => {
    if (!Array.isArray(files)) return [files];
    return files;
  }).refine((files) => files.length > 0 && files.every(f => f.size > 0), "At least one detail image is required"),
});

export async function addProduct(prevState: unknown, formData: FormData) {
  const rawData = {
    ...Object.fromEntries(formData.entries()),
    detailImages: formData.getAll("detailImages"),
  };

  const result = addSchema.safeParse(rawData);
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  try {
    const catalogImageExtension = data.catalogImage.name.split(".").pop();
    const catalogImageName = `${crypto.randomUUID()}.${catalogImageExtension}`;
    await fs.writeFile(
      `public/products/${catalogImageName}`,
      Buffer.from(await data.catalogImage.arrayBuffer())
    );
    const catalogImageUrl = `/products/${catalogImageName}`;

    const detailImageUrls = await Promise.all(
      data.detailImages.map(async (image) => {
        const extension = image.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${extension}`;
        await fs.writeFile(
          `public/products/${fileName}`,
          Buffer.from(await image.arrayBuffer())
        );
        return `/products/${fileName}`;
      })
    );

    await prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        size: data.size || null,
        description: data.description,
        catalogImageUrl: catalogImageUrl,
        images: {
          create: detailImageUrls.map((url) => ({ url })),
        },
      },
    });

  } catch (error) {
    console.error(error);
    return { general: "An unexpected error occurred." };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

const editSchema = addSchema.extend({
  catalogImage: imageSchema.optional(),
  detailImages: z.union([z.array(imageSchema), imageSchema]).optional().transform(files => {
    if (files == null) return [];
    if (!Array.isArray(files)) return [files];
    return files.filter(f => f.size > 0);
  }),
});

export async function updateProduct(
  productId: number,
  prevState: unknown,
  formData: FormData
) {
  const rawData = {
    ...Object.fromEntries(formData.entries()),
    detailImages: formData.getAll("detailImages").filter(f => f.size > 0),
  };
  const result = editSchema.safeParse(rawData);

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (product == null) return notFound();

  let catalogImageUrl = product.catalogImageUrl;
  if (data.catalogImage != null && data.catalogImage.size > 0) {
    try {
      await fs.unlink(`public${product.catalogImageUrl}`);
    } catch (error) {
      console.error("Error deleting old catalog image:", error);
    }
    const extension = data.catalogImage.name.split(".").pop();
    const newName = `${crypto.randomUUID()}.${extension}`;
    await fs.writeFile(
      `public/products/${newName}`,
      Buffer.from(await data.catalogImage.arrayBuffer())
    );
    catalogImageUrl = `/products/${newName}`;
  }

  if (data.detailImages && data.detailImages.length > 0) {
    const detailImageUrls = await Promise.all(
      data.detailImages.map(async (image) => {
        const extension = image.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${extension}`;
        await fs.writeFile(
          `public/products/${fileName}`,
          Buffer.from(await image.arrayBuffer())
        );
        return { url: `/products/${fileName}` };
      })
    );
    await prisma.productImage.createMany({
        data: detailImageUrls.map(img => ({...img, productId: product.id}))
    });
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: data.name,
      price: data.price,
      size: data.size || null,
      description: data.description,
      catalogImageUrl: catalogImageUrl,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(productId: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true },
  });

  if (product == null) return notFound();

  try {
    await fs.unlink(`public${product.catalogImageUrl}`);
    if (product.images.length > 0) {
      await Promise.all(
        product.images.map((image) => {
          return fs.unlink(`public${image.url}`);
        })
      );
    }

    await prisma.product.delete({
      where: { id: productId },
    });

  } catch (error) {
    console.error("Error deleting product:", error);
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
}
