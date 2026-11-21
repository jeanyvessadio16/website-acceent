"use client";

import { useState } from "react";
import { Mail, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { subscribeNewsletterAction } from "@/actions/newsletter";
import { subscribeNewsletterSchema } from "@/validation/newsletter";

interface NewsletterSubscribeFormProps {
  variant?: "dark" | "light";
  compact?: boolean;
}

export function NewsletterSubscribeForm({
  variant = "light",
  compact = false,
}: NewsletterSubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const payload = {
      email,
      name: compact ? undefined : name || undefined,
    };

    const parsed = subscribeNewsletterSchema.safeParse(payload);
    if (!parsed.success) {
      setFeedback({
        type: "error",
        text: parsed.error.issues[0]?.message || "Veuillez vérifier votre saisie.",
      });
      return;
    }

    setLoading(true);
    const res = await subscribeNewsletterAction(parsed.data);
    setLoading(false);

    if (res.success) {
      setEmail("");
      setName("");
      setFeedback({ type: "success", text: res.message });
    } else {
      setFeedback({ type: "error", text: res.message });
    }
  };

  const isDark = variant === "dark";

  return (
    <div className="space-y-3">
      <form
        onSubmit={handleSubmit}
        noValidate
        className={`flex flex-col ${compact ? "sm:flex-row" : "md:flex-row"} gap-2.5`}
      >
        {!compact && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre prénom (optionnel)"
            aria-label="Votre prénom (optionnel)"
            className={`h-11 px-4 rounded-full text-sm outline-none border transition-colors ${
              isDark
                ? "bg-white/10 border-white/15 text-white placeholder:text-slate-400 focus:border-[#b9939e]"
                : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#836182]"
            }`}
          />
        )}

        <div className="relative flex-1 min-w-0">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 pointer-events-none text-slate-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse e-mail…"
            aria-label="Adresse e-mail pour la newsletter"
            className={`w-full h-11 pl-10 pr-4 rounded-full text-sm outline-none border transition-colors ${
              isDark
                ? "bg-white/10 border-white/15 text-white placeholder:text-slate-400 focus:border-[#b9939e]"
                : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#836182]"
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-11 px-6 rounded-full bg-[#836182] hover:bg-[#6d4c6c] text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors shadow-sm shrink-0 cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <Send className="size-3.5" />
              <span>S&apos;abonner</span>
            </>
          )}
        </button>
      </form>

      {feedback && (
        <div
          role={feedback.type === "error" ? "alert" : "status"}
          className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-xl border ${
            feedback.type === "success"
              ? isDark
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
              : isDark
              ? "bg-red-500/15 border-red-500/30 text-red-300"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="size-4 shrink-0" />
          ) : (
            <AlertCircle className="size-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}
    </div>
  );
}
