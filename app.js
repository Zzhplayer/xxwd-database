const DATA = window.XZDATA;

const qualityOrder = ["Z", "Q", "神器", "MAX", "SSS", "SS", "S", "A", "B", "C", "D", "任务", "材料", "制作券", "消耗", "其他"];
const categoryLabel = { all: "全部", shop: "商店", boss: "Boss", npc: "NPC" };

const state = {
  view: "heroes",
  query: "",
  quality: "全部",
  itemType: "全部",
  sourceType: "全部",
  setOnly: false,
  mapFilter: "all",
  selectedMarkerKey: "",
  focusedMarkerKey: "",
};

let currentDetail = null;
let detailHistory = [];

const navItems = [
  ["heroes", "英雄", "英", "heroes"],
  ["items", "物品", "物", "items"],
  ["sets", "套装", "套", "itemSets"],
  ["guides", "攻略", "攻", ""],
  ["map", "地图", "图", "placements"],
  ["yaoyang", "幺阳", "阵", "yaoyangLayers"],
  ["bosses", "Boss", "首", "bosses"],
  ["tasks", "任务", "任", "tasks"],
  ["shops", "商店", "店", "shops"],
  ["professions", "副职", "副", "professions"],
  ["raw", "单位", "单", "units"],
];

const titleMap = Object.fromEntries(navItems.map(([id, label]) => [id, label]));
const GUIDE_DATA = {
  updatedAt: "2026-06-08",
  sources: [
    {
      id: "jdrts-builds",
      site: "JDRTS",
      type: "加点路线",
      title: "《逆天问道》总结的加点路数",
      url: "https://jdrts.com/16588",
      note: "覆盖问剑、云素青、瑜、望缺、藏劫如来、燕落、萧梦寻等英雄的路线号与后期装备方向。",
    },
    {
      id: "jdrts-hero-read",
      site: "JDRTS",
      type: "英雄理解",
      title: "《逆天问道》发点个人对英雄的理解",
      url: "https://jdrts.com/16523",
      note: "偏玩家体感，适合判断英雄定位、装备依赖和上手难度。",
    },
    {
      id: "jdrts-doufo",
      site: "JDRTS",
      type: "专门攻略",
      title: "玩家自发性斗佛攻略心得",
      url: "https://jdrts.com/16466-2",
      note: "斗佛开局节奏、装备取舍、单通思路和抗压定位。",
    },
    {
      id: "jdrts-attack",
      site: "JDRTS",
      type: "机制攻略",
      title: "普通攻击详解全攻略",
      url: "https://jdrts.com/16427-2",
      note: "解释普通攻击、距离、会心提元、分裂、破月生命差伤害等机制。",
    },
    {
      id: "jdrts-flow",
      site: "JDRTS",
      type: "通关流程",
      title: "第一次通关体验局流程攻略",
      url: "https://jdrts.com/16401-2",
      note: "从开局任务、前期装备、FB1/FB2到终局流程的玩家经验。",
    },
    {
      id: "jdrts-tianyin",
      site: "JDRTS",
      type: "技能测试",
      title: "天音技能加点输出测试",
      url: "https://jdrts.com/17243",
      note: "旧版本测试资料，但对天音地雷、禁断、八斩风路线仍有参考价值。",
    },
    {
      id: "pc0359-31",
      site: "河东下载站",
      type: "英雄装备攻略",
      title: "逆天问道3.1闲竹4.55版英雄加点装备攻略",
      url: "https://www.pc0359.cn/downinfo/53223.html",
      note: "包含青麈、燕落、执刑仙、破月、斗佛、鱼湘等英雄路线和新手流程。",
    },
    {
      id: "cncrk-31",
      site: "起点软件园",
      type: "地图系统说明",
      title: "逆天问道3.1含攻略正式版",
      url: "https://www.cncrk.com/downinfo/160384.html",
      note: "解释四次三选一职业系统、装备星级、成长武器、套装和基础属性。",
    },
    {
      id: "bili-wenjian-xiaokui",
      site: "哔哩哔哩",
      type: "教学视频",
      title: "逆天问道3.3.4和3.3.2问剑及小葵教学",
      url: "https://www.bilibili.com/video/BV1Qs4y1a74P/",
      note: "面向问剑、小葵的版本教学视频。",
    },
    {
      id: "bili-yumei",
      site: "哔哩哔哩",
      type: "通关录像",
      title: "逆天问道3.3.2 N8鱼妹单通完整攻略通关录像",
      url: "https://www.bilibili.com/video/BV1u8411T7Z3/",
      note: "鱼妹单通完整流程录像，适合观察走位、发育节奏和装备过渡。",
    },
    {
      id: "bili-youshen",
      site: "哔哩哔哩",
      type: "系列视频",
      title: "逆天问道3.32殁佛模式斗佛流程及关联视频",
      url: "https://www.bilibili.com/video/BV1Nz421a7Tr/",
      note: "同作者关联列表包含新手任务、斗佛、小葵、破月、玄虚、青麈等高难视频。",
    },
    {
      id: "bili-heshang",
      site: "哔哩哔哩",
      type: "教学视频",
      title: "逆天问道3.3.2 和尚：教学",
      url: "https://www.bilibili.com/video/BV1GV41117VQ/",
      note: "和尚/斗佛向教学视频。",
    },
  ],
  general: [
    {
      title: "通用开局与流程",
      sourceIds: ["jdrts-flow", "pc0359-31", "cncrk-31"],
      summary: "多数攻略都把前期任务、成长武器、蜘蛛/狼/草药、熊洞与鱼谷作为节奏核心。新手可以先按通用流程熟悉地图，再按英雄路线微调。",
      points: [
        "开局任务链优先保证等级、钱和早期装备，成长武器与衣服过渡比盲目刷高级副本更稳定。",
        "鱼谷、熊洞、幺阳、精魄、四象玉等节点会影响后续能否按时进 A/S 级装备节奏。",
        "高难单通通常需要停怪窗口规划，任务、守家、转生和刷 Boss 不能互相挤占太多时间。",
      ],
    },
    {
      title: "基础机制：普通攻击、分裂、会心提元",
      sourceIds: ["jdrts-attack", "cncrk-31"],
      summary: "普通攻击并不是普通白字，筋骨、物理攻击、会心、提元、距离、分裂和部分技能都会改写实际输出。",
      points: [
        "远程英雄尤其要关注距离收益；瑜和萧梦寻的弓系/远程输出会被站位影响。",
        "会心决定触发概率，提元决定爆发倍率；只堆攻击而忽略会心提元，后期输出会明显变钝。",
        "分裂伤害可吃多种加成，清怪和多目标 Boss 场景价值很高。",
      ],
    },
  ],
  heroes: [
    {
      hero: "问剑",
      aliases: ["弈剑", "内剑"],
      role: "全面剑系，可走战系、法系或心剑操作流。",
      entries: [
        {
          title: "路线参考",
          sourceIds: ["jdrts-builds"],
          summary: "玩家路线把问剑分成战系多通、战系单通和法系飞仙流几类。飞仙流操作要求高，更适合熟悉地图后尝试。",
          points: ["战系多通可参考 1111。", "战系单通可参考 1311。", "法系可参考 3223 或 3233，3233偏操作。"],
        },
        {
          title: "英雄理解",
          sourceIds: ["jdrts-hero-read", "bili-wenjian-xiaokui"],
          summary: "外部玩家普遍把问剑视为上手容易、发育简单、爆发全面的中流砥柱型英雄。",
          points: ["优点是流派多、适配面广。", "缺点是高操作流派需要清楚技能联动，不适合只按单一技能循环打。"],
        },
      ],
    },
    {
      hero: "萧梦寻",
      aliases: ["法魂", "法MM"],
      role: "远程法魂，反伤、暴力和主动路线都可玩。",
      entries: [
        {
          title: "路线参考",
          sourceIds: ["jdrts-builds", "jdrts-hero-read"],
          summary: "法魂常见路线有反伤流、暴力流和主动流。老攻略里新手更偏向反伤路线，熟练后可追求更高输出。",
          points: ["反伤流可参考 2232。", "暴力流可参考 2212。", "主动流可参考 1212。"],
        },
        {
          title: "输出机制",
          sourceIds: ["jdrts-attack"],
          summary: "法魂的远程攻击与距离、火魂、分裂等机制相关。拿弓或分裂装时，要注意不是所有加成都按同一方式继承。",
          points: ["距离对远程威力有影响，但法魂射程较短，需要实际站位验证。", "仙疗咒与火魂、分裂之间的继承关系会影响装备选择。"],
        },
      ],
    },
    {
      hero: "望缺",
      aliases: ["破月", "忘缺"],
      role: "高爆发物理输出，装备依赖明显。",
      entries: [
        {
          title: "路线参考",
          sourceIds: ["jdrts-builds", "pc0359-31"],
          summary: "破月常见方向是生存流或极限输出流。极限路线容错低，但装备到位后 Boss 输出很亮眼。",
          points: ["生存流可参考 2233。", "极限流可参考 2212 或 2232。", "高难打鸠罗时要把吸血、会心、提元和保命窗口一起算。"],
        },
        {
          title: "机制提醒",
          sourceIds: ["jdrts-attack", "jdrts-hero-read"],
          summary: "破月的核心特色是低血量相关的伤害放大，因此它很强，也更怕装备、操作或节奏断档。",
          points: ["输出和当前生命比例关联，低血爆发不等于无脑卖血。", "外部玩家评价破月吃装备，没装备时 DPS 起不来。"],
        },
      ],
    },
    {
      hero: "瑜",
      aliases: ["鱼湘", "鱼妹", "鱼妹妹", "漁湘"],
      role: "远程炮台，吃距离、会心提元和生存装备。",
      entries: [
        {
          title: "路线参考",
          sourceIds: ["jdrts-builds", "pc0359-31"],
          summary: "瑜可走战系或法系路线。远程输出要兼顾距离收益和生存，不要因为弓手定位忽略防御与回血。",
          points: ["战系可参考 1211 或 1111。", "法系可参考 3113 或 3121。", "部分玩家也使用 2121/2122 或 2111 提元流。"],
        },
        {
          title: "单通录像与机制",
          sourceIds: ["bili-yumei", "jdrts-attack"],
          summary: "鱼妹完整录像适合看路线节奏；机制攻略则强调她的距离和分裂收益，站位越熟练，输出越稳定。",
          points: ["远距离威力会提升，打 Boss 时保持安全距离很关键。", "火灵和分裂相关收益较突出，装备要围绕持续输出与生存补齐。"],
        },
      ],
    },
    {
      hero: "藏劫如来",
      aliases: ["斗佛", "豆腐", "和尚"],
      role: "肉盾爆发兼顾，单通和多人都常见。",
      entries: [
        {
          title: "专门心得",
          sourceIds: ["jdrts-doufo", "pc0359-31"],
          summary: "斗佛攻略重点在开局效率、内元/会心/提元分配、套装与防御血量。它能抗也能打，但依然需要装备节奏支撑。",
          points: ["前期可围绕蜘蛛、狼、花任务和成长武器快速起势。", "高难单通常重视内元、提元、会心和高防高血。", "套装、败亡令、四象玉等过渡件在老攻略里被反复提到。"],
        },
        {
          title: "路线与视频",
          sourceIds: ["jdrts-builds", "bili-heshang", "bili-youshen"],
          summary: "斗佛常见战系、法系都能玩。B站教学和殁佛流程视频更适合看实际 Boss 操作窗口。",
          points: ["战系可参考 1311 或 1321。", "法系可参考 3121 或 3123。", "老攻略推荐 1311 作为较稳路线。"],
        },
      ],
    },
    {
      hero: "燕落",
      aliases: ["燕捕", "燕子"],
      role: "高攻速、平稳输出，部分路线偏 Boss 单体。",
      entries: [
        {
          title: "路线参考",
          sourceIds: ["jdrts-builds", "pc0359-31"],
          summary: "燕落的推荐路线多围绕燕翔、空流燕、燕雨春分的联动。杀 Boss 时更看重技能贯穿、攻速和会心提元的搭配。",
          points: ["基流可参考 3133 或 3123。", "主动流可参考 1223。", "PC0359 攻略强调燕翔、空流燕、燕雨春分的 Boss 输出联动。"],
        },
        {
          title: "英雄理解",
          sourceIds: ["jdrts-hero-read"],
          summary: "玩家评价燕落爆发不一定夸张，但输出较平稳，技能里带有明显的 PvP/机动倾向。",
          points: ["适合喜欢持续输出和灵活走位的玩家。", "高难副本需要装备补足生存，不能只看攻速。"],
        },
      ],
    },
    {
      hero: "云素青",
      aliases: ["青麈", "青尘", "青薼"],
      role: "内元/AOE/黑洞流派明显，路线自由度较高。",
      entries: [
        {
          title: "详细加点装备",
          sourceIds: ["pc0359-31", "jdrts-builds"],
          summary: "青麈资料相对完整：有被动流、黑洞流、混加流等分支。单体、群怪、看家强度取决于 20/30 技能组合。",
          points: ["基式流可参考 2132。", "黑洞流可参考 3X31 或 3231。", "也有玩家使用 2332 全内元路线。"],
        },
        {
          title: "装备方向",
          sourceIds: ["pc0359-31"],
          summary: "老攻略给青麈列了衣服、成长武器、万花/S 武器和饰品方向，适合用来判断中后期过渡。",
          points: ["单体输出路线前期清怪压力会更大。", "黑洞/AOE路线更利于看家和多目标场景。"],
        },
      ],
    },
    {
      hero: "天音",
      aliases: ["执刑仙"],
      role: "地雷、禁断、比例斩杀路线，控制和 Boss 爆发兼具。",
      entries: [
        {
          title: "技能输出测试",
          sourceIds: ["jdrts-tianyin"],
          summary: "天音资料以旧版本测试为主，但地结印、聚、疾行之道、皇律禁断、八斩风这些组合仍能帮助理解路线差异。",
          points: ["地雷+聚+疾行之道+皇律禁断偏看家和综合输出。", "地雷+聚+疾行之道+八斩风偏 Boss 爆发，尤其适合血量很高的 Boss。", "全筋骨路线在测试中表现较弱，不建议新手照走。"],
        },
        {
          title: "高难 Boss 经验",
          sourceIds: ["pc0359-31"],
          summary: "PC0359 的旧攻略把执刑仙列入能处理高难 Boss 的英雄之一，核心是天罚与断生死配合。",
          points: ["加点可参考燕落一类的会心、身法、提元思路。", "装备推荐偏高配，适合中后期对照，不适合照搬开局。"],
        },
      ],
    },
    {
      hero: "尹月行",
      aliases: ["玄虚"],
      role: "召唤/道术系，单通视频资料多于文字资料。",
      entries: [
        {
          title: "视频资料索引",
          sourceIds: ["bili-youshen"],
          summary: "搜索结果中能找到 3.32 玄虚单撸鸠罗相、玄虚单通骨灰等视频，比文字攻略更适合观察技能节奏和 Boss 处理。",
          points: ["先看视频确定麒麟、符法、剑阵的释放顺序。", "玄虚文字攻略较少，建议结合站内英雄技能页和视频录像一起看。"],
        },
        {
          title: "系统背景",
          sourceIds: ["cncrk-31"],
          summary: "玄虚同样遵循四次三选一系统，路线需要围绕每阶段技能的相互影响来搭配。",
          points: ["先确定自己要走召唤、生存还是爆发路线，再看装备。", "视频路线不一定适合低难新手开荒，需按装备强度降配。"],
        },
      ],
    },
    {
      hero: "小葵",
      aliases: ["身法葵"],
      role: "身法/内力均可，有辅助和单挑 Boss 路线。",
      entries: [
        {
          title: "教学视频",
          sourceIds: ["bili-wenjian-xiaokui", "bili-youshen"],
          summary: "小葵的高质量资料主要集中在视频：问剑及小葵教学、身法葵杀鸠罗相等，适合看技能释放和 Boss 站位。",
          points: ["身法葵路线更重视操作和输出窗口。", "小葵有辅助能力，但单通打法更看重技能组合与装备节奏。"],
        },
        {
          title: "版本资料",
          sourceIds: ["pc0359-31", "cncrk-31"],
          summary: "旧版本资料提到小葵能处理高难 Boss，地图说明也强调每次学习三选一会影响后续技能联动。",
          points: ["不要只看单个技能强度，要按四轮技能组合理解。", "录像路线通常默认玩家熟悉停怪、任务和装备来源。"],
        },
      ],
    },
  ],
};
const guideSourceById = new Map(GUIDE_DATA.sources.map((source) => [source.id, source]));
const itemByKey = new Map(DATA.items.map((item) => [item.key, item]));
const setById = new Map((DATA.itemSets || []).map((itemSet) => [itemSet.id, itemSet]));
const rawItemById = new Map((DATA.raw?.items || []).map((item) => [item.id, item]));
const itemGroupByRawId = new Map();
DATA.items.forEach((item) => {
  (item.variants || []).forEach((variant) => itemGroupByRawId.set(variant.id, item));
});
const mapMarkers = DATA.mapMarkers.filter((marker, index, markers) =>
  markers.findIndex((candidate) => candidate.key === marker.key) === index
);
const markerByKey = new Map(mapMarkers.map((marker) => [marker.key, marker]));
const taskById = new Map(DATA.tasks.map((task) => [task.id, task]));
const taskByTitle = new Map(DATA.tasks.map((task) => [textKey(task.title), task]));

