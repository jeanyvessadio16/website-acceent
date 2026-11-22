import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import ts from "typescript";
import ExcelJS from "exceljs";
import {
  buildEventAttendanceWorkbook,
  buildUsersWorkbook,
} from "@/lib/export/excel";

async function loadWorkbookFromBytes(bytes: Uint8Array): Promise<ExcelJS.Workbook> {
  const wb = new ExcelJS.Workbook();
  const ab = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer;
  await wb.xlsx.load(ab);
  return wb;
}

describe("Exports Excel & PDF (logo ACCEENT & colonnes événements)", () => {
  it("génère un classeur utilisateurs XLSX valide avec le logo ACCEENT dans l'en-tête", async () => {
    const bytes = await buildUsersWorkbook(
      [
        {
          fullName: "Aïssatou Diallo",
          email: "aissatou@acceent.org",
          age: 24,
          sexe: "Femme",
          milieuResidence: "Urbain",
          telephone: "771234567",
          sdh: false,
          date: "21/11/2026",
        },
      ],
      "21 novembre 2026 à 12:00"
    );

    assert.ok(bytes instanceof Uint8Array);
    assert.ok(bytes.length > 100);
    assert.equal(bytes[0], 0x50);
    assert.equal(bytes[1], 0x4b);
    assert.equal(bytes[2], 0x03);
    assert.equal(bytes[3], 0x04);

    const wb = await loadWorkbookFromBytes(bytes);
    const sheet = wb.getWorksheet("Membres ACCEENT");
    assert.ok(sheet);
    assert.ok(wb.model.media.length >= 1);
    const rawMedia = wb.model.media[0]?.buffer as Uint8Array | ArrayBuffer | undefined;
    assert.ok(rawMedia);
    const mediaBytes = new Uint8Array(rawMedia);
    assert.equal(mediaBytes[0], 0x89);
    assert.equal(mediaBytes[1], 0x50);
    assert.equal(mediaBytes[2], 0x4e);
    assert.equal(mediaBytes[3], 0x47);
    assert.equal(sheet.getImages().length, 1);

    assert.equal(sheet.getRow(4).getCell(1).value, "Nom complet");
    assert.equal(sheet.getRow(5).getCell(1).value, "Aïssatou Diallo");
  });

  it("inclut le logo ACCEENT ainsi que téléphone, âge et sexe dans l'export Excel d'événement", async () => {
    const bytes = await buildEventAttendanceWorkbook({
      title: "Atelier Robotique WRO",
      dateFormatted: "25 novembre 2026 à 10:00",
      location: "Ziguinchor",
      registrations: [
        {
          ticketCode: "ACC-123456",
          fullName: "Moussa Ndiaye",
          email: "moussa@acceent.org",
          phone: "+221 77 111 22 33",
          age: 22,
          sexe: "Homme",
          attended: false,
          registeredAt: "22/11/2026",
        },
      ],
    });

    const wb = await loadWorkbookFromBytes(bytes);
    const sheet = wb.getWorksheet("Émargement");
    assert.ok(sheet);
    assert.ok(wb.model.media.length >= 1);
    assert.equal(sheet.getImages().length, 1);

    const headerRow = sheet.getRow(4);
    assert.equal(headerRow.getCell(4).value, "Téléphone");
    assert.equal(headerRow.getCell(5).value, "Âge");
    assert.equal(headerRow.getCell(6).value, "Sexe");

    const dataRow = sheet.getRow(5);
    assert.equal(dataRow.getCell(4).value, "'+221 77 111 22 33");
    assert.equal(dataRow.getCell(5).value, 22);
    assert.equal(dataRow.getCell(6).value, "Homme");
  });

  it("génère des documents PDF valides avec le logo ACCEENT et les colonnes événements", () => {
    const req = createRequire(path.join(process.cwd(), "package.json"));
    const reactUrl = pathToFileURL(req.resolve("react")).href;
    const reactPdfPkgDir = path.dirname(req.resolve("@react-pdf/renderer/package.json"));
    const reactPdfUrl = pathToFileURL(
      path.join(reactPdfPkgDir, "lib/react-pdf.js")
    ).href;

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "acceent-pdf-test-"));
    try {
      const logoJs = ts.transpileModule(
        fs.readFileSync(path.join(process.cwd(), "src/lib/export/logo.ts"), "utf8"),
        {
          compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2022,
          },
        }
      ).outputText;
      fs.writeFileSync(path.join(tmpDir, "logo.mjs"), logoJs, "utf8");

      let pdfJs = ts.transpileModule(
        fs.readFileSync(path.join(process.cwd(), "src/lib/export/pdf.tsx"), "utf8"),
        {
          compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2022,
            jsx: ts.JsxEmit.React,
          },
        }
      ).outputText;
      pdfJs = pdfJs
        .replace(/from ["']react["']/g, `from ${JSON.stringify(reactUrl)}`)
        .replace(
          /from ["']@react-pdf\/renderer["']/g,
          `from ${JSON.stringify(reactPdfUrl)}`
        )
        .replace(/from ["']\.\/logo["']/g, 'from "./logo.mjs"');
      fs.writeFileSync(path.join(tmpDir, "pdf.mjs"), pdfJs, "utf8");

      const runner = `
        import {
          renderAdminReportPdf,
          renderEventAttendancePdf,
          renderMemberTicketPdf,
        } from "./pdf.mjs";
        const [eventPdf, overviewPdf, ticketPdf] = await Promise.all([
          renderEventAttendancePdf({
            title: "Forum Entrepreneuriat",
            dateFormatted: "28 novembre 2026 à 09:30",
            location: "Santhiaba, Ziguinchor",
            poleLabel: "Entrepreneuriat",
            capacity: 50,
            generatedAt: "22 novembre 2026 à 10:20",
            registrations: [
              {
                ticketCode: "ACC-ABCDEF",
                fullName: "Fatou Bâ",
                email: "fatou@acceent.org",
                phone: "+221 78 555 44 33",
                age: 25,
                sexe: "Femme",
                attended: true,
              },
            ],
          }),
          renderAdminReportPdf({
            generatedAt: "22 novembre 2026 à 10:20",
            generatedBy: "Admin ACCEENT",
            kpis: {
              usersCount: 10,
              publishedArticlesCount: 4,
              totalArticlesCount: 5,
              pendingAppsCount: 2,
              totalAppsCount: 6,
              upcomingEventsCount: 1,
              resourcesCount: 3,
              subscribersCount: 15,
            },
            recentArticles: [],
            recentApplications: [],
            upcomingEvents: [],
          }),
          renderMemberTicketPdf({
            ticketCode: "ACC-ABCDEF",
            holderName: "Fatou Bâ",
            holderEmail: "fatou@acceent.org",
            eventTitle: "Forum Entrepreneuriat",
            eventDateFormatted: "28 novembre 2026 à 09:30",
            eventLocation: "Santhiaba, Ziguinchor",
            isOnline: false,
            meetingUrl: null,
            registeredAtFormatted: "22/11/2026",
          }),
        ]);
        console.log(JSON.stringify({
          event: { header: Buffer.from(eventPdf.subarray(0, 5)).toString("ascii"), len: eventPdf.length },
          overview: { header: Buffer.from(overviewPdf.subarray(0, 5)).toString("ascii"), len: overviewPdf.length },
          ticket: { header: Buffer.from(ticketPdf.subarray(0, 5)).toString("ascii"), len: ticketPdf.length },
        }));
      `;
      const runnerPath = path.join(tmpDir, "run.mjs");
      fs.writeFileSync(runnerPath, runner, "utf8");

      const cleanEnv = { ...process.env };
      delete cleanEnv.NODE_OPTIONS;
      const out = execFileSync(process.execPath, [runnerPath], {
        cwd: process.cwd(),
        env: cleanEnv,
        encoding: "utf8",
      });
      const result = JSON.parse(out) as Record<
        "event" | "overview" | "ticket",
        { header: string; len: number }
      >;

      for (const key of ["event", "overview", "ticket"] as const) {
        assert.equal(result[key].header, "%PDF-");
        assert.ok(result[key].len > 50_000);
      }
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
