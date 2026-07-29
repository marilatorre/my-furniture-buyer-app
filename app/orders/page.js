import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getBudgetSummary } from "@/lib/budget";
import BudgetBar from "@/components/BudgetBar";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  const userId = Number(session.user.id);

  const [orders, summary] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    }),
    getBudgetSummary(userId),
  ]);

  return (
    <main className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-black/60 dark:text-white/60">
          Everything you&apos;ve ordered so far.
        </p>
      </div>

      {summary ? <BudgetBar {...summary} /> : null}

      {orders.length === 0 ? (
        <p className="text-sm text-black/60 dark:text-white/60">
          You haven&apos;t placed any orders yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            const lineTotal = order.product.price * order.quantity;
            return (
              <div
                key={order.id}
                className="flex items-center gap-4 rounded-lg border border-black/10 dark:border-white/10 p-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={order.product.imageUrl}
                  alt={order.product.name}
                  className="w-16 h-16 object-cover rounded shrink-0"
                />
                <div className="flex-1">
                  <p className="font-semibold">{order.product.name}</p>
                  <p className="text-sm text-black/60 dark:text-white/60">
                    Qty {order.quantity} x ${order.product.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-black/50 dark:text-white/50">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="font-semibold whitespace-nowrap">
                  ${lineTotal.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
