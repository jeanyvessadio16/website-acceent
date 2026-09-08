"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  User,
  Clock,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { FormErrorBanner, SuccessAlertDialog } from "../alerts";
import { FadeIn, StaggerContainer, StaggerItem } from "../Animations";
import { contactSchema, ContactFormData } from "../../../validation/contact";
import { ContactService } from "../../../services/contactService";
import { cn } from "@/lib/utils";

export default function Contact() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema) as any,
  });

  const onSubmit = async (data: ContactFormData) => {
    const result = await ContactService.submitContactForm(data);

    if (result.success) {
      setFormError("");
      setDialogMessage(result.message);
      setDialogOpen(true);
      reset();
    } else {
      setFormError(result.message);
    }
  };

  return (
    <section className="relative bg-slate-50 py-12 sm:py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-10 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <FadeIn delay={0.1} direction="down" className="mb-8 sm:mb-12 text-center">
            <span className="mb-3 inline-block rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary shadow-2xs">
              Contact
            </span>
            <h2 className="mb-3 text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Contactez ACCEENT
            </h2>
            <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed">
              Une question sur nos programmes ou nos activités à Ziguinchor ? N&apos;hésitez pas à nous écrire ou nous contacter directement.
            </p>
          </FadeIn>

          <div className="grid items-stretch gap-6 sm:gap-8 lg:grid-cols-12">
            {/* Left Column: Info */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <FadeIn
                delay={0.2}
                direction="right"
                className="h-full flex flex-col justify-between gap-6"
              >
                <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xs flex-grow">
                  <h3 className="mb-5 sm:mb-6 text-lg sm:text-xl font-bold text-slate-900">
                    Nos coordonnées
                  </h3>

                  <StaggerContainer
                    delay={0.3}
                    className="space-y-6 sm:space-y-8 relative z-10"
                  >
                    <StaggerItem>
                      <div className="group/item flex items-start gap-4 sm:gap-5">
                        <div className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-white transition-all duration-300 group-hover/item:bg-primary/5 group-hover/item:scale-110 group-hover/item:shadow-md border border-slate-200/50">
                          <MapPin
                            className="text-slate-600 transition-colors duration-300 group-hover/item:text-primary size-5 sm:size-6"
                          />
                        </div>
                        <div>
                          <h4 className="mb-0.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                            Adresse
                          </h4>
                          <p className="text-slate-800 font-semibold text-sm sm:text-lg leading-relaxed">
                            Quartier Santhiaba
                            <br />
                            Ziguinchor, Sénégal
                          </p>
                        </div>
                      </div>
                    </StaggerItem>

                    <StaggerItem>
                      <div className="group/item flex items-start gap-4 sm:gap-5">
                        <div className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-white transition-all duration-300 group-hover/item:bg-primary/5 group-hover/item:scale-110 group-hover/item:shadow-md border border-slate-200/50">
                          <Mail
                            className="text-slate-600 transition-colors duration-300 group-hover/item:text-primary size-5 sm:size-6"
                          />
                        </div>
                        <div>
                          <h4 className="mb-0.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                            Email
                          </h4>
                          <a
                            href="mailto:info@acceent.org"
                            className="text-slate-800 font-semibold text-sm sm:text-lg transition-colors hover:text-primary relative inline-block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                          >
                            info@acceent.org
                          </a>
                        </div>
                      </div>
                    </StaggerItem>

                    <StaggerItem>
                      <div className="group/item flex items-start gap-4 sm:gap-5">
                        <div className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-white transition-all duration-300 group-hover/item:bg-primary/5 group-hover/item:scale-110 group-hover/item:shadow-md border border-slate-200/50">
                          <Phone
                            className="text-slate-600 transition-colors duration-300 group-hover/item:text-primary size-5 sm:size-6"
                          />
                        </div>
                        <div>
                          <h4 className="mb-0.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                            Téléphone
                          </h4>
                          <a
                            href="tel:+221761417070"
                            className="text-slate-800 font-semibold text-sm sm:text-lg transition-colors hover:text-primary relative inline-block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                          >
                            +221 76 141 70 70
                          </a>
                        </div>
                      </div>
                    </StaggerItem>
                  </StaggerContainer>
                </div>

                <div className="rounded-2xl border border-primary/10 bg-white/40 px-4 py-4 sm:px-6 sm:py-5 text-xs sm:text-sm font-semibold text-primary shadow-sm flex items-center gap-3 backdrop-blur-xl">
                  <div className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                  <span className="text-slate-700 flex items-center gap-1.5 leading-snug">
                    <Clock size={14} className="text-slate-400 shrink-0" />
                    Nous vous répondrons dans les 72 heures ouvrables.
                  </span>
                </div>
              </FadeIn>
            </div>

            {/* Right Column: Form */}
            <FadeIn
              delay={0.4}
              direction="left"
              className="lg:col-span-7 h-full"
            >
              <Card className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_8px_40px_rgb(0,0,0,0.06)] backdrop-blur-2xl h-full p-0">
                <CardContent className="p-5 sm:p-8 md:p-12">
                  <div className="mb-6 sm:mb-8">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1.5">
                      Envoyez-nous un message
                    </h3>
                    <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                      Remplissez le formulaire, nous reviendrons vers vous avec
                      une réponse claire et personnalisée.
                    </p>
                  </div>

                  <FormErrorBanner message={formError} />

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                    {/* Bot honeypot */}
                    <input
                      type="checkbox"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="absolute -left-[9999px] h-0 w-0 opacity-0"
                      {...register("botcheck")}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {/* Name input */}
                      <div className="space-y-1.5 sm:space-y-2 relative group">
                        <Label
                          htmlFor="nomComplet"
                          className={cn(
                            "text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors duration-200",
                            focusedField === "nomComplet"
                              ? "text-primary"
                              : "text-slate-700",
                          )}
                        >
                          <User
                            size={16}
                            className={cn(
                              "transition-colors duration-200",
                              focusedField === "nomComplet"
                                ? "text-primary"
                                : "text-slate-400",
                            )}
                          />
                          Prénom et Nom <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="nomComplet"
                          type="text"
                          {...register("nomComplet")}
                          onFocus={() => setFocusedField("nomComplet")}
                          onBlur={() => setFocusedField(null)}
                          autoComplete="name"
                          aria-invalid={Boolean(errors.nomComplet)}
                          placeholder="Votre nom complet"
                          className={cn(
                            "w-full rounded-xl border px-3.5 py-3 sm:px-4 sm:py-5 text-sm text-slate-900 transition-all duration-300 placeholder:text-slate-400 bg-white/60 shadow-xs",
                            errors.nomComplet
                              ? "border-red-300 focus-visible:ring-red-400/25 focus-visible:border-red-500 bg-red-50/20"
                              : "border-slate-200 focus-visible:ring-primary/25 focus-visible:border-primary hover:border-slate-300 focus-visible:ring-2 focus-visible:outline-none",
                          )}
                        />
                        {errors.nomComplet && (
                          <p className="text-xs font-semibold text-red-500 mt-1">
                            {errors.nomComplet.message}
                          </p>
                        )}
                      </div>

                      {/* Email input */}
                      <div className="space-y-1.5 sm:space-y-2 relative group">
                        <Label
                          htmlFor="email"
                          className={cn(
                            "text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors duration-200",
                            focusedField === "email"
                              ? "text-primary"
                              : "text-slate-700",
                          )}
                        >
                          <Mail
                            size={16}
                            className={cn(
                              "transition-colors duration-200",
                              focusedField === "email"
                                ? "text-primary"
                                : "text-slate-400",
                            )}
                          />
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField(null)}
                          autoComplete="email"
                          aria-invalid={Boolean(errors.email)}
                          placeholder="votre@email.com"
                          className={cn(
                            "w-full rounded-xl border px-3.5 py-3 sm:px-4 sm:py-5 text-sm text-slate-900 transition-all duration-300 placeholder:text-slate-400 bg-white/60 shadow-xs",
                            errors.email
                              ? "border-red-300 focus-visible:ring-red-400/25 focus-visible:border-red-500 bg-red-50/20"
                              : "border-slate-200 focus-visible:ring-primary/25 focus-visible:border-primary hover:border-slate-300 focus-visible:ring-2 focus-visible:outline-none",
                          )}
                        />
                        {errors.email && (
                          <p className="text-xs font-semibold text-red-500 mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Phone input */}
                    <div className="space-y-1.5 sm:space-y-2 relative">
                      <Label
                        htmlFor="telephone"
                        className={cn(
                          "text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors duration-200",
                          focusedField === "telephone"
                            ? "text-primary"
                            : "text-slate-700",
                        )}
                      >
                        <Phone
                          size={16}
                          className={cn(
                            "transition-colors duration-200",
                            focusedField === "telephone"
                              ? "text-primary"
                              : "text-slate-400",
                          )}
                        />
                        Téléphone <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="telephone"
                        type="tel"
                        {...register("telephone")}
                        onFocus={() => setFocusedField("telephone")}
                        onBlur={() => setFocusedField(null)}
                        autoComplete="tel"
                        aria-invalid={Boolean(errors.telephone)}
                        placeholder="+221 77 123 45 67"
                        className={cn(
                          "w-full rounded-xl border px-3.5 py-3 sm:px-4 sm:py-5 text-sm text-slate-900 transition-all duration-300 placeholder:text-slate-400 bg-white/60 shadow-xs",
                          errors.telephone
                            ? "border-red-300 focus-visible:ring-red-400/25 focus-visible:border-red-500 bg-red-50/20"
                            : "border-slate-200 focus-visible:ring-primary/25 focus-visible:border-primary hover:border-slate-300 focus-visible:ring-2 focus-visible:outline-none",
                        )}
                      />
                      {errors.telephone && (
                        <p className="text-xs font-semibold text-red-500 mt-1">
                          {errors.telephone.message}
                        </p>
                      )}
                    </div>

                    {/* Message input */}
                    <div className="space-y-1.5 sm:space-y-2 relative">
                      <Label
                        htmlFor="message"
                        className={cn(
                          "text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors duration-200",
                          focusedField === "message"
                            ? "text-primary"
                            : "text-slate-700",
                        )}
                      >
                        <MessageSquare
                          size={16}
                          className={cn(
                            "transition-colors duration-200",
                            focusedField === "message"
                              ? "text-primary"
                              : "text-slate-400",
                          )}
                        />
                        Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        {...register("message")}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField(null)}
                        aria-invalid={Boolean(errors.message)}
                        placeholder="Décrivez votre demande ou votre question..."
                        className={cn(
                          "min-h-[120px] sm:min-h-[140px] w-full rounded-xl resize-none border px-3.5 py-3 sm:px-4 sm:py-4 text-sm text-slate-900 transition-all duration-300 placeholder:text-slate-400 bg-white/60 shadow-xs",
                          errors.message
                            ? "border-red-300 focus-visible:ring-red-400/25 focus-visible:border-red-500 bg-red-50/20"
                            : "border-slate-200 focus-visible:ring-primary/25 focus-visible:border-primary hover:border-slate-300 focus-visible:ring-2 focus-visible:outline-none",
                        )}
                      />
                      {errors.message && (
                        <p className="text-xs font-semibold text-red-500 mt-1">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 sm:pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative w-full overflow-hidden rounded-xl bg-slate-900 px-6 py-3.5 sm:px-8 sm:py-6 font-bold text-white shadow-[0_8px_20px_rgb(0,0,0,0.12)] transition-all duration-300 hover:scale-[1.01] hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-75 h-12 sm:h-14"
                      >
                        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
                          <div className="relative h-full w-8 bg-white/10" />
                        </div>
                        <span className="relative flex items-center justify-center text-sm sm:text-base">
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-b-2 border-white" />
                              Envoi en cours...
                            </span>
                          ) : (
                            <>
                              <Send
                                size={16}
                                className="mr-2 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                              />
                              Envoyer le message
                              <ArrowRight
                                size={16}
                                className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                              />
                            </>
                          )}
                        </span>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>

      <SuccessAlertDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        message={dialogMessage}
      />
    </section>
  );
}
