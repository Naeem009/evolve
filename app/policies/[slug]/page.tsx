import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Document } from "@/components/document";
import { getPolicy, policies } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return policies.map((policy) => ({ slug: policy.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) return { title: "Policy" };
  return pageMeta(policy.title, policy.description, `/policies/${policy.slug}`);
}

export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-16 text-sm text-stone-deep">Loading the policy…</div>}>
      <Policy params={params} />
    </Suspense>
  );
}

async function Policy({ params }: { params: Params }) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) notFound();
  return <Document title={policy.title} lede={policy.lede} sections={policy.sections} />;
}
