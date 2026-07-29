import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getBudgetSummary } from "@/lib/budget";
import ProductCard from "@/components/ProductCard";
import BudgetBar from "@/components/BudgetBar";

const PAGE_SIZE = 24;

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page) || 1);

  const session = await getServerSession(authOptions);
  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      orderBy: { id: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count(),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
  const summary = session
    ? await getBudgetSummary(Number(session.user.id))
    : null;

  return (
    <main className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Furniture Catalogue</h1>
        <p className="text-black/60 dark:text-white/60">
          Browse the collection and place an order.
        </p>
      </div>

      {summary ? <BudgetBar {...summary} /> : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-black/60 dark:text-white/60">
          Page {page} of {totalPages} ({totalProducts} products)
        </span>
        <div className="flex gap-2">
          {page > 1 ? (
            <Link
              href={`/?page=${page - 1}`}
              className="rounded bg-black/5 dark:bg-white/10 px-3 py-1.5"
            >
              Previous
            </Link>
          ) : null}
          {page < totalPages ? (
            <Link
              href={`/?page=${page + 1}`}
              className="rounded bg-black/5 dark:bg-white/10 px-3 py-1.5"
            >
              Next
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}
