/**
 * Point d'entrée des Server Actions d'authentification.
 *
 * Usage :
 *   import { loginAction, registerAction } from "@/actions/auth";
 */
export { loginAction, type LoginActionResult } from "./login";
export { registerAction, type RegisterActionResult } from "./register";
export { logoutAction } from "./logout";