const $ = (selector) => document.querySelector(selector);

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[ch]);
}

function compactText(value, length = 180) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > length ? `${text.slice(0, length - 1)}…` : text;
}

function includesQuery(obj, keys = []) {
  if (!state.query) return true;
  const query = state.query.toLowerCase();
  const hay = keys.map((key) => {
    const value = obj[key];
    if (Array.isArray(value)) return JSON.stringify(value);
    return value ?? "";
  }).join(" ").toLowerCase();
  return hay.includes(query);
}

function clearGlobalSearch() {
  state.query = "";
  const input = $("#globalSearch");
  if (input) input.value = "";
}

function focusSelectedMarker() {
  if (state.view !== "map" || !state.focusedMarkerKey) return;
  const key = state.focusedMarkerKey;
  requestAnimationFrame(() => {
    const markerButton = Array.from(document.querySelectorAll("[data-marker-key]"))
      .find((button) => button.dataset.markerKey === key);
    if (!markerButton) return;
    markerButton.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    markerButton.classList.remove("located");
    void markerButton.offsetWidth;
    markerButton.classList.add("located");
    window.setTimeout(() => {
      markerButton.classList.remove("located");
      if (state.focusedMarkerKey === key) state.focusedMarkerKey = "";
    }, 2200);
  });
}

function fmtNum(value) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return value || "0";
  if (num >= 100000000) return `${(num / 100000000).toFixed(num >= 1000000000 ? 1 : 2)}亿`;
  if (num >= 10000) return `${(num / 10000).toFixed(num >= 100000 ? 1 : 2)}万`;
  return String(Math.round(num));
}

function fmtStat(value) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return value || "0";
  if (Math.abs(num) >= 10000) return fmtNum(num);
  return Number.isInteger(num) ? String(num) : num.toFixed(1);
}

function chip(label, active, attrs = "") {
  return `<button class="chip ${active ? "active" : ""}" ${attrs}>${esc(label)}</button>`;
}

function qualityClass(q) {
  return `quality ${String(q || "其他").replace(/[^\w\u4e00-\u9fa5]/g, "")}`;
}

function icon(src, name, className = "object-icon") {
  return `<img class="${className}" src="${esc(src || "assets/preview.png")}" alt="${esc(name || "图标")}" loading="lazy" />`;
}

function nameForMatch(value) {
  return String(value || "")
    .replace(/[【\[].*?[】\]]/g, "")
    .replace(/禅/g, "蝉")
    .replace(/洛阳/g, "落阳")
    .replace(/^(成长武器|任务|英雄任务)[：:]?/, "")
    .replace(/[\s　:：·•《》「」,，。；;()（）]/g, "");
}

function textKey(value) {
  return nameForMatch(value).toLowerCase();
}

function resolveItemRef(item) {
  if (!item) return null;
  const rawKey = item.key || item.itemKey || item.recipeFor || "";
  const full = (rawKey && itemByKey.get(rawKey)) || itemByKey.get(item.name) || null;
  return {
    key: full?.key || rawKey,
    name: item.name || full?.name || "",
    icon: item.icon || full?.icon || "assets/preview.png",
    quality: full?.quality || item.quality || "",
  };
}

function itemButton(item, attrs = "") {
  if (!item) return "";
  const ref = resolveItemRef(item);
  const key = ref.key || "";
  const disabled = key ? "" : "disabled";
  const sourceHint = item.source ? (String(item.source).match(/（(.+)）/)?.[1] || item.source) : "";
  return `
    <button class="mini-object" data-item-key="${esc(key)}" ${disabled} ${attrs}>
      ${icon(ref.icon, ref.name, "mini-icon")}
      <span>${esc(ref.name)}</span>
      ${ref.quality ? `<small class="${qualityClass(ref.quality)}">${esc(ref.quality)}</small>` : ""}
      ${item.chance ? `<small>${esc(item.chance)}</small>` : ""}
      ${sourceHint ? `<small>${esc(sourceHint)}</small>` : ""}
    </button>
  `;
}

function variantRef(rawOrVariant) {
  if (!rawOrVariant) return null;
  const raw = rawOrVariant.id ? rawItemById.get(rawOrVariant.id) || rawOrVariant : rawOrVariant;
  return {
    id: raw.id || "",
    name: raw.name || "",
    icon: raw.iconPath || raw.icon || "assets/preview.png",
    quality: raw.quality || "",
    type: raw.type || "",
    stats: raw.stats || [],
    description: raw.ubers || raw.description || "",
    sources: raw.sources || [],
  };
}

function variantButton(rawOrVariant, attrs = "") {
  const ref = variantRef(rawOrVariant);
  if (!ref) return "";
  const disabled = ref.id ? "" : "disabled";
  return `
    <button class="mini-object" data-variant-id="${esc(ref.id)}" ${disabled} ${attrs}>
      ${icon(ref.icon, ref.name, "mini-icon")}
      <span>${esc(ref.name)}</span>
      ${ref.quality ? `<small class="${qualityClass(ref.quality)}">${esc(ref.quality)}</small>` : ""}
    </button>
  `;
}

function mergeDrops(drops = []) {
  const merged = new Map();
  drops.forEach((drop) => {
    const key = drop.key || drop.itemKey || drop.name;
    if (!key) return;
    if (!merged.has(key)) {
      merged.set(key, { ...drop, source: "", chances: [] });
    }
    const target = merged.get(key);
    const chance = String(drop.chance || "").trim();
    if (chance && !target.chances.includes(chance)) target.chances.push(chance);
  });
  return Array.from(merged.values()).map((drop) => ({
    ...drop,
    chance: drop.chances.length ? `掉率 ${drop.chances.join(" / ")}` : "掉率未标注",
  }));
}

function dropList(drops = []) {
  const rows = mergeDrops(drops);
  if (!rows.length) return "";
  return `<div class="mini-list drop-list">${rows.map((drop) => itemButton(drop)).join("")}</div>`;
}

function relatedUnitChips(units = []) {
  if (!units.length) return "";
  return `
    <div class="related-unit-list">
      ${units.map((unit) => `
        <span class="related-unit-chip">
          ${icon(unit.icon, unit.name, "mini-icon")}
          <span>${esc(unit.name)}</span>
          <small>${esc(unit.role || "关联单位")}</small>
          <small>${esc(unit.locationCount ? `${unit.locationCount} 处` : "无固定点")}</small>
        </span>
      `).join("")}
    </div>
  `;
}

function taskRewardList(task) {
  const itemRewards = (task.rewards || []).map((reward) => ({
    ...reward,
    chance: reward.chance ? `概率 ${reward.chance}` : "固定",
  }));
  const textRewards = task.rewardText || [];
  return `
    <div class="task-rewards">
      ${itemRewards.length ? `<div class="mini-list reward-items">${itemRewards.map((reward) => itemButton(reward)).join("")}</div>` : ""}
      ${textRewards.length ? `<div class="reward-text-list">${textRewards.map((text) => `<span class="pill reward-note">${esc(text)}</span>`).join("")}</div>` : ""}
    </div>
  `;
}

