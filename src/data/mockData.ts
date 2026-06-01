import type { Channel, Comment, Info, Tag } from "@/types";

export const channels: Channel[] = [
  { id: "ch-rental", name: "租房", slug: "rental", description: "新加坡租房、室友、合同与避坑经验。", icon: "Home", sort_order: 1 },
  { id: "ch-work", name: "工作", slug: "work", description: "找工作、准证、简历、面试与职场信息。", icon: "Briefcase", sort_order: 2 },
  { id: "ch-medical", name: "医疗", slug: "medical", description: "看病、陪诊、诊所、医院流程。", icon: "HeartPulse", sort_order: 3 },
  { id: "ch-transport", name: "交通", slug: "transport", description: "机场接送、Grab、买车、驾照。", icon: "Car", sort_order: 4 },
  { id: "ch-food", name: "美食", slug: "food", description: "本地餐厅、小吃、团购和厨房灵感。", icon: "Utensils", sort_order: 5 },
  { id: "ch-legal", name: "法律", slug: "legal", description: "押金、投诉、邻里纠纷和基础合规信息。", icon: "Scale", sort_order: 6 },
  { id: "ch-study", name: "留学", slug: "study", description: "新生、校园、课程和生活适应。", icon: "GraduationCap", sort_order: 7 },
  { id: "ch-events", name: "活动", slug: "events", description: "周末活动、社群聚会和本地体验。", icon: "CalendarDays", sort_order: 8 },
  { id: "ch-secondhand", name: "二手", slug: "secondhand", description: "毕业闲置、家具、电器、通勤工具。", icon: "Recycle", sort_order: 9 },
  { id: "ch-news", name: "本地资讯", slug: "news", description: "新加坡政策、新闻和公共服务信息。", icon: "Newspaper", sort_order: 10 },
  { id: "ch-life", name: "生活", slug: "life", description: "开户、手机卡、报税、搬家和日常攻略。", icon: "Sparkles", sort_order: 11 }
];

const tagSeed = [
  ["NTU租房", "ntu-rental", "ch-rental", true], ["NUS租房", "nus-rental", "ch-rental", false], ["Pioneer", "pioneer", "ch-rental", true],
  ["普通房", "common-room", "ch-rental", false], ["主人房", "master-room", "ch-rental", false], ["女生房", "female-room", "ch-rental", false], ["短租", "short-term-rental", "ch-rental", false],
  ["蒸饺", "dumplings", "ch-food", true], ["东北菜", "dongbei-food", "ch-food", false], ["Jurong美食", "jurong-food", "ch-food", true], ["24小时食阁", "24h-kopitiam", "ch-food", false],
  ["EP申请", "ep-application", "ch-work", true], ["新加坡找工作", "sg-job-search", "ch-work", false], ["简历", "resume", "ch-work", false], ["面试", "interview", "ch-work", false],
  ["陪诊", "medical-companion", "ch-medical", true], ["医院", "hospital", "ch-medical", false], ["诊所", "clinic", "ch-medical", false],
  ["机场接送", "airport-transfer", "ch-transport", true], ["考驾照", "driving-test", "ch-transport", false], ["买车", "buy-car", "ch-transport", false], ["Grab", "grab", "ch-transport", false],
  ["MCST投诉", "mcst-complaint", "ch-legal", false], ["房东不退押金", "deposit-dispute", "ch-legal", true], ["PDPA", "pdpa", "ch-legal", false], ["邻里纠纷", "neighbour-dispute", "ch-legal", false],
  ["毕业闲置", "graduation-sale", "ch-secondhand", true], ["二手家具", "used-furniture", "ch-secondhand", false], ["二手显示器", "used-monitor", "ch-secondhand", false], ["二手自行车", "used-bike", "ch-secondhand", false],
  ["银行开户", "bank-account", "ch-life", true], ["手机卡", "sim-card", "ch-life", false], ["新加坡生活", "sg-life", "ch-life", true],
  ["新加坡新闻", "sg-news", "ch-news", false], ["社区活动", "community-events", "ch-news", false], ["政府服务", "gov-services", "ch-news", false],
  ["NTU新生", "ntu-freshman", "ch-study", false], ["NUS新生", "nus-freshman", "ch-study", false], ["羽毛球", "badminton", "ch-events", false], ["华人创业", "chinese-startup", "ch-events", false]
] as const;

export const tags: Tag[] = tagSeed.map(([name, slug, channel_id, featured], index) => ({
  id: `tag-${slug}`,
  name: `#${name}`,
  slug,
  channel_id,
  description: `${name} 相关的新加坡本地信息、经验和资源。`,
  info_count: 0,
  is_featured: featured
}));

const t = (slug: string) => `tag-${slug}`;
const now = (day: number) => new Date(Date.UTC(2026, 4, day, 8, 0, 0)).toISOString();

