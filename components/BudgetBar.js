export default function BudgetBar({ budget, spent, remaining }) {
  const percentSpent = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;

  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
      <div className="flex justify-between text-sm mb-2">
        <span>Budget: ${budget.toFixed(2)}</span>
        <span>Spent: ${spent.toFixed(2)}</span>
        <span>Remaining: ${remaining.toFixed(2)}</span>
      </div>
      <div className="w-full h-2 rounded bg-black/10 dark:bg-white/10 overflow-hidden">
        <div
          className="h-full bg-black dark:bg-white"
          style={{ width: `${percentSpent}%` }}
        />
      </div>
    </div>
  );
}
