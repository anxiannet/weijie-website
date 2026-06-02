import type { Info } from "@/types";

const palettes = [
  { bg: "#dff7f3", panel: "#ffffff", accent: "#008080", soft: "#a7e4dc", ink: "#172026" },
  { bg: "#e7f0ff", panel: "#ffffff", accent: "#2563eb", soft: "#bfdbfe", ink: "#172026" },
  { bg: "#fff4d6", panel: "#ffffff", accent: "#d97706", soft: "#fde68a", ink: "#172026" },
  { bg: "#ffe8ee", panel: "#ffffff", accent: "#e11d48", soft: "#fecdd3", ink: "#172026" },
  { bg: "#efe7ff", panel: "#ffffff", accent: "#7c3aed", soft: "#ddd6fe", ink: "#172026" }
];

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&apos;");
}

function paletteIndex(id: string) {
  return id.split("").reduce((total, char) => total + char.charCodeAt(0), 0) % palettes.length;
}

function wrapText(text: string, maxChars: number, maxLines: number) {
  const chars = Array.from(text.trim());
  const lines: string[] = [];

  for (let index = 0; index < chars.length && lines.length < maxLines; index += maxChars) {
    const line = chars.slice(index, index + maxChars).join("");
    lines.push(line);
  }

  if (chars.length > maxChars * maxLines && lines.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].slice(0, -1)}…`;
  }

  return lines.length ? lines : ["维界信息"];
}

export function buildGeneratedCoverSvg(info: Info, channelName = "维界") {
  const palette = palettes[paletteIndex(info.id)];
  const titleLines = wrapText(info.title, 9, 4);
  const subtitle = info.location_text || info.price_text || "新加坡华人本地生活信息";
  const meta = info.price_text && info.location_text ? `${info.location_text} · ${info.price_text}` : subtitle;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="900" height="1200" viewBox="0 0 900 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="900" height="1200" fill="${palette.bg}"/>
  <circle cx="780" cy="170" r="210" fill="${palette.soft}" opacity="0.65"/>
  <circle cx="120" cy="1040" r="260" fill="${palette.soft}" opacity="0.45"/>
  <path d="M0 785C130 720 244 730 363 785C508 852 644 855 900 725V1200H0V785Z" fill="${palette.panel}" opacity="0.66"/>
  <rect x="58" y="72" width="784" height="1056" rx="44" fill="${palette.panel}" opacity="0.88"/>
  <rect x="98" y="118" width="178" height="58" rx="29" fill="${palette.accent}"/>
  <text x="187" y="155" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="28" font-weight="700" fill="white">${escapeXml(channelName)}</text>
  <text x="98" y="268" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="28" font-weight="700" fill="${palette.accent}">维界 Weijie</text>
  <g font-family="-apple-system,BlinkMacSystemFont,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif" font-size="86" font-weight="850" fill="${palette.ink}">
    ${titleLines.map((line, index) => `<text x="98" y="${410 + index * 104}">${escapeXml(line)}</text>`).join("")}
  </g>
  <rect x="98" y="846" width="704" height="2" fill="${palette.accent}" opacity="0.18"/>
  <text x="98" y="920" font-family="-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif" font-size="34" font-weight="650" fill="${palette.ink}" opacity="0.82">${escapeXml(meta)}</text>
  <text x="98" y="990" font-family="-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif" font-size="28" font-weight="500" fill="${palette.ink}" opacity="0.56">打破信息壁垒，解决现实问题</text>
  <rect x="650" y="1002" width="112" height="16" rx="8" fill="${palette.accent}" opacity="0.22"/>
  <rect x="720" y="1038" width="82" height="16" rx="8" fill="${palette.accent}" opacity="0.34"/>
</svg>`;
}
