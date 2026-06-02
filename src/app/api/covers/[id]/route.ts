import { NextResponse } from "next/server";
import { buildGeneratedCoverSvg } from "@/lib/coverImage";
import { channelById, getInfo } from "@/lib/data";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const info = await getInfo(params.id);

  if (!info) {
    return new NextResponse("Not found", { status: 404 });
  }

  const channel = info.channel ?? channelById(info.channel_id);
  const svg = buildGeneratedCoverSvg(info, channel?.name ?? "维界");

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
