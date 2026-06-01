insert into public.channels (name, slug, description, icon, sort_order) values
('租房','rental','新加坡租房、室友、合同与避坑经验。','Home',1),
('工作','work','找工作、准证、简历、面试与职场信息。','Briefcase',2),
('医疗','medical','看病、陪诊、诊所、医院流程。','HeartPulse',3),
('交通','transport','机场接送、Grab、买车、驾照。','Car',4),
('美食','food','本地餐厅、小吃、团购和厨房灵感。','Utensils',5),
('法律','legal','押金、投诉、邻里纠纷和基础合规信息。','Scale',6),
('留学','study','新生、校园、课程和生活适应。','GraduationCap',7),
('活动','events','周末活动、社群聚会和本地体验。','CalendarDays',8),
('二手','secondhand','毕业闲置、家具、电器、通勤工具。','Recycle',9),
('本地资讯','news','新加坡政策、新闻和公共服务信息。','Newspaper',10),
('生活','life','开户、手机卡、报税、搬家和日常攻略。','Sparkles',11)
on conflict (slug) do update set name = excluded.name, description = excluded.description, sort_order = excluded.sort_order;

insert into public.tags (name, slug, channel_id, description, is_featured)
select v.name, v.slug, c.id, v.description, v.is_featured
from (values
('#NTU租房','ntu-rental','rental','NTU 周边租房信息。',true),('#NUS租房','nus-rental','rental','NUS 周边租房信息。',false),('#Pioneer','pioneer','rental','Pioneer 区域生活与租房。',true),('#普通房','common-room','rental','普通房出租与经验。',false),('#主人房','master-room','rental','主人房出租与经验。',false),('#女生房','female-room','rental','女生房源。',false),('#短租','short-term-rental','rental','短租信息。',false),
('#蒸饺','dumplings','food','蒸饺推荐与团购。',true),('#东北菜','dongbei-food','food','东北菜推荐。',false),('#Jurong美食','jurong-food','food','Jurong 美食。',true),('#24小时食阁','24h-kopitiam','food','24 小时食阁。',false),
('#EP申请','ep-application','work','EP 申请经验。',true),('#新加坡找工作','sg-job-search','work','找工作信息。',false),('#简历','resume','work','简历建议。',false),('#面试','interview','work','面试经验。',false),
('#陪诊','medical-companion','medical','陪诊服务。',true),('#医院','hospital','medical','医院流程。',false),('#诊所','clinic','medical','诊所信息。',false),
('#机场接送','airport-transfer','transport','机场接送服务。',true),('#考驾照','driving-test','transport','考驾照流程。',false),('#买车','buy-car','transport','买车基础。',false),('#Grab','grab','transport','Grab 使用经验。',false),
('#MCST投诉','mcst-complaint','legal','MCST 投诉经验。',false),('#房东不退押金','deposit-dispute','legal','押金纠纷处理。',true),('#PDPA','pdpa','legal','PDPA 基础。',false),('#邻里纠纷','neighbour-dispute','legal','邻里纠纷。',false),
('#毕业闲置','graduation-sale','secondhand','毕业闲置。',true),('#二手家具','used-furniture','secondhand','二手家具。',false),('#二手显示器','used-monitor','secondhand','二手显示器。',false),('#二手自行车','used-bike','secondhand','二手自行车。',false),
('#银行开户','bank-account','life','银行开户指南。',true),('#手机卡','sim-card','life','手机卡办理。',false),('#新加坡生活','sg-life','life','新加坡日常生活。',true),
('#新加坡新闻','sg-news','news','本地新闻。',false),('#社区活动','community-events','news','社区活动。',false),('#政府服务','gov-services','news','政府服务。',false),
('#NTU新生','ntu-freshman','study','NTU 新生指南。',false),('#NUS新生','nus-freshman','study','NUS 新生指南。',false),('#羽毛球','badminton','events','羽毛球活动。',false),('#华人创业','chinese-startup','events','华人创业活动。',false)
) as v(name, slug, channel_slug, description, is_featured)
join public.channels c on c.slug = v.channel_slug
on conflict (slug) do update set name = excluded.name, channel_id = excluded.channel_id, description = excluded.description, is_featured = excluded.is_featured;

