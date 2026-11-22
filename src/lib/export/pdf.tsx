import React from "react";
import {
  Document,
  Image as PdfImage,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import { getAcceentLogoDataUri } from "./logo";

const COLORS = {
  plum: "#836182",
  plumSoft: "#f4e6ea",
  plumDark: "#5e435d",
  ink: "#0f172a",
  muted: "#475569",
  light: "#94a3b8",
  bgSoft: "#f8fafc",
  border: "#e2e8f0",
  white: "#ffffff",
  emerald: "#047857",
  emeraldSoft: "#ecfdf5",
  amber: "#b45309",
  amberSoft: "#fffbeb",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 52,
    paddingHorizontal: 36,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: COLORS.ink,
    backgroundColor: COLORS.white,
  },
  headerBanner: {
    backgroundColor: COLORS.plum,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandBlock: {
    flexDirection: "column",
    gap: 4,
  },
  brandLogo: {
    width: 118,
    height: 33,
    objectFit: "contain",
  },
  brandLogoCompact: {
    width: 100,
    height: 28,
    objectFit: "contain",
  },
  brandTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },
  brandSubtitle: {
    color: COLORS.plumSoft,
    fontSize: 8.5,
    marginTop: 3,
  },
  headerMeta: {
    alignItems: "flex-end",
  },
  headerMetaText: {
    color: COLORS.white,
    fontSize: 8,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 11.5,
    fontFamily: "Helvetica-Bold",
    color: COLORS.plumDark,
    marginTop: 14,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  kpiGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: COLORS.bgSoft,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: 10,
  },
  kpiLabel: {
    fontSize: 7.5,
    color: COLORS.muted,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: COLORS.ink,
  },
  kpiSub: {
    fontSize: 7.5,
    color: COLORS.muted,
    marginTop: 3,
  },
  table: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.plumSoft,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: COLORS.plumDark,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bgSoft,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableCell: {
    fontSize: 8.5,
    color: COLORS.ink,
  },
  infoBox: {
    backgroundColor: COLORS.bgSoft,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    width: 110,
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    color: COLORS.muted,
  },
  infoValue: {
    flex: 1,
    fontSize: 8.5,
    color: COLORS.ink,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    color: COLORS.light,
  },
  ticketWrapper: {
    borderWidth: 1.5,
    borderColor: COLORS.plum,
    borderRadius: 10,
    padding: 20,
    marginTop: 8,
  },
  ticketBadge: {
    backgroundColor: COLORS.emeraldSoft,
    borderWidth: 1,
    borderColor: COLORS.emerald,
    color: COLORS.emerald,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  ticketCodeBox: {
    backgroundColor: COLORS.plumSoft,
    borderWidth: 1,
    borderColor: COLORS.plum,
    borderRadius: 8,
    padding: 14,
    marginVertical: 14,
    alignItems: "center",
  },
  ticketCodeLabel: {
    fontSize: 8,
    color: COLORS.plumDark,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  ticketCodeValue: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: COLORS.plumDark,
    letterSpacing: 2,
  },
  ticketNotice: {
    marginTop: 14,
    padding: 10,
    backgroundColor: COLORS.amberSoft,
    borderRadius: 6,
    fontSize: 8,
    color: COLORS.amber,
    lineHeight: 1.4,
  },
});

export interface AdminReportPdfPayload {
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
  recentArticles: Array<{
    title: string;
    author: string;
    status: string;
    date: string;
  }>;
  recentApplications: Array<{
    applicantName: string;
    programName: string;
    statusLabel: string;
    city: string;
    date: string;
  }>;
  upcomingEvents: Array<{
    title: string;
    location: string;
    date: string;
    registrationsCount: number;
    capacity: number | null;
  }>;
}

