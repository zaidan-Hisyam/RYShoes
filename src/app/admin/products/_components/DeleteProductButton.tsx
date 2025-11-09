"use client";

import { useTransition } from "react";
import { deleteProduct } from "../_actions/products";
import { Button } from "@/components/ui/button";

export function DeleteProductButton({ productId }: { productId: number }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (confirm("Are you sure you want to delete this product?")) {
          startTransition(async () => {
            await deleteProduct(productId);
          });
        }
      }}
    >
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}
