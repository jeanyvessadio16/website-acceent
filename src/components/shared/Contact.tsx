"use client";

import { useState } from "react";
import {
  ArrowRight,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { FormErrorBanner, SuccessAlertDialog } from "./alerts";
import { FadeIn, StaggerContainer, StaggerItem } from "./Animations";
import { ContactFormData } from "../../zodSchema/contact";
import { ContactService } from "../../services/contactService";
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
  } = useForm<ContactFormData>();

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
    <section className="relative overflow-hidden bg-slate-50 py-20 md:py-32">
      {/* Premium Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[50vw] w-[50vw] rounded-full bg-blue-400/20 blur-[120px] mix-blend-multiply" />
        <div className="absolute top-[20%] right-[-10%] h-[40vw] w-[40vw] rounded-full bg-cyan-400/20 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-20%] left-[20%] h-[60vw] w-[60vw] rounded-full bg-indigo-400/20 blur-[120px] mix-blend-multiply" />
      </div>

      <div className="container relative mx-auto px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <FadeIn delay={0.1} direction="down" className="mb-16 text-center">
            <span className="mb-6 inline-flex items-center rounded-full border border-blue-200/50 bg-blue-50/50 backdrop-blur-md px-5 py-2 text-sm font-bold text-blue-700 shadow-sm">
              Restons en contact
            </span>
            <h2 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
              Discutons de votre <span>projet</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-600 leading-relaxed">
              Nous sommes là pour vous accompagner. N&apos;hésitez pas à nous
              contacter pour toute question ou collaboration, nous vous
              répondrons rapidement.
            </p>
          </FadeIn>

          <div className="grid items-start gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-8">
              <FadeIn delay={0.2} direction="right">
                <div className="rounded-3xl border border-white/60 bg-white/60 p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <h3 className="mb-8 flex items-center gap-4 text-2xl font-bold text-slate-900 relative z-10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-600/20">
                      <MapPin className="text-white" size={24} />
                    </div>
                    Nos coordonnées
                  </h3>

                  <StaggerContainer
                    delay={0.3}
                    className="space-y-8 relative z-10"
                  >
                    <StaggerItem>
                      <div className="group/item flex items-start gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100/80 transition-all duration-300 group-hover/item:bg-blue-50 group-hover/item:scale-110 group-hover/item:shadow-sm border border-slate-200/50">
                          <MapPin
                            className="text-slate-600 transition-colors duration-300 group-hover/item:text-blue-600"
                            size={24}
                          />
                        </div>
                        <div>
                          <h4 className="mb-1 text-sm font-bold uppercase tracking-wider text-slate-500">
                            Adresse
                          </h4>
                          <p className="text-slate-800 font-medium text-lg leading-relaxed">
                            Quartier Santhiaba
                            <br />
                            Ziguinchor, Sénégal
                          </p>
                        </div>
                      </div>
                    </StaggerItem>

                    <StaggerItem>
                      <div className="group/item flex items-start gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100/80 transition-all duration-300 group-hover/item:bg-blue-50 group-hover/item:scale-110 group-hover/item:shadow-sm border border-slate-200/50">
                          <Mail
                            className="text-slate-600 transition-colors duration-300 group-hover/item:text-blue-600"
                            size={24}
                          />
                        </div>
                        <div>
                          <h4 className="mb-1 text-sm font-bold uppercase tracking-wider text-slate-500">
                            Email
                          </h4>
                          <a
                            href="mailto:info@acceent.org"
                            className="text-slate-800 font-medium text-lg transition-colors hover:text-blue-600 relative inline-block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
                          >
                            info@acceent.org
                          </a>
                        </div>
                      </div>
                    </StaggerItem>

                    <StaggerItem>
                      <div className="group/item flex items-start gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100/80 transition-all duration-300 group-hover/item:bg-blue-50 group-hover/item:scale-110 group-hover/item:shadow-sm border border-slate-200/50">
                          <Phone
                            className="text-slate-600 transition-colors duration-300 group-hover/item:text-blue-600"
                            size={24}
                          />
                        </div>
                        <div>
                          <h4 className="mb-1 text-sm font-bold uppercase tracking-wider text-slate-500">
                            Téléphone
                          </h4>
                          <a
                            href="tel:+221761417070"
                            className="text-slate-800 font-medium text-lg transition-colors hover:text-blue-600 relative inline-block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
                          >
                            +221 76 141 70 70
                          </a>
                        </div>
                      </div>
                    </StaggerItem>
                  </StaggerContainer>
                </div>

                <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 px-6 py-5 text-sm font-medium text-blue-800 shadow-sm flex items-center gap-3 backdrop-blur-sm">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  Temps de réponse moyen: moins de 24h les jours ouvrés.
                </div>
              </FadeIn>
            </div>

            <FadeIn
              delay={0.4}
              direction="left"
              className="lg:col-span-7 h-full"
            >
              <Card className="overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-[0_8px_40px_rgb(0,0,0,0.08)] backdrop-blur-2xl h-full">
                <CardContent className="p-8 md:p-12">
                  <div className="mb-8">
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-2">
                      Envoyez-nous un message
                    </h3>
                    <p className="text-slate-500 text-lg">
                      Remplissez le formulaire, nous reviendrons vers vous avec
                      une réponse claire et personnalisée.
                    </p>
                  </div>

                  <FormErrorBanner message={formError} />

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <input
                      type="checkbox"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="absolute -left-[9999px] h-0 w-0 opacity-0"
                      {...register("botcheck")}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 relative group">
                        <Label
                          htmlFor="nomComplet"
                          className={cn(
                            "text-sm font-bold flex items-center gap-2 transition-colors",
                            focusedField === "nomComplet"
                              ? "text-blue-600"
                              : "text-slate-700",
                          )}
                        >
                          <User
                            size={16}
                            className={
                              focusedField === "nomComplet"
                                ? "text-blue-600"
                                : "text-slate-400"
                            }
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
                            "w-full rounded-xl border-2 px-4 py-6 text-slate-900 transition-all duration-300 placeholder:text-slate-400 bg-white/50",
                            errors.nomComplet
                              ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 bg-red-50/30"
                              : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 hover:border-slate-300",
                          )}
                        />
                        {errors.nomComplet && (
                          <p className="text-sm font-medium text-red-500 mt-1.5 absolute -bottom-6">
                            {errors.nomComplet.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 relative group">
                        <Label
                          htmlFor="email"
                          className={cn(
                            "text-sm font-bold flex items-center gap-2 transition-colors",
                            focusedField === "email"
                              ? "text-blue-600"
                              : "text-slate-700",
                          )}
                        >
                          <Mail
                            size={16}
                            className={
                              focusedField === "email"
                                ? "text-blue-600"
                                : "text-slate-400"
                            }
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
                            "w-full rounded-xl border-2 px-4 py-6 text-slate-900 transition-all duration-300 placeholder:text-slate-400 bg-white/50",
                            errors.email
                              ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 bg-red-50/30"
                              : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 hover:border-slate-300",
                          )}
                        />
                        {errors.email && (
                          <p className="text-sm font-medium text-red-500 mt-1.5 absolute -bottom-6">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 relative pt-2">
                      <Label
                        htmlFor="telephone"
                        className={cn(
                          "text-sm font-bold flex items-center gap-2 transition-colors",
                          focusedField === "telephone"
                            ? "text-blue-600"
                            : "text-slate-700",
                        )}
                      >
                        <Phone
                          size={16}
                          className={
                            focusedField === "telephone"
                              ? "text-blue-600"
                              : "text-slate-400"
                          }
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
                          "w-full rounded-xl border-2 px-4 py-6 text-slate-900 transition-all duration-300 placeholder:text-slate-400 bg-white/50",
                          errors.telephone
                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 bg-red-50/30"
                            : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 hover:border-slate-300",
                        )}
                      />
                      {errors.telephone && (
                        <p className="text-sm font-medium text-red-500 mt-1.5 absolute -bottom-6">
                          {errors.telephone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 relative pt-2">
                      <Label
                        htmlFor="message"
                        className={cn(
                          "text-sm font-bold flex items-center gap-2 transition-colors",
                          focusedField === "message"
                            ? "text-blue-600"
                            : "text-slate-700",
                        )}
                      >
                        <MessageSquare
                          size={16}
                          className={
                            focusedField === "message"
                              ? "text-blue-600"
                              : "text-slate-400"
                          }
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
                          "min-h-[160px] w-full rounded-xl resize-none border-2 px-4 py-4 text-slate-900 transition-all duration-300 placeholder:text-slate-400 bg-white/50",
                          errors.message
                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 bg-red-50/30"
                            : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 hover:border-slate-300",
                        )}
                      />
                      {errors.message && (
                        <p className="text-sm font-medium text-red-500 mt-1.5 absolute -bottom-6">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <div className="pt-6">
                      <Button
                        type="submit"
                        size={"xl"}
                        disabled={isSubmitting}
                        className="group relative w-full overflow-hidden rounded-xl bg-slate-900 px-8 py-7 font-bold text-white shadow-[0_8px_20px_rgb(0,0,0,0.12)] transition-all duration-300 hover:scale-[1.02] hover:bg-slate-800 hover:shadow-[0_8px_25px_rgb(0,0,0,0.16)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                      >
                        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
                          <div className="relative h-full w-8 bg-white/20" />
                        </div>
                        <span className="relative flex items-center justify-center text-lg">
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                              Envoi en cours...
                            </span>
                          ) : (
                            <>
                              <Send
                                size={20}
                                className="mr-3 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                              />
                              Envoyer le message
                              <ArrowRight
                                size={20}
                                className="ml-3 transition-transform duration-300 group-hover:translate-x-1"
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
