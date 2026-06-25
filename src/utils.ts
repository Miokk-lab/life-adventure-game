// Game avatar and monster illustration mapping utilities
// Uses animal-island-ui item PNGs (488 available items)

// Monster archetype images
import item251 from "animal-island-ui/items/item-251.png"; // 👹 Ogre mask — default/generic monster
import item252 from "animal-island-ui/items/item-252.png"; // 👺 Tengu mask — perfectionism/anxiety
import item106 from "animal-island-ui/items/item-106.png"; // 🦥 Sloth — procrastination
import item105 from "animal-island-ui/items/item-105.png"; // 🐼 Panda — overwork/stress
import item019 from "animal-island-ui/items/item-019.png"; // 🐟 Fish — avoidance/swimming away
import item018 from "animal-island-ui/items/item-018.png"; // 🦋 Bug — nagging thoughts
import item104 from "animal-island-ui/items/item-104.png"; // 🦔 Hedgehog — defensive/prickly
import item107 from "animal-island-ui/items/item-107.png"; // 🐿️ Squirrel — scattered thoughts
import item035 from "animal-island-ui/items/item-035.png"; // 🧸 Teddy bear — comfort/safety issues
import item036 from "animal-island-ui/items/item-036.png"; // 🐰 Rabbit — anxiety/jumpy
import item037 from "animal-island-ui/items/item-037.png"; // 🐻 Bear — heavy/burdensome
import item020 from "animal-island-ui/items/item-020.png"; // 🐦 Bird — fleeting worries
import item253 from "animal-island-ui/items/item-253.png"; // 🪨 Stone — stubborn/stuck
import item060 from "animal-island-ui/items/item-060.png"; // 📱 Phone — screen addiction
import item254 from "animal-island-ui/items/item-254.png"; // 🌑 Shadow — dark thoughts
import item108 from "animal-island-ui/items/item-108.png"; // 🦌 Deer — gentle/shy issues
import item109 from "animal-island-ui/items/item-109.png"; // 🦊 Fox — cunning/tricky
import item112 from "animal-island-ui/items/item-112.png"; // 🐢 Turtle — slow/steady
import item115 from "animal-island-ui/items/item-115.png"; // 🐷 Pig — greed/hoarding
import item255 from "animal-island-ui/items/item-255.png"; // 👻 Ghost — spirit/phantom

// Hero theme images
import item101 from "animal-island-ui/items/item-101.png"; // 🧑‍🌾 Explorer — default hero
import item102 from "animal-island-ui/items/item-102.png"; // ⭐ Star — night/stargazer
import item103 from "animal-island-ui/items/item-103.png"; // 🌸 Flower — gardener
import item070 from "animal-island-ui/items/item-070.png"; // 🌊 Ocean — wave/diver
import item071 from "animal-island-ui/items/item-071.png"; // 🍃 Wind — messenger/breeze
import item072 from "animal-island-ui/items/item-072.png"; // ☀️ Sun — light/warmth
import item073 from "animal-island-ui/items/item-073.png"; // 🌲 Forest — tree/woods

// NPC images
import item012 from "animal-island-ui/items/item-012.png"; // 🍵 Tea mug — default/warm advisor
import item110 from "animal-island-ui/items/item-110.png"; // 🦆 Duck
import item111 from "animal-island-ui/items/item-111.png"; // 🐶 Dog

// Leaf fallback
import item001 from "animal-island-ui/items/item-001.png"; // 🍃 Leaf

// ─── Monster Image Mapping ───────────────────────────────────────

interface ImageRule {
  keywords: string[];
  image: string;
}