function taskSnippet(task) {
  return `
    <div class="task-snippet">
      <strong>${esc(task.title)}</strong>
      <div class="stats-list compact">
        <span class="pill">NPC ${esc(task.npc || "未解析")}</span>
        ${mapButtonByName(task.npc, "NPC位置")}
        <button class="ghost-button" data-task-key="${esc(task.id)}">任务详情</button>
      </div>
      <p>${esc(task.objective || task.text)}</p>
      ${taskRewardList(task)}
    </div>
  `;
}

function firstMarkerForUnit(unitId) {
  return mapMarkers.find((m) => m.id === unitId);
}

function firstMarkerForName(name) {
  const exact = mapMarkers.find((m) => m.name === name);
  if (exact) return exact;
  const key = nameForMatch(name);
  if (!key || key.length < 2) return null;
  const matches = mapMarkers.filter((m) => {
    const markerKey = nameForMatch(m.name);
    return markerKey === key || markerKey.includes(key) || key.includes(markerKey);
  });
  return matches.find((m) => m.category === "npc") || matches[0] || null;
}

function mapButtonByUnit(unitId, label = "地图定位") {
  const marker = firstMarkerForUnit(unitId);
  if (!marker) return "";
  return `<button class="ghost-button" data-goto-marker="${esc(marker.key)}">${esc(label)}</button>`;
}

function mapButtonByName(name, label = "地图定位") {
  const marker = firstMarkerForName(name);
  if (!marker) return "";
  return `<button class="ghost-button" data-goto-marker="${esc(marker.key)}">${esc(label)}</button>`;
}

function unique(values) {
  return Array.from(new Set(values.filter((value) => String(value || "").trim())));
}

function cleanSourceName(value) {
  return String(value || "")
    .replace(/（Boss 携带）/g, "")
    .replace(/^任务(?:奖励|获得)?[：:]?/, "")
    .replace(/^商店(?:\/配方)?[：:]?/, "")
    .trim();
}

function cleanTaskTitle(value) {
  return String(value || "")
    .replace(/^任务(?:奖励|获得)?[：:]?/, "")
    .trim();
}

function splitSourceTargets(value) {
  return cleanSourceName(value)
    .split(/\s*\/\s*/)
    .map((name) => name.trim())
    .filter((name) => name && name !== "合成系统");
}

function splitDropSourceTargets(value) {
  const targets = splitSourceTargets(value);
  const grouped = new Map();
  targets.forEach((target) => {
    const normalized = target.replace(/^黑暗[-－]/, "").trim();
    const key = textKey(normalized);
    const current = grouped.get(key);
    if (!current || /^黑暗[-－]/.test(current)) grouped.set(key, target);
  });
  return Array.from(grouped.values());
}

function taskFromSource(source) {
  const title = cleanTaskTitle(source?.source || "");
  return taskByTitle.get(textKey(title)) || taskByTitle.get(textKey(source?.source || "")) || null;
}

function sourceKind(source) {
  const type = String(source?.type || "");
  const name = String(source?.source || "");
  if (/掉落|生成|携带/.test(type)) return "drop";
  if (/任务/.test(type) || /^任务/.test(name)) return "task";
  if (/商店|商城/.test(type)) return /配方/.test(type) ? "craft" : "shop";
  if (/合成|配方|兑换|制作卷|狩猎|贡献|宝石|五岳|属性点|成长|升级/.test(type)) return "craft";
  if (/系统|功能|技能|挑战|传送|补给|药品|说明|对象/.test(type)) return "system";
  if (/奖励|获得/.test(type) && /^任务/.test(name)) return "task";
  return "other";
}

function recipeNpc(recipe, fallbackNpcs = []) {
  const npc = String(recipe?.npc || "").trim();
  if (npc && npc !== "合成系统") return npc;
  return fallbackNpcs[0] || npc || "合成系统";
}

function recipeUsesSameItem(item, recipe) {
  const keys = new Set([textKey(item.name), textKey(item.key)]);
  return (recipe.materials || []).some((material) =>
    keys.has(textKey(material.name || material.key || material.itemKey || ""))
  );
}

function recipeProvidesItem(item, recipe) {
  return !recipeUsesSameItem(item, recipe);
}

function sourceLabel(entry) {
  if (entry.kind === "drop") return "单位掉落";
  if (entry.kind === "task") return "任务获得";
  if (entry.kind === "shop") return /商城/.test(entry.rawType || "") ? "商城购买" : "商店购买";
  if (entry.kind === "craft") {
    if (/成长|升级/.test(entry.rawType || "")) return "成长/升级";
    if (/商店/.test(entry.rawType || "")) return "商店合成";
    return entry.target === "合成系统" ? "合成获得" : "合成/兑换";
  }
  if (entry.kind === "system") return entry.rawType || "系统/功能";
  return entry.rawType || "获得";
}

function mergeSourceEntries(entries) {
  const merged = new Map();
  entries.forEach((entry) => {
    const targetKey = entry.kind === "drop" ? textKey(entry.target.replace(/^黑暗[-－]/, "")) : textKey(entry.target);
    const key = [entry.kind, targetKey, entry.task?.id || "", sourceLabel(entry)].join("|");
    if (!merged.has(key)) {
      const target = entry.kind === "drop" ? entry.target.replace(/^黑暗[-－]/, "").trim() : entry.target;
      merged.set(key, { ...entry, target, label: sourceLabel(entry), chances: [], recipes: [] });
    }
    const target = merged.get(key);
    const chance = String(entry.chance || "").trim();
    if (chance && !target.chances.includes(chance)) target.chances.push(chance);
    if (entry.recipe && !target.recipes.includes(entry.recipe)) target.recipes.push(entry.recipe);
  });
  const order = { drop: 1, craft: 2, shop: 3, task: 4, system: 5, other: 6 };
  return Array.from(merged.values()).sort((a, b) => (order[a.kind] || 9) - (order[b.kind] || 9));
}

function structuredItemSources(item) {
  const rawSources = item.sources || [];
  const acquisitionRecipes = (item.recipes || []).filter((recipe) => recipeProvidesItem(item, recipe));
  const shopRecipeNpcs = unique(rawSources
    .filter((source) => /商店\/配方|商店|商城/.test(source.type || ""))
    .flatMap((source) => splitSourceTargets(source.source)));
  const entries = [];
  const recipeTargets = new Set();

  acquisitionRecipes.forEach((recipe) => {
    const target = recipeNpc(recipe, shopRecipeNpcs);
    if (!target) return;
    recipeTargets.add(textKey(target));
    entries.push({ kind: "craft", target, recipe, rawType: recipe.type || "合成", chance: recipe.chance });
  });

  rawSources.forEach((source) => {
    const kind = sourceKind(source);
    if (kind === "craft" && acquisitionRecipes.length) return;

    if (kind === "drop") {
      const targets = splitDropSourceTargets(source.source);
      (targets.length ? targets : [cleanSourceName(source.source)]).forEach((target) => {
        if (target) entries.push({ kind, target, rawType: source.type, chance: source.chance });
      });
      return;
    }

    if (kind === "task") {
      const task = taskFromSource(source);
      const target = task?.title || cleanTaskTitle(source.source);
      entries.push({ kind, target, task, rawType: source.type, chance: source.chance });
      return;
    }

    if (kind === "shop") {
      splitSourceTargets(source.source).forEach((target) => {
        if (acquisitionRecipes.length && recipeTargets.has(textKey(target))) return;
        entries.push({ kind, target, rawType: source.type, chance: source.chance });
      });
      return;
    }

    if (kind === "system") {
      entries.push({ kind, target: cleanSourceName(source.source), rawType: source.type, chance: source.chance });
      return;
    }

    const target = cleanSourceName(source.source);
    if (target) entries.push({ kind, target, rawType: source.type, chance: source.chance });
  });

  return mergeSourceEntries(entries);
}

function sourceChanceText(entry, label) {
  if (!entry.chances?.length) return "";
  return `<span class="id">${esc(label)} ${esc(entry.chances.join(" / "))}</span>`;
}

function sourceChanceLabel(entry) {
  if (/成长|升级/.test(entry.rawType || "")) return "条件";
  if (entry.kind === "drop") return "掉率";
  if (entry.kind === "task") return "奖励概率";
  return "概率";
}

function itemSourceSummary(entry) {
  const chance = entry.chances?.length ? ` ${sourceChanceLabel(entry)} ${entry.chances.join(" / ")}` : "";
  if (entry.kind === "drop") return `${entry.target} 掉落${chance}`;
  if (entry.kind === "task") return `任务：${entry.target}${chance}`;
  return `${entry.label}：${entry.target}${chance}`;
}

function renderItemSource(entry) {
  const dot = entry.kind === "drop" ? "boss" : entry.kind === "task" ? "npc" : "shop";
  if (entry.kind === "drop") {
    return `
      <div class="source-card">
        <span class="dot ${dot}"></span>
        <div class="source-main">
          <strong>${esc(entry.target)} 掉落</strong>
          <span class="source-meta">点击地图定位可查看该单位完整掉落</span>
        </div>
        <div class="source-actions">
          ${sourceChanceText(entry, "掉率")}
          ${mapButtonByName(entry.target, "地图定位")}
        </div>
      </div>
    `;
  }
  if (entry.kind === "task") {
    const task = entry.task;
    return `
      <div class="source-card">
        <span class="dot ${dot}"></span>
        <div class="source-main">
          <strong>任务获得：${esc(entry.target)}</strong>
          <span class="source-meta">任务NPC：${esc(task?.npc || "未解析")}</span>
          ${task?.objective ? `<p>${esc(task.objective)}</p>` : ""}
        </div>
        <div class="source-actions">
          ${sourceChanceText(entry, sourceChanceLabel(entry))}
          ${task ? `<button class="ghost-button" data-task-key="${esc(task.id)}">任务详情</button>` : ""}
          ${mapButtonByName(task?.npc, "NPC位置")}
        </div>
      </div>
    `;
  }
  if (entry.kind === "system") {
    return `
      <div class="source-card">
        <span class="dot npc"></span>
        <div class="source-main">
          <strong>${esc(entry.label)}：${esc(entry.target)}</strong>
          <span class="source-meta">用途来源：${esc(entry.target)}</span>
        </div>
        <div class="source-actions">
          ${sourceChanceText(entry, sourceChanceLabel(entry))}
          ${mapButtonByName(entry.target, "地图定位")}
        </div>
      </div>
    `;
  }
  const npcLabel = entry.kind === "shop"
    ? "商店NPC"
    : (/成长|升级/.test(entry.rawType || "") ? "成长/升级" : (entry.target === "合成系统" ? "来源" : "合成NPC"));
  return `
    <div class="source-card">
      <span class="dot ${dot}"></span>
      <div class="source-main">
        <strong>${esc(entry.label)}：${esc(entry.target)}</strong>
        <span class="source-meta">${esc(npcLabel)}：${esc(entry.target)}</span>
        ${entry.recipes?.length ? `<span class="source-meta">配方 ${entry.recipes.length} 条，材料见下方合成/兑换</span>` : ""}
      </div>
      <div class="source-actions">
        ${sourceChanceText(entry, sourceChanceLabel(entry))}
        ${mapButtonByName(entry.target, "地图定位")}
      </div>
    </div>
  `;
}

function renderItemSources(item) {
  const sources = structuredItemSources(item);
  if (!sources.length) return empty("来源数据为空");
  return `<div class="source-list">${sources.map(renderItemSource).join("")}</div>`;
}

function renderNav() {
  $("#nav").innerHTML = navItems.map(([id, label, badge, countKey]) => {
    const count = countKey ? DATA.meta.counts[countKey] : "";
    return `
      <button class="nav-button ${state.view === id ? "active" : ""}" data-view="${id}" title="${esc(label)}">
        <span class="nav-icon">${esc(badge)}</span>
        <span>${esc(label)}</span>
        <span class="nav-count">${count || ""}</span>
      </button>
    `;
  }).join("");

  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      if (state.view === "map") {
        state.mapFilter = "all";
        state.selectedMarkerKey = "";
        state.focusedMarkerKey = "";
      }
      render();
    });
  });
}

