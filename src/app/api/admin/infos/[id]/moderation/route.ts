import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/client";

type ModerationBody = {
  moderationStatus?: "approved" | "rejected";
};

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = (await request.json()) as ModerationBody;

  if (body.moderationStatus !== "approved" && body.moderationStatus !== "rejected") {
    return NextResponse.json({ error: "审核状态无效" }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({
      id: params.id,
      moderationStatus: body.moderationStatus,
      mode: "mock"
    });
  }

  const { data, error } = await supabase
    .from("infos")
    .update({
      moderation_status: body.moderationStatus,
      status: body.moderationStatus === "approved" ? "published" : "hidden"
    })
    .eq("id", params.id)
    .select("id, moderation_status, status")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    id: data.id,
    moderationStatus: data.moderation_status,
    status: data.status,
    mode: "supabase"
  });
}
