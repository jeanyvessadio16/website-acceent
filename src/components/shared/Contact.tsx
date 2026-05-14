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
import { ContactFormData } from "../../zodSchema/contact";
import { ContactService } from "../../services/contactService";

export default function Contact() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [formError, setFormError] = useState("");

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
    <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-white to-slate-100 py-20 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-12 h-72 w-72 rounded-full bg-blue-300/15 blur-3xl" />
        <div className="absolute -right-16 bottom-8 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
      </div>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 text-center">
            <p className="mb-4 inline-flex items-center rounded-full border border-blue-200/70 bg-white px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-xs">
              Restons en contact
            </p>
            <h2 className="mb-4 text-fluid-h2 text-gray-900">
              Contactez-nous
            </h2>
            <p className="mx-auto max-w-2xl text-fluid-p-large text-gray-600">
              Nous sommes là pour vous accompagner. N&apos;hésitez pas à nous
              contacter pour toute question ou collaboration.
            </p>
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/70 bg-white/90 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl">
                <h3 className="mb-6 flex items-center gap-3 text-fluid-h3 text-gray-900">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                    <MapPin className="text-white" size={20} />
                  </div>
                  Nos coordonnées
                </h3>
                <div className="space-y-6">
                  <div className="group flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 transition-colors group-hover:bg-blue-100">
                      <MapPin className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-gray-900">Adresse</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Quartier Santhiaba
                        <br />
                        Ziguinchor, Sénégal
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 transition-colors group-hover:bg-green-100">
                      <Mail className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-gray-900">Email</h4>
                      <a
                        href="mailto:info@acceent.org"
                        className="text-gray-600 transition-colors hover:text-green-700"
                      >
                        info@acceent.org
                      </a>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 transition-colors group-hover:bg-purple-100">
                      <Phone className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-gray-900">
                        Téléphone
                      </h4>
                      <a
                        href="tel:+221761417070"
                        className="text-gray-600 transition-colors hover:text-purple-700"
                      >
                        +221 76 141 70 70
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <p className="rounded-xl border border-gray-200/80 bg-white/80 px-5 py-4 text-sm text-gray-600 shadow-sm">
                Temps de réponse moyen: moins de 24h les jours ouvrés.
              </p>
            </div>

            <Card className="overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-2xl backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-fluid-h3 text-gray-900">
                    Parlez-nous de votre besoin
                  </h3>
                  <p className="mt-2 text-fluid-p text-gray-600">
                    Remplissez le formulaire, nous revenons vers vous avec une
                    réponse claire et personnalisée.
                  </p>
                </div>
                <FormErrorBanner message={formError} />
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="nomComplet"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <User size={18} className="text-blue-600" />
                      Prénom et Nom <span className="text-red-800">*</span>
                    </Label>
                    <Input
                      id="nomComplet"
                      type="text"
                      {...register("nomComplet")}
                      autoComplete="name"
                      aria-invalid={Boolean(errors.nomComplet)}
                      placeholder="Votre nom complet"
                      className={`w-full border-2 px-4 py-5 text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:ring-4 focus:ring-blue-500/20 ${
                        errors.nomComplet
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                      }`}
                    />
                    {errors.nomComplet && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.nomComplet.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <Mail size={18} className="text-blue-600" />
                      Email <span className="text-red-800">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email)}
                      placeholder="votre.email@exemple.com"
                      className={`w-full border-2 px-4 py-5 text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:ring-4 focus:ring-blue-500/20 ${
                        errors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <MessageSquare size={18} className="text-blue-600" />
                      Message <span className="text-red-800">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      aria-invalid={Boolean(errors.message)}
                      placeholder="Décrivez votre demande ou votre question..."
                      className={`min-h-32 w-full resize-none border-2 px-4 py-4 text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:ring-4 focus:ring-blue-500/20 ${
                        errors.message
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                      }`}
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size={"xl"}
                    disabled={isSubmitting}
                    className="group w-full cursor-pointer bg-gray-950 font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-900 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      "Envoi en cours..."
                    ) : (
                      <>
                        <Send size={20} className="mr-2" />
                        Envoyer le message
                        <ArrowRight
                          size={18}
                          className="ml-2 transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
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
