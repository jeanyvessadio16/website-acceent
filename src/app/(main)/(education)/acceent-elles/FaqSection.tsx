"use client";

import { useState } from "react";
import { questions } from "@/data/education/acceentElles";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      <div className="mb-6">
        <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-3">
          Questions fréquentes
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">FAQ</h3>
      </div>
      <div className="divide-y divide-slate-200 rounded-3xl border border-slate-200 overflow-hidden bg-white">
        {questions.map((q) => (
          <div key={q.id}>
            <button
              type="button"
              onClick={() => setOpenFaq(openFaq === q.id ? null : q.id)}
              className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 hover:bg-slate-50 transition-colors"
              aria-expanded={openFaq === q.id}
            >
              <span className="text-sm sm:text-base font-semibold text-slate-900">
                {q.question}
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-primary transition-transform duration-200 ${
                  openFaq === q.id ? "rotate-180" : ""
                }`}
              />
            </button>
            {openFaq === q.id && (
              <div className="px-6 pb-5">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {q.reponse}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
