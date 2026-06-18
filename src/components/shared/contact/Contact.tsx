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
  Sparkles,
  Clock,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { FormErrorBanner, SuccessAlertDialog } from "../alerts";
import { FadeIn, StaggerContainer, StaggerItem } from "../Animations";
import { contactSchema, ContactFormData } from "../../../zodSchema/contact";
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
    <section className="relative overflow-hidden bg-slate-50/50 py-20 md:py-32">
      {/* Premium Background Blurs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[50vw] w-[50vw] rounded-full bg-[#836182]/10 blur-[120px] mix-blend-multiply" />
        <div className="absolute top-[20%] right-[-10%] h-[40vw] w-[40vw] rounded-full bg-[#b9939e]/15 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-20%] left-[20%] h-[60vw] w-[60vw] rounded-full bg-[#836182]/10 blur-[120px] mix-blend-multiply" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <FadeIn delay={0.1} direction="down" className="mb-16 text-center">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md px-5 py-2 text-sm font-bold text-primary shadow-sm">
              <Sparkles size={14} className="animate-pulse" />
              Restons en contact
            </span>
            <h2 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-none">
              Discutons de votre <span className="text-primary">projet</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-600 leading-relaxed">
              Nous sommes là pour vous accompagner. N&apos;hésitez pas à nous
              contacter pour toute question ou collaboration, nous vous
              répondrons rapidement.
            </p>
          </FadeIn>

          <div className="grid items-stretch gap-10 lg:grid-cols-12">
            {/* Left Column: Info */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              <FadeIn delay={0.2} direction="right" className="h-full flex flex-col justify-between gap-6">
                <div className="rounded-3xl border border-white/60 bg-white/60 p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl relative overflow-hidden group flex-grow">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <h3 className="mb-8 flex items-center gap-4 text-2xl font-bold text-slate-900 relative z-10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20">
                      <MapPin className="text-white" size={24} />
                    </div>
                    Nos coordonnées
                  </h3>

                  <StaggerContainer delay={0.3} className="space-y-8 relative z-10">
                    <StaggerItem>
                      <div className="group/item flex items-start gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white transition-all duration-300 group-hover/item:bg-primary/5 group-hover/item:scale-110 group-hover/item:shadow-md border border-slate-200/50">
                          <MapPin
                            className="text-slate-600 transition-colors duration-300 group-hover/item:text-primary"
                            size={24}
                          />
                        </div>
                        <div>
                          <h4 className="mb-1 text-sm font-bold uppercase tracking-wider text-slate-400">
                            Adresse
                          </h4>
                          <p className="text-slate-800 font-semibold text-lg leading-relaxed">
                            Quartier Santhiaba
                            <br />
                            Ziguinchor, Sénégal
                          </p>
                        </div>
                      </div>
                    </StaggerItem>

                    <StaggerItem>
                      <div className="group/item flex items-start gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white transition-all duration-300 group-hover/item:bg-primary/5 group-hover/item:scale-110 group-hover/item:shadow-md border border-slate-200/50">
                          <Mail
                            className="text-slate-600 transition-colors duration-300 group-hover/item:text-primary"
                            size={24}
                          />
                        </div>
                        <div>
                          <h4 className="mb-1 text-sm font-bold uppercase tracking-wider text-slate-400">
                            Email
                          </h4>
                          <a
                            href="mailto:info@acceent.org"
                            className="text-slate-800 font-semibold text-lg transition-colors hover:text-primary relative inline-block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                          >
                            info@acceent.org
                          </a>
                        </div>
                      </div>
                    </StaggerItem>

                    <StaggerItem>
                      <div className="group/item flex items-start gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white transition-all duration-300 group-hover/item:bg-primary/5 group-hover/item:scale-110 group-hover/item:shadow-md border border-slate-200/50">
                          <Phone
                            className="text-slate-600 transition-colors duration-300 group-hover/item:text-primary"
                            size={24}
                          />
                        </div>
                        <div>
                          <h4 className="mb-1 text-sm font-bold uppercase tracking-wider text-slate-400">
                            Téléphone
                          </h4>
                          <a
                            href="tel:+221761417070"
                            className="text-slate-800 font-semibold text-lg transition-colors hover:text-primary relative inline-block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                          >
                            +221 76 141 70 70
                          </a>
                        </div>
                      </div>
                    </StaggerItem>
                  </StaggerContainer>
                </div>

                <div className="rounded-2xl border border-primary/10 bg-white/40 px-6 py-5 text-sm font-semibold text-primary shadow-sm flex items-center gap-3 backdrop-blur-xl">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <Clock size={14} className="text-slate-400" />
                    Temps de réponse : moins de 24h les jours ouvrés
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
              <Card className="overflow-hidden rounded-3xl border border-white/80 bg-white/85 shadow-[0_8px_40px_rgb(0,0,0,0.06)] backdrop-blur-2xl h-full">
                <CardContent className="p-8 md:p-12">
                  <div className="mb-8">
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-2">
                      Envoyez-nous un message
                    </h3>
                    <p className="text-slate-500 text-lg leading-relaxed">
                      Remplissez le formulaire, nous reviendrons vers vous avec
                      une réponse claire et personnalisée.
                    </p>
                  </div>

                  <FormErrorBanner message={formError} />

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Bot honeypot */}
                    <input
                      type="checkbox"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="absolute -left-[9999px] h-0 w-0 opacity-0"
                      {...register("botcheck")}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name input */}
                      <div className="space-y-2 relative group">
                        <Label
                          htmlFor="nomComplet"
                          className={cn(
                            "text-sm font-bold flex items-center gap-2 transition-colors duration-200",
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
                            "w-full rounded-xl border px-4 py-6 text-slate-900 transition-all duration-300 placeholder:text-slate-400 bg-white/40 shadow-sm",
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
                      <div className="space-y-2 relative group">
                        <Label
                          htmlFor="email"
                          className={cn(
                            "text-sm font-bold flex items-center gap-2 transition-colors duration-200",
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
                            "w-full rounded-xl border px-4 py-6 text-slate-900 transition-all duration-300 placeholder:text-slate-400 bg-white/40 shadow-sm",
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
                    <div className="space-y-2 relative">
                      <Label
                        htmlFor="telephone"
                        className={cn(
                          "text-sm font-bold flex items-center gap-2 transition-colors duration-200",
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
                          "w-full rounded-xl border px-4 py-6 text-slate-900 transition-all duration-300 placeholder:text-slate-400 bg-white/40 shadow-sm",
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
                    <div className="space-y-2 relative">
                      <Label
                        htmlFor="message"
                        className={cn(
                          "text-sm font-bold flex items-center gap-2 transition-colors duration-200",
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
                          "min-h-[140px] w-full rounded-xl resize-none border px-4 py-4 text-slate-900 transition-all duration-300 placeholder:text-slate-400 bg-white/40 shadow-sm",
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
                    <div className="pt-4">
                      <Button
                        type="submit"
                        size="xl"
                        disabled={isSubmitting}
                        className="group relative w-full overflow-hidden rounded-xl bg-slate-900 px-8 py-6 font-bold text-white shadow-[0_8px_20px_rgb(0,0,0,0.12)] transition-all duration-300 hover:scale-[1.01] hover:bg-slate-800 hover:shadow-[0_8px_25px_rgb(0,0,0,0.16)] disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:scale-100"
                      >
                        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
                          <div className="relative h-full w-8 bg-white/10" />
                        </div>
                        <span className="relative flex items-center justify-center text-base">
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                              Envoi en cours...
                            </span>
                          ) : (
                            <>
                              <Send
                                size={18}
                                className="mr-2 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                              />
                              Envoyer le message
                              <ArrowRight
                                size={18}
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
