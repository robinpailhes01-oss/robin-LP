import { NextResponse } from "next/server";
import { STUDIO_COOKIE } from "@/lib/studio/auth";

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/studio/connexion", req.url), 303);
  res.cookies.delete(STUDIO_COOKIE);
  return res;
}
