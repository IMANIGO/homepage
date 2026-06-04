import { linkifyText } from '../../lib/linkify';

type BodySection = {
  title: string;
  items?: string[];
};

type PageBodySectionProps = {
  heading: string;
  text?: string;
  sections?: BodySection[];
};

export function PageBodySection({ heading, text, sections }: PageBodySectionProps) {
  return (
    <section className="prose prose-invert max-w-none text-slate-200">
      <h3 className="mt-0 text-xl text-white">{heading}</h3>
      {sections?.length ? (
        <ol className="mt-4 space-y-5 pl-0 list-none">
          {sections.map((section, index) => (
            <li key={`${section.title}-${index}`} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accentSoft bg-white/5 text-sm font-semibold text-accent">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold text-white">{section.title}</p>
                {section.items?.length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
                    {section.items.map((item) => (
                      <li key={item}>{linkifyText(item)}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      ) : text ? (
        <p className="whitespace-pre-wrap leading-7">{linkifyText(text)}</p>
      ) : null}
    </section>
  );
}
