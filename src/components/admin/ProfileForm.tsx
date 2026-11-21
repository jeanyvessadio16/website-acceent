"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
} from "lucide-react";
import { updateProfileAction } from "@/actions/user";
import { updateProfileSchema } from "@/validation/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileFormProps {
  initialUser: {
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    age: number;
    sexe: "HOMME" | "FEMME";
    milieuResidence: "RURAL" | "URBAIN";
    telephone: string;
    sdh: boolean;
  };
}

export function ProfileForm({ initialUser }: ProfileFormProps) {
  const [firstname, setFirstname] = useState(initialUser.firstname);
  const [lastname, setLastname] = useState(initialUser.lastname);
  const [email, setEmail] = useState(initialUser.email);
  const [ageStr, setAgeStr] = useState(String(initialUser.age));
  const [sexe, setSexe] = useState<"HOMME" | "FEMME">(initialUser.sexe);
  const [milieuResidence, setMilieuResidence] = useState<"RURAL" | "URBAIN">(
    initialUser.milieuResidence
  );
  const [telephone, setTelephone] = useState(initialUser.telephone || "");
  const [sdh, setSdh] = useState<boolean>(initialUser.sdh);
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const trimmedAge = ageStr.trim();
    const parsedAge = Number(trimmedAge);
    if (!trimmedAge || Number.isNaN(parsedAge) || !Number.isInteger(parsedAge)) {
      setMessage({
        type: "error",
        text: "Veuillez saisir un âge entier valide (entre 10 et 120 ans).",
      });
      return;
    }

    const payload = {
      firstname,
      lastname,
      email,
      age: parsedAge,
      sexe,
      milieuResidence,
      telephone: telephone.trim(),
      sdh,
      password: password || undefined,
    };

    const validation = updateProfileSchema.safeParse(payload);
    if (!validation.success) {
      setMessage({
        type: "error",
        text: validation.error.issues[0]?.message || "Veuillez vérifier les champs saisis.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await updateProfileAction(validation.data);
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
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-xs">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="size-10 rounded-full bg-gradient-to-br from-[#836182] to-[#a57da4] flex items-center justify-center text-white font-bold text-sm shadow-xs">
          {firstname[0] || "U"}
          {lastname[0] || ""}
        </div>
        <div>
          <h3 className="text-slate-900 dark:text-white font-bold text-base">
            Informations personnelles &amp; Profil
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            Modifiez votre identité, vos coordonnées et votre profil socio-démographique
          </p>
        </div>
      </div>

      {message && (
        <div
          role="alert"
          className={`flex items-start gap-2.5 p-4 rounded-xl border text-xs ${message.type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-300"
            : "bg-red-50 border-red-200 text-red-800 dark:bg-red-500/10 dark:border-red-500/25 dark:text-red-300"
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

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="profile-firstname" className="text-slate-700 dark:text-slate-300 text-xs font-semibold">
              Prénom *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              <Input
                id="profile-firstname"
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
                className="h-10 pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-lastname" className="text-slate-700 dark:text-slate-300 text-xs font-semibold">
              Nom *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              <Input
                id="profile-lastname"
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                className="h-10 pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="profile-email" className="text-slate-700 dark:text-slate-300 text-xs font-semibold">
              Adresse e-mail *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-telephone" className="text-slate-700 dark:text-slate-300 text-xs font-semibold">
              Téléphone *
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              <Input
                id="profile-telephone"
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="+221 77 123 45 67"
                required
                className="h-10 pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="profile-age" className="text-slate-700 dark:text-slate-300 text-xs font-semibold">
              Âge *
            </Label>
            <Input
              id="profile-age"
              type="number"
              min={10}
              max={120}
              step={1}
              value={ageStr}
              onChange={(e) => setAgeStr(e.target.value)}
              placeholder="22"
              required
              className="h-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-sexe" className="text-slate-700 dark:text-slate-300 text-xs font-semibold">
              Sexe *
            </Label>
            <select
              id="profile-sexe"
              value={sexe}
              onChange={(e) => setSexe(e.target.value as "HOMME" | "FEMME")}
              required
              className="w-full h-10 rounded-md px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
            >
              <option value="HOMME">Homme</option>
              <option value="FEMME">Femme</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-milieu" className="text-slate-700 dark:text-slate-300 text-xs font-semibold">
              Milieu de résidence *
            </Label>
            <select
              id="profile-milieu"
              value={milieuResidence}
              onChange={(e) => setMilieuResidence(e.target.value as "RURAL" | "URBAIN")}
              required
              className="w-full h-10 rounded-md px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
            >
              <option value="URBAIN">Urbain</option>
              <option value="RURAL">Rural</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-sdh" className="text-slate-700 dark:text-slate-300 text-xs font-semibold">
              SDH (Handicap) *
            </Label>
            <select
              id="profile-sdh"
              value={sdh ? "OUI" : "NON"}
              onChange={(e) => setSdh(e.target.value === "OUI")}
              required
              className="w-full h-10 rounded-md px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
            >
              <option value="NON">Non</option>
              <option value="OUI">Oui</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
          <Label htmlFor="profile-password" className="text-slate-700 dark:text-slate-300 text-xs font-semibold">
            Nouveau mot de passe{" "}
            <span className="text-slate-400 font-normal">(optionnel)</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
            <Input
              id="profile-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 caractères (A-z, 0-9, @$!%*?&)"
              className="h-10 pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#836182] hover:bg-[#6f4f6e] text-white font-semibold shadow-xs px-5 cursor-pointer"
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
