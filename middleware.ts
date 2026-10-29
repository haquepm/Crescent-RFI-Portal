import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const isLogin = request.nextUrl.pathname === "/login";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (isLogin) return response;
    return NextResponse.redirect(new URL("/login", request.url));
  }

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
      if (isLogin) return response;
      const destination = new URL("/login", request.url);
      destination.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(destination);
    }
    if (isLogin) return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Crescent RFI auth middleware failed:", error);
    if (!isLogin) return NextResponse.redirect(new URL("/login", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
