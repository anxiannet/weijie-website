export function AdminStatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
