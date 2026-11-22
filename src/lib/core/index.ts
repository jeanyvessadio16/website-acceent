export { logger, serializeError } from "./logger";
export {
  ok,
  fail,
  fromZodError,
  handleActionError,
  type ActionErrorCode,
  type ActionResult,
} from "./result";
export {
  requireSession,
  requireAdmin,
  requireAuthorOrAdmin,
  canManageOwnedResource,
  type GuardResult,
} from "./auth-guard";
export {
  checkRateLimit,
  checkDistributedRateLimit,
  resetRateLimiter,
  type RateLimitOptions,
  type RateLimitResult,
  type RateLimitDbExecutor,
} from "./rate-limit";
export { getClientIp, getPublicSiteOrigin, getRequestOrigin } from "./request";
export { generateAuthToken, hashAuthToken } from "./tokens";
export { recordAuditLog, type RecordAuditParams } from "./audit";
export { slugify, formatDateFr } from "./strings";
export {
  deleteUserCompletely,
  type DeletedUserSummary,
  type CompleteUserDeletionResult,
  type CompleteUserDeletionDeps,
  type UserDeletionTx,
} from "./user-deletion";
