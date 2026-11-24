import Link from "next/link";
import type { ReactNode } from "react";

const pattern = /\[([^\]]+)\]\((\/[^)\s]+)\)/g;

export function RichText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={className}>
      {text.split(/\n\n+/).map((paragraph) => (
        <p key={paragraph.slice(0, 32)} className="mt-4 text-stone-deep first:mt-0">
          {inline(paragraph)}
        </p>
      ))}
    </div>
  );
}

function inline(paragraph: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of paragraph.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(paragraph.slice(last, index));
    const label = match[1] ?? "";
    const href = match[2] ?? "/";
    nodes.push(
      <Link key={`${href}-${index}`} href={href} className="text-ink underline underline-offset-4">
        {label}
      </Link>,
    );
    last = index + match[0].length;
  }
  if (last < paragraph.length) nodes.push(paragraph.slice(last));
  return nodes;
}
