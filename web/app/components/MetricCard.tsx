export function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="card-surface">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-300">{detail}</p>
    </div>
  );
}
