"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addProduct, updateProduct } from "../_actions/products";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product, ProductImage } from "@prisma/client";
import Image from "next/image";

export function ProductForm({
  product,
}: {
  product?: (Product & { images: ProductImage[] }) | null;
}) {
  const action = product == null ? addProduct : updateProduct.bind(null, product.id);
  const [error, formAction] = useActionState(action, {});

  return (
    <form action={formAction}>
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
          <CardDescription>
            {product
              ? "Update the details of your product."
              : "Fill out the form to add a new product."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={product?.name || ""}
            />
            {error?.name && (
              <div className="text-destructive text-sm">{error.name}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price (in IDR)</Label>
            <Input
              type="number"
              id="price"
              name="price"
              required
              defaultValue={product?.price || ""}
            />
            {error?.price && (
              <div className="text-destructive text-sm">{error.price}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="size">Size</Label>
            <Input
              type="text"
              id="size"
              name="size"
              defaultValue={product?.size || ""}
            />
            {error?.size && (
              <div className="text-destructive text-sm">{error.size}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              defaultValue={product?.description || ""}
            />
            {error?.description && (
              <div className="text-destructive text-sm">{error.description}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="catalogImage">Catalog Image</Label>
            {product?.catalogImageUrl && (
              <Image
                src={product.catalogImageUrl}
                width={200}
                height={200}
                alt="Catalog Image"
                className="rounded-lg"
              />
            )}
            <Input
              type="file"
              id="catalogImage"
              name="catalogImage"
              required={product == null}
            />
            {error?.catalogImage && (
              <div className="text-destructive text-sm">{error.catalogImage}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="detailImages">Detail Images</Label>
            {product?.images && product.images.length > 0 && (
              <div className="flex gap-4 flex-wrap">
                {product.images.map((img) => (
                  <Image
                    key={img.id}
                    src={img.url}
                    width={100}
                    height={100}
                    alt="Detail Image"
                    className="rounded-lg"
                  />
                ))}
              </div>
            )}
            <Input
              type="file"
              id="detailImages"
              name="detailImages"
              multiple
              required={product == null}
            />
            {error?.detailImages && (
              <div className="text-destructive text-sm">{error.detailImages}</div>
            )}
          </div>
          {error?.general && (
            <div className="text-destructive text-sm">{error.general}</div>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}
