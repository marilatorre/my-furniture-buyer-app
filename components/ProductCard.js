"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleOrder() {
    setMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: data.error });
      } else {
        setMessage({ type: "success", text: "Order placed!" });
        router.refresh();
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong. Try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10 overflow-hidden flex flex-col">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-black/60 dark:text-white/60 flex-1">
          {product.description}
        </p>
        <p className="font-semibold">${product.price.toFixed(2)}</p>

        <div className="flex items-center gap-2 mt-2">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-16 rounded border border-black/10 dark:border-white/20 bg-transparent px-2 py-1 text-sm"
          />
          <button
            onClick={handleOrder}
            disabled={isSubmitting}
            className="flex-1 rounded bg-black text-white dark:bg-white dark:text-black px-3 py-1.5 text-sm disabled:opacity-50"
          >
            {isSubmitting ? "Ordering..." : "Order"}
          </button>
        </div>

        {message ? (
          <p
            className={
              message.type === "error"
                ? "text-sm text-red-600"
                : "text-sm text-green-600"
            }
          >
            {message.text}
          </p>
        ) : null}
      </div>
    </div>
  );
}
