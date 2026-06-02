# 数据模型

## profiles

用户资料。`role` 可为 `user`、`admin`、`creator`。后台页面要求未来接入时校验 `role = admin`。

## channels

一级频道，人工维护。初始频道包括租房、工作、医疗、交通、美食、法律、留学、活动、二手、本地资讯、生活。

## tags

类似小红书话题。Tag 归属一个 Channel，带 `info_count` 和 `is_featured`。

## infos

MVP 的核心内容表。房源、二手、服务、美食、活动、新闻、攻略、求助都放在 `infos`。通过 `info_type` 区分内容形态，不拆复杂业务表。

图片仍挂在 `infos.cover_url` 和 `infos.images` 上，文件存储在公开的 Supabase Storage bucket `info-images`。发布时第一张图片会写入 `cover_url` 作为信息卡片封面。

地点标记也挂在 `infos` 上，不拆房源、商户或地点业务表。结构化字段包括 `location_name`、`location_address`、`location_postal`、`location_lat`、`location_lng`、`location_source`、`location_raw`；旧的 `location_text` 继续作为列表和兼容展示字段。

## places_cache

OneMap 搜索结果缓存表。`/api/places/search` 先按 query 查询 `places_cache`，未命中才通过服务端代理调用 OneMap Search API，并把标准化后的地点写入缓存。前端不直接访问 OneMap。

## info_tags

Info 和 Tag 的多对多关系。一个 Info 至少应关联一个 Tag。

## comments

信息评论。前台只展示 `moderation_status = approved`。

## saved_items

收藏表，支持收藏 `info` 和 `tag`，仅本人可见。

## reports

举报表。登录用户可创建，管理员查看处理。

## search_logs / page_views

搜索和访问埋点，用来发现真实需求、热门标签和无结果搜索。

## moderation_queue

审核队列，支持 info、comment、profile、tag。

## ai_drafts

AI 内容草稿。AI 生成内容必须先进入草稿，管理员审核后再发布为 Info。

## admin_tasks

后台运营任务，例如合并标签、检查空标签、升级热门标签为模块。
