import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Document } from "@/components/document";
import { ContactForm } from "@/components/forms";
import { JsonLd } from "@/components/json-ld";
import { SizeTable } from "@/components/size-table";
import { faqs, getInfoPage, infoPages } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return infoPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const page = getInfoPage(slug);
  if (!page) return { title: "Page" };
  return pageMeta(page.title, page.description, `/pages/${page.slug}`);
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const page = getInfoPage(slug);
  if (!page) notFound();
  return (
    <Document title={page.title} lede={page.lede} sections={page.sections}>
      {page.slug === "contact" ? <ContactForm /> : null}
      {page.slug === "size-guide" ? (
        <div className="mt-10 space-y-8">
          <div>
            <h2 className="font-serif text-3xl">Adults, centimetres</h2>
            <SizeTable kind="adult" unit="cm" />
          </div>
          <div>
            <h2 className="font-serif text-3xl">Adults, inches</h2>
            <SizeTable kind="adult" unit="in" />
          </div>
          <div>
            <h2 className="font-serif text-3xl">Girls 10+, centimetres</h2>
            <SizeTable kind="girls" unit="cm" />
          </div>
          <div>
            <h2 className="font-serif text-3xl">Girls 10+, inches</h2>
            <SizeTable kind="girls" unit="in" />
          </div>
        </div>
      ) : null}
      {page.slug === "faq" ? (
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            }}
          />
          <div className="mt-8 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="border-b border-sand py-3">
                <summary className="min-h-11 text-base">{faq.question}</summary>
                <p className="pb-3 text-sm text-stone-deep">{faq.answer}</p>
              </details>
            ))}
          </div>
        </>
      ) : null}
    </Document>
  );
}
