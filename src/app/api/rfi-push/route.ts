import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const secret = process.env.RFI_PUSH_WEBHOOK_SECRET;
  const publicKey = process.env.RFI_VAPID_PUBLIC_KEY;
  const privateKey = process.env.RFI_VAPID_PRIVATE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!secret || !publicKey || !privateKey || !supabaseUrl || !anonKey) {
    return NextResponse.json({ error: "Push delivery is not configured." }, { status: 503 });
  }
  if (request.headers.get("x-rfi-push-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const notificationId = payload?.notification_id;
  if (typeof notificationId !== "string") {
    return NextResponse.json({ error: "notification_id is required." }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: targets, error } = await supabase.rpc("get_rfi_push_targets", {
    p_notification_id: notificationId,
    p_secret: secret,
  });
  if (error) {
    console.error("RFI push target lookup failed:", error.message);
    return NextResponse.json({ error: "Unable to load push targets." }, { status: 500 });
  }

  webpush.setVapidDetails("mailto:admin@crescentcontractors.com", publicKey, privateKey);
  const results = await Promise.all((targets || []).map(async (target: {
    endpoint: string;
    subscription: webpush.PushSubscription;
    title: string;
    body: string;
    target_url: string;
  }) => {
    try {
      await webpush.sendNotification(
        target.subscription,
        JSON.stringify({
          title: target.title,
          body: target.body,
          target_url: target.target_url,
          tag: notificationId,
        }),
      );
      return { sent: true };
    } catch (err) {
      const statusCode = (err as { statusCode?: number }).statusCode;
      if (statusCode === 404 || statusCode === 410) {
        await supabase.rpc("remove_rfi_push_subscription", {
          p_endpoint: target.endpoint,
          p_secret: secret,
        });
      } else {
        console.error("RFI push delivery failed:", statusCode || "unknown");
      }
      return { sent: false, statusCode: statusCode || null };
    }
  }));

  return NextResponse.json({
    ok: true,
    attempted: results.length,
    sent: results.filter((item: { sent: boolean }) => item.sent).length,
  });
}
