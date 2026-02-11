const jimp = require("jimp");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "love",
    version: "5.0.0",
    author: "Alihsan Shourov",
    countDown: 5,
    role: 0,
    category: "fun",
    guide: "{p}love @mention OR reply someone"
  },

  onStart: async function ({ message, event, usersData }) {
    try {
      const one = event.senderID;
      const two =
        event.messageReply?.senderID ||
        Object.keys(event.mentions || {})[0];

      if (!two)
        return message.reply("💚 Please mention or reply someone!");

      let avone, avtwo;

      // ===== TRY GRAPH API FIRST =====
      try {
        avone = await jimp.read(
          `https://graph.facebook.com/${one}/picture?height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`
        );

        avtwo = await jimp.read(
          `https://graph.facebook.com/${two}/picture?height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`
        );
      } catch (err) {
        // ===== FALLBACK SYSTEM =====
        const avatar1 = await usersData.getAvatarUrl(one);
        const avatar2 = await usersData.getAvatarUrl(two);

        avone = await jimp.read(avatar1);
        avtwo = await jimp.read(avatar2);
      }

      avone.circle();
      avtwo.circle();

      // ===== BACKGROUND =====
      const background = await jimp.read(
        "https://i.imgur.com/LjpG3CW.jpeg"
      );

      background
        .resize(1440, 1080)
        .composite(avone.resize(470, 470), 125, 210)
        .composite(avtwo.resize(470, 470), 800, 200);

      // ===== TMP FOLDER =====
      const tmpDir = path.join(__dirname, "tmp");
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

      const filePath = path.join(tmpDir, `love_${Date.now()}.png`);

      await background.writeAsync(filePath);

      message.reply(
        {
          body: "❤️ Love is beautiful 💞",
          attachment: fs.createReadStream(filePath)
        },
        () => fs.unlinkSync(filePath)
      );

    } catch (err) {
      console.log("LOVE ERROR:", err);
      message.reply("⚠️ Love command error.");
    }
  }
};