function heroStatEntries(hero) {
  const entries = Object.entries(hero.stats || {});
  if (entries.length) {
    return entries.map(([name, stat]) => ({
      name,
      base: Number(stat.base || 0),
      growth: Number(stat.growth || 0),
    }));
  }
  return [
    ["筋骨", hero.rawStr, hero.rawStrGrowth],
    ["身法", hero.rawAgi, hero.rawAgiGrowth],
    ["内元", hero.rawInt, hero.rawIntGrowth],
  ].map(([name, base, growth]) => ({
    name,
    base: Number(base || 0),
    growth: Number(growth || 0),
  }));
}

function heroStatScale(heroes = DATA.heroes) {
  const entries = heroes.flatMap(heroStatEntries);
  return {
    base: Math.max(1, ...entries.map((entry) => entry.base)),
    growth: Math.max(1, ...entries.map((entry) => entry.growth)),
  };
}

function heroStats(hero, scale = heroStatScale()) {
  return heroStatEntries(hero).map(({ name, base, growth }) => `
    <div class="hero-stat-row">
      <span class="hero-stat-name">${esc(name)}</span>
      <div class="hero-stat-bars">
        <span class="stat-meter base">
          <span class="meter-fill" style="width:${Math.max(7, Math.min(100, (base / scale.base) * 100))}%"></span>
          <span class="meter-text">基础 ${fmtStat(base)}</span>
        </span>
        <span class="stat-meter growth">
          <span class="meter-fill" style="width:${Math.max(7, Math.min(100, (growth / scale.growth) * 100))}%"></span>
          <span class="meter-text">成长 ${fmtStat(growth)}</span>
        </span>
      </div>
    </div>
  `).join("");
}

function skillFacts(skill) {
  const facts = unique((skill.facts || []).map((fact) => String(fact || "").trim().replace(/^[◆◇*-]\s*/, "")));
  if (facts.length) return facts;
  return unique(String(skill.description || "")
    .split(/\n+/)
    .map((line) => line.trim().replace(/^[◆◇*-]\s*/, ""))
    .filter((line) => line && !/^(被动|战系|法系)$/.test(line)));
}

