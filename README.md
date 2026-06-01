# 维界 Weijie

新加坡华人本地生活内容社区 MVP。

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 环境变量

复制 `.env.example` 为 `.env.local`，按需填写：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

未配置 Supabase 时，页面会使用 mock data 正常展示。未配置 `OPENAI_API_KEY` 时，AI 内容生成使用 mock 模板。

## Supabase

Migration：

- `supabase/migrations/001_init.sql`
- `supabase/migrations/002_admin_ai_monitoring.sql`

Seed：

- `supabase/seed.sql`

核心结构是 `channels -> tags -> infos`。

## 项目文档

- `AGENTS.md`：AI/开发助手协作规则
- `CONTRIBUTING.md`：开发协作流程
- `docs/DEVELOPMENT.md`：本地开发与代码结构
- `docs/SUPABASE_RUNBOOK.md`：数据库迁移、RLS、排错手册
- `docs/MVP.md`：MVP 产品范围
- `docs/DATA_MODEL.md`：数据模型说明
- `docs/ADMIN.md`：后台与审核说明
