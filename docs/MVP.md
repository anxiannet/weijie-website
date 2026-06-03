# 维界 Weijie MVP

维界是面向新加坡华人的本地生活内容社区。MVP 只保留三层结构：

Channel -> Tag -> Info

第一版不做完整房源、二手交易、达人、商家、预约、支付、私信、群聊或专题系统。所有复杂需求先用 Info 承载，当某个 Tag 的内容足够多，再升级成独立模块。

## 核心页面

- `/`：首页，小红书式双列信息流、搜索、频道入口、热门标签。
- `/channels/[slug]`：频道页，展示频道简介、热门标签和最新信息。
- `/tags/[slug]`：标签页，展示标签说明、信息数量和相关信息。
- `/infos/[id]`：信息详情，展示正文、图片、频道、标签、价格、地点、联系方式、评论、收藏和举报入口。
- `/publish`：发布信息，支持图片、地点选择、规则归类和标签建议；登录用户发布后进入待审核。
- `/search`：搜索 tags、infos、channels，并记录搜索日志。
- `/me`：展示当前用户资料、我的信息、收藏、评论，并可编辑昵称、头像 URL、简介和位置。
- `/login`：Supabase Auth Magic Link 邮箱登录入口。
- `/admin`：后台仪表盘。
- `/admin/moderation`：审核中心。
- `/admin/analytics`：搜索和访问数据监控。
- `/admin/tags`：标签管理。
- `/admin/ai`：AI/mock AI 草稿生成。

## Mock fallback

如果没有 Supabase 环境变量，前端使用 `src/data/mockData.ts` 展示频道、标签和 40 条信息。埋点函数会输出 mock log，不阻断页面运行。
