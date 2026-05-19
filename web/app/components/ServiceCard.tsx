export function ServiceCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <a href={href} className="card-surface group hover:-translate-y-1">
      <div className="flex items-center justify-between gap-4">
        <p className="text-lg font-semibold text-white">{title}</p>
        <span className="text-sm text-cyan-200">→</span>
      </div>
      <p className="mt-4 text-slate-300">{description}</p>
    </a>
  );
}
