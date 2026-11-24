"use client";

import Script from "next/script";
import { useActionState } from "react";
import { subscribe } from "@/app/actions";
import { btn, field, labelCls } from "../styles";

export function SignupForm({
  id,
  source,
  showPhone,
  requireConsent,
  turnstileSiteKey,
}: {
  id: string;
  source: "circle" | "newsletter";
  showPhone?: boolean;
  requireConsent?: boolean;
  turnstileSiteKey?: string;
}) {
  const [state, action, pending] = useActionState(subscribe, null);
  if (state?.ok) {
    return <p className="text-sm text-stone-deep">{state.message}</p>;
  }
  return (
    <form action={action} className="relative mt-6 space-y-3 overflow-hidden">
      {turnstileSiteKey ? <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer /> : null}
      <input type="hidden" name="source" value={source} />
      <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0" aria-hidden="true">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <label className={labelCls} htmlFor={`${id}-email`}>
          Email
        </label>
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" required className={field} />
      </div>
      {showPhone ? (
        <div>
          <label className={labelCls} htmlFor={`${id}-phone`}>
            WhatsApp, optional
          </label>
          <input id={`${id}-phone`} name="phone" inputMode="tel" autoComplete="tel" placeholder="03XXXXXXXXX" className={field} />
        </div>
      ) : null}
      {requireConsent ? (
        <label className="flex min-h-11 items-center gap-3 text-sm text-stone-deep">
          <input type="checkbox" name="consent" value="yes" required className="h-4 w-4" />
          Email me about new drops. I can unsubscribe.
        </label>
      ) : null}
      {turnstileSiteKey ? <div className="cf-turnstile" data-sitekey={turnstileSiteKey} /> : null}
      <button className={btn} type="submit" disabled={pending}>
        {pending ? "Sending" : "Join"}
      </button>
      {state?.message ? <p className="text-sm text-danger">{state.message}</p> : null}
    </form>
  );
}
