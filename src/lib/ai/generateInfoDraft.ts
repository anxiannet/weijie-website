type GenerateDraftInput = {
  channel: string;
  tag: string;
  topicText: string;
};

export async function generateInfoDraft({ channel, tag, topicText }: GenerateDraftInput) {
  const cleanTag = tag.replace(/^#/, "");
  const topic = topicText.trim() || cleanTag || channel;

  if (!process.env.OPENAI_API_KEY) {
    return {
      title: `新加坡${topic}基础指南`,
      content: [
        `背景说明：这是一份面向新加坡华人的 ${topic} 入门信息，方便快速判断下一步。`,
        "适合人群：刚来新加坡、正在比较选择、或需要中文信息辅助决策的人。",
        "具体步骤：先确认自身身份和需求，再准备材料，最后联系官方渠道或可信服务方。",
        "注意事项：不要轻信夸张承诺，涉及付款、合同、证件时保留记录并核实来源。",
        "可联系资源：优先查看政府网站、学校/雇主官方通知、银行或正规服务机构。",
        "下一步建议：把你的具体区域、预算、时间和限制写清楚，再发布一条信息寻求更精准建议。"
      ].join("\n\n"),
      suggestedTags: [tag.startsWith("#") ? tag : `#${tag}`, "#新加坡生活"].filter(Boolean)
    };
  }

  return {
    title: `新加坡${topic}基础指南`,
    content: "已检测到 OPENAI_API_KEY。MVP 先保留服务端接入点，生产环境可在这里调用 OpenAI 并把结果写入 ai_drafts。",
    suggestedTags: [tag.startsWith("#") ? tag : `#${tag}`]
  };
}
