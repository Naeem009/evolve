"use client";

import { useActionState } from "react";
import { sendMessage, submitReview, subscribe } from "@/app/actions";
import { btn, field, labelCls } from "./styles";

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribe, null);
  return (
    <form action={action} className="mt-4 space-y-2">
      <label className={labelCls} htmlFor="newsletter-email">
        Email
      </label>
      <input id="newsletter-email" name="email" type="email" autoComplete="email" className={field} />
      <label className={labelCls} htmlFor="newsletter-phone">
        WhatsApp, optional
      </label>
      <input id="newsletter-phone" name="phone" inputMode="tel" autoComplete="tel" placeholder="03XXXXXXXXX" className={field} />
      <button className={`${btn} w-full`} type="submit" disabled={pending}>
        {pending ? "Sending" : "Join"}
      </button>
      {state?.message ? <p className="text-sm text-stone-deep">{state.message}</p> : null}
    </form>
  );
}

export function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, null);
  return (
    <form action={action} className="mt-8 max-w-lg space-y-4">
      <div>
        <label className={labelCls} htmlFor="contact-name">Name</label>
        <input id="contact-name" name="name" required className={field} />
      </div>
      <div>
        <label className={labelCls} htmlFor="contact-phone">Mobile</label>
        <input id="contact-phone" name="phone" required inputMode="tel" placeholder="03XXXXXXXXX" className={field} />
      </div>
      <div>
        <label className={labelCls} htmlFor="contact-body">Message</label>
        <textarea id="contact-body" name="body" required rows={5} className={`${field} py-3`} />
      </div>
      <button className={btn} type="submit" disabled={pending}>
        {pending ? "Sending" : "Send"}
      </button>
      {state?.message ? <p className="text-sm">{state.message}</p> : null}
    </form>
  );
}

export function ReviewForm({ handle, author }: { handle: string; author?: string }) {
  const [state, action, pending] = useActionState(submitReview, null);
  if (state?.ok) return <p className="text-sm text-success">{state.message}</p>;
  return (
    <form action={action} className="mt-6 max-w-lg space-y-3">
      <input type="hidden" name="handle" value={handle} />
      <div>
        <label className={labelCls} htmlFor="review-author">Name</label>
        <input id="review-author" name="author" required defaultValue={author} className={field} />
      </div>
      <div>
        <label className={labelCls} htmlFor="review-rating">Rating</label>
        <select id="review-rating" name="rating" defaultValue="5" className={field}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <option key={rating} value={rating}>
              {rating} star{rating === 1 ? "" : "s"}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls} htmlFor="review-text">Review</label>
        <textarea id="review-text" name="text" required rows={4} className={`${field} py-3`} />
      </div>
      <button className={btn} type="submit" disabled={pending}>
        {pending ? "Sending" : "Submit review"}
      </button>
      {state?.message ? <p className="text-sm text-danger">{state.message}</p> : null}
    </form>
  );
}
