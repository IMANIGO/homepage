export function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="space-y-3">
      <p className="text-sm uppercase tracking-[0.32em] text-cyan-200">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="max-w-3xl text-base leading-8 text-slate-300">{description}</p>
    </div>
  );
}
