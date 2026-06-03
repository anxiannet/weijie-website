import type { ContactVisibility } from "@/types";

const labels: Record<ContactVisibility, string> = {
  public: "公开联系方式",
  login_required: "登录可见",
  verified_only: "认证可见",
  private: "私信联系"
};

export function ContactVisibilityBadge({ visibility }: { visibility?: ContactVisibility }) {
  return (
    <span className="inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-brand">
      {labels[visibility ?? "private"]}
    </span>
  );
}
