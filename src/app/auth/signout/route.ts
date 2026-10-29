import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login?logged_out=1", request.url));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    });

    try {
      await supabase.auth.signOut({ scope: "local" });
    } catch (error) {
      console.error("Server-side Crescent RFI sign-out failed:", error);
    }
  }

  // Explicitly expire every Supabase auth cookie for this origin as a
  // fallback, so a stale browser session cannot immediately log the user in.
  for (const cookie of request.cookies.getAll()) {
    if (cookie.name.startsWith("sb-") || cookie.name.includes("supabase")) {
      response.cookies.set(cookie.name, "", {
        path: "/",
        maxAge: 0,
        expires: new Date(0),
        sameSite: "lax",
        secure: request.nextUrl.protocol === "https:",
        httpOnly: true,
      });
    }
  }

  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return response;
}
