"use server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "screenwhy-sw3-owner-preview";
const TTL_SECONDS = 8 * 3600;
function previewAvailable(): boolean {
  return process.env.NODE_ENV !== "production" || (process.env.VERCEL_ENV === "preview" && process.env.SCREENWHY_SW3_PREVIEW_ENABLED === "true");
}
function secret(): string | null {
  const value = process.env.SCREENWHY_SW3_PREVIEW_PASSWORD;
  return value && value.length >= 24 ? value : null;
}
function same(a: string, b: string): boolean {
  const left=Buffer.from(a);const right=Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left,right);
}
function signature(expires: number, key: string) {
  return createHmac("sha256", key).update(`screenwhy3.preview.${expires}`).digest("hex");
}
export async function previewAuthorized(): Promise<boolean> {
  if (!previewAvailable()) return false;
  if (process.env.NODE_ENV !== "production") return true;
  const key=secret();if (!key) return false;
  const value=(await cookies()).get(COOKIE)?.value ?? "";
  const parts=value.split(".");if(parts.length!==2 || !/^\d{10,}$/.test(parts[0])) return false;
  const expires=Number(parts[0]);
  if(!Number.isSafeInteger(expires) || expires <= Math.floor(Date.now()/1000) || expires > Math.floor(Date.now()/1000)+TTL_SECONDS) return false;
  return same(parts[1],signature(expires,key));
}
/** Expects a server-only password stored in the Vercel PREVIEW environment, never in source. */
export async function unlockSw3Preview(formData: FormData) {
  if (!previewAvailable() || process.env.NODE_ENV !== "production") redirect("/");
  const key=secret();const provided=formData.get("password");
  if (!key || typeof provided !== "string" || provided.length > 256 || !same(provided,key ?? "")) redirect("/__ui/screenwhy3/?error=invalid");
  const expires=Math.floor(Date.now()/1000)+TTL_SECONDS;
  (await cookies()).set(COOKIE,`${expires}.${signature(expires,key)}`,{httpOnly:true,secure:true,sameSite:"strict",maxAge:TTL_SECONDS,path:"/__ui/screenwhy3"});
  redirect("/__ui/screenwhy3/");
}
