const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "blink",
    version: "2.0",
    author: "Alihsan Shourov",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Generate blinking GIF using avatars"
    },
    category: "image",
    guide: "{pn} @mention | reply | UID"
  },

  onStart: async function ({ event, message, usersData, args }) {
    try {
      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);

      const senderID = event.senderID;
      let targetIDs = [];

      // ===== 1️⃣ Reply Support =====
      if (event.messageReply?.senderID) {
        targetIDs.push(event.messageReply.senderID);
      }

      // ===== 2️⃣ Mention Support =====
      const mentionIDs = Object.keys(event.mentions || {});
      if (mentionIDs.length > 0) {
        targetIDs.push(...mentionIDs);
      }

      // ===== 3️⃣ UID Support =====
      if (args.length > 0 && !isNaN(args[0])) {
        targetIDs.push(args[0]);
      }

      // Remove duplicate IDs
      targetIDs = [...new Set(targetIDs)];

      // ===== Collect Avatar URLs =====
      const links = [];

      // Always include sender first
      links.push(await usersData.getAvatarUrl(senderID));

      for (const id of targetIDs) {
        if (id !== senderID) {
          links.push(await usersData.getAvatarUrl(id));
        }
      }

      if (links.length === 0) {
        return message.reply("❌ No valid users found.");
      }

      // ===== Generate Blink GIF =====
      const img = await new DIG.Blink().getImage(150, ...links);
      const filePath = path.join(cacheDir, `blink_${Date.now()}.gif`);

      await fs.writeFile(filePath, Buffer.from(img));

      message.reply(
        {
          attachment: fs.createReadStream(filePath)
        },
        () => fs.unlinkSync(filePath)
      );

    } catch (err) {
      console.error("BLINK ERROR:", err);
      message.reply("❌ Blink command failed.");
    }
  }
};