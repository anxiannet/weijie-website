import { NextResponse } from "next/server";
import { generateInfoDraft } from "@/lib/ai/generateInfoDraft";

export async function POST(request: Request) {
  const body = await request.json();
  const draft = await generateInfoDraft({
    channel: body.channel ?? "生活",
    tag: body.tag ?? "#新加坡生活",
    topicText: body.topicText ?? ""
  });
  return NextResponse.json(draft);
}