export async function renderAdminReportPdf(payload: AdminReportPdfPayload): Promise<Uint8Array> {
  const logoSrc = getAcceentLogoDataUri();
  const doc = (
    <Document title="Rapport de Synthese ACCEENT" author="ACCEENT">
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBanner}>
          <View style={styles.brandBlock}>
            {logoSrc ? (
              <PdfImage src={logoSrc} style={styles.brandLogo} />
            ) : (
              <Text style={styles.brandTitle}>ACCEENT</Text>
            )}
            <Text style={styles.brandSubtitle}>
              Rapport executif de supervision de la plateforme
            </Text>
          </View>
          <View style={styles.headerMeta}>
            <Text style={styles.headerMetaText}>Edite le {payload.generatedAt}</Text>
            <Text style={styles.headerMetaText}>Par : {payload.generatedBy}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Indicateurs cles de la plateforme</Text>
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Articles publies</Text>
            <Text style={styles.kpiValue}>{payload.kpis.publishedArticlesCount}</Text>
            <Text style={styles.kpiSub}>sur {payload.kpis.totalArticlesCount} articles</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Membres inscrits</Text>
            <Text style={styles.kpiValue}>{payload.kpis.usersCount}</Text>
            <Text style={styles.kpiSub}>{payload.kpis.subscribersCount} abonnes newsletter</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Candidatures</Text>
            <Text style={styles.kpiValue}>{payload.kpis.pendingAppsCount}</Text>
            <Text style={styles.kpiSub}>a traiter ({payload.kpis.totalAppsCount} total)</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Ateliers & Guides</Text>
            <Text style={styles.kpiValue}>{payload.kpis.upcomingEventsCount}</Text>
            <Text style={styles.kpiSub}>{payload.kpis.resourcesCount} ressources en ligne</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Dernieres publications</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 3 }]}>Titre</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Auteur</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Statut</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Date</Text>
          </View>
          {payload.recentArticles.length === 0 ? (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Aucune publication recente.</Text>
            </View>
          ) : (
            payload.recentArticles.map((art, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCell, { flex: 3 }]}>{art.title}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{art.author}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{art.status}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{art.date}</Text>
              </View>
            ))
          )}
        </View>

        <Text style={styles.sectionTitle}>Dernieres candidatures aux programmes</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Candidat(e)</Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Programme</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Ville</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Statut</Text>
          </View>
          {payload.recentApplications.length === 0 ? (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Aucune candidature enregistree.</Text>
            </View>
          ) : (
            payload.recentApplications.map((app, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{app.applicantName}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>{app.programName}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{app.city}</Text>
                <Text style={[styles.tableCell, { flex: 1.2 }]}>{app.statusLabel}</Text>
              </View>
            ))
          )}
        </View>

        <Text style={styles.sectionTitle}>Prochains evenements</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2.5 }]}>Evenement</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.8 }]}>Lieu</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Date</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.9 }]}>Inscrits</Text>
          </View>
          {payload.upcomingEvents.length === 0 ? (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Aucun evenement a venir.</Text>
            </View>
          ) : (
            payload.upcomingEvents.map((ev, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCell, { flex: 2.5 }]}>{ev.title}</Text>
                <Text style={[styles.tableCell, { flex: 1.8 }]}>{ev.location}</Text>
                <Text style={[styles.tableCell, { flex: 1.2 }]}>{ev.date}</Text>
                <Text style={[styles.tableCell, { flex: 0.9 }]}>
                  {ev.capacity ? `${ev.registrationsCount}/${ev.capacity}` : `${ev.registrationsCount}`}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.footer} fixed>
          <Text>
            {"ACCEENT - Agir pour la Solidarite, l'Education et l'Entrepreneuriat (Ziguinchor)"}
          </Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );

  const buf = await renderToBuffer(doc);
  return new Uint8Array(buf);
}

export interface EventAttendancePdfPayload {
  title: string;
  dateFormatted: string;
  location: string;
  poleLabel: string;
  capacity: number | null;
  generatedAt: string;
  registrations: Array<{
    ticketCode: string;
    fullName: string;
    email: string;
    phone: string;
    age: number;
    sexe: string;
    attended: boolean;
  }>;
}

