"use client";

import { useState } from "react";
import { User, Mail, Lock, CheckCircle2, AlertCircle, Loader2, Save } from "lucide-react";
import { updateProfileAction } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileFormProps {
  initialUser: {
    firstname: string;
    lastname: string;
    email: string;
    role: string;
  };
}

export function ProfileForm({ initialUser }: ProfileFormProps) {
  const [firstname, setFirstname] = useState(initialUser.firstname);
  const [lastname, setLastname] = useState(initialUser.lastname);
  const [email, setEmail] = useState(initialUser.email);
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await updateProfileAction({
        firstname,
        lastname,
        email,
        password: password || undefined,
      });

      if (res.success) {
        setMessage({ type: "success", text: res.message });
        setPassword("");
      } else {
        setMessage({ type: "error", text: res.message });
      }
    } catch {
      setMessage({ type: "error", text: "Une erreur inattendue est survenue." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#12131a] p-6 space-y-6 shadow-xs">
      <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
        <div className="size-10 rounded-full bg-gradient-to-br from-[#836182] to-[#b9939e] flex items-center justify-center text-white font-bold text-sm shadow-xs">
          {firstname[0]}
          {lastname[0]}
        </div>
        <div>
          <h3 className="text-zinc-100 font-bold text-base">Informations personnelles</h3>
          <p className="text-zinc-400 text-xs mt-0.5">
            Modifiez votre identité, votre adresse e-mail et votre mot de passe d'accès
          </p>
        </div>
      </div>

      {message && (
        <div
          role="alert"
          className={`flex items-start gap-2.5 p-4 rounded-xl border text-xs animate-in fade-in duration-150 ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
              : "bg-red-500/10 border-red-500/20 text-red-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Prénom & Nom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="profile-firstname" className="text-zinc-300 text-xs font-medium">
              Prénom
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none" />
              <Input
                id="profile-firstname"
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
                className="h-10 pl-10 bg-white/[0.04] border-white/[0.1] text-zinc-100 placeholder:text-zinc-500 focus-visible:border-white/[0.2]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-lastname" className="text-zinc-300 text-xs font-medium">
              Nom
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none" />
              <Input
                id="profile-lastname"
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                className="h-10 pl-10 bg-white/[0.04] border-white/[0.1] text-zinc-100 placeholder:text-zinc-500 focus-visible:border-white/[0.2]"
              />
            </div>
          </div>
        </div>

        {/* E-mail */}
        <div className="space-y-1.5">
          <Label htmlFor="profile-email" className="text-zinc-300 text-xs font-medium">
            Adresse e-mail
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none" />
            <Input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 pl-10 bg-white/[0.04] border-white/[0.1] text-zinc-100 placeholder:text-zinc-500 focus-visible:border-white/[0.2]"
            />
          </div>
        </div>

        {/* Nouveau mot de passe */}
        <div className="space-y-1.5 pt-2 border-t border-white/[0.04]">
          <Label htmlFor="profile-password" className="text-zinc-300 text-xs font-medium">
            Nouveau mot de passe <span className="text-zinc-500 font-normal">(optionnel)</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none" />
            <Input
              id="profile-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 caractères"
              minLength={8}
              className="h-10 pl-10 bg-white/[0.04] border-white/[0.1] text-zinc-100 placeholder:text-zinc-500 focus-visible:border-white/[0.2]"
            />
          </div>
        </div>

        {/* Bouton Enregistrer */}
        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#836182] hover:bg-[#966f95] text-white font-medium shadow-xs px-5"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Mise à jour…
              </>
            ) : (
              <>
                <Save className="size-4 mr-2" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