function uniqueGrants(grants = []) {
  const seen = new Set();
  return grants.filter((grant) => {
    const key = `${textKey(grant.name)}|${grant.icon || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function skillCard(skill) {
  const facts = skillFacts(skill);
  const grants = uniqueGrants(skill.grants || []);
  return `
    <article class="skill-card">
      <header>
        ${icon(skill.icon, skill.name, "skill-icon")}
        <div>
          <h3>${esc(skill.name.replace(/^学习/, ""))}</h3>
          ${skill.tip ? `<span class="muted">${esc(skill.tip)}</span>` : ""}
        </div>
      </header>
      <div class="skill-fact-list">
        ${facts.length ? facts.map((fact) => `
          <span class="skill-fact"><span class="skill-bullet">◆</span>${esc(fact)}</span>
        `).join("") : `<span class="muted">技能表未写入说明</span>`}
      </div>
      ${grants.length ? `
        <div class="grant-list">
          <span class="muted">获得</span>
          ${grants.map((grant) => `
            <span class="grant-chip">
              ${icon(grant.icon, grant.name, "mini-icon")}
              <span>${esc(grant.name.replace(/\([A-Z]\)$/i, ""))}</span>
            </span>
          `).join("")}
        </div>
      ` : ""}
    </article>
  `;
}

function heroStage(stage) {
  return `
    <section class="stage-block">
      <header class="stage-head">
        <h3>${esc(stage.name || `第${stage.stage}次学习`)}</h3>
        <span class="pill">三选一</span>
      </header>
      <div class="choice-grid">${(stage.choices || []).map(skillCard).join("")}</div>
    </section>
  `;
}

function renderHeroes() {
  const heroes = DATA.heroes.filter((hero) => includesQuery(hero, ["name", "tip", "skills", "skillStages"]));
  const statScale = heroStatScale(DATA.heroes);
  return `
    <div class="toolbar">
      <span class="pill">共 ${heroes.length} 名英雄</span>
      <span class="pill">4 次学习 · 每次 3 选 1</span>
    </div>
    <div class="hero-jump-list">
      ${heroes.map((hero) => `
        <button class="hero-jump" data-hero-jump="${esc(hero.id)}">
          ${icon(hero.icon, hero.name, "mini-icon")}
          <span>${esc(hero.name)}</span>
        </button>
      `).join("")}
    </div>
    <div class="hero-grid">
      ${heroes.map((hero) => `
        <article class="hero-card" id="hero-${esc(hero.id)}">
          <header>
            ${icon(hero.icon, hero.name)}
            <div>
              <h2>${esc(hero.name)}</h2>
              <div class="meta-line compact">
                <span class="pill">${esc(hero.range || "定位待判")}</span>
                ${hero.move ? `<span class="pill">移动 ${esc(hero.move)}</span>` : ""}
                <span class="pill">${(hero.skillStages || []).length} 轮学习</span>
                ${hero.skillCombinationCount ? `<span class="pill">${hero.skillCombinationCount} 种搭配</span>` : ""}
              </div>
            </div>
          </header>
          <div class="hero-stat">${heroStats(hero, statScale)}</div>
          <div class="stage-stack">${(hero.skillStages || []).map(heroStage).join("")}</div>
        </article>
      `).join("") || empty("没有匹配的英雄")}
    </div>
  `;
}

function itemSourceText(item) {
  return structuredItemSources(item).slice(0, 3).map(itemSourceSummary).join(" / ");
}

function itemSetFor(item) {
  return item?.setId ? setById.get(item.setId) : null;
}

function renderSetBonuses(itemSet) {
  const bonuses = itemSet?.bonuses || [];
  return `
    <div class="stats-list set-bonus-list">
      ${bonuses.map((bonus) => `<span class="pill">${esc(bonus)}</span>`).join("") || `<span class="muted">未解析到套装属性</span>`}
    </div>
  `;
}

function renderSetMembers(itemSet, currentKey = "") {
  const members = itemSet?.members || [];
  return `
    <div class="mini-list set-member-list">
      ${members.map((member) => itemButton(member, member.key === currentKey ? `data-current-set-member="true"` : "")).join("")}
    </div>
  `;
}

function renderItemSetSection(item) {
  const itemSet = itemSetFor(item);
  if (!itemSet) return "";
  return `
    <h3>套装</h3>
    <div class="set-detail-card">
      <div class="set-detail-head">
        <div>
          <strong>${esc(itemSet.name)}套</strong>
          <span class="muted">${esc(itemSet.memberCount)} 件激活</span>
        </div>
        <span class="pill ${qualityClass(itemSet.quality)}">${esc(itemSet.quality)}</span>
      </div>
      <h4>套装成员</h4>
      ${renderSetMembers(itemSet, item.key)}
      <h4>套装属性</h4>
      ${renderSetBonuses(itemSet)}
    </div>
  `;
}

function renderSets() {
  const allSets = DATA.itemSets || [];
  const sets = allSets.filter((itemSet) => includesQuery(itemSet, ["name", "quality", "members", "bonuses"]));
  return `
    <div class="toolbar">
      <span class="pill">套装 ${sets.length} / ${allSets.length}</span>
      <button class="chip" data-view-jump="items">回到物品</button>
    </div>
    <div class="set-grid">
      ${sets.map((itemSet) => `
        <article class="set-card">
          <header>
            <div class="set-icon-stack">
              ${(itemSet.members || []).slice(0, 4).map((member) => icon(member.icon, member.name, "mini-icon")).join("")}
            </div>
            <div>
              <h2>${esc(itemSet.name)}套</h2>
              <div class="meta-line compact">
                <span class="pill ${qualityClass(itemSet.quality)}">${esc(itemSet.quality)}</span>
                <span class="pill">${esc(itemSet.memberCount)} 件激活</span>
                <span class="pill">${esc(itemSet.source || "套装触发器")}</span>
              </div>
            </div>
          </header>
          <h3>套装成员</h3>
          ${renderSetMembers(itemSet)}
          <h3>套装属性</h3>
          ${renderSetBonuses(itemSet)}
        </article>
      `).join("") || empty("没有匹配的套装")}
    </div>
  `;
}

function guideHeroIcon(group) {
  const aliases = [group.hero, ...(group.aliases || [])].map(textKey);
  const hero = DATA.heroes.find((candidate) => aliases.includes(textKey(candidate.name)));
  return icon(hero?.icon, group.hero);
}

function guideSourceLinks(sourceIds = []) {
  return sourceIds.map((id) => guideSourceById.get(id)).filter(Boolean).map((source) => `
    <a class="guide-source-link" href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">
      <span>原文 · ${esc(source.site)}</span>
      <strong>${esc(source.title)}</strong>
    </a>
  `).join("");
}

function guideEntryCard(entry) {
  return `
    <article class="guide-entry-card">
      <header>
        <h3>${esc(entry.title)}</h3>
        <span class="pill">${esc((entry.sourceIds || []).length)} 个来源</span>
      </header>
      <p>${esc(entry.summary)}</p>
      <ul class="guide-point-list">
        ${(entry.points || []).map((point) => `<li>${esc(point)}</li>`).join("")}
      </ul>
      <div class="guide-source-row">${guideSourceLinks(entry.sourceIds)}</div>
    </article>
  `;
}

function guideSearchText(group) {
  const sourceText = (group.entries || []).flatMap((entry) =>
    (entry.sourceIds || []).map((id) => guideSourceById.get(id)?.title || "")
  );
  return {
    hero: group.hero,
    aliases: group.aliases || [],
    role: group.role || "",
    entries: group.entries || [],
    sources: sourceText,
  };
}

function renderGuides() {
  const heroes = GUIDE_DATA.heroes.filter((group) =>
    includesQuery(guideSearchText(group), ["hero", "aliases", "role", "entries", "sources"])
  );
  const guideCount = GUIDE_DATA.heroes.reduce((sum, group) => sum + (group.entries || []).length, 0)
    + (GUIDE_DATA.general || []).length;
  const general = (GUIDE_DATA.general || []).filter((entry) =>
    includesQuery(entry, ["title", "summary", "points", "sourceIds"])
  );
  return `
    <div class="toolbar">
      <span class="pill">外部来源 ${GUIDE_DATA.sources.length}</span>
      <span class="pill">攻略摘要 ${guideCount}</span>
      <span class="pill">更新 ${esc(GUIDE_DATA.updatedAt)}</span>
    </div>
    <div class="hero-jump-list guide-jump-list">
      ${heroes.map((group) => `
        <button class="hero-jump" data-guide-jump="${esc(textKey(group.hero))}">
          ${guideHeroIcon(group).replace("object-icon", "mini-icon")}
          <span>${esc(group.hero)}</span>
        </button>
      `).join("")}
    </div>
    <section class="guide-section">
      <h2>通用资料</h2>
      <div class="guide-entry-grid">
        ${general.map(guideEntryCard).join("") || empty("没有匹配的通用攻略")}
      </div>
    </section>
    <section class="guide-section">
      <h2>资料来源</h2>
      <div class="guide-source-grid">
        ${GUIDE_DATA.sources.map((source) => `
          <a class="guide-source-card" href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">
            <span class="pill">${esc(source.site)} · ${esc(source.type)}</span>
            <strong>${esc(source.title)}</strong>
            <p>${esc(source.note)}</p>
          </a>
        `).join("")}
      </div>
    </section>
    <section class="guide-section">
      <h2>按英雄分类</h2>
      <div class="guide-hero-stack">
        ${heroes.map((group) => `
          <article class="guide-hero-card" id="guide-${esc(textKey(group.hero))}">
            <header>
              ${guideHeroIcon(group)}
              <div>
                <h2>${esc(group.hero)}</h2>
                <div class="meta-line compact">
                  ${(group.aliases || []).map((alias) => `<span class="pill">${esc(alias)}</span>`).join("")}
                  <span class="pill">${esc(group.role)}</span>
                </div>
              </div>
            </header>
            <div class="guide-entry-grid">
              ${(group.entries || []).map(guideEntryCard).join("")}
            </div>
          </article>
        `).join("") || empty("没有匹配的英雄攻略")}
      </div>
    </section>
  `;
}

function renderItems() {
  const qualities = ["全部", ...qualityOrder.filter((q) => DATA.meta.qualityCounts[q])];
  const types = ["全部", ...Array.from(new Set(DATA.items.map((i) => i.type || "未分类"))).sort()];
  const sourceTypes = ["全部", ...Array.from(new Set(DATA.items.flatMap((i) => (i.sources || []).map((s) => s.type)))).sort()];
  const items = DATA.items.filter((item) => {
    if (state.setOnly && !item.setId) return false;
    if (state.quality !== "全部" && item.quality !== state.quality) return false;
    if (state.itemType !== "全部" && item.type !== state.itemType) return false;
    if (state.sourceType !== "全部" && !(item.sources || []).some((s) => s.type === state.sourceType)) return false;
    return includesQuery(item, ["name", "type", "quality", "description", "stats", "sources", "recipes", "setName"]);
  });

  return `
    <div class="toolbar">
      ${qualities.map((q) => chip(q, state.quality === q, `data-quality="${esc(q)}"`)).join("")}
      ${chip("套装", state.setOnly, `data-set-only="${state.setOnly ? "0" : "1"}"`)}
      <select id="itemType">${types.map((type) => `<option ${state.itemType === type ? "selected" : ""}>${esc(type)}</option>`).join("")}</select>
      <select id="sourceType">${sourceTypes.map((type) => `<option ${state.sourceType === type ? "selected" : ""}>${esc(type)}</option>`).join("")}</select>
      <span class="pill">显示 ${items.length} / ${DATA.items.length}</span>
    </div>
    <div class="grid">
      ${items.map((item) => {
        const craftCount = mergeRecipes(item.recipes || []).filter((recipe) => recipeProvidesItem(item, recipe)).length;
        const upgradeCount = upgradeTransitionsFor(item).length;
        return `
        <article class="item-card" data-open-item="${esc(item.key)}">
          <header>
            ${icon(item.icon, item.name)}
            <div>
              <h3>${esc(item.name)}</h3>
              <span class="muted">${esc(item.type || "未分类")}</span>
            </div>
            <span class="pill ${qualityClass(item.quality)}">${esc(item.quality)}</span>
          </header>
          <div class="stats-list">
            ${(item.stats || []).slice(0, 5).map((stat) => `<span class="pill">${esc(stat)}</span>`).join("") || `<span class="muted">未解析到数值属性</span>`}
          </div>
          ${item.setName ? `<span class="pill set-badge">${esc(item.setName)}套 · ${esc(item.setMemberCount || "")}件</span>` : ""}
          <p class="copy">${esc(itemSourceText(item) || "来源数据为空")}</p>
          ${craftCount ? `<span class="pill">合成/兑换 ${craftCount}</span>` : ""}
          ${upgradeCount ? `<span class="pill">升级/强化 ${upgradeCount}</span>` : ""}
        </article>
      `;
      }).join("") || empty("没有匹配的物品")}
    </div>
  `;
}

function renderMapDetail(marker) {
  if (!marker) {
    return `<aside class="panel">${empty("请选择地图上的中文标注")}</aside>`;
  }
  const detail = marker.detail || {};
  return `
    <aside class="panel map-detail">
      <header class="detail-inline-head">
        ${icon(marker.icon, marker.name)}
        <div>
          <h2>${esc(marker.name)}</h2>
          <span class="muted">${esc(categoryLabel[marker.category] || marker.category)} · ${Math.round(marker.x)}, ${Math.round(marker.y)}</span>
        </div>
      </header>
      ${detail.summary ? `<p class="copy">${esc(detail.summary)}</p>` : ""}
      ${detail.shop ? `
        <h3>出售/训练</h3>
        <div class="mini-list">${(detail.shop.items || []).map(itemButton).join("") || `<span class="muted">出售单位或训练项</span>`}</div>
        ${(detail.shop.units?.length || detail.shop.trains?.length) ? `<p class="copy">${esc([...(detail.shop.units || []), ...(detail.shop.trains || [])].map((x) => x.name).join(" / "))}</p>` : ""}
      ` : ""}
      ${(detail.drops || []).length ? `
        <h3>掉落/生成</h3>
        ${dropList(detail.drops)}
      ` : ""}
      ${(detail.relatedUnits || []).length ? `
        <h3>关联单位</h3>
        ${relatedUnitChips(detail.relatedUnits)}
      ` : ""}
      ${(detail.recipes || []).length ? `
        <h3>可合成/兑换</h3>
        <div class="marker-list">
          ${detail.recipes.map((recipe) => `
            <div class="recipe-row">
              ${itemButton(recipe)}
              <div class="mini-list material-list">${(recipe.materials || []).map((m) => itemButton(m)).join("")}</div>
            </div>
          `).join("")}
        </div>
      ` : ""}
      ${(detail.professions || []).length ? `
        <h3>可学习副职</h3>
        <div class="mini-list profession-mini-list">
          ${detail.professions.map((prof) => `
            <span class="profession-mini">
              ${icon(prof.icon, prof.name, "mini-icon")}
              <span>${esc(prof.name)}</span>
            </span>
          `).join("")}
        </div>
      ` : ""}
      ${(detail.tasks || []).length ? `
        <h3>任务</h3>
        <div class="marker-list">
          ${detail.tasks.map(taskSnippet).join("")}
        </div>
      ` : ""}
      ${!(detail.shop || detail.drops?.length || detail.relatedUnits?.length || detail.recipes?.length || detail.professions?.length || detail.tasks?.length) ? empty("此对象没有解析到商店、掉落或任务功能") : ""}
    </aside>
  `;
}

function renderVectorMapArt() {
  const regions = [
    ["西境山脉", 15, 44],
    ["新手营地", 10, 88],
    ["主城", 56, 58],
    ["幺阳阵", 20, 72],
    ["玄寂禁地", 61, 23],
    ["东海古林", 79, 52],
    ["寒渊", 86, 82],
    ["地下遗迹", 92, 91],
  ];
  return `
    <svg class="map-art" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id="terrain-grain" width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M0 4 L4 0" stroke="rgba(75,96,72,.1)" stroke-width=".24"/>
          <circle cx="1.2" cy="1.1" r=".22" fill="rgba(83,127,94,.18)"/>
          <circle cx="3.2" cy="3.1" r=".18" fill="rgba(86,115,150,.13)"/>
        </pattern>
        <linearGradient id="land-light" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#d4d2a9"/>
          <stop offset=".5" stop-color="#b8c995"/>
          <stop offset="1" stop-color="#9dbb88"/>
        </linearGradient>
        <linearGradient id="sea-light" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#48aeb8"/>
          <stop offset="1" stop-color="#1f7d91"/>
        </linearGradient>
      </defs>
      <rect class="map-sea" x="0" y="0" width="100" height="100" fill="url(#sea-light)"/>
      <path class="map-coast" d="M2 9 H97 V95 H2 Z"/>
      <path class="map-land" fill="url(#land-light)" d="M2.2 8.4 C17 7.2 29 8.8 42 7.6 C60 6 73 8.2 97 8.8 L97 94.8 C78 96 57 94.2 39 96 C24 97.4 10 95.4 2.2 96 Z"/>
      <path class="map-grain" fill="url(#terrain-grain)" d="M2.2 8.4 C17 7.2 29 8.8 42 7.6 C60 6 73 8.2 97 8.8 L97 94.8 C78 96 57 94.2 39 96 C24 97.4 10 95.4 2.2 96 Z"/>
      <path class="map-water-shape" d="M72 2 L78 0 L85 0 L81 6 L76 9 Z"/>
      <path class="map-water-shape" d="M88 0 H99 V42 C96 41 94 36 96 30 C97 24 92 18 93 10 C93 6 90 4 88 0 Z"/>
      <path class="map-water-shape" d="M0 77 C3 76 6 80 5 86 C4 92 2 96 0 98 Z"/>
      <path class="map-ridge ridge-west" d="M7 49 C11 47 13 54 17 55 C24 60 29 55 34 54 C30 61 24 68 16 67 C10 66 8 58 7 49 Z"/>
      <path class="map-ridge ridge-west-dark" d="M12 39 C17 39 22 41 27 46 C21 47 17 45 12 44 Z"/>
      <path class="map-ridge ridge-center" d="M53 48 C57 46 60 49 63 52 C60 55 55 54 51 52 Z"/>
      <path class="map-ridge ridge-east" d="M73 39 C78 35 83 38 86 44 C82 47 77 45 73 39 Z"/>
      <path class="map-forest" d="M9 18 C15 13 23 16 28 20 C25 28 15 29 9 24 Z"/>
      <path class="map-forest" d="M29 17 C36 12 44 16 45 24 C38 28 31 25 29 17 Z"/>
      <path class="map-forest" d="M67 14 C74 10 82 14 83 21 C77 25 70 23 67 14 Z"/>
      <path class="map-forest" d="M77 61 C84 58 91 62 91 70 C84 73 78 69 77 61 Z"/>
      <path class="map-road main-road" d="M9 87 C18 77 29 75 39 68 C49 62 54 54 62 48 C72 40 83 37 93 28"/>
      <path class="map-road side-road" d="M17 17 C27 24 35 31 43 40 C50 48 55 55 60 64"/>
      <path class="map-road side-road" d="M57 58 C66 62 74 67 86 81"/>
      <path class="map-stream" d="M47 69 C50 68 50 64 48 61 C51 60 53 56 52 53"/>
      <path class="map-stream" d="M79 23 C80 27 84 28 83 32 C82 35 85 37 87 39"/>
      <ellipse class="map-lake" cx="48" cy="72" rx="3.5" ry="4.5"/>
      <ellipse class="map-lake" cx="60" cy="82" rx="4.5" ry="3.4"/>
      <ellipse class="map-lake" cx="88" cy="56" rx="4.1" ry="3.9"/>
      <ellipse class="map-lake" cx="64" cy="22" rx="3.2" ry="3.3"/>
      <g class="map-mountains">
        <path d="M14 39 L16 34 L19 40 Z"/>
        <path d="M18 41 L21 35 L24 42 Z"/>
        <path d="M74 47 L77 40 L80 47 Z"/>
        <path d="M81 49 L84 42 L88 49 Z"/>
        <path d="M89 84 L92 77 L96 85 Z"/>
      </g>
      <g class="map-grid">
        <path d="M14 9 V95 M27 9 V96 M40 8 V96 M53 8 V95 M66 8 V95 M79 8 V96 M92 8 V95"/>
        <path d="M2 20 H97 M2 32 H97 M2 44 H97 M2 56 H97 M2 68 H97 M2 80 H97 M2 92 H97"/>
      </g>
    </svg>
    ${regions.map(([name, left, top]) => `<span class="map-region-label" style="left:${left}%;top:${top}%">${esc(name)}</span>`).join("")}
  `;
}

function renderMap() {
  let markers = mapMarkers
    .filter((m) => state.mapFilter === "all" || m.category === state.mapFilter)
    .filter((m) => includesQuery(m, ["name", "category", "detail"]));
  const selectedMarker = markerByKey.get(state.selectedMarkerKey);
  if (selectedMarker && !markers.some((m) => m.key === selectedMarker.key)) {
    markers = [selectedMarker, ...markers];
  }
  const selected = state.selectedMarkerKey && markers.some((m) => m.key === state.selectedMarkerKey)
    ? markerByKey.get(state.selectedMarkerKey)
    : null;
  return `
    <div class="map-layout">
      <div class="map-frame label-map vector-map" aria-label="逆天问道地图">
        ${renderVectorMapArt()}
        ${selected ? `<span class="map-focus-ring ${esc(selected.category)}" style="left:${selected.left}%;top:${selected.top}%" aria-hidden="true"></span>` : ""}
        ${markers.map((m) => `
          <button class="map-label ${esc(m.category)} ${state.selectedMarkerKey === m.key ? "selected" : ""}" style="left:${m.left}%;top:${m.top}%" data-marker-key="${esc(m.key)}" title="${esc(m.name)}">
            ${esc(m.name)}
          </button>
        `).join("")}
      </div>
      ${renderMapDetail(selected)}
    </div>
  `;
}

const YAOYANG_VISIBLE_MAX_LAYER = 15;

function yaoyangVisibleLabel(label) {
  return String(label || "").replace(/第15层以上/g, "第15层");
}

function yaoyangStageRange(stage) {
  const from = Number(stage.from || 0);
  const to = Math.min(Number(stage.to || from), YAOYANG_VISIBLE_MAX_LAYER);
  return from === to ? `${fmtNum(from)}层` : `${fmtNum(from)}-${fmtNum(to)}层`;
}

function renderYaoyang() {
  const data = DATA.yaoyang;
  if (!data || !data.unit) return empty("没有解析到幺阳诛魔阵数据");
  const unit = data.unit;
  const layers = (data.layers || []).filter((layer) => {
    if (Number(layer.layer || 0) > YAOYANG_VISIBLE_MAX_LAYER) return false;
    if (!state.query) return true;
    const q = state.query.toLowerCase();
    return JSON.stringify(layer).toLowerCase().includes(q);
  });
  const dropStages = (data.dropStages || [])
    .filter((stage) => Number(stage.from || 0) <= YAOYANG_VISIBLE_MAX_LAYER)
    .map((stage) => ({
      ...stage,
      label: yaoyangVisibleLabel(stage.label),
      to: Math.min(Number(stage.to || stage.from || 0), YAOYANG_VISIBLE_MAX_LAYER),
      drops: (stage.drops || []).map((drop) => ({ ...drop, source: yaoyangVisibleLabel(drop.source) })),
    }));
  const scrolls = (data.scrolls || []).map((entry) => ({
    ...entry,
    dropStages: unique((entry.dropStages || []).map(yaoyangVisibleLabel)),
  }));
  const mechanics = [
    `仅展示 1-${YAOYANG_VISIBLE_MAX_LAYER} 层数据。`,
    ...(data.mechanics || []).filter((text) => !/20层后|50层|封顶/.test(text)),
  ];
  return `
    <section class="yaoyang-hero">
      <div class="yaoyang-title">
        ${icon(unit.icon, unit.name)}
        <div>
          <h2>${esc(unit.name)}</h2>
          <div class="meta-line compact">
            <span class="pill">基础 HP ${fmtNum(unit.hp)}</span>
            <span class="pill">法力 ${fmtNum(unit.mana)}</span>
            <span class="pill">防御 ${fmtNum(unit.defense)}</span>
            <span class="pill">刷新 ${esc(unit.respawnTime || "无")}</span>
            <span class="pill">展示 1-${fmtNum(YAOYANG_VISIBLE_MAX_LAYER)} 层</span>
            ${mapButtonByUnit(unit.id)}
          </div>
        </div>
      </div>
      <div class="yaoyang-notes">
        ${mechanics.map((text) => `<p>${esc(text)}</p>`).join("")}
      </div>
    </section>

    <section class="section-band">
      <h2>层级属性</h2>
      <div class="table-wrap layer-table">
        <table>
          <thead>
            <tr>
              <th>层数</th>
              <th>生命上限</th>
              <th>幺阳弹道</th>
              <th>物理攻击光环</th>
              <th>周期伤害</th>
              <th>掉落</th>
            </tr>
          </thead>
          <tbody>
            ${layers.map((layer) => `
              <tr>
                <td><strong>${fmtNum(layer.layer)}</strong><small>${esc(yaoyangVisibleLabel(layer.dropStage))}</small></td>
                <td>${fmtNum(layer.maxHp)}<small>生命补正 +${fmtNum(layer.hpBonus)}</small></td>
                <td>${fmtStat(layer.projectileDamage)}<small>${layer.layer > 20 ? "20级封顶" : `技能${layer.projectileLevel}级`}</small></td>
                <td>+${fmtNum(layer.attackAuraPercent)}%<small>${layer.layer > 20 ? "20级封顶" : `技能${layer.projectileLevel}级`}</small></td>
                <td>${esc(layer.periodicDamageText)}<small>每5秒 · 1000码</small></td>
                <td class="drop-text">${esc(layer.dropsText)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>

    <section class="section-band">
      <h2>掉落阶段</h2>
      <div class="drop-stage-grid">
        ${dropStages.map((stage) => `
          <article class="drop-stage-card">
            <header>
              <h3>${esc(stage.label)}</h3>
              <span class="pill">${esc(yaoyangStageRange(stage))}</span>
            </header>
            ${dropList(stage.drops)}
          </article>
        `).join("")}
      </div>
    </section>

    <section class="section-band">
      <h2>制作券与成品</h2>
      <div class="scroll-grid">
        ${scrolls.map((entry) => `
          <article class="scroll-card">
            <header>
              ${icon(entry.scroll.icon, entry.scroll.name)}
              <div>
                <h3>${esc(entry.scroll.name)}</h3>
                <span class="muted">掉落：${esc((entry.dropStages || []).join(" / ") || "未解析")}</span>
              </div>
            </header>
            <div class="scroll-product">
              <span class="muted">合成成品</span>
              ${itemButton(entry.product)}
            </div>
            <div class="stats-list">
              ${(entry.product.stats || []).map((stat) => `<span class="pill">${esc(stat)}</span>`).join("") || `<span class="muted">成品未写入属性</span>`}
            </div>
            <div class="recipe-block">
              <div class="recipe-meta"><span class="pill">材料</span><span class="pill">${esc(entry.product.quality || "")}</span></div>
              <div class="mini-list material-list">${(entry.scroll.materials || []).map(itemButton).join("")}</div>
            </div>
            <p class="copy">${esc(compactText(entry.product.description, 300))}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function bossTierText(tier) {
  if (!tier || tier === "无掉落") return "无固定掉落";
  if (["其他", "材料", "制作券", "消耗", "任务"].includes(tier)) return `${tier}掉落`;
  return `${tier}级 Boss`;
}

function bossTierClass(tier) {
  return ["Q", "特殊", "Z", "神器", "MAX", "SSS", "SS", "S", "A", "B", "C", "D", "任务", "材料", "制作券", "消耗"].includes(tier) ? tier : "其他";
}

function renderTierGroups(units, options = {}) {
  const groups = new Map();
  units.forEach((unit) => {
    const tier = unit.dropTier || "其他";
    if (!groups.has(tier)) groups.set(tier, []);
    groups.get(tier).push(unit);
  });
  return Array.from(groups.entries()).map(([tier, group]) => `
    <div class="boss-tier-block">
      <div class="boss-tier-head">
        <h3>${esc(bossTierText(tier))}</h3>
        <span class="pill ${qualityClass(bossTierClass(tier))}">${group.length} 个</span>
      </div>
      <div class="grid ${options.small ? "creep-grid" : ""}">
        ${group.map((unit) => renderDropUnitCard(unit, options)).join("")}
      </div>
    </div>
  `).join("");
}

function renderDropUnitCard(unit, { small = false, event = false } = {}) {
  const locationText = unit.locationCount ? `${unit.locationCount} 处` : "无固定点";
  const subtitle = event
    ? `第 ${fmtNum(unit.wave)} 波 · ${bossTierText(unit.dropTier)} · Lv ${fmtNum(unit.level)}`
    : `${small ? "小怪掉落" : bossTierText(unit.dropTier)} · 强度 ${fmtNum(unit.rank || unit.strength)} · Lv ${fmtNum(unit.level)} · ${locationText}`;
  const drops = dropList(unit.drops || []);
  return `
    <article class="boss-card ${small ? "creep-card" : ""} ${event ? "event-boss-card" : ""}">
      <header>
        ${icon(unit.icon, unit.name)}
        <div>
          <h3>${esc(unit.name)}</h3>
          <span class="muted">${esc(subtitle)}</span>
        </div>
        <span class="pill quality 任务">HP ${fmtNum(unit.hp)}</span>
      </header>
      <div class="stats-list">
        <span class="pill">防御 ${fmtNum(unit.defense)}</span>
        ${event ? `<span class="pill">进攻波次 ${fmtNum(unit.wave)}</span>` : `<span class="pill">刷新 ${esc(unit.respawnTime || "无")}</span>`}
        <span class="pill">掉落 ${mergeDrops(unit.drops || []).length}</span>
        <span class="pill ${qualityClass(bossTierClass(unit.dropTier))}">${esc(bossTierText(unit.dropTier))}</span>
        ${(unit.relatedUnits || []).length ? `<span class="pill">关联单位 ${unit.relatedUnits.length}</span>` : ""}
        ${event ? "" : mapButtonByUnit(unit.id)}
      </div>
      ${(unit.relatedUnits || []).length ? relatedUnitChips(unit.relatedUnits) : ""}
      ${drops || `<p class="empty-note">未解析到固定掉落</p>`}
    </article>
  `;
}

function renderBosses() {
  const smallDropUnitsAll = DATA.smallDropUnits || [];
  const bossEventsAll = DATA.bossEvents || [];
  const bosses = DATA.bosses.filter((boss) => includesQuery(boss, ["name", "summary", "drops"]));
  const smallDropUnits = smallDropUnitsAll.filter((unit) => includesQuery(unit, ["name", "summary", "drops"]));
  const bossEvents = bossEventsAll.filter((unit) => includesQuery(unit, ["name", "eventName", "summary", "drops"]));
  return `
    <div class="toolbar">
      <span class="pill">Boss ${bosses.length} / ${DATA.bosses.length}</span>
      <span class="pill">小怪掉落 ${smallDropUnits.length} / ${smallDropUnitsAll.length}</span>
      <span class="pill">按掉落档位从强到弱</span>
      <span class="pill">进攻 Boss ${bossEvents.length} / ${bossEventsAll.length}</span>
    </div>
    <section class="section-band boss-page">
      <h2>Boss / 副本 Boss</h2>
      ${renderTierGroups(bosses) || empty("没有匹配的 Boss")}
    </section>
    <section class="section-band boss-page">
      <h2>小怪掉落</h2>
      ${renderTierGroups(smallDropUnits, { small: true }) || empty("没有匹配的小怪掉落")}
    </section>
    <section class="section-band boss-page">
      <h2>仙府进攻 Boss</h2>
      <div class="grid">
        ${bossEvents.map((eventBoss) => renderDropUnitCard(eventBoss, { event: true })).join("") || empty("没有匹配的仙府进攻 Boss")}
      </div>
    </section>
  `;
}

function renderTasks() {
  const tasks = DATA.tasks.filter((task) => includesQuery(task, ["title", "npc", "objective", "text", "rewards", "rewardText"]));
  return `
    <div class="toolbar">
      <span class="pill">任务 ${tasks.length} / ${DATA.tasks.length}</span>
      <span class="pill">奖励 ${tasks.filter((task) => (task.rewards || []).length || (task.rewardText || []).length).length}</span>
    </div>
    <div class="grid">
      ${tasks.map((task) => `
        <article class="task-card">
          <header>
            <div>
              <h3>${esc(task.title)}</h3>
              <span class="muted">任务NPC：${esc(task.npc || "未解析")}</span>
            </div>
          </header>
          <div class="task-info-grid">
            <span>NPC</span>
            <div><strong>${esc(task.npc || "未解析")}</strong>${mapButtonByName(task.npc, "地图定位")}</div>
            <span>目标</span>
            <p>${esc(task.objective || task.title)}</p>
            <span>奖励</span>
            ${taskRewardList(task)}
          </div>
          <p class="copy task-raw">${esc(task.text)}</p>
        </article>
      `).join("") || empty("没有匹配的任务")}
    </div>
  `;
}

function renderShops() {
  const shops = DATA.shops.filter((shop) => includesQuery(shop, ["name", "kind", "items"]));
  return `
    <div class="toolbar">
      <span class="pill">装备商店 ${shops.length} / ${DATA.shops.length}</span>
      <span class="pill">仅含装备出售与装备合成/兑换</span>
      <span class="pill">商品可点击查看来源与合成材料</span>
    </div>
    <div class="shop-grid">
      ${shops.map((shop) => `
        <article class="shop-card">
          <header>
            ${icon(shop.icon, shop.name)}
            <div>
              <h3>${esc(shop.name)}</h3>
              <span class="muted">${esc(shop.kind || "装备商店")} · ${shop.locationCount ? `${shop.locationCount} 个地图点` : "无固定点位"}</span>
            </div>
            <span class="pill">${shop.items.length} 件</span>
          </header>
          <div class="stats-list">
            ${shop.saleCount ? `<span class="pill">出售 ${shop.saleCount}</span>` : ""}
            ${shop.recipeCount ? `<span class="pill">合成 ${shop.recipeCount}</span>` : ""}
            ${mapButtonByUnit(shop.id)}
          </div>
          <div class="mini-list goods-list">
            ${shop.items.map(itemButton).join("")}
          </div>
        </article>
      `).join("") || empty("没有匹配的商店")}
    </div>
  `;
}

const professionOrder = ["nth0", "nth1", "ncnt"];

function professionFacts(prof) {
  const facts = unique((prof.facts || []).map((fact) => String(fact || "").trim()));
  if (facts.length) return facts;
  return unique(String(prof.description || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line && !/^(需求道具|技能属性|技能强化)[：:]?/.test(line)));
}

function groupProfessions(professions) {
  const groups = new Map();
  professions.forEach((prof) => {
    const ids = prof.sourceUnitIds?.length ? prof.sourceUnitIds : [""];
    const labels = prof.sourceNpcs?.length ? prof.sourceNpcs : ["副职导师"];
    const categories = prof.sourceCategories || [];
    ids.forEach((unitId, index) => {
      const label = labels[index] || labels[0] || "副职导师";
      const key = unitId || label;
      if (!groups.has(key)) {
        groups.set(key, {
          key,
          unitId,
          label,
          category: categories[index] || categories[0] || "",
          items: [],
        });
      }
      groups.get(key).items.push(prof);
    });
  });
  return Array.from(groups.values())
    .sort((a, b) => {
      const ai = professionOrder.indexOf(a.unitId);
      const bi = professionOrder.indexOf(b.unitId);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi) || a.label.localeCompare(b.label, "zh-Hans-CN");
    });
}

function renderProfessions() {
  const professions = DATA.professions.filter((prof) => includesQuery(prof, ["name", "description", "facts", "sourceNpcs"]));
  const groups = groupProfessions(professions);
  return `
    <div class="toolbar">
      <span class="pill">副职技能 ${professions.length} / ${DATA.professions.length}</span>
      <span class="pill">导师分类 ${groups.length}</span>
    </div>
    <div class="profession-group-stack">
      ${groups.map((group) => `
        <section class="profession-group">
          <header class="profession-group-head">
            <div>
              <h2>${esc(group.label)}</h2>
              <span class="muted">${esc(group.category || "副职技能")} · ${group.items.length} 个技能</span>
            </div>
            ${group.unitId ? mapButtonByUnit(group.unitId, "地图定位") : mapButtonByName(group.label, "地图定位")}
          </header>
          <div class="profession-grid">
            ${group.items.map((prof) => {
              const facts = professionFacts(prof);
              return `
                <article class="skill-card profession-card">
                  <header>
                    ${icon(prof.icon, prof.name, "skill-icon")}
                    <div>
                      <h3>${esc(prof.name)}</h3>
                      <span class="muted">${esc(group.category || "副职技能")}</span>
                    </div>
                  </header>
                  <div class="skill-fact-list">
                    ${facts.slice(0, 8).map((fact) => `
                      <span class="skill-fact"><span class="skill-bullet">◆</span>${esc(fact)}</span>
                    `).join("") || `<span class="muted">未写入副职说明</span>`}
                  </div>
                </article>
              `;
            }).join("")}
          </div>
        </section>
      `).join("") || empty("没有匹配的副职")}
    </div>
  `;
}

function renderRaw() {
  const filtered = DATA.raw.units
    .filter((unit) => includesQuery(unit, ["name", "tip", "ubers", "unitRole", "parentBossName", "relatedUnits"]));
  const rows = filtered
    .filter((unit) => state.query || (!unit.parentBossId && !String(unit.unitRole || "").startsWith("系统单位")))
    .sort((a, b) => (b.level || 0) - (a.level || 0))
    .slice(0, 500);
  const mergedCount = filtered.length - rows.length;
  return `
    <div class="toolbar">
      <span class="pill">显示 ${rows.length} / ${DATA.raw.units.length}</span>
      <span class="pill">按等级排序</span>
      ${mergedCount ? `<span class="pill">已合并/隐藏系统单位 ${mergedCount}</span>` : ""}
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>图标</th><th>名称</th><th>等级</th><th>生命</th><th>防御</th><th>刷新时间</th></tr></thead>
        <tbody>
          ${rows.map((unit) => `
            <tr>
              <td>${icon(unit.iconPath, unit.name, "table-icon")}</td>
              <td>
                <div class="unit-name-cell">
                  <strong>${esc(unit.name)}</strong>
                  ${unit.unitRole ? `<span class="pill unit-role">${esc(unit.unitRole)}</span>` : ""}
                  ${unit.parentBossName ? `<small>归属：${esc(unit.parentBossName)}</small>` : ""}
                  ${(unit.relatedUnits || []).length ? `<small>关联单位：${unit.relatedUnits.map((child) => `${child.name}${child.locationCount ? ` x${child.locationCount}` : ""}`).join(" / ")}</small>` : ""}
                </div>
              </td>
              <td>${fmtNum(unit.level)}</td>
              <td>${fmtNum(unit.hp)}</td>
              <td>${fmtNum(unit.defense)}</td>
              <td>${esc(unit.respawnTime || "无")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function empty(text) {
  return `<div class="empty">${esc(text)}</div>`;
}

function materialMatchesItem(material, item) {
  const ref = resolveItemRef(material);
  const materialKeys = [ref?.key, ref?.name, material?.key, material?.name]
    .map(textKey)
    .filter(Boolean);
  const itemKeys = [item.key, item.name].map(textKey).filter(Boolean);
  return materialKeys.some((key) => itemKeys.includes(key));
}

function recipeMaterialScore(recipe) {
  return (recipe.materials || []).reduce((score, material) => {
    const ref = resolveItemRef(material);
    return score + (ref?.key ? 2 : ref?.name ? 1 : 0);
  }, 0);
}

function recipeMaterialKey(recipe) {
  return (recipe.materials || [])
    .map((material) => {
      const ref = resolveItemRef(material);
      return textKey(ref?.key || ref?.name || material.key || material.name);
    })
    .filter(Boolean)
    .sort()
    .join("+");
}

function mergeRecipes(recipes = []) {
  const merged = new Map();
  recipes.forEach((recipe) => {
    const key = [
      recipe.type || "合成",
      textKey(recipe.npc || ""),
      recipeMaterialKey(recipe),
      recipeProvidesItem({ key: "__dummy__", name: "__dummy__" }, recipe) ? "provide" : "self",
    ].join("|");
    if (!merged.has(key)) {
      merged.set(key, { ...recipe, chances: [] });
    }
    const target = merged.get(key);
    if (recipeMaterialScore(recipe) > recipeMaterialScore(target)) {
      target.materials = recipe.materials || [];
      target.text = recipe.text || target.text;
      target.recipeItem = recipe.recipeItem || target.recipeItem;
    }
    const chance = String(recipe.chance || "").trim();
    if (chance && !target.chances.includes(chance)) target.chances.push(chance);
  });
  return Array.from(merged.values()).map((recipe) => ({
    ...recipe,
    chance: recipe.chances.length ? recipe.chances.join(" / ") : recipe.chance,
  }));
}

function qualityPower(quality) {
  const index = qualityOrder.indexOf(quality);
  return index === -1 ? 0 : qualityOrder.length - index;
}

function materialRefFromRaw(material) {
  const raw = rawItemById.get(material.id);
  const group = itemGroupByRawId.get(material.id) || itemByKey.get(material.key) || itemByKey.get(material.name);
  return {
    id: material.id || raw?.id || "",
    key: group?.key || material.key || textKey(material.name),
    name: raw?.name || group?.name || material.name || "",
    icon: raw?.iconPath || group?.icon || material.icon || "assets/preview.png",
    quality: raw?.quality || group?.quality || material.quality || "",
    isVariant: !!raw && !!group && (group.variants || []).length > 1,
  };
}

function materialButton(material, currentItem = null) {
  const ref = materialRefFromRaw(material);
  if (currentItem && ref.isVariant && textKey(ref.name) === textKey(currentItem.name)) {
    return variantButton(ref);
  }
  return itemButton(ref);
}

function isUpgradeSource(source) {
  return /合成|升级|强化|宝石|狩猎强化/.test(source?.type || "");
}

function upgradeTransitionsFor(item) {
  const variantIds = new Set((item.variants || []).map((variant) => variant.id));
  if (!variantIds.size) return [];
  const transitions = new Map();

  (item.variants || []).forEach((variant) => {
    const productRaw = rawItemById.get(variant.id);
    if (!productRaw) return;
    (productRaw.sources || []).forEach((source) => {
      if (!isUpgradeSource(source)) return;
      const materials = source.materials || [];
      const fromMaterial = materials.find((material) => {
        const raw = rawItemById.get(material.id);
        return raw && raw.id !== productRaw.id && variantIds.has(raw.id) && textKey(raw.name) === textKey(productRaw.name);
      });
      if (!fromMaterial) return;
      const fromRaw = rawItemById.get(fromMaterial.id);
      const key = [
        fromRaw.id,
        productRaw.id,
        source.chance || "",
        materials.map((material) => material.id || material.name).join("+"),
      ].join("|");
      if (!transitions.has(key)) {
        transitions.set(key, {
          from: variantRef(fromRaw),
          to: variantRef(productRaw),
          materials: materials.map(materialRefFromRaw),
          source: source.source || source.type || "装备升级",
          type: source.type || "升级/强化",
          chance: source.chance || "",
          text: source.recipeText || materials.map((material) => material.name).filter(Boolean).join(" + "),
        });
      }
    });
  });

  return Array.from(transitions.values())
    .sort((a, b) => qualityPower(a.from.quality) - qualityPower(b.from.quality) || qualityPower(a.to.quality) - qualityPower(b.to.quality));
}

function renderUpgradeTransitions(item) {
  const transitions = upgradeTransitionsFor(item);
  if (!transitions.length) return "";
  return `
    <h3>升级/强化</h3>
    <div class="upgrade-list">
      ${transitions.map((upgrade) => `
        <div class="recipe-block upgrade-block">
          <div class="recipe-meta">
            <span class="pill">升级/强化</span>
            ${upgrade.source ? `<span class="pill">${esc(upgrade.source)}</span>${mapButtonByName(upgrade.source)}` : ""}
            ${upgrade.chance ? `<span class="pill">成功率 ${esc(upgrade.chance)}</span>` : ""}
          </div>
          <div class="upgrade-flow">
            <div>
              <span class="source-meta">当前档位</span>
              ${variantButton(upgrade.from)}
            </div>
            <span class="upgrade-arrow">→</span>
            <div>
              <span class="source-meta">升级后装备</span>
              ${variantButton(upgrade.to)}
            </div>
          </div>
          <div class="mini-list material-list">
            ${upgrade.materials.map((material) => material.isVariant && textKey(material.name) === textKey(item.name) ? variantButton(material) : itemButton(material)).join("")}
          </div>
          ${upgrade.text ? `<p class="copy">${esc(upgrade.text)}</p>` : ""}
        </div>
      `).join("")}
    </div>
  `;
}

function craftRelations(item) {
  const creationRecipes = mergeRecipes(item.recipes || []).filter((recipe) => recipeProvidesItem(item, recipe));
  const componentMap = new Map();
  creationRecipes.forEach((recipe) => {
    (recipe.materials || []).forEach((material) => {
      if (materialMatchesItem(material, item)) return;
      const ref = resolveItemRef(material);
      const key = ref?.key || textKey(ref?.name || material.name || material.key);
      if (key && !componentMap.has(key)) {
        componentMap.set(key, { ...material, key: ref.key, name: ref.name, icon: ref.icon, quality: ref.quality });
      }
    });
  });

  const upgradeMap = new Map();
  DATA.items.forEach((product) => {
    if (product.key === item.key) return;
    mergeRecipes(product.recipes || []).forEach((recipe) => {
      if (!recipeProvidesItem(product, recipe)) return;
      if (!(recipe.materials || []).some((material) => materialMatchesItem(material, item))) return;
      const key = `${product.key}|${textKey(recipe.npc || "")}`;
      const candidate = { product, recipe };
      const existing = upgradeMap.get(key);
      if (!existing || recipeMaterialScore(recipe) > recipeMaterialScore(existing.recipe)) {
        upgradeMap.set(key, candidate);
      }
    });
  });

  return {
    components: Array.from(componentMap.values()),
    upgrades: Array.from(upgradeMap.values())
      .sort((a, b) => (qualityOrder.indexOf(a.product.quality) - qualityOrder.indexOf(b.product.quality)) || a.product.name.localeCompare(b.product.name, "zh-Hans")),
  };
}

function renderCraftRelations(item) {
  const relations = craftRelations(item);
  if (!relations.components.length && !relations.upgrades.length) return "";
  return `
    <h3>关联装备</h3>
    <div class="craft-relation-grid">
      ${relations.components.length ? `
        <section class="craft-relation-card">
          <h4>合成它需要</h4>
          <div class="mini-list material-list">${relations.components.map(itemButton).join("")}</div>
        </section>
      ` : ""}
      ${relations.upgrades.length ? `
        <section class="craft-relation-card">
          <h4>可继续合成</h4>
          <div class="relation-upgrade-list">
            ${relations.upgrades.map(({ product, recipe }) => `
              <div class="recipe-block relation-upgrade">
                <div class="recipe-meta">
                  ${itemButton(product)}
                  ${recipe.npc ? `<span class="pill">${esc(recipe.npc)}</span>${mapButtonByName(recipe.npc)}` : ""}
                </div>
                ${(recipe.materials || []).length ? `<div class="mini-list material-list">${recipe.materials.map(itemButton).join("")}</div>` : ""}
              </div>
            `).join("")}
          </div>
        </section>
      ` : ""}
    </div>
  `;
}

function recipeBlock(recipe) {
  return `
    <div class="recipe-block">
      <div class="recipe-meta">
        <span class="pill">${esc(recipe.type || "合成")}</span>
        ${recipe.npc ? `<span class="pill">${esc(recipe.npc)}</span>${mapButtonByName(recipe.npc)}` : ""}
        ${recipe.chance ? `<span class="pill">成功率 ${esc(recipe.chance)}</span>` : ""}
      </div>
      ${(recipe.materials || []).length ? `
        <div class="mini-list material-list">${recipe.materials.map((m) => itemButton(m)).join("")}</div>
      ` : ""}
      ${recipe.text ? `<p class="copy">${esc(compactText(recipe.text, 260))}</p>` : ""}
    </div>
  `;
}

function sameDetail(left, right) {
  return !!left && !!right && left.type === right.type && left.key === right.key;
}

function detailBackButton() {
  if (!detailHistory.length) return "";
  return `<button class="icon-button detail-back-button" data-detail-back title="返回上一页" aria-label="返回上一页">←</button>`;
}

function closeDetailPanel() {
  const panel = $("#detail");
  panel.hidden = true;
  currentDetail = null;
  detailHistory = [];
}

function bindDetailPanelControls(panel) {
  panel.querySelectorAll("[data-detail-back]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const previous = detailHistory.pop();
      if (!previous) return;
      renderDetail(previous.type, previous.key, { pushHistory: false });
    });
  });
  panel.querySelectorAll("[data-detail-close]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      closeDetailPanel();
    });
  });
}

