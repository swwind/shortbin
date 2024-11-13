export const ORIGIN = Deno.env.get("SHORTBIN_ORIGIN") || "http://[::1]:3000";
export const AUTH_TOKEN = Deno.env.get("SHORTBIN_AUTH_TOKEN") || "";
export const HOSTNAME = Deno.env.get("SHORTBIN_HOSTNAME") || "::1";
export const PORT = +(Deno.env.get("SHORTBIN_PORT") || "3000");
