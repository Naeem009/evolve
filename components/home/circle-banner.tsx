import type { HomeSection } from "@/lib/home/schema";
import { SignupForm } from "./signup-form";

export function CircleBanner({
  section,
  turnstileSiteKey,
}: {
  section: Extract<HomeSection, { type: "circle" }>;
  turnstileSiteKey?: string;
}) {
  return (
    <section className="bg-sand">
      <div className="mx-auto max-w-xl px-4 py-16 lg:py-24">
        <h2 className="font-serif text-4xl md:text-5xl">{section.heading}</h2>
        <p className="mt-4 text-stone-deep">{section.body}</p>
        <SignupForm id="circle" source="circle" showPhone requireConsent turnstileSiteKey={turnstileSiteKey} />
      </div>
    </section>
  );
}
