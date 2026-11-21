import ExcelJS from "exceljs";

function sanitizeExcelValue(val: string | number | boolean | null | undefined): string | number {
  if (val === null || val === undefined) return "";
  if (typeof val === "number") return val;
  if (typeof val === "boolean") return val ? "Oui" : "Non";
  const str = String(val);
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
}

function addTitleBanner(
  sheet: ExcelJS.Worksheet,
  title: string,
  subtitle: string,
  colCount: number
) {
  sheet.addRow([sanitizeExcelValue(title)]);
  const titleRow = sheet.getRow(1);
  titleRow.height = 28;
  titleRow.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
  titleRow.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  for (let c = 1; c <= colCount; c++) {
    titleRow.getCell(c).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF836182" },
    };
  }
  if (colCount > 1) {
    sheet.mergeCells(1, 1, 1, colCount);
  }

  sheet.addRow([sanitizeExcelValue(subtitle)]);
  const subRow = sheet.getRow(2);
  subRow.height = 20;
  subRow.font = { italic: true, size: 10, color: { argb: "FF475569" } };
  subRow.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  for (let c = 1; c <= colCount; c++) {
    subRow.getCell(c).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF4E6EA" },
    };
  }
  if (colCount > 1) {
    sheet.mergeCells(2, 1, 2, colCount);
  }
}

function styleTableSheet(
  sheet: ExcelJS.Worksheet,
  headerRowNumber: number,
  colWidths: number[]
) {
  const headerRow = sheet.getRow(headerRowNumber);
  headerRow.height = 24;
  headerRow.font = { bold: true, size: 10.5, color: { argb: "FFFFFFFF" } };
  headerRow.alignment = { vertical: "middle", horizontal: "left" };

  colWidths.forEach((w, idx) => {
    const col = sheet.getColumn(idx + 1);
    col.width = w;
    const cell = headerRow.getCell(idx + 1);
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF5E435D" },
    };
    cell.border = {
      bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
    };
  });

  sheet.views = [{ state: "frozen", ySplit: headerRowNumber }];

  for (let r = headerRowNumber + 1; r <= sheet.rowCount; r++) {
    const row = sheet.getRow(r);
    row.height = 20;
    row.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
    const isAlt = (r - headerRowNumber) % 2 === 0;
    for (let c = 1; c <= colWidths.length; c++) {
      const cell = row.getCell(c);
      if (isAlt) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF8FAFC" },
        };
      }
      cell.border = {
        bottom: { style: "hair", color: { argb: "FFE2E8F0" } },
      };
    }
  }
}

async function toUint8Array(workbook: ExcelJS.Workbook): Promise<Uint8Array> {
  const buf = await workbook.xlsx.writeBuffer();
  return new Uint8Array(buf);
}

export interface OverviewExcelPayload {
  generatedAt: string;
  generatedBy: string;
  kpis: {
    usersCount: number;
    publishedArticlesCount: number;
    totalArticlesCount: number;
    pendingAppsCount: number;
    totalAppsCount: number;
    upcomingEventsCount: number;
    resourcesCount: number;
    subscribersCount: number;
  };
  articles: Array<{
    title: string;
    category: string;
    author: string;
    published: boolean;
    date: string;
  }>;
  applications: Array<{
    applicantName: string;
    applicantEmail: string;
    programName: string;
    pole: string;
    city: string;
    statusLabel: string;
    date: string;
  }>;
  events: Array<{
    title: string;
    pole: string;
    location: string;
    isOnline: boolean;
    date: string;
    registrationsCount: number;
    capacity: number | null;
  }>;
  users: Array<{
    fullName: string;
    email: string;
    role: string;
    age: number;
    sexe: string;
    milieuResidence: string;
    telephone: string;
    sdh: boolean;
    newsletterOptIn: boolean;
    date: string;
  }>;
}

