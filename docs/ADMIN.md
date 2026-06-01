# 后台说明

## 权限

RLS 中通过 `public.is_admin()` 判断管理员。生产环境需要在 `profiles.role` 中把管理员设为 `admin`。

## 审核

- 普通用户发布 Info 默认 `pending`。
- Admin 发布 Info 可为 `approved`。
- 前台只展示 `approved + published`。
- 举报内容进入 `moderation_queue`。
- 管理员可通过、拒绝、编辑后通过。

## 数据监控

后台关注：

- 搜索词排行
- 无结果搜索排行
- 频道访问排行
- 标签访问排行
- 信息访问排行
- 热门发布类型

无结果搜索是后续开新标签、新频道、甚至升级独立模块的重要信号。

## AI 内容

`/admin/ai` 生成的内容必须进入 `ai_drafts`。管理员编辑审核后，再发布为 `infos` 并关联对应 channel/tag。