export async function renderEventAttendancePdf(
  event: EventAttendancePdfPayload
): Promise<Uint8Array> {
  const logoSrc = getAcceentLogoDataUri();
  const doc = (
    <Document title={`Emargement - ${event.title}`} author="ACCEENT">
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.headerBanner}>
          <View style={styles.brandBlock}>
            {logoSrc ? (
              <PdfImage src={logoSrc} style={styles.brandLogo} />
            ) : (
              <Text style={styles.brandTitle}>ACCEENT</Text>
            )}
            <Text style={styles.brandSubtitle}>
              {`Feuille d'emargement - ${event.title}`}
            </Text>
          </View>
          <View style={styles.headerMeta}>
            <Text style={styles.headerMetaText}>Imprime le {event.generatedAt}</Text>
            <Text style={styles.headerMetaText}>
              {event.registrations.length} inscrit{event.registrations.length > 1 ? "s" : ""}
              {event.capacity ? ` / ${event.capacity} places` : ""}
            </Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date & heure :</Text>
            <Text style={styles.infoValue}>{event.dateFormatted}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Lieu / Modalite :</Text>
            <Text style={styles.infoValue}>{event.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pole ACCEENT :</Text>
            <Text style={styles.infoValue}>{event.poleLabel}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: 72 }]}>Billet</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Nom complet</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.8 }]}>E-mail</Text>
            <Text style={[styles.tableHeaderCell, { width: 86 }]}>Telephone</Text>
            <Text style={[styles.tableHeaderCell, { width: 40 }]}>Age</Text>
            <Text style={[styles.tableHeaderCell, { width: 56 }]}>Sexe</Text>
            <Text style={[styles.tableHeaderCell, { width: 66 }]}>Statut</Text>
            <Text style={[styles.tableHeaderCell, { width: 90 }]}>Signature</Text>
          </View>
          {event.registrations.length === 0 ? (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Aucun participant inscrit a ce jour.</Text>
            </View>
          ) : (
            event.registrations.map((r, i) => (
              <View key={r.ticketCode} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCell, { width: 72, fontFamily: "Helvetica-Bold" }]}>
                  {r.ticketCode}
                </Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{r.fullName}</Text>
                <Text style={[styles.tableCell, { flex: 1.8 }]}>{r.email}</Text>
                <Text style={[styles.tableCell, { width: 86 }]}>{r.phone || "-"}</Text>
                <Text style={[styles.tableCell, { width: 40 }]}>{`${r.age} ans`}</Text>
                <Text style={[styles.tableCell, { width: 56 }]}>{r.sexe}</Text>
                <Text style={[styles.tableCell, { width: 66 }]}>
                  {r.attended ? "Present" : "A confirmer"}
                </Text>
                <Text style={[styles.tableCell, { width: 90 }]}> </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.footer} fixed>
          <Text>Document administratif interne - ACCEENT Ziguinchor</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );

  const buf = await renderToBuffer(doc);
  return new Uint8Array(buf);
}

export interface MemberTicketPdfPayload {
  ticketCode: string;
  holderName: string;
  holderEmail: string;
  eventTitle: string;
  eventDateFormatted: string;
  eventLocation: string;
  isOnline: boolean;
  meetingUrl?: string | null;
  registeredAtFormatted: string;
}

export async function renderMemberTicketPdf(
  ticket: MemberTicketPdfPayload
): Promise<Uint8Array> {
  const logoSrc = getAcceentLogoDataUri();
  const doc = (
    <Document title={`Billet ACCEENT - ${ticket.ticketCode}`} author="ACCEENT">
      <Page size="A5" orientation="landscape" style={styles.page}>
        <View style={styles.headerBanner}>
          <View style={styles.brandBlock}>
            {logoSrc ? (
              <PdfImage src={logoSrc} style={styles.brandLogoCompact} />
            ) : (
              <Text style={styles.brandTitle}>ACCEENT</Text>
            )}
            <Text style={styles.brandSubtitle}>
              {"Billet d'acces officiel - Evenement & Atelier"}
            </Text>
          </View>
          <View style={styles.headerMeta}>
            <Text style={styles.headerMetaText}>Inscrit le {ticket.registeredAtFormatted}</Text>
          </View>
        </View>

        <View style={styles.ticketWrapper}>
          <Text style={styles.ticketBadge}>BILLET CONFIRME</Text>
          <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", marginBottom: 10 }}>
            {ticket.eventTitle}
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Participant(e) :</Text>
            <Text style={styles.infoValue}>
              {ticket.holderName} ({ticket.holderEmail})
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date & heure :</Text>
            <Text style={styles.infoValue}>{ticket.eventDateFormatted}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Lieu / Acces :</Text>
            <Text style={styles.infoValue}>
              {ticket.eventLocation}
              {ticket.isOnline ? " (Session en ligne)" : ""}
            </Text>
          </View>
          {ticket.isOnline && ticket.meetingUrl ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Lien visio :</Text>
              <Text style={styles.infoValue}>{ticket.meetingUrl}</Text>
            </View>
          ) : null}

          <View style={styles.ticketCodeBox}>
            <Text style={styles.ticketCodeLabel}>{"Code d'identification unique"}</Text>
            <Text style={styles.ticketCodeValue}>{ticket.ticketCode}</Text>
          </View>

          <Text style={styles.ticketNotice}>
            {
              "Presentez ce code billet (sur telephone ou imprime) a l'accueil lors de votre arrivee. Ce billet est strictement personnel et rattache a votre compte membre ACCEENT."
            }
          </Text>
        </View>
      </Page>
    </Document>
  );

  const buf = await renderToBuffer(doc);
  return new Uint8Array(buf);
}
