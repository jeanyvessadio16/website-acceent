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
  Plus,
  UserPlus,
  Lock,
} from "lucide-react";
import { updateUserAction, deleteUserAction, createUserAction } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface UserItem {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UserListProps {
  users: UserItem[];
  currentUserEmail?: string;
}

export function UserList({ users, currentUserEmail }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // ── État pour l'édition ──────────────────────────────────────────────────
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editFirstname, setEditFirstname] = useState("");
  const [editLastname, setEditLastname] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<"USER" | "AUTHOR" | "ADMIN">("USER");

  // ── État pour la création ────────────────────────────────────────────────
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createFirstname, setCreateFirstname] = useState("");
  const [createLastname, setCreateLastname] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createRole, setCreateRole] = useState<"USER" | "AUTHOR" | "ADMIN">("USER");

  // ── État pour la suppression ─────────────────────────────────────────────
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Ouverture du modal d'édition
  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    setEditFirstname(user.firstname);
    setEditLastname(user.lastname);
    setEditEmail(user.email);
    setEditRole(user.role as "USER" | "AUTHOR" | "ADMIN");
    setErrorMsg(null);
  };

  // Soumission de l'édition
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setLoading(true);
    setErrorMsg(null);

    const res = await updateUserAction({
      id: editingUser.id,
      firstname: editFirstname,
      lastname: editLastname,
      email: editEmail,
      role: editRole,
    });

    setLoading(false);
    if (res.success) {
      setEditingUser(null);
    } else {
      setErrorMsg(res.message);
    }
  };

  // Soumission de la création
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await createUserAction({
      firstname: createFirstname,
      lastname: createLastname,
      email: createEmail,
      password: createPassword,
      role: createRole,
    });

    setLoading(false);
    if (res.success) {
      setIsCreateOpen(false);
      setCreateFirstname("");
      setCreateLastname("");
      setCreateEmail("");
      setCreatePassword("");
      setCreateRole("USER");
    } else {
      setErrorMsg(res.message);
    }
  };

  // Confirmation et exécution de la suppression
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
    const query = searchTerm.toLowerCase().trim();
    return (
      fullName.includes(query) ||
      email.includes(query) ||
      u.role.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-5 max-w-5xl">
      {/* ── En-tête d'action hautement visible ────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#12131a] border border-white/[0.08]">
        <div>
          <h2 className="text-zinc-100 font-bold text-base flex items-center gap-2">
            Membres de la plateforme
            <span className="text-zinc-400 text-xs font-normal px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
              {filteredUsers.length} au total
            </span>
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Ajoutez de nouveaux comptes, modifiez les rôles ou supprimez des utilisateurs
          </p>
        </div>

        {/* Bouton Ajouter Utilisateur */}
        <Button
          onClick={() => {
            setIsCreateOpen(true);
            setErrorMsg(null);
          }}
          className="bg-gradient-to-r from-[#836182] to-[#b9939e] hover:from-[#966f95] hover:to-[#cbaab5] text-white font-bold text-xs h-10 px-5 rounded-xl shadow-lg shadow-[#836182]/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] shrink-0"
        >
          <UserPlus className="size-4" />
          Ajouter un utilisateur
        </Button>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-2 bg-[#12131a] border border-white/[0.08] rounded-xl px-3.5 py-2.5 focus-within:border-white/[0.2] transition-colors">
        <Search className="size-4 text-zinc-500 shrink-0" />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher par nom, e-mail ou rôle…"
          className="bg-transparent text-zinc-100 text-sm placeholder:text-zinc-500 outline-none flex-1 font-normal"
        />
      </div>

      {/* Table des utilisateurs */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#12131a] overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/[0.06] text-zinc-500 text-[11px] font-semibold uppercase tracking-wider">
          <span>Avatar</span>
          <span>Utilisateur</span>
          <span>Rôle</span>
          <span>Rejoint</span>
          <span>Actions</span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-sm">
              Aucun utilisateur ne correspond à votre recherche.
            </div>
          ) : (
            filteredUsers.map((u) => {
              const fullName = `${u.firstname} ${u.lastname}`;
              const initials =
                `${u.firstname[0] || ""}${u.lastname[0] || ""}`.toUpperCase() ||
                "U";
              const isCurrentUser =
                currentUserEmail &&
                u.email.toLowerCase() === currentUserEmail.toLowerCase();

              return (
                <div
                  key={u.id}
                  className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-5 py-3.5 transition-colors ${
                    isCurrentUser ? "bg-white/[0.03]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  {/* Avatar */}
                  <div className="size-8 rounded-full bg-gradient-to-br from-[#836182] to-[#b9939e] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs">
                    {initials}
                  </div>

                  {/* Info Utilisateur */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-zinc-200 text-sm font-medium truncate">
                        {fullName}
                      </p>
                      {isCurrentUser && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#836182]/20 text-[#b9939e] border border-[#836182]/40 shrink-0">
                          Vous
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-500 text-xs mt-0.5 flex items-center gap-1.5 truncate">
                      <Mail className="size-3 shrink-0" />
                      {u.email}
                    </p>
                  </div>

                  {/* Rôle */}
                  <span
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 border ${
                      u.role === "ADMIN"
                        ? "bg-[#836182]/15 text-[#b9939e] border-[#836182]/30"
                        : u.role === "AUTHOR"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-white/[0.04] text-zinc-400 border-white/[0.08]"
                    }`}
                  >
                    {u.role === "ADMIN" ? (
                      <ShieldCheck className="size-3.5" />
                    ) : (
                      <User className="size-3.5" />
                    )}
                    {u.role}
                  </span>

                  {/* Date d'inscription */}
                  <span className="text-zinc-500 text-xs shrink-0 flex items-center gap-1">
                    <Calendar className="size-3" />
                    {u.createdAt}
                  </span>

                  {/* Boutons d'Action (Édition & Suppression) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(u)}
                      title="Modifier l'utilisateur"
                      className="size-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] transition-colors cursor-pointer"
                    >
                      <PencilLine className="size-3.5" />
                    </button>
                    {!isCurrentUser ? (
                      <button
                        onClick={() => {
                          setDeletingUser(u);
                          setErrorMsg(null);
                        }}
                        title="Supprimer l'utilisateur"
                        className="size-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    ) : (
                      <div className="size-7" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Modal de Confirmation de Suppression ─────────────────────────── */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#12131a] border border-red-500/30 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-red-400 font-bold text-base flex items-center gap-2">
                <Trash2 className="size-4 text-red-400" />
                Confirmer la suppression
              </h3>
              <button
                onClick={() => setDeletingUser(null)}
                className="text-zinc-400 hover:text-white rounded-lg p-1 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-zinc-300 text-sm">
                Voulez-vous vraiment supprimer l'utilisateur{" "}
                <strong className="text-white font-semibold">
                  {deletingUser.firstname} {deletingUser.lastname}
                </strong>{" "}
                (<span className="text-zinc-400">{deletingUser.email}</span>) ?
              </p>
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                ⚠️ Cette action est irréversible et supprimera définitivement le compte et ses accès de la base de données.
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-white/[0.08]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingUser(null)}
                className="bg-transparent border-white/[0.1] text-zinc-400 hover:bg-white/[0.04] hover:text-white"
              >
                Annuler
              </Button>
              <Button
                type="button"
                disabled={loading}
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-500 text-white font-medium shadow-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-1.5" />
                    Suppression…
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4 mr-1.5" />
                    Supprimer définitivement
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal de Création d'Utilisateur ────────────────────────────────── */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#12131a] border border-white/[0.12] rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-zinc-100 font-bold text-base flex items-center gap-2">
                <UserPlus className="size-4 text-[#b9939e]" />
                Ajouter un nouvel utilisateur
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-zinc-400 hover:text-white rounded-lg p-1 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-zinc-300 text-xs font-medium">Prénom</Label>
                  <Input
                    type="text"
                    value={createFirstname}
                    onChange={(e) => setCreateFirstname(e.target.value)}
                    placeholder="Marie"
                    required
                    className="h-10 bg-white/[0.04] border-white/[0.1] text-zinc-100 text-sm focus-visible:border-white/[0.2]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-zinc-300 text-xs font-medium">Nom</Label>
                  <Input
                    type="text"
                    value={createLastname}
                    onChange={(e) => setCreateLastname(e.target.value)}
                    placeholder="Dupont"
                    required
                    className="h-10 bg-white/[0.04] border-white/[0.1] text-zinc-100 text-sm focus-visible:border-white/[0.2]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-xs font-medium">Adresse e-mail</Label>
                <Input
                  type="email"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  placeholder="exemple@acceent.org"
                  required
                  className="h-10 bg-white/[0.04] border-white/[0.1] text-zinc-100 text-sm focus-visible:border-white/[0.2]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-xs font-medium">Mot de passe initial</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none" />
                  <Input
                    type="password"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    placeholder="Minimum 8 caractères"
                    minLength={8}
                    required
                    className="h-10 pl-10 bg-white/[0.04] border-white/[0.1] text-zinc-100 text-sm focus-visible:border-white/[0.2]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-xs font-medium">Rôle attribué</Label>
                <select
                  value={createRole}
                  onChange={(e) => setCreateRole(e.target.value as "USER" | "AUTHOR" | "ADMIN")}
                  className="w-full h-10 px-3 rounded-xl bg-[#1c1d27] border border-white/[0.1] text-zinc-100 text-sm focus:outline-none focus:border-white/[0.2]"
                >
                  <option value="USER">USER (Membre classique)</option>
                  <option value="AUTHOR">AUTHOR (Rédacteur d'articles)</option>
                  <option value="ADMIN">ADMIN (Administrateur complet)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-white/[0.08]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="bg-transparent border-white/[0.1] text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#836182] hover:bg-[#966f95] text-white font-medium shadow-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-1.5" />
                      Création…
                    </>
                  ) : (
                    <>
                      <UserPlus className="size-4 mr-1.5" />
                      Créer l'utilisateur
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal d'Édition d'Utilisateur ──────────────────────────────────── */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#12131a] border border-white/[0.12] rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-zinc-100 font-bold text-base flex items-center gap-2">
                <PencilLine className="size-4 text-[#b9939e]" />
                Modifier le membre
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-zinc-400 hover:text-white rounded-lg p-1 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-zinc-300 text-xs font-medium">Prénom</Label>
                  <Input
                    type="text"
                    value={editFirstname}
                    onChange={(e) => setEditFirstname(e.target.value)}
                    required
                    className="h-10 bg-white/[0.04] border-white/[0.1] text-zinc-100 text-sm focus-visible:border-white/[0.2]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-zinc-300 text-xs font-medium">Nom</Label>
                  <Input
                    type="text"
                    value={editLastname}
                    onChange={(e) => setEditLastname(e.target.value)}
                    required
                    className="h-10 bg-white/[0.04] border-white/[0.1] text-zinc-100 text-sm focus-visible:border-white/[0.2]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-xs font-medium">Adresse e-mail</Label>
                <Input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  className="h-10 bg-white/[0.04] border-white/[0.1] text-zinc-100 text-sm focus-visible:border-white/[0.2]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-xs font-medium">Rôle d'accès</Label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as "USER" | "AUTHOR" | "ADMIN")}
                  className="w-full h-10 px-3 rounded-xl bg-[#1c1d27] border border-white/[0.1] text-zinc-100 text-sm focus:outline-none focus:border-white/[0.2]"
                >
                  <option value="USER">USER (Membre)</option>
                  <option value="AUTHOR">AUTHOR (Rédacteur)</option>
                  <option value="ADMIN">ADMIN (Administrateur)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-white/[0.08]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                  className="bg-transparent border-white/[0.1] text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#836182] hover:bg-[#966f95] text-white font-medium shadow-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-1.5" />
                      Sauvegarde…
                    </>
                  ) : (
                    <>
                      <Save className="size-4 mr-1.5" />
                      Enregistrer
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
