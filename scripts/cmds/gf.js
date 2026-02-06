const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "gf",
    version: "2.0",
    author: "ALIHSAN SHOUROV",
    countDown: 5,
    role: 0,
    shortDescription: "Get a random GF",
    longDescription: "Send random GF photo & caption from API when user types gf / gf de",
    category: "fun",
    guide: "Type: gf | gf de | bot gf de"
  },

  // command use: gf
  onStart: async function ({ api, event }) {
    return sendGf(api, event);
  },

  // auto detect in group chat
  onChat: async function ({ api, event }) {
    const text = event.body?.toLowerCase();
    if (!text) return;

    const triggers = ["gf", "gf de", "bot gf de"];
    if (triggers.includes(text.trim())) {
      return sendGf(api, event);
    }
  }
};

// ================== MAIN FUNCTION ==================
async function sendGf(api, event) {
  try {
    // 🔹 API CALL
    const res = await axios.get(
      "https://shourov-api.onrender.com/api/gf",
      { timeout: 10000 }
    );

    const dataArr = res.data.data;
    const images = res.data.images;
    const author = res.data.author?.name || "SHOUROV BOT";

    if (!dataArr?.length || !images?.length) {
      return api.sendMessage(
        "❌ GF পাওয়া যায়নি",
        event.threadID,
        event.messageID
      );
    }

    // 🔹 RANDOM SELECT
    const randomText = dataArr[Math.floor(Math.random() * dataArr.length)];
    const randomImg = images[Math.floor(Math.random() * images.length)];

    const caption =
      `💖 GF FOUND 💖\n\n` +
      `${randomText.title}\n\n` +
      `🔗 Profile:\n${randomText.fb}\n\n` +
      `✍️ Create: ${author}`;

    // 🔹 DOWNLOAD IMAGE
    const imgPath = path.join(__dirname, "cache", `gf_${Date.now()}.jpg`);
    const imgRes = await axios.get(randomImg, { responseType: "arraybuffer" });
    await fs.outputFile(imgPath, imgRes.data);

    // 🔹 SEND MESSAGE
    api.sendMessage(
      {
        body: caption,
        attachment: fs.createReadStream(imgPath)
      },
      event.threadID,
      () => fs.unlinkSync(imgPath),
      event.messageID
    );

  } catch (err) {
    console.error("GF ERROR:", err.message);
    api.sendMessage(
      "⚠️ GF আনতে সমস্যা হয়েছে",
      event.threadID,
      event.messageID
    );
  }
}