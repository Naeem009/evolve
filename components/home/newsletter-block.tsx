import type { HomeSection } from "@/lib/home/schema";
import { SignupForm } from "./signup-form";

export function NewsletterBlock({
  section,
  turnstileSiteKey,
}: {
  section: Extract<HomeSection, { type: "newsletter" }>;
  turnstileSiteKey?: string;
}) {
  return (
    <section className="mx-auto max-w-md px-4 py-16 text-center lg:py-24">
      <h2 className="text-[12px] uppercase tracking-[0.18em]">{section.heading}</h2>
      <p className="mt-3 text-sm text-stone-deep">New pieces and the occasional note. No noise.</p>
      <SignupForm id="letters" source="newsletter" turnstileSiteKey={turnstileSiteKey} />
    </section>
  );
}