const MONSTER_RULES: ImageRule[] = [
  // Specific creature names FIRST (before generic trait keywords)
  { keywords: ["龟", "turtle", "tortoise", "蜗"], image: item112 },
  { keywords: ["猪", "pig", "boar", "肥"], image: item115 },
  { keywords: ["狐", "fox", "狸", "狡猾", "骗", "瞒"], image: item109 },
  { keywords: ["鹿", "deer", "怯", "羞"], image: item108 },
  { keywords: ["松鼠", "squirrel", "散", "囤积"], image: item107 },
  { keywords: ["刺猬", "hedgehog", "扎", "防御"], image: item104 },
  { keywords: ["虫", "bug", "蚁", "insect", "嗡嗡", "爬", "蝇", "fly", "蚊"], image: item018 },
  { keywords: ["鱼", "fish", "鲨", "逃", "躲避", "游"], image: item019 },
  { keywords: ["熊猫", "panda", "黑眼圈"], image: item105 },
  { keywords: ["兔", "bunny", "rabbit", "跳", "惊"], image: item036 },
  { keywords: ["猫", "cat", "喵", "高冷"], image: item035 },
  { keywords: ["熊", "bear", "沉", "怒"], image: item037 },
  { keywords: ["鸟", "bird", "飞", "浮", "飘"], image: item020 },
  // Trait/behavior/object rules (checked after creatures)
  { keywords: ["完美", "完美主义", "perfection"], image: item252 },
  { keywords: ["拖延", "delay", "树懒", "sloth", "迟", "懒"], image: item106 },
  { keywords: ["焦虑", "担心", "慌", "anxiety", "紧张", "不安"], image: item251 },
  { keywords: ["石", "铁", "rock", "固", "僵", "硬", "堵"], image: item253 },
  { keywords: ["手机", "phone", "刷屏", "屏幕", "网", "scroll"], image: item060 },
  { keywords: ["妖", "ghost", "spirit", "phantom", "幽灵", "鬼", "幻"], image: item255 },
  { keywords: ["雾", "黑", "影", "shadow", "dark", "暗", "阴"], image: item254 },
  { keywords: ["熬夜", "加班"], image: item105 },
  { keywords: ["躲藏", "缩"], image: item104 },
  { keywords: ["重", "压"], image: item037 },
  { keywords: ["慢", "壳"], image: item112 },
  { keywords: ["轻"], image: item020 },
  { keywords: ["敏感", "乱"], image: item107 },
];

export function getMonsterImage(name: string = ""): string {
  const norm = name.toLowerCase();
  for (const rule of MONSTER_RULES) {
    if (rule.keywords.some(kw => norm.includes(kw.toLowerCase()))) {
      return rule.image;
    }
  }
  return item251; // Default: ogre mask
}

// ─── Hero Image Mapping ──────────────────────────────────────────

const HERO_RULES: ImageRule[] = [
  { keywords: ["星", "star", "夜", "night", "月", "moon", "观"], image: item102 },
  { keywords: ["花", "园", "flower", "garden", "种", "植", "圃"], image: item103 },
  { keywords: ["海", "波", "wave", "ocean", "浪", "水", "泳", "潜"], image: item070 },
  { keywords: ["风", "wind", "信使", "messenger", "吹", "飘", "轻"], image: item071 },
  { keywords: ["光", "light", "阳", "sun", "暖", "照", "亮", "辉"], image: item072 },
  { keywords: ["森", "forest", "木", "tree", "林", "叶", "绿"], image: item073 },
  { keywords: ["探", "explorer", "adventure", "冒险", "远征", "旅"], image: item101 },
];

export function getHeroImage(identity: string = ""): string {
  const norm = identity.toLowerCase();
  for (const rule of HERO_RULES) {
    if (rule.keywords.some(kw => norm.includes(kw.toLowerCase()))) {
      return rule.image;
    }
  }
  return item101; // Default: explorer villager
}

// ─── NPC Image Mapping ───────────────────────────────────────────

const NPC_RULES: ImageRule[] = [
  { keywords: ["猫头鹰", "owl"], image: item020 },
  { keywords: ["熊猫", "panda"], image: item105 },
  { keywords: ["树懒", "sloth"], image: item106 },
  { keywords: ["考拉", "koala"], image: item106 },
  { keywords: ["松鼠", "squirrel"], image: item107 },
  { keywords: ["兔", "bunny", "rabbit"], image: item036 },
  { keywords: ["猫", "cat", "喵"], image: item035 },
  { keywords: ["熊", "bear", "泰迪"], image: item037 },
  { keywords: ["鸟", "bird", "鹦"], image: item020 },
  { keywords: ["鹿", "deer"], image: item108 },
  { keywords: ["狐", "fox", "狸"], image: item109 },
  { keywords: ["变色龙", "chameleon", "蜥蜴", "lizard"], image: item109 },
  { keywords: ["鸭", "duck"], image: item110 },
  { keywords: ["狗", "dog", "汪"], image: item111 },
  { keywords: ["鱼", "fish"], image: item019 },
  { keywords: ["鲸", "whale", "dolphin", "海豚", "白鲸", "豚"], image: item019 },
  { keywords: ["章鱼", "octopus"], image: item019 },
  { keywords: ["鸡", "chicken", "hen", "rooster", "公鸡", "母鸡"], image: item020 },
  { keywords: ["鸥", "seagull", "gull", "海鸥"], image: item020 },
  { keywords: ["獭", "otter", "海獭", "水獭"], image: item110 },
  { keywords: ["刺猬", "hedgehog"], image: item104 },
  { keywords: ["蜜蜂", "bee", "honey"], image: item018 },
];

export function getNpcImage(name: string = ""): string {
  const norm = name.toLowerCase();
  for (const rule of NPC_RULES) {
    if (rule.keywords.some(kw => norm.includes(kw.toLowerCase()))) {
      return rule.image;
    }
  }
  return item012; // Default: tea mug
}

// Re-export leaf for general use
export { item001 as leafIcon };