const infoSeed: Array<[string, string, string, string, string, string[], string?, string?, string?]> = [
  ["The Floravale 普通房出租", "rental", "ch-rental", "rental", "The Floravale 普通房，近 Pioneer MRT，适合 NTU 学生。包网络，可煮，房东友好。", [t("ntu-rental"), t("pioneer"), t("common-room")], "S$950/月", "Pioneer", "WhatsApp: 8xxx xxxx"],
  ["Pioneer 主人房出租", "rental", "ch-rental", "rental", "Pioneer 主人房带独卫，楼下巴士到 NTU，适合情侣或单人。", [t("pioneer"), t("master-room")], "S$1450/月", "Pioneer", "Telegram: @pioneerroom"],
  ["NTU租房避坑经验", "guide", "ch-rental", "note", "看房前确认水电网、空调清洗、访客规则和押金退还条件，合同不要只看截图。", [t("ntu-rental"), t("deposit-dispute")]],
  ["NUS附近租房经验", "guide", "ch-rental", "note", "Kent Ridge、Clementi、Dover 都有人选，通勤和预算要一起看。", [t("nus-rental"), t("short-term-rental")]],
  ["OCBC开户指南", "guide", "ch-life", "note", "整理学生、工作人士常见开户材料和预约方式。", [t("bank-account"), t("sg-life")]],
  ["DBS开户指南", "guide", "ch-life", "note", "DBS digibank 线上开户流程、地址证明和常见卡种选择。", [t("bank-account")]],
  ["新加坡手机卡办理", "guide", "ch-life", "note", "Singtel、StarHub、M1、SIMBA 预付卡和后付费基础对比。", [t("sim-card"), t("sg-life")]],
  ["EP申请流程", "guide", "ch-work", "note", "从雇主提交、材料准备到 MOM 审批的基础流程。", [t("ep-application"), t("sg-job-search")]],
  ["EP被拒怎么办", "guide", "ch-work", "question", "先看拒信理由，再补充薪资、学历、岗位匹配材料。", [t("ep-application")]],
  ["新加坡找工作简历建议", "guide", "ch-work", "note", "简历控制在 1-2 页，突出结果、技术栈和本地可入职时间。", [t("sg-job-search"), t("resume"), t("interview")]],
  ["Jurong 东北蒸饺推荐", "food", "ch-food", "food", "Jurong 一带几家东北口味蒸饺，适合想吃热乎面食的人。", [t("dumplings"), t("dongbei-food"), t("jurong-food")], "S$8-15", "Jurong"],
  ["哪里可以买冷冻蒸饺", "food", "ch-food", "food", "超市、团购群和部分东北餐馆都有冷冻蒸饺，注意冷链和保质期。", [t("dumplings"), t("dongbei-food")]],
  ["包饺子活动", "event", "ch-events", "event", "周末小型包饺子活动，欢迎新朋友一起做饭聊天。", [t("dumplings"), t("community-events")], "AA", "Jurong East"],
  ["机场接送 Serena 7座服务", "service", "ch-transport", "service", "7 座车机场接送，可放多个行李，适合新生和家庭。", [t("airport-transfer"), t("grab")], "S$55 起", "Changi Airport", "WhatsApp: Serena"],
  ["Grab司机经验分享", "note", "ch-transport", "note", "高峰期、机场排队和平台奖励的一些真实经验。", [t("grab")]],
  ["陪诊服务说明", "service", "ch-medical", "service", "陪同挂号、翻译、取药和复诊提醒，适合初到新加坡的人。", [t("medical-companion"), t("hospital"), t("clinic")], "按小时", "全岛", "微信: clinic-help"],
  ["新加坡看病流程", "guide", "ch-medical", "note", "普通诊所、综合诊疗所、专科和急诊的基本区别。", [t("hospital"), t("clinic")]],
  ["MCST投诉经验", "guide", "ch-legal", "note", "遇到公寓管理问题，先保留邮件、照片和时间线，再按流程沟通。", [t("mcst-complaint"), t("neighbour-dispute")]],
  ["房东不退押金怎么办", "guide", "ch-legal", "note", "整理合同、交接记录、聊天记录，必要时寻求小额索赔渠道。", [t("deposit-dispute")]],
  ["毕业出售书桌", "secondhand", "ch-secondhand", "secondhand", "IKEA 书桌，轻微使用痕迹，自取优先。", [t("graduation-sale"), t("used-furniture")], "S$30", "Boon Lay"],
  ["毕业出售显示器", "secondhand", "ch-secondhand", "secondhand", "24 寸显示器，适合学习办公，送 HDMI 线。", [t("graduation-sale"), t("used-monitor")], "S$60", "NTU"],
  ["二手自行车出售", "secondhand", "ch-secondhand", "secondhand", "通勤自行车，刹车正常，适合校园内骑行。", [t("used-bike"), t("graduation-sale")], "S$80", "Pioneer"],
  ["新加坡社区活动汇总", "news", "ch-news", "news", "整理本周 CC 活动、亲子活动和社区课程入口。", [t("community-events"), t("gov-services")]],
  ["周末活动推荐", "event", "ch-events", "event", "展览、徒步、羽毛球和小型聚会推荐。", [t("community-events"), t("badminton")]],
  ["SkillsFuture 介绍", "guide", "ch-news", "note", "新加坡居民常用技能补贴项目基础介绍。", [t("gov-services")]],
  ["ActiveSG 介绍", "guide", "ch-life", "note", "如何预订场地、使用积分和查找附近运动设施。", [t("sg-life"), t("badminton")]],
  ["Jurong生活攻略", "guide", "ch-life", "note", "Jurong West、Jurong East、Boon Lay 的交通、吃饭和购物。", [t("sg-life"), t("jurong-food")]],
  ["NTU新生指南", "guide", "ch-study", "note", "入学前住宿、电话卡、银行卡和校园交通清单。", [t("ntu-freshman"), t("ntu-rental")]],
  ["NUS新生指南", "guide", "ch-study", "note", "NUS 新生常见生活问题和租房交通建议。", [t("nus-freshman"), t("nus-rental")]],
  ["新加坡银行开户材料清单", "guide", "ch-life", "note", "护照、准证、录取信或雇佣证明、地址证明等常见材料。", [t("bank-account")]],
  ["租房合同注意事项", "guide", "ch-rental", "note", "重点看押金、维修、提前退租、空调清洁和访客条款。", [t("deposit-dispute"), t("ntu-rental")]],
  ["新加坡搬家服务信息", "service", "ch-life", "service", "小件搬家、整屋搬家和跨区搬运注意事项。", [t("sg-life")], "按车计费", "全岛"],
  ["换门锁服务信息", "service", "ch-life", "service", "HDB、公寓门锁更换，建议先确认物业规则。", [t("sg-life")], "报价后定", "全岛"],
  ["空调维修服务信息", "service", "ch-life", "service", "空调清洗、漏水检查和定期保养信息。", [t("sg-life")], "S$30 起", "全岛"],
  ["新加坡报税基础", "guide", "ch-life", "note", "个人所得税申报时间、NOA 和常见扣除项目。", [t("sg-life"), t("gov-services")]],
  ["新加坡买车基础", "guide", "ch-transport", "note", "COE、路税、保险、贷款和养车成本基础。", [t("buy-car")]],
  ["新加坡考驾照流程", "guide", "ch-transport", "note", "BTT、FTT、实践课和考试预约流程。", [t("driving-test")]],
  ["周末羽毛球活动", "event", "ch-events", "event", "周末晚间羽毛球，适合初中级，场地 AA。", [t("badminton"), t("community-events")], "AA", "Clementi"],
  ["华人创业活动", "event", "ch-events", "event", "面向新加坡华人创业者的小型交流活动。", [t("chinese-startup"), t("community-events")]],
  ["新加坡本地新闻摘要示例", "news", "ch-news", "news", "用简明中文整理公共交通、社区服务和生活政策动态。", [t("sg-news"), t("gov-services")]]
];

