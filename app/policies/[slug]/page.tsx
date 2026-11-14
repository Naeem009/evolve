import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) notFound();
  return <Document title={policy.title} lede={policy.lede} sections={policy.sections} />;
}
