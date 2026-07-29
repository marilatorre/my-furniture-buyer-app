import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getBudgetSummary } from "@/lib/budget";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(
      { error: "You need to log in to place an order." },
      { status: 401 }
    );
  }

  const body = await request.json();
  const productId = Number(body.productId);
  const quantity = Number(body.quantity);

  if (!productId || !Number.isInteger(quantity) || quantity < 1) {
    return Response.json(
      { error: "Enter a valid quantity." },
      { status: 400 }
    );
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product) {
    return Response.json({ error: "Product not found." }, { status: 404 });
  }

  const userId = Number(session.user.id);
  const summary = await getBudgetSummary(userId);
  const orderTotal = product.price * quantity;

  if (orderTotal > summary.remaining) {
    const over = (orderTotal - summary.remaining).toFixed(2);
    return Response.json(
      { error: `This would put you $${over} over budget.` },
      { status: 400 }
    );
  }

  await prisma.order.create({
    data: { userId, productId, quantity },
  });

  const updatedSummary = await getBudgetSummary(userId);
  return Response.json({ success: true, summary: updatedSummary });
}
