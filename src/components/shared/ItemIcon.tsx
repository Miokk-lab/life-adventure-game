import React from "react";

// Import corresponding high-quality assets from animal-island-ui items directory
import item001 from "animal-island-ui/items/item-001.png"; // 🍃 Leaf (classic AC leaf)
import item002 from "animal-island-ui/items/item-002.png"; // 🍂 Dried/fall leaf
import item003 from "animal-island-ui/items/item-003.png"; // 🌱 sprout/sapling
import item004 from "animal-island-ui/items/item-004.png"; // 🌲 Pine tree
import item005 from "animal-island-ui/items/item-005.png"; // 🌿 Weeds/herbs
import item006 from "animal-island-ui/items/item-006.png"; // 🌸 Sakura blossom
import item010 from "animal-island-ui/items/item-010.png"; // 🍊 Orange
import item012 from "animal-island-ui/items/item-012.png"; // 🍵 Mug cup/tea
import item035 from "animal-island-ui/items/item-035.png"; // 🧸 Teddy bear
import item040 from "animal-island-ui/items/item-040.png"; // 🌟 Star fragment (yellow)
import item041 from "animal-island-ui/items/item-041.png"; // ☁ Cloud / soft sphere
import item042 from "animal-island-ui/items/item-042.png"; // ⭐ Regular star / wish star
import item044 from "animal-island-ui/items/item-044.png"; // 🌬 Wind storm
import item045 from "animal-island-ui/items/item-045.png"; // 🏆 Trophy (shiny)
import item048 from "animal-island-ui/items/item-048.png"; // 🏅 Gold medal
import item050 from "animal-island-ui/items/item-050.png"; // 🧺 Bamboo basket
import item060 from "animal-island-ui/items/item-060.png"; // 💛 Gold heart / heart
import item061 from "animal-island-ui/items/item-061.png"; // 🔍 Nook lens
import item062 from "animal-island-ui/items/item-062.png"; // 💡 Bulb / lightbulb
import item066 from "animal-island-ui/items/item-066.png"; // ✏ Wood pencil
import item068 from "animal-island-ui/items/item-068.png"; // 🛠 Toolbox / shovel
import item071 from "animal-island-ui/items/item-071.png"; // 📊 Chart board
import item075 from "animal-island-ui/items/item-075.png"; // 🧠 Smart head / brain
import item081 from "animal-island-ui/items/item-081.png"; // 🧘 Zen cushion / yoga
import item101 from "animal-island-ui/items/item-101.png"; // 🧑‍🌾 Straw hat farmer
import item105 from "animal-island-ui/items/item-105.png"; // 🐼 Panda doll
import item106 from "animal-island-ui/items/item-106.png"; // 🦥 Sloth doll
import item110 from "animal-island-ui/items/item-110.png"; // 🐾 Paw slippers/boots
import item113 from "animal-island-ui/items/item-113.png"; // ⚡ Zap lightning item
import item115 from "animal-island-ui/items/item-115.png"; // ⚠️ Warning sign
import item120 from "animal-island-ui/items/item-120.png"; // ❌ Cross sign / cancel
import item125 from "animal-island-ui/items/item-125.png"; // ✓ Checkmark sign / ok
import item135 from "animal-island-ui/items/item-135.png"; // ▶ Play button sign
import item140 from "animal-island-ui/items/item-140.png"; // ▸ Tiny arrow
import item145 from "animal-island-ui/items/item-145.png"; // 💎 Ore crystal
import item150 from "animal-island-ui/items/item-150.png"; // 🏃 Running shoes
import item160 from "animal-island-ui/items/item-160.png"; // 🧪 Flask experiment
import item162 from "animal-island-ui/items/item-162.png"; // 🧬 Helix item
import item180 from "animal-island-ui/items/item-180.png"; // 🏰 Silo / Castle
import item201 from "animal-island-ui/items/item-201.png"; // 🔮 Crystal ball
import item209 from "animal-island-ui/items/item-209.png"; // 💬 Sign board / chat bubble
import item210 from "animal-island-ui/items/item-210.png"; // 📜 Parchment certificate
import item211 from "animal-island-ui/items/item-211.png"; // 📄 Document letter
import item223 from "animal-island-ui/items/item-223.png"; // 🎉 Party popper ball
import item225 from "animal-island-ui/items/item-225.png"; // 🎁 Gift wrapped balloon present
import item227 from "animal-island-ui/items/item-227.png"; // 📬 Cute wood mailbox
import item241 from "animal-island-ui/items/item-241.png"; // 🚀 Space rocket
import item251 from "animal-island-ui/items/item-251.png"; // 👹 Ogre mask
import item252 from "animal-island-ui/items/item-252.png"; // 👺 Tengu mask

// Fallback Leaf
import defaultLeaf from "animal-island-ui/items/item-001.png";

const EMOJI_MAP: Record<string, string> = {
  "🍃": item001,
  "🍂": item002,
  "🌱": item003,
  "🌲": item004,
  "🌿": item005,
  "🌸": item006,
  "🍊": item010,
  "🍵": item012,
  "🧸": item035,
  "🌟": item040,
  "☁": item041,
  "⭐": item042,
  "🌬": item044,
  "🏆": item045,
  "🏅": item048,
  "🧺": item050,
  "💛": item060,
  "🔍": item061,
  "🔎": item061,
  "💡": item062,
  "✏": item066,
  "🛠": item068,
  "🛠️": item068,
  "📊": item071,
  "🧠": item075,
  "🧘": item081,
  "🧑‍🌾": item101,
  "🧑": item101, // support simple sequence
  "🐼": item105,
  "🦥": item106,
  "🐾": item110,
  "⚡": item113,
  "⚠️": item115,
  "⚠": item115,
  "❌": item120,
  "✓": item125,
  "▶": item135,
  "▸": item140,
  "💎": item145,
  "🏃": item150,
  "🧪": item160,
  "🧬": item162,
  "🏰": item180,
  "🔮": item201,
  "💬": item209,
  "📜": item210,
  "📄": item211,
  "🎉": item223,
  "🎁": item225,
  "📬": item227,
  "🚀": item241,
  "👹": item251,
  "👺": item252,
  "⚔": item068,
  "⚔️": item068,
  "💚": item060,
};

interface ItemIconProps {
  emoji: string;
  className?: string;
  style?: React.CSSProperties;
  size?: number | string;
}

export default function ItemIcon({ emoji, className = "", style, size }: ItemIconProps) {
  // Extract emoji character or use mapping
  const cleanedEmoji = emoji.trim();
  const src = EMOJI_MAP[cleanedEmoji] || defaultLeaf;

  const currentSize = size !== undefined ? (typeof size === "number" ? `${size}px` : size) : "1.25em";

  return (
    <img
      src={src}
      alt={cleanedEmoji}
      referrerPolicy="no-referrer"
      className={`inline-block select-none pointer-events-none align-middle ${className}`}
      style={{
        width: currentSize,
        height: currentSize,
        objectFit: "contain",
        display: "inline-block",
        ...style,
      }}
    />
  );
}
