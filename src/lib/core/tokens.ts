import crypto from "node:crypto";

export function generateAuthToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashAuthToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}