export async function buildAdminOverviewWorkbook(
  payload: OverviewExcelPayload
): Promise<Uint8Array> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "ACCEENT Plateforme";
  workbook.created = new Date();

  // 1. Synthèse
  const summarySheet = workbook.addWorksheet("Synthèse");
  addTitleBanner(
    summarySheet,
    "ACCEENT — Rapport de Synthèse Plateforme",
    `Exporté le ${payload.generatedAt} par ${payload.generatedBy}`,
    3
  );
  summarySheet.addRow(["Indicateur", "Valeur", "Précision"]);
  const kpiRows: Array<[string, string | number, string]> = [
    ["Articles publiés", payload.kpis.publishedArticlesCount, `Sur ${payload.kpis.totalArticlesCount} articles au total`],
    ["Membres enregistrés", payload.kpis.usersCount, "Comptes actifs sur la plateforme"],
    ["Candidatures à traiter", payload.kpis.pendingAppsCount, `Sur ${payload.kpis.totalAppsCount} dossiers déposés`],
    ["Événements à venir", payload.kpis.upcomingEventsCount, "Ateliers, forums et webinaires publiés"],
    ["Ressources pédagogiques", payload.kpis.resourcesCount, "Guides Tut-Tank & supports publiés"],
    ["Abonnés Newsletter", payload.kpis.subscribersCount, "Destinataires actifs des campagnes"],
  ];
  for (const row of kpiRows) {
    summarySheet.addRow(row.map(sanitizeExcelValue));
  }
  styleTableSheet(summarySheet, 3, [34, 18, 44]);

  // 2. Articles
  const articlesSheet = workbook.addWorksheet("Articles");
  addTitleBanner(articlesSheet, "ACCEENT — Articles & Actualités", `${payload.articles.length} enregistrement(s)`, 5);
  articlesSheet.addRow(["Titre", "Catégorie", "Auteur", "Statut", "Date de création"]);
  for (const a of payload.articles) {
    articlesSheet.addRow([
      sanitizeExcelValue(a.title),
      sanitizeExcelValue(a.category),
      sanitizeExcelValue(a.author),
      sanitizeExcelValue(a.published ? "Publié" : "Brouillon"),
      sanitizeExcelValue(a.date),
    ]);
  }
  styleTableSheet(articlesSheet, 3, [46, 20, 24, 14, 18]);

  // 3. Candidatures
  const appsSheet = workbook.addWorksheet("Candidatures");
  addTitleBanner(appsSheet, "ACCEENT — Candidatures Programmes", `${payload.applications.length} dossier(s)`, 7);
  appsSheet.addRow(["Candidat(e)", "E-mail", "Programme", "Pôle", "Ville", "Statut", "Date"]);
  for (const ap of payload.applications) {
    appsSheet.addRow([
      sanitizeExcelValue(ap.applicantName),
      sanitizeExcelValue(ap.applicantEmail),
      sanitizeExcelValue(ap.programName),
      sanitizeExcelValue(ap.pole),
      sanitizeExcelValue(ap.city),
      sanitizeExcelValue(ap.statusLabel),
      sanitizeExcelValue(ap.date),
    ]);
  }
  styleTableSheet(appsSheet, 3, [26, 30, 26, 18, 16, 18, 16]);

  // 4. Événements
  const eventsSheet = workbook.addWorksheet("Événements");
  addTitleBanner(eventsSheet, "ACCEENT — Événements & Ateliers", `${payload.events.length} événement(s)`, 7);
  eventsSheet.addRow(["Titre", "Pôle", "Lieu", "Modalité", "Date", "Inscrits", "Capacité"]);
  for (const ev of payload.events) {
    eventsSheet.addRow([
      sanitizeExcelValue(ev.title),
      sanitizeExcelValue(ev.pole),
      sanitizeExcelValue(ev.location),
      sanitizeExcelValue(ev.isOnline ? "En ligne" : "Présentiel"),
      sanitizeExcelValue(ev.date),
      sanitizeExcelValue(ev.registrationsCount),
      sanitizeExcelValue(ev.capacity ?? "Illimitée"),
    ]);
  }
  styleTableSheet(eventsSheet, 3, [38, 18, 28, 14, 20, 12, 14]);

  // 5. Membres
  const usersSheet = workbook.addWorksheet("Membres");
  addTitleBanner(usersSheet, "ACCEENT — Communauté & Rôles", `${payload.users.length} utilisateur(s)`, 10);
  usersSheet.addRow([
    "Nom complet",
    "E-mail",
    "Rôle",
    "Âge",
    "Sexe",
    "Milieu de résidence",
    "Téléphone",
    "SDH",
    "Newsletter",
    "Date d'inscription",
  ]);
  for (const u of payload.users) {
    usersSheet.addRow([
      sanitizeExcelValue(u.fullName),
      sanitizeExcelValue(u.email),
      sanitizeExcelValue(u.role),
      sanitizeExcelValue(u.age),
      sanitizeExcelValue(u.sexe),
      sanitizeExcelValue(u.milieuResidence),
      sanitizeExcelValue(u.telephone),
      sanitizeExcelValue(u.sdh),
      sanitizeExcelValue(u.newsletterOptIn),
      sanitizeExcelValue(u.date),
    ]);
  }
  styleTableSheet(usersSheet, 3, [26, 30, 12, 10, 12, 18, 18, 10, 12, 18]);

  return toUint8Array(workbook);
}

