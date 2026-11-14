"use client";

import { useActionState } from "react";
import { requestReturn } from "@/app/actions";
import { btn, field, labelCls } from "./styles";

export function ReturnForm({ orderId, phone }: { orderId: string; phone: string }) {
  const [state, action, pending] = useActionState(requestReturn, null);
  if (state?.ok) return <p className="text-sm text-success">{state.message}</p>;
  return (
    <form action={action} className="mt-4 max-w-lg space-y-3">
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="phone" value={phone} />
      <label className="block">
        <span className={labelCls}>Request</span>
        <select name="type" className={field}>
          <option value="exchange">Exchange</option>
          <option value="refund">Refund</option>
        </select>
      </label>
      <label className="block">
        <span className={labelCls}>Reason</span>
        <input name="reason" required className={field} placeholder="Size, colour, fault" />
      </label>
      <label className="block">
        <span className={labelCls}>Notes</span>
        <textarea name="notes" required rows={4} className={`${field} py-3`} />
      </label>
      <button className={btn} type="submit" disabled={pending}>
        Submit request
      </button>
      {state?.message ? <p className="text-sm text-danger">{state.message}</p> : null}
    </form>
  );
}