do $$
declare
  item record;
  new_info_id uuid;
  tag_slug text;
begin
  for item in select * from (values
    ('The Floravale 普通房出租','rental','rental','The Floravale 普通房，近 Pioneer MRT，适合 NTU 学生。包网络，可煮，房东友好。','S$950/月','Pioneer','WhatsApp: 8xxx xxxx',array['ntu-rental','pioneer','common-room']),
    ('Pioneer 主人房出租','rental','rental','Pioneer 主人房带独卫，楼下巴士到 NTU，适合情侣或单人。','S$1450/月','Pioneer','Telegram: @pioneerroom',array['pioneer','master-room']),
    ('NTU租房避坑经验','rental','guide','看房前确认水电网、空调清洗、访客规则和押金退还条件。',null,null,null,array['ntu-rental','deposit-dispute']),
    ('NUS附近租房经验','rental','guide','Kent Ridge、Clementi、Dover 都有人选，通勤和预算要一起看。',null,null,null,array['nus-rental','short-term-rental']),
    ('OCBC开户指南','life','guide','整理学生、工作人士常见开户材料和预约方式。',null,null,null,array['bank-account','sg-life']),
    ('DBS开户指南','life','guide','DBS digibank 线上开户流程、地址证明和常见卡种选择。',null,null,null,array['bank-account']),
    ('新加坡手机卡办理','life','guide','Singtel、StarHub、M1、SIMBA 预付卡和后付费基础对比。',null,null,null,array['sim-card','sg-life']),
    ('EP申请流程','work','guide','从雇主提交、材料准备到 MOM 审批的基础流程。',null,null,null,array['ep-application','sg-job-search']),
    ('EP被拒怎么办','work','question','先看拒信理由，再补充薪资、学历、岗位匹配材料。',null,null,null,array['ep-application']),
    ('新加坡找工作简历建议','work','guide','简历控制在 1-2 页，突出结果、技术栈和本地可入职时间。',null,null,null,array['sg-job-search','resume','interview']),
    ('Jurong 东北蒸饺推荐','food','food','Jurong 一带几家东北口味蒸饺，适合想吃热乎面食的人。','S$8-15','Jurong',null,array['dumplings','dongbei-food','jurong-food']),
    ('哪里可以买冷冻蒸饺','food','food','超市、团购群和部分东北餐馆都有冷冻蒸饺，注意冷链和保质期。',null,null,null,array['dumplings','dongbei-food']),
    ('包饺子活动','events','event','周末小型包饺子活动，欢迎新朋友一起做饭聊天。','AA','Jurong East',null,array['dumplings','community-events']),
    ('机场接送 Serena 7座服务','transport','service','7 座车机场接送，可放多个行李，适合新生和家庭。','S$55 起','Changi Airport','WhatsApp: Serena',array['airport-transfer','grab']),
    ('Grab司机经验分享','transport','note','高峰期、机场排队和平台奖励的一些真实经验。',null,null,null,array['grab']),
    ('陪诊服务说明','medical','service','陪同挂号、翻译、取药和复诊提醒，适合初到新加坡的人。','按小时','全岛','微信: clinic-help',array['medical-companion','hospital','clinic']),
    ('新加坡看病流程','medical','guide','普通诊所、综合诊疗所、专科和急诊的基本区别。',null,null,null,array['hospital','clinic']),
    ('MCST投诉经验','legal','guide','遇到公寓管理问题，先保留邮件、照片和时间线，再按流程沟通。',null,null,null,array['mcst-complaint','neighbour-dispute']),
    ('房东不退押金怎么办','legal','guide','整理合同、交接记录、聊天记录，必要时寻求小额索赔渠道。',null,null,null,array['deposit-dispute']),
    ('毕业出售书桌','secondhand','secondhand','IKEA 书桌，轻微使用痕迹，自取优先。','S$30','Boon Lay',null,array['graduation-sale','used-furniture']),
    ('毕业出售显示器','secondhand','secondhand','24 寸显示器，适合学习办公，送 HDMI 线。','S$60','NTU',null,array['graduation-sale','used-monitor']),
    ('二手自行车出售','secondhand','secondhand','通勤自行车，刹车正常，适合校园内骑行。','S$80','Pioneer',null,array['used-bike','graduation-sale']),
    ('新加坡社区活动汇总','news','news','整理本周 CC 活动、亲子活动和社区课程入口。',null,null,null,array['community-events','gov-services']),
    ('周末活动推荐','events','event','展览、徒步、羽毛球和小型聚会推荐。',null,null,null,array['community-events','badminton']),
    ('SkillsFuture 介绍','news','guide','新加坡居民常用技能补贴项目基础介绍。',null,null,null,array['gov-services']),
    ('ActiveSG 介绍','life','guide','如何预订场地、使用积分和查找附近运动设施。',null,null,null,array['sg-life','badminton']),
    ('Jurong生活攻略','life','guide','Jurong West、Jurong East、Boon Lay 的交通、吃饭和购物。',null,null,null,array['sg-life','jurong-food']),
    ('NTU新生指南','study','guide','入学前住宿、电话卡、银行卡和校园交通清单。',null,null,null,array['ntu-freshman','ntu-rental']),
    ('NUS新生指南','study','guide','NUS 新生常见生活问题和租房交通建议。',null,null,null,array['nus-freshman','nus-rental']),
    ('新加坡银行开户材料清单','life','guide','护照、准证、录取信或雇佣证明、地址证明等常见材料。',null,null,null,array['bank-account']),
    ('租房合同注意事项','rental','guide','重点看押金、维修、提前退租、空调清洁和访客条款。',null,null,null,array['deposit-dispute','ntu-rental']),
    ('新加坡搬家服务信息','life','service','小件搬家、整屋搬家和跨区搬运注意事项。','按车计费','全岛',null,array['sg-life']),
    ('换门锁服务信息','life','service','HDB、公寓门锁更换，建议先确认物业规则。','报价后定','全岛',null,array['sg-life']),
    ('空调维修服务信息','life','service','空调清洗、漏水检查和定期保养信息。','S$30 起','全岛',null,array['sg-life']),
    ('新加坡报税基础','life','guide','个人所得税申报时间、NOA 和常见扣除项目。',null,null,null,array['sg-life','gov-services']),
    ('新加坡买车基础','transport','guide','COE、路税、保险、贷款和养车成本基础。',null,null,null,array['buy-car']),
    ('新加坡考驾照流程','transport','guide','BTT、FTT、实践课和考试预约流程。',null,null,null,array['driving-test']),
    ('周末羽毛球活动','events','event','周末晚间羽毛球，适合初中级，场地 AA。','AA','Clementi',null,array['badminton','community-events']),
    ('华人创业活动','events','event','面向新加坡华人创业者的小型交流活动。',null,null,null,array['chinese-startup','community-events']),
    ('新加坡本地新闻摘要示例','news','news','用简明中文整理公共交通、社区服务和生活政策动态。',null,null,null,array['sg-news','gov-services'])
  ) as x(title, channel_slug, info_type, content, price_text, location_text, contact_text, tag_slugs)
  loop
    insert into public.infos (channel_id, title, content, info_type, price_text, location_text, contact_text, source_type, moderation_status, status, images)
    select c.id, item.title, item.content, item.info_type, item.price_text, item.location_text, item.contact_text, 'admin', 'approved', 'published', array[]::text[]
    from public.channels c where c.slug = item.channel_slug
    returning id into new_info_id;

    foreach tag_slug in array item.tag_slugs loop
      insert into public.info_tags (info_id, tag_id)
      select new_info_id, t.id from public.tags t where t.slug = tag_slug
      on conflict do nothing;
    end loop;
  end loop;
end $$;

update public.tags t
set info_count = counts.total
from (
  select tag_id, count(*)::int as total
  from public.info_tags
  group by tag_id
) counts
where counts.tag_id = t.id;
