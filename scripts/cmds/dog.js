const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "dog",
    version: "2.0",
    author: "Alihsan Shourov",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Dog with tagged face" },
    category: "fun",
    guide: { en: "+dog @mention OR reply" }
  },

  onStart: async function ({ message, event, usersData }) {
    try {
      const senderID = event.senderID;

      const targetID =
        event.messageReply?.senderID ||
        Object.keys(event.mentions || {})[0] ||
        senderID; // যদি mention না করে, নিজেরটাই বসবে

      // ===== Get Dog Image =====
      const res = await axios.get("https://dog.ceo/api/breeds/image/random");
      const dogURL = res.data.message;

      // ===== Get Avatar =====
      const avatarURL = await usersData.getAvatarUrl(targetID);

      // ===== Load Images =====
      const dogImage = await loadImage(dogURL);
      const avatar = await loadImage(avatarURL);

      const canvas = createCanvas(dogImage.width, dogImage.height);
      const ctx = canvas.getContext("2d");

      // Draw Dog
      ctx.drawImage(dogImage, 0, 0);

      // ===== Face Position (Adjust If Needed) =====
      const size = 200; // avatar size
      const x = dogImage.width / 2 - size / 2; 
      const y = dogImage.height / 3 - size / 2;

      // Circle Clip
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, x, y, size, size);
      ctx.restore();

      // ===== Save Temp =====
      const tmpDir = path.join(__dirname, "tmp");
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

      const filePath = path.join(tmpDir, `dog_${Date.now()}.png`);
      fs.writeFileSync(filePath, canvas.toBuffer());

      message.reply(
        {
          body: "🐶 তুই কুত্তা",
          attachment: fs.createReadStream(filePath)
        },
        () => fs.unlinkSync(filePath)
      );

    } catch (err) {
      console.log("DOG ERROR:", err);
      message.reply("⚠️ Dog command failed.");
    }
  }
};