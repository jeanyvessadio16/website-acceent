"use client";

import { useState } from "react";
import {
  Search,
  ShieldCheck,
  User,
  Mail,
  Calendar,
  PencilLine,
  Trash2,
  X,
  Loader2,
  Save,
  AlertCircle,
  UserPlus,
  Lock,
  FileSpreadsheet,
  Phone,
  MapPin,
} from "lucide-react";
import { updateUserAction, deleteUserAction, createUserAction } from "@/actions/user";
import { adminCreateUserSchema, adminUpdateUserSchema } from "@/validation/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 10;

export interface UserItem {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  age?: number | null;
  sexe?: string | null;
  milieuResidence?: string | null;
  telephone?: string | null;
  sdh?: boolean;
  createdAt: string;
}

interface UserListProps {
  users: UserItem[];
  currentUserEmail?: string;
  initialOpenCreate?: boolean;
}

export function UserList({
  users,
  currentUserEmail,
  initialOpenCreate = false,
}: UserListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editFirstname, setEditFirstname] = useState("");
  const [editLastname, setEditLastname] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<"USER" | "AUTHOR" | "ADMIN">("USER");
  const [editAgeStr, setEditAgeStr] = useState("");
  const [editSexe, setEditSexe] = useState<"" | "HOMME" | "FEMME">("");
  const [editMilieu, setEditMilieu] = useState<"" | "RURAL" | "URBAIN">("");
  const [editTelephone, setEditTelephone] = useState("");
  const [editSdh, setEditSdh] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(initialOpenCreate);
  const [createFirstname, setCreateFirstname] = useState("");
  const [createLastname, setCreateLastname] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createRole, setCreateRole] = useState<"USER" | "AUTHOR" | "ADMIN">("USER");
  const [createAgeStr, setCreateAgeStr] = useState("");
  const [createSexe, setCreateSexe] = useState<"" | "HOMME" | "FEMME">("HOMME");
  const [createMilieu, setCreateMilieu] = useState<"" | "RURAL" | "URBAIN">("URBAIN");
  const [createTelephone, setCreateTelephone] = useState("");
  const [createSdh, setCreateSdh] = useState(false);

  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const parseOptionalAge = (raw: string): { ok: true; value: number | null } | { ok: false; error: string } => {
    const trimmed = raw.trim();
    if (!trimmed) return { ok: true, value: null };
    const n = Number(trimmed);
    if (Number.isNaN(n) || !Number.isInteger(n)) {
      return { ok: false, error: "L'âge doit être un nombre entier valide." };
    }
    return { ok: true, value: n };
  };

  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    setEditFirstname(user.firstname);
    setEditLastname(user.lastname);
    setEditEmail(user.email);
    setEditRole(user.role as "USER" | "AUTHOR" | "ADMIN");
    setEditAgeStr(user.age !== null && user.age !== undefined ? String(user.age) : "");
    setEditSexe(user.sexe === "HOMME" || user.sexe === "FEMME" ? user.sexe : "");
    setEditMilieu(
      user.milieuResidence === "RURAL" || user.milieuResidence === "URBAIN"
        ? user.milieuResidence
        : ""
    );
    setEditTelephone(user.telephone || "");
    setEditSdh(Boolean(user.sdh));
    setErrorMsg(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setErrorMsg(null);

    const ageCheck = parseOptionalAge(editAgeStr);
    if (!ageCheck.ok) {
      setErrorMsg(ageCheck.error);
      return;
    }

    const payload = {
      id: editingUser.id,
      firstname: editFirstname,
      lastname: editLastname,
      email: editEmail,
      role: editRole,
      age: ageCheck.value,
      sexe: editSexe || null,
      milieuResidence: editMilieu || null,
      telephone: editTelephone.trim(),
      sdh: editSdh,
    };

    const parsed = adminUpdateUserSchema.safeParse(payload);
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Données invalides.");
      return;
    }

    setLoading(true);
    const res = await updateUserAction(parsed.data);
    setLoading(false);

    if (res.success) {
      setEditingUser(null);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const ageCheck = parseOptionalAge(createAgeStr);
    if (!ageCheck.ok) {
      setErrorMsg(ageCheck.error);
      return;
    }

    const payload = {
      firstname: createFirstname,
      lastname: createLastname,
      email: createEmail,
      password: createPassword,
      role: createRole,
      age: ageCheck.value,
      sexe: createSexe || null,
      milieuResidence: createMilieu || null,
      telephone: createTelephone.trim(),
      sdh: createSdh,
    };

    const parsed = adminCreateUserSchema.safeParse(payload);
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Données invalides.");
      return;
    }

    setLoading(true);
    const res = await createUserAction(parsed.data);
    setLoading(false);

    if (res.success) {
      setIsCreateOpen(false);
      setCreateFirstname("");
      setCreateLastname("");
      setCreateEmail("");
      setCreatePassword("");
      setCreateRole("USER");
      setCreateAgeStr("");
      setCreateSexe("HOMME");
      setCreateMilieu("URBAIN");
      setCreateTelephone("");
      setCreateSdh(false);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    setLoading(true);
    setErrorMsg(null);

    const res = await deleteUserAction(deletingUser.id);
    setLoading(false);

    if (res.success) {
      setDeletingUser(null);
    } else {
      setErrorMsg(res.message);
    }
  };

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.firstname} ${u.lastname}`.toLowerCase();
    const email = u.email.toLowerCase();
    const phone = (u.telephone || "").toLowerCase();
    const query = searchTerm.toLowerCase().trim();
    return (
      fullName.includes(query) ||
      email.includes(query) ||
      phone.includes(query) ||
      u.role.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedUsers = filteredUsers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-slate-900 dark:text-white font-bold text-base flex items-center gap-2">
            Membres de la plateforme
            <span className="text-slate-600 dark:text-slate-300 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {filteredUsers.length} au total
            </span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            Ajoutez de nouveaux comptes, consultez les profils (âge, sexe, milieu, SDH) ou exportez l&apos;annuaire Excel
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href="/api/admin/export/excel?type=users"
            download
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-xs font-bold transition-colors"
          >
            <FileSpreadsheet className="size-4" />
            <span>Excel (.xlsx)</span>
          </a>
          <Button
            onClick={() => {
              setIsCreateOpen(true);
              setErrorMsg(null);
            }}
            className="bg-[#836182] hover:bg-[#6f4f6e] text-white font-bold text-xs h-10 px-5 rounded-xl flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="size-4" />
            Ajouter un utilisateur
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 shadow-2xs">
        <Search className="size-4 text-slate-400 shrink-0" />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Rechercher par nom, e-mail, téléphone ou rôle…"
          className="bg-transparent text-slate-900 dark:text-white text-sm placeholder:text-slate-400 outline-none flex-1"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">
          <span>Avatar</span>
          <span>Utilisateur &amp; Profil</span>
          <span>Rôle</span>
          <span>Rejoint</span>
          <span>Actions</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {paginatedUsers.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
              Aucun utilisateur ne correspond à votre recherche.
            </div>
          ) : (
            paginatedUsers.map((u) => {
              const fullName = `${u.firstname} ${u.lastname}`;
              const initials =
                `${u.firstname[0] || ""}${u.lastname[0] || ""}`.toUpperCase() || "U";
              const isCurrentUser =
                currentUserEmail &&
                u.email.toLowerCase() === currentUserEmail.toLowerCase();

              return (
                <div
                  key={u.id}
                  className={`grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-5 py-3.5 transition-colors ${
                    isCurrentUser
                      ? "bg-[#836182]/5 dark:bg-[#836182]/10"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="size-8 rounded-full bg-gradient-to-br from-[#836182] to-[#a57da4] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {initials}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-slate-900 dark:text-white text-sm font-semibold truncate">
                        {fullName}
                      </p>
                      {isCurrentUser && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#836182]/15 text-[#6d4c6c] dark:text-[#f4e6ea] border border-[#836182]/30 shrink-0">
                          Vous
                        </span>
                      )}
                      {u.sexe && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {u.sexe === "HOMME" ? "Homme" : "Femme"}
                        </span>
                      )}
                      {u.age ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {u.age} ans
                        </span>
                      ) : null}
                      {u.milieuResidence && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-50 text-cyan-800 dark:bg-cyan-500/15 dark:text-cyan-300">
                          <MapPin className="size-2.5" />
                          {u.milieuResidence === "RURAL" ? "Rural" : "Urbain"}
                        </span>
                      )}
                      {u.sdh && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30">
                          SDH
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-slate-500 dark:text-slate-400 text-xs">
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="size-3 shrink-0" />
                        {u.email}
                      </span>
                      {u.telephone && (
                        <span className="flex items-center gap-1">
                          <Phone className="size-3 shrink-0" />
                          {u.telephone}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 border ${
                      u.role === "ADMIN"
                        ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30"
                        : u.role === "AUTHOR"
                        ? "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30"
                        : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {u.role === "ADMIN" ? (
                      <ShieldCheck className="size-3.5" />
                    ) : (
                      <User className="size-3.5" />
                    )}
                    {u.role}
                  </span>

                  <span className="hidden sm:inline-flex text-slate-500 dark:text-slate-400 text-xs shrink-0 items-center gap-1">
                    <Calendar className="size-3" />
                    {u.createdAt}
                  </span>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(u)}
                      title="Modifier l'utilisateur"
                      className="size-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <PencilLine className="size-3.5" />
                    </button>
                    {!isCurrentUser ? (
                      <button
                        type="button"
                        onClick={() => {
                          setDeletingUser(u);
                          setErrorMsg(null);
                        }}
                        title="Supprimer l'utilisateur"
                        className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    ) : (
                      <div className="size-8" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                text="Précédent"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => Math.max(1, p - 1));
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === safePage}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                text="Suivant"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Modal Suppression */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-red-600 dark:text-red-400 font-bold text-base flex items-center gap-2">
                <Trash2 className="size-4" />
                Confirmer la suppression
              </h3>
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg p-1 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <p className="text-slate-700 dark:text-slate-300 text-sm">
              Voulez-vous vraiment supprimer l&apos;utilisateur{" "}
              <strong className="text-slate-900 dark:text-white">
                {deletingUser.firstname} {deletingUser.lastname}
              </strong>{" "}
              ({deletingUser.email}) ?
            </p>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => setDeletingUser(null)}>
                Annuler
              </Button>
              <Button
                type="button"
                disabled={loading}
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? "Suppression…" : "Supprimer définitivement"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Création */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-slate-900 dark:text-white font-bold text-base flex items-center gap-2">
                <UserPlus className="size-4 text-[#836182]" />
                Ajouter un nouvel utilisateur
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg p-1 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} noValidate className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 text-xs font-semibold">Prénom *</Label>
                  <Input
                    type="text"
                    value={createFirstname}
                    onChange={(e) => setCreateFirstname(e.target.value)}
                    placeholder="Marie"
                    required
                    className="h-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 text-xs font-semibold">Nom *</Label>
                  <Input
                    type="text"
                    value={createLastname}
                    onChange={(e) => setCreateLastname(e.target.value)}
                    placeholder="Dupont"
                    required
                    className="h-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 text-xs font-semibold">Adresse e-mail *</Label>
                  <Input
                    type="email"
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                    placeholder="exemple@acceent.org"
                    required
                    className="h-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 text-xs font-semibold">Téléphone</Label>
                  <Input
                    type="tel"
                    value={createTelephone}
                    onChange={(e) => setCreateTelephone(e.target.value)}
                    placeholder="+221 77 123 45 67"
                    className="h-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 text-xs font-semibold">Âge</Label>
                  <Input
                    type="number"
                    min={10}
                    max={120}
                    value={createAgeStr}
                    onChange={(e) => setCreateAgeStr(e.target.value)}
                    placeholder="24"
                    className="h-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 text-xs font-semibold">Sexe</Label>
                  <select
                    value={createSexe}
                    onChange={(e) => setCreateSexe(e.target.value as "" | "HOMME" | "FEMME")}
                    className="w-full h-10 px-2.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="">—</option>
                    <option value="HOMME">Homme</option>
                    <option value="FEMME">Femme</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 text-xs font-semibold">Milieu</Label>
                  <select
                    value={createMilieu}
                    onChange={(e) => setCreateMilieu(e.target.value as "" | "RURAL" | "URBAIN")}
                    className="w-full h-10 px-2.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="">—</option>
                    <option value="URBAIN">Urbain</option>
                    <option value="RURAL">Rural</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 text-xs font-semibold">SDH</Label>
                  <select
                    value={createSdh ? "OUI" : "NON"}
                    onChange={(e) => setCreateSdh(e.target.value === "OUI")}
                    className="w-full h-10 px-2.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="NON">Non</option>
                    <option value="OUI">Oui</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 text-xs font-semibold">Mot de passe initial *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                    <Input
                      type="password"
                      value={createPassword}
                      onChange={(e) => setCreatePassword(e.target.value)}
                      placeholder="A-z, 0-9, @$!%*?&"
                      required
                      className="h-10 pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 text-xs font-semibold">Rôle attribué</Label>
                  <select
                    value={createRole}
                    onChange={(e) => setCreateRole(e.target.value as "USER" | "AUTHOR" | "ADMIN")}
                    className="w-full h-10 px-3 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="USER">USER (Membre classique)</option>
                    <option value="AUTHOR">AUTHOR (Rédacteur d&apos;articles)</option>
                    <option value="ADMIN">ADMIN (Administrateur complet)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#836182] hover:bg-[#6f4f6e] text-white"
                >
                  {loading ? <Loader2 className="size-4 animate-spin mr-1.5" /> : <UserPlus className="size-4 mr-1.5" />}
                  {loading ? "Création…" : "Créer l'utilisateur"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Édition */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-slate-900 dark:text-white font-bold text-base flex items-center gap-2">
                <PencilLine className="size-4 text-[#836182]" />
                Modifier le membre
              </h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg p-1 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} noValidate className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 text-xs font-semibold">Prénom *</Label>
                  <Input
                    type="text"
                    value={editFirstname}
                    onChange={(e) => setEditFirstname(e.target.value)}
                    required
                    className="h-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 text-xs font-semibold">Nom *</Label>
                  <Input
                    type="text"
                    value={editLastname}
                    onChange={(e) => setEditLastname(e.target.value)}
                    required
                    className="h-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 text-xs font-semibold">Adresse e-mail *</Label>
                  <Input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    className="h-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 text-xs font-semibold">Téléphone</Label>
                  <Input
                    type="tel"
                    value={editTelephone}
                    onChange={(e) => setEditTelephone(e.target.value)}
                    placeholder="+221 77 123 45 67"
                    className="h-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 text-xs font-semibold">Âge</Label>
                  <Input
                    type="number"
                    min={10}
                    max={120}
                    value={editAgeStr}
                    onChange={(e) => setEditAgeStr(e.target.value)}
                    placeholder="24"
                    className="h-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 text-xs font-semibold">Sexe</Label>
                  <select
                    value={editSexe}
                    onChange={(e) => setEditSexe(e.target.value as "" | "HOMME" | "FEMME")}
                    className="w-full h-10 px-2.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="">—</option>
                    <option value="HOMME">Homme</option>
                    <option value="FEMME">Femme</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 text-xs font-semibold">Milieu</Label>
                  <select
                    value={editMilieu}
                    onChange={(e) => setEditMilieu(e.target.value as "" | "RURAL" | "URBAIN")}
                    className="w-full h-10 px-2.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="">—</option>
                    <option value="URBAIN">Urbain</option>
                    <option value="RURAL">Rural</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 text-xs font-semibold">SDH</Label>
                  <select
                    value={editSdh ? "OUI" : "NON"}
                    onChange={(e) => setEditSdh(e.target.value === "OUI")}
                    className="w-full h-10 px-2.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="NON">Non</option>
                    <option value="OUI">Oui</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-700 dark:text-slate-300 text-xs font-semibold">Rôle d&apos;accès</Label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as "USER" | "AUTHOR" | "ADMIN")}
                  className="w-full h-10 px-3 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                >
                  <option value="USER">USER (Membre)</option>
                  <option value="AUTHOR">AUTHOR (Rédacteur)</option>
                  <option value="ADMIN">ADMIN (Administrateur)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#836182] hover:bg-[#6f4f6e] text-white"
                >
                  {loading ? <Loader2 className="size-4 animate-spin mr-1.5" /> : <Save className="size-4 mr-1.5" />}
                  {loading ? "Sauvegarde…" : "Enregistrer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
