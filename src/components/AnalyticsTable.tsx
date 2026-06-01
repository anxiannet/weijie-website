export function AnalyticsTable({ title, rows }: { title: string; rows: Array<{ name: string; value: number | string }> }) {
  return (
    <section className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-3 divide-y divide-slate-100">
        {rows.map((row) => (
          <div key={row.name} className="flex items-center justify-between py-2 text-sm">
            <span>{row.name}</span>
            <span className="font-semibold text-brand">{row.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
