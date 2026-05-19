export function QuoteCard({ quote, author, company }: { quote: string; author: string; company: string }) {
  return (
    <div className="card-surface border border-cyan-200/10">
      <p className="text-lg leading-8 text-slate-100">“{quote}”</p>
      <div className="mt-5 text-sm text-slate-400">
        <p className="font-semibold text-white">{author}</p>
        <p>{company}</p>
      </div>
    </div>
  );
}
