"use client";

import type { FormEvent } from "react";
import { useState } from "react";

export default function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submittedEmail = email.trim();

    if (!submittedEmail || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");

    try {
      const response = await fetch(
        "https://nextnative.dev/api/playground-access",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: submittedEmail }),
        },
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-[70px] border border-black/20 p-5 dark:border-white/20">
      <h2 className="text-[18px] font-bold leading-normal">
        Get my essays in your inbox
      </h2>
      <p className="pt-2 pb-4 text-[16px] leading-normal">
        Thoughts on engineering, slow productivity, books, and building calmer
        software.
      </p>

      <form
        className="flex flex-col gap-2 sm:flex-row sm:items-center"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          name="email"
          placeholder="email@domain.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-10 w-full border border-black/30 px-3 text-[16px] outline-none placeholder:text-gray-500 focus:border-black dark:border-white/30 dark:focus:border-white"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 border border-black/50 px-4 text-[16px] disabled:opacity-60 dark:border-white/50"
        >
          {isSubmitting ? "Sending..." : "Subscribe"}
        </button>
      </form>

      {status === "success" && (
        <p className="pt-3 text-sm text-gray-500 dark:text-[rgb(190,190,190)]">
          Success. Check your inbox.
        </p>
      )}
      {status === "error" && (
        <p className="pt-3 text-sm text-gray-500 dark:text-[rgb(190,190,190)]">
          Something went wrong. Please try again.
        </p>
      )}

      <p className="pt-3 text-xs text-gray-500 dark:text-[rgb(190,190,190)]">
        Only quality writing. No spam. Unsubscribe anytime.
      </p>
    </section>
  );
}
