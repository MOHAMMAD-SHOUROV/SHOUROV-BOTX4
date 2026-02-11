const jimp = require("jimp");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "love",
    version: "6.0.0",
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

      // ===== GET AVATAR (SAFE METHOD) =====
      const avatar1 = await usersData.getAvatarUrl(one);
      const avatar2 = await usersData.getAvatarUrl(two);

      const avone = await jimp.read(avatar1);
      const avtwo = await jimp.read(avatar2);

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
      console.log("LOVE ERROR FULL:", err);
      message.reply("⚠️ Love command failed. Check console log.");
    }
  }
};