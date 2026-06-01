export type ClassifyInput = {
  title: string;
  content?: string;
  location_text?: string;
  price_text?: string;
};

export type ClassifyOutput = {
  channelSlug: string;
  tags: string[];
  infoType: string;
};

const hasAny = (text: string, words: string[]) => words.some((word) => text.includes(word.toLowerCase()));

export function classifyInfo(input: ClassifyInput): ClassifyOutput {
  const text = `${input.title} ${input.content ?? ""} ${input.location_text ?? ""} ${input.price_text ?? ""}`.toLowerCase();

  if (hasAny(text, ["ntu", "南大", "pioneer", "普通房", "主人房", "租房"])) {
    return { channelSlug: "rental", tags: ["#NTU租房", "#Pioneer", text.includes("主人房") ? "#主人房" : "#普通房"], infoType: "rental" };
  }
  if (hasAny(text, ["蒸饺", "东北菜", "吃", "餐厅"])) {
    return { channelSlug: "food", tags: ["#蒸饺", "#东北菜"], infoType: "food" };
  }
  if (hasAny(text, ["ep", "sp", "wp", "工作", "简历", "面试"])) {
    return { channelSlug: "work", tags: ["#EP申请", "#新加坡找工作"], infoType: "guide" };
  }
  if (hasAny(text, ["陪诊", "医院", "诊所"])) {
    return { channelSlug: "medical", tags: ["#陪诊", "#医院"], infoType: "service" };
  }
  if (hasAny(text, ["机场", "接送", "grab"])) {
    return { channelSlug: "transport", tags: ["#机场接送", "#Grab"], infoType: "service" };
  }
  if (hasAny(text, ["出售", "二手", "闲置", "毕业"])) {
    return { channelSlug: "secondhand", tags: ["#毕业闲置", "#二手家具"], infoType: "secondhand" };
  }
  if (hasAny(text, ["mcst", "押金", "投诉", "pdpa"])) {
    return { channelSlug: "legal", tags: ["#MCST投诉", "#房东不退押金"], infoType: "guide" };
  }

  return { channelSlug: "life", tags: ["#新加坡生活"], infoType: "note" };
}
