import { MapPin, Mail, Phone, User, MessageSquare, Send } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export default function Contact() {
  return (
    <section className="relative bg-linear-to-br from-slate-50 via-white to-slate-100 py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Titre principal */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contactez-nous
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nous sommes là pour vous accompagner. N&apos;hésitez pas à nous
              contacter pour toute question ou collaboration.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Informations de contact */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <MapPin className="text-white" size={20} />
                  </div>
                  Nos coordonnées
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <MapPin className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Adresse
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        Quartier Santhiaba
                        <br />
                        Ziguinchor, Sénégal
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                      <Mail className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Email
                      </h4>
                      <p className="text-gray-600">info@acceent.org</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                      <Phone className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Téléphone
                      </h4>
                      <p className="text-gray-600">+221 76 141 70 70</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Élément décoratif */}
              <div className="hidden lg:block absolute left-8 top-1/2 transform -translate-y-1/2 w-px h-32 bg-linear-to-b from-blue-200 to-transparent"></div>
            </div>

            {/* Formulaire de contact */}
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <User size={18} className="text-blue-600" />
                      Prénom et Nom *
                    </Label>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Votre nom complet"
                      className="w-full px-4 py-5 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <Mail size={18} className="text-blue-600" />
                      Email *
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="votre.email@exemple.com"
                      className="w-full px-4 py-5 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <MessageSquare size={18} className="text-blue-600" />
                      Message *
                    </Label>
                    <Textarea
                      name="message"
                      placeholder="Décrivez votre demande ou votre question..."
                      className="w-full min-h-32 px-4 py-4 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 resize-none text-gray-900 placeholder:text-gray-400"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size={"xl"}
                    className="w-full bg-black text-white font-semibold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Send size={20} className="mr-2" />
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