function renderVariantSources(raw) {
  const sources = raw.sources || [];
  if (!sources.length) return empty("没有解析到来源");
  return `
    <div class="source-list">
      ${sources.map((source) => `
        <div class="source-card">
          <span class="source-dot"></span>
          <div class="source-main">
            <strong>${esc(source.type || "来源")}：${esc(source.source || "未解析")}</strong>
            ${source.chance ? `<span class="source-meta">概率 ${esc(source.chance)}</span>` : ""}
            ${source.recipeText ? `<p>${esc(source.recipeText)}</p>` : ""}
            ${(source.materials || []).length ? `
              <div class="mini-list material-list">${source.materials.map((material) => materialButton(material, raw)).join("")}</div>
            ` : ""}
          </div>
          <div class="source-actions">
            ${mapButtonByName(source.source, "地图定位")}
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderVariantDetailPanel(raw) {
  const group = itemGroupByRawId.get(raw.id);
  const description = raw.ubers || raw.description || "";
  return `
    <div class="detail-card">
      <div class="detail-head">
        <div class="detail-title">
          ${icon(raw.iconPath || raw.icon, raw.name)}
          <div>
            <h2>${esc(raw.name)}</h2>
            <span class="muted">${esc(raw.type || "未分类")} · 精确档位</span>
          </div>
        </div>
        <div class="detail-actions">
          <span class="pill ${qualityClass(raw.quality)}">${esc(raw.quality || "其他")}</span>
          ${detailBackButton()}
          <button class="icon-button" data-detail-close aria-label="关闭">×</button>
        </div>
      </div>
      <div class="detail-body">
        <h3>属性</h3>
        <div class="stats-list">${(raw.stats || []).map((stat) => `<span class="pill">${esc(stat)}</span>`).join("") || `<span class="muted">没有解析到数值属性</span>`}</div>
        ${description ? `<p class="copy">${esc(description)}</p>` : ""}
        ${group ? `
          <h3>同名装备</h3>
          <div class="mini-list">${itemButton(group)}</div>
          ${renderItemSetSection(group)}
        ` : ""}
        <h3>来源</h3>
        ${renderVariantSources(raw)}
      </div>
    </div>
  `;
}

function renderTaskDetailPanel(task) {
  const marker = firstMarkerForName(task.npc);
  return `
    <div class="detail-card">
      <div class="detail-head">
        <div class="detail-title">
          ${icon(marker?.icon, task.npc || task.title)}
          <div>
            <h2>${esc(task.title)}</h2>
            <span class="muted">任务NPC：${esc(task.npc || "未解析")}</span>
          </div>
        </div>
        <div class="detail-actions">
          ${detailBackButton()}
          <button class="icon-button" data-detail-close aria-label="关闭">×</button>
        </div>
      </div>
      <div class="detail-body">
        <h3>任务NPC</h3>
        <div class="stats-list">
          <span class="pill">${esc(task.npc || "未解析")}</span>
          ${mapButtonByName(task.npc, "地图定位")}
        </div>
        <h3>任务目标</h3>
        <p class="copy">${esc(task.objective || task.title)}</p>
        <h3>任务奖励</h3>
        ${taskRewardList(task) || empty("未解析到奖励")}
        ${task.text ? `
          <h3>任务原文</h3>
          <p class="copy">${esc(task.text)}</p>
        ` : ""}
      </div>
    </div>
  `;
}

function renderDetail(type, key, options = {}) {
  const panel = $("#detail");
  const nextDetail = { type, key };
  const shouldPush = options.pushHistory !== false && !panel.hidden && currentDetail && !sameDetail(currentDetail, nextDetail);

  if (type === "variant") {
    const raw = rawItemById.get(key);
    if (!raw) return;
    if (shouldPush) detailHistory.push(currentDetail);
    currentDetail = nextDetail;
    panel.innerHTML = renderVariantDetailPanel(raw);
    panel.hidden = false;
    bindDetailPanelControls(panel);
    bindDynamicControls(panel);
    return;
  }
  if (type === "task") {
    const task = taskById.get(key) || taskByTitle.get(textKey(key));
    if (!task) return;
    if (shouldPush) detailHistory.push(currentDetail);
    currentDetail = nextDetail;
    panel.innerHTML = renderTaskDetailPanel(task);
    panel.hidden = false;
    bindDetailPanelControls(panel);
    bindDynamicControls(panel);
    return;
  }
  if (type !== "item") return;
  const item = itemByKey.get(key);
  if (!item) return;
  if (shouldPush) detailHistory.push(currentDetail);
  currentDetail = nextDetail;
  const mergedItemRecipes = mergeRecipes(item.recipes || []);
  const craftRecipes = mergedItemRecipes.filter((recipe) => recipeProvidesItem(item, recipe));
  panel.innerHTML = `
    <div class="detail-card">
      <div class="detail-head">
        <div class="detail-title">
          ${icon(item.icon, item.name)}
          <div>
            <h2>${esc(item.name)}</h2>
            <span class="muted">${esc(item.type || "未分类")}</span>
          </div>
        </div>
        <div class="detail-actions">
          <span class="pill ${qualityClass(item.quality)}">${esc(item.quality)}</span>
          ${detailBackButton()}
          <button class="icon-button" data-detail-close aria-label="关闭">×</button>
        </div>
      </div>
      <div class="detail-body">
        <h3>属性</h3>
        <div class="stats-list">${(item.stats || []).map((stat) => `<span class="pill">${esc(stat)}</span>`).join("") || `<span class="muted">没有解析到数值属性</span>`}</div>
        ${item.description ? `<p class="copy">${esc(item.description)}</p>` : ""}
        ${renderItemSetSection(item)}
        <h3>来源</h3>
        ${renderItemSources(item)}
        ${renderCraftRelations(item)}
        ${renderUpgradeTransitions(item)}
        ${craftRecipes.length ? `
          <h3>合成/兑换</h3>
          <div class="recipe-list">${craftRecipes.map(recipeBlock).join("")}</div>
        ` : ""}
      </div>
    </div>
  `;
  panel.hidden = false;
  bindDetailPanelControls(panel);
  bindDynamicControls(panel);
}

function bindDynamicControls(root = document) {
  root.querySelectorAll("[data-quality]").forEach((button) => {
    button.addEventListener("click", () => {
      state.quality = button.dataset.quality;
      render();
    });
  });
  root.querySelectorAll("[data-set-only]").forEach((button) => {
    button.addEventListener("click", () => {
      state.setOnly = button.dataset.setOnly === "1";
      render();
    });
  });
  root.querySelectorAll("[data-map-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.mapFilter = button.dataset.mapFilter;
      state.selectedMarkerKey = "";
      state.focusedMarkerKey = "";
      render();
    });
  });
  root.querySelectorAll("[data-marker-key]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedMarkerKey = button.dataset.markerKey;
      state.focusedMarkerKey = button.dataset.markerKey;
      render();
    });
  });
  root.querySelectorAll("[data-goto-marker]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const marker = markerByKey.get(button.dataset.gotoMarker);
      if (!marker) return;
      state.view = "map";
      state.mapFilter = "all";
      state.selectedMarkerKey = marker.key;
      state.focusedMarkerKey = marker.key;
      clearGlobalSearch();
      closeDetailPanel();
      render();
    });
  });
  root.querySelectorAll("[data-item-key]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      if (button.dataset.itemKey) renderDetail("item", button.dataset.itemKey);
    });
  });
  root.querySelectorAll("[data-variant-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      if (button.dataset.variantId) renderDetail("variant", button.dataset.variantId);
    });
  });
  root.querySelectorAll("[data-task-key]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      if (button.dataset.taskKey) renderDetail("task", button.dataset.taskKey);
    });
  });
  root.querySelectorAll("[data-open-item]").forEach((card) => {
    card.addEventListener("click", () => renderDetail("item", card.dataset.openItem));
  });
  root.querySelectorAll("[data-view-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.viewJump;
      render();
    });
  });
  root.querySelectorAll("[data-hero-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(`hero-${button.dataset.heroJump}`);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.classList.remove("located");
      void target.offsetWidth;
      target.classList.add("located");
      window.setTimeout(() => target.classList.remove("located"), 1800);
    });
  });
  root.querySelectorAll("[data-guide-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(`guide-${button.dataset.guideJump}`);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.classList.remove("located");
      void target.offsetWidth;
      target.classList.add("located");
      window.setTimeout(() => target.classList.remove("located"), 1800);
    });
  });
  const itemType = $("#itemType");
  if (itemType) itemType.addEventListener("change", () => {
    state.itemType = itemType.value;
    render();
  });
  const sourceType = $("#sourceType");
  if (sourceType) sourceType.addEventListener("change", () => {
    state.sourceType = sourceType.value;
    render();
  });
}

function render() {
  renderNav();
  $("#pageTitle").textContent = titleMap[state.view] || "资料库";
  const renderers = {
    heroes: renderHeroes,
    items: renderItems,
    sets: renderSets,
    guides: renderGuides,
    map: renderMap,
    yaoyang: renderYaoyang,
    bosses: renderBosses,
    tasks: renderTasks,
    shops: renderShops,
    professions: renderProfessions,
    raw: renderRaw,
  };
  $("#content").innerHTML = renderers[state.view]();
  bindDynamicControls();
  focusSelectedMarker();
}

$("#globalSearch").addEventListener("input", (event) => {
  state.query = event.target.value.trim();
  render();
});

$("#detail").addEventListener("click", (event) => {
  if (event.target.id === "detail") closeDetailPanel();
});

render();
