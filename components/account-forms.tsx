"use client";

import { useActionState } from "react";
import { saveAddress, signIn, signOut } from "@/app/actions";
import { provinces } from "@/lib/shipping";
import { btn, btnGhost, field, labelCls } from "./styles";

export function SignInForm() {
  const [state, action, pending] = useActionState(signIn, null);
  return (
    <form action={action} className="mt-8 max-w-md space-y-4">
      <label className="block">
        <span className={labelCls}>Name</span>
        <input name="name" required className={field} />
      </label>
      <label className="block">
        <span className={labelCls}>Mobile</span>
        <input name="phone" required placeholder="03XXXXXXXXX" className={field} />
      </label>
      <label className="block">
        <span className={labelCls}>Email, optional</span>
        <input name="email" type="email" className={field} />
      </label>
      <button className={btn} disabled={pending} type="submit">
        {pending ? "Saving" : "Continue"}
      </button>
      {state?.message ? <p className="text-sm text-danger">{state.message}</p> : null}
      <p className="text-[13px] text-stone-deep">This remembers you on this device. It is not a password login. Phone verification arrives with the commerce backend.</p>
    </form>
  );
}

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button className={btnGhost} type="submit">
        Sign out
      </button>
    </form>
  );
}

export function AddressForm() {
  const [state, action, pending] = useActionState(saveAddress, null);
  return (
    <form action={action} className="mt-4 grid gap-3 sm:grid-cols-2">
      <label className="block">
        <span className={labelCls}>Province</span>
        <select name="province" className={field} required>
          {provinces.map((province) => (
            <option key={province.id}>{province.name}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className={labelCls}>City</span>
        <select name="city" className={field} required>
          {provinces.flatMap((province) => province.cities.map((city) => (
            <option key={city.name}>{city.name}</option>
          )))}
        </select>
      </label>
      <label className="block sm:col-span-2">
        <span className={labelCls}>Address</span>
        <textarea name="address" required rows={3} className={`${field} py-3`} />
      </label>
      <label className="block sm:col-span-2">
        <span className={labelCls}>Landmark</span>
        <input name="landmark" className={field} />
      </label>
      <button className={btn} type="submit" disabled={pending}>
        Save address
      </button>
      {state?.message ? <p className="text-sm">{state.message}</p> : null}
    </form>
  );
}
