const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "chor",
    version: "3.0.0",
    author: "Alihsan Shourov",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "Scooby-doo chor meme"
    },
    guide: {
      en: "{pn} @mention | reply | UID"
    }
  },

  onStart: async function ({ event, message, args }) {
    try {
      const { senderID } = event;
      let targetID;

      // ===== Reply Support =====
      if (event.messageReply?.senderID) {
        targetID = event.messageReply.senderID;
      }

      // ===== Mention Support =====
      if (!targetID && Object.keys(event.mentions || {}).length > 0) {
        targetID = Object.keys(event.mentions)[0];
      }

      // ===== UID Support =====
      if (!targetID && args.length > 0 && !isNaN(args[0])) {
        targetID = args[0];
      }

      if (!targetID) {
        return message.reply("❌ Please reply, mention or provide UID.");
      }

      // ===== Get API URL =====
      const apiList = await axios.get(
        "https://raw.githubusercontent.com/shahadat-sahu/SAHU-API/main/SAHU-API.json"
      );

      const AVATAR_CANVAS_API = apiList.data.AvatarCanvas;

      // ===== Call Canvas API =====
      const res = await axios.post(
        `${AVATAR_CANVAS_API}/api`,
        {
          cmd: "chor",
          senderID: targetID,
          targetID: senderID
        },
        {
          responseType: "arraybuffer",
          timeout: 30000
        }
      );

      // ===== Save Image =====
      const cachePath = path.join(__dirname, "cache");
      await fs.ensureDir(cachePath);

      const imgPath = path.join(
        cachePath,
        `chor_${Date.now()}.png`
      );

      await fs.writeFile(imgPath, res.data);

      await message.reply(
        {
          body: "😹 Scooby Doo caught the thief!",
          attachment: fs.createReadStream(imgPath)
        },
        () => fs.unlinkSync(imgPath)
      );

    } catch (err) {
      console.error("CHOR ERROR:", err.message);
      return message.reply("❌ Failed to generate image. Try again later.");
    }
  }
};