import { UserShell } from "@/components/dashboard/UserShell";
import { getSession } from "@/lib/session";
import { BookOpen, Lightbulb, Monitor, CheckCircle2 } from "lucide-react";

const programmes = [
  {
    id: 1,
    title: "Éducation & Mentorat",
    category: "Pôle Éducation",
    description: "Accompagnement académique et mentorat personnalisé pour la jeunesse.",
    status: "Actif",
    icon: BookOpen,
    color: "bg-[#836182]/15 text-[#b9939e]",
  },
  {
    id: 2,
    title: "Entrepreneuriat & Innovation",
    category: "Pôle Entrepreneuriat",
    description: "Incubation d'idées, formations à la création d'entreprise et ateliers de projets.",
    status: "Actif",
    icon: Lightbulb,
    color: "bg-amber-500/15 text-amber-400",
  },
  {
    id: 3,
    title: "Inclusion Numérique & Tech",
    category: "Pôle Numérique",
    description: "Ateliers de code, initiation aux métiers de l'informatique et ateliers pratiques.",
    status: "Actif",
    icon: Monitor,
    color: "bg-blue-500/15 text-blue-400",
  },
];

export default async function UserProgrammesPage() {
  const session = await getSession();
  const currentUser = session
    ? {
        name: `${session.firstname} ${session.lastname}`,
        email: session.email,
        role: session.role,
      }
    : null;

  return (
    <UserShell
      title="Mes Programmes & Activités"
      subtitle="Découvrez les initiatives et programmes disponibles au sein de la communauté ACCEENT"
      user={currentUser}
    >
      <div className="space-y-6 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {programmes.map((prog) => (
            <div
              key={prog.id}
              className="rounded-2xl border border-white/[0.08] bg-[#12131a] p-5 space-y-4 shadow-xs hover:border-white/[0.15] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className={`size-10 rounded-xl ${prog.color} flex items-center justify-center`}>
                  <prog.icon className="size-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium flex items-center gap-1">
                  <CheckCircle2 className="size-3" />
                  {prog.status}
                </span>
              </div>

              <div>
                <span className="text-zinc-500 text-xs font-medium">{prog.category}</span>
                <h3 className="text-zinc-100 font-bold text-base mt-0.5">{prog.title}</h3>
                <p className="text-zinc-400 text-xs mt-2 leading-relaxed">{prog.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </UserShell>
  );
}
