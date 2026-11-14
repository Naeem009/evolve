import type { DocSection } from "@/lib/content";

export function Document({
  title,
  lede,
  sections,
  children,
}: {
  title: string;
  lede: string;
  sections: DocSection[];
  children?: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <span className="mb-4 block h-px w-8 bg-accent" />
      <h1 className="font-serif text-5xl font-medium">{title}</h1>
      <p className="mt-4 text-stone-deep">{lede}</p>
      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-serif text-3xl">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-[15px] leading-7">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
      {children}
    </article>
  );
}
