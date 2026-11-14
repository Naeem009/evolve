"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { confirmSandboxPayment } from "@/app/actions";
import { btn } from "./styles";

export function PayButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <div>
      <button
        type="button"
        className={`${btn} mt-6`}
        disabled={pending}
        onClick={async () => {
          setPending(true);
          const result = await confirmSandboxPayment(orderId);
          if (result.ok && result.next) router.push(result.next);
          else setMessage(result.message ?? "Payment could not be confirmed.");
          setPending(false);
        }}
      >
        {pending ? "Confirming" : "Confirm sandbox payment"}
      </button>
      {message ? <p className="mt-3 text-sm text-danger">{message}</p> : null}
    </div>
  );
}
