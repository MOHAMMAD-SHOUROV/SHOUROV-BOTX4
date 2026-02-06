const a = require("axios");

const b = "h";
const c = "t";
const d = "t";
const e = "p";
const f = "s";
const g = "://";

const h = "n";
const i = "i";
const j = "x";
const k = "-";
const l = "e";
const m = "m";
const n = "o";
const o = "j";
const p = "i";
const q = "m";
const r = "i";
const s = "x";

const t = ".";
const u = "vercel";
const v = ".";
const w = "app";
const x = "/";
const y = "emojimix";

const z = b + c + d + e + f + g + h + i + j + k + l + m + n + o + p + q + r + s + t + u + v + w + x + y;

module.exports = {
  config: {
    name: "emojimix",
    aliases: ["mix"],
    version: "0.0.1",
    author: "ArYAN",
    countDown: 5,
    role: 0,
    guide: "Example: {pn} 🙂 😘",
    category: "FUN",
  },

  langs: {
    en: {
      error: "Sorry, emoji %1 and %2 can't mix",
      success: "Emoji %1 and %2 mix successfully",
    },
  },

  onStart: async function ({ message, args, getLang }) {
    const A = args[0];
    const B = args[1];

    if (!A || !B) return message.SyntaxError();

    const C = await D(A, B, z);

    if (!C) {
      return message.reply(getLang("error", A, B));
    }

    message.reply({
      body: getLang("success", A, B),
      attachment: C,
    });
  },
};

async function D(E, F, G) {
  try {
    const { data: H } = await a.get(G, {
      params: { emoji1: E, emoji2: F },
      responseType: "stream",
    });
    H.path = `emojimix${Date.now()}.png`;
    return H;
  } catch (I) {
    console.error("Error generating emojimix:", I);
    return null;
  }
}