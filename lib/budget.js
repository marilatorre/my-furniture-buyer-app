import prisma from "@/lib/prisma";

// Spend/remaining aren't stored anywhere — they're computed from the
// user's orders each time, so they can never drift out of sync.
export async function getBudgetSummary(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return null;
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { product: true },
  });

  const spent = orders.reduce(
    (total, order) => total + order.product.price * order.quantity,
    0
  );

  return {
    budget: user.budget,
    spent,
    remaining: user.budget - spent,
  };
}