export const infos: Info[] = infoSeed.map(([title, source, channel_id, info_type, content, tag_ids, price_text, location_text, contact_text], index) => ({
  id: `info-${String(index + 1).padStart(2, "0")}`,
  author_id: source === "admin" ? "profile-admin" : "profile-seed",
  channel_id,
  title,
  content,
  info_type: info_type as Info["info_type"],
  cover_url: index % 3 === 0 ? `https://images.unsplash.com/photo-${["1560448204-e02f11c3d0e2", "1546069901-ba9599a7e63c", "1521791136064-7986c2920216"][index % 3]}?auto=format&fit=crop&w=900&q=80` : null,
  images: [],
  contact_text: contact_text ?? null,
  price_text: price_text ?? null,
  location_text: location_text ?? null,
  source_type: "admin",
  is_ai_generated: false,
  moderation_status: "approved",
  status: "published",
  created_at: now((index % 28) + 1),
  tag_ids
}));

for (const tag of tags) {
  tag.info_count = infos.filter((info) => info.tag_ids.includes(tag.id)).length;
}

export const comments: Comment[] = [
  { id: "comment-1", info_id: "info-01", author_id: "profile-seed", content: "请问可以短租两个月吗？", moderation_status: "approved", created_at: now(29) },
  { id: "comment-2", info_id: "info-14", author_id: "profile-seed", content: "Serena 接机很准时，行李多也能放。", moderation_status: "approved", created_at: now(30) }
];