export async function buildUsersWorkbook(
  users: OverviewExcelPayload["users"],
  generatedAt: string
): Promise<Uint8Array> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "ACCEENT Plateforme";
  const sheet = workbook.addWorksheet("Membres ACCEENT");
  addTitleBanner(
    sheet,
    "ACCEENT — Annuaire des Utilisateurs",
    `Exporté le ${generatedAt} • ${users.length} compte(s)`,
    10
  );
  sheet.addRow([
    "Nom complet",
    "E-mail",
    "Rôle",
    "Âge",
    "Sexe",
    "Milieu de résidence",
    "Téléphone",
    "SDH",
    "Newsletter",
    "Date d'inscription",
  ]);
  for (const u of users) {
    sheet.addRow([
      sanitizeExcelValue(u.fullName),
      sanitizeExcelValue(u.email),
      sanitizeExcelValue(u.role),
      sanitizeExcelValue(u.age),
      sanitizeExcelValue(u.sexe),
      sanitizeExcelValue(u.milieuResidence),
      sanitizeExcelValue(u.telephone),
      sanitizeExcelValue(u.sdh),
      sanitizeExcelValue(u.newsletterOptIn),
      sanitizeExcelValue(u.date),
    ]);
  }
  styleTableSheet(sheet, 3, [26, 30, 12, 10, 12, 18, 18, 10, 12, 18]);
  return toUint8Array(workbook);
}

export async function buildApplicationsWorkbook(
  applications: Array<{
    applicantName: string;
    applicantEmail: string;
    programName: string;
    pole: string;
    phone: string;
    city: string;
    projectTitle: string;
    statusLabel: string;
    date: string;
  }>,
  generatedAt: string
): Promise<Uint8Array> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "ACCEENT Plateforme";
  const sheet = workbook.addWorksheet("Candidatures");
  addTitleBanner(
    sheet,
    "ACCEENT — Dossiers de Candidatures aux Programmes",
    `Exporté le ${generatedAt} • ${applications.length} dossier(s)`,
    9
  );
  sheet.addRow([
    "Candidat(e)",
    "E-mail",
    "Téléphone",
    "Ville",
    "Pôle",
    "Programme",
    "Projet",
    "Statut",
    "Déposé le",
  ]);
  for (const a of applications) {
    sheet.addRow([
      sanitizeExcelValue(a.applicantName),
      sanitizeExcelValue(a.applicantEmail),
      sanitizeExcelValue(a.phone),
      sanitizeExcelValue(a.city),
      sanitizeExcelValue(a.pole),
      sanitizeExcelValue(a.programName),
      sanitizeExcelValue(a.projectTitle),
      sanitizeExcelValue(a.statusLabel),
      sanitizeExcelValue(a.date),
    ]);
  }
  styleTableSheet(sheet, 3, [24, 28, 16, 16, 18, 24, 30, 18, 16]);
  return toUint8Array(workbook);
}

export async function buildEventAttendanceWorkbook(payload: {
  title: string;
  dateFormatted: string;
  location: string;
  registrations: Array<{
    ticketCode: string;
    fullName: string;
    email: string;
    phone: string;
    attended: boolean;
    registeredAt: string;
  }>;
}): Promise<Uint8Array> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "ACCEENT Plateforme";
  const sheet = workbook.addWorksheet("Émargement");
  addTitleBanner(
    sheet,
    `ACCEENT — Feuille de présence : ${payload.title}`,
    `${payload.dateFormatted} • ${payload.location} • ${payload.registrations.length} inscrit(s)`,
    7
  );
  sheet.addRow([
    "Code Billet",
    "Nom complet",
    "E-mail",
    "Téléphone",
    "Présent(e)",
    "Inscrit le",
    "Émargement",
  ]);
  for (const r of payload.registrations) {
    sheet.addRow([
      sanitizeExcelValue(r.ticketCode),
      sanitizeExcelValue(r.fullName),
      sanitizeExcelValue(r.email),
      sanitizeExcelValue(r.phone),
      sanitizeExcelValue(r.attended),
      sanitizeExcelValue(r.registeredAt),
      "",
    ]);
  }
  styleTableSheet(sheet, 3, [18, 28, 32, 18, 14, 18, 22]);
  return toUint8Array(workbook);
}
