import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const next = url.searchParams.get("next") || "/dashboard";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      const safeNext = next.startsWith("/") ? next : "/dashboard";
      url.pathname = safeNext;
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  url.pathname = "/auth/confirm/error";
  url.search = "";
  return NextResponse.redirect(url);
}
