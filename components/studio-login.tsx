"use client";

import { useActionState } from "react";
import { studioLogin, studioLogout } from "@/app/actions";
import { btn, btnGhost, field, labelCls } from "./styles";

export function StudioLogin() {
  const [state, action, pending] = useActionState(studioLogin, null);
  return (
    <form action={action} className="mx-auto mt-10 max-w-sm space-y-4">
      <label className="block">
        <span className={labelCls}>Studio password</span>
        <input name="password" type="password" required className={field} />
      </label>
      <button className={btn} type="submit" disabled={pending}>
        Enter
      </button>
      {state?.message ? <p className="text-sm text-danger">{state.message}</p> : null}
    </form>
  );
}

export function StudioLogout() {
  return (
    <form action={studioLogout}>
      <button className={btnGhost} type="submit">
        Sign out
      </button>
    </form>
  );
}
