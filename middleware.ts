import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const isLogin = request.nextUrl.pathname === "/login";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Always allow the login page to render, even with an existing session,
  // so users can deliberately switch accounts.
  if (isLogin) return response;

  if (!url || !key) return NextResponse.redirect(new URL("/login", request.url));

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      const destination = new URL("/login", request.url);
      destination.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(destination);
    }

    const { data: profile, error: profileError } = await supabase
      .from("rfi_user_profiles")
      .select("is_active")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError || !profile?.is_active) {
      const destination = new URL("/login", request.url);
      destination.searchParams.set("access", "inactive");
      return NextResponse.redirect(destination);
    }
  } catch (error) {
    console.error("Crescent RFI auth middleware failed:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
