import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/client";

const bucketName = "info-images";
const maxFiles = 6;
const maxFileSize = 5 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extensionFor(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "webp", "gif"].includes(fromName)) return fromName;
  if (file.type === "image/jpeg") return "jpg";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/gif") return "gif";
  return "jpg";
}

export async function POST(request: Request) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "未配置 Supabase Storage，暂不能上传图片。" }, { status: 503 });
  }

  if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
    return NextResponse.json({ error: "请使用 multipart/form-data 上传图片。" }, { status: 400 });
  }

  const formData = await request.formData();
  const files = formData
    .getAll("images")
    .filter((value): value is File => value instanceof File);

  if (!files.length) {
    return NextResponse.json({ urls: [] });
  }

  if (files.length > maxFiles) {
    return NextResponse.json({ error: `最多只能上传 ${maxFiles} 张图片。` }, { status: 400 });
  }

  const uploadedUrls: string[] = [];

  for (const file of files) {
    if (!allowedTypes.has(file.type)) {
      return NextResponse.json({ error: "只支持 JPG、PNG、WEBP 或 GIF 图片。" }, { status: 400 });
    }

    if (file.size > maxFileSize) {
      return NextResponse.json({ error: "单张图片不能超过 5MB。" }, { status: 400 });
    }

    const path = `infos/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extensionFor(file)}`;
    const { error } = await supabase.storage.from(bucketName).upload(path, file, {
      contentType: file.type,
      upsert: false
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
    uploadedUrls.push(data.publicUrl);
  }

  return NextResponse.json({ urls: uploadedUrls });
}
