const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "caption",
    version: "1.1.0",
    author: "Alihsan Shourov",
    role: 0,
    category: "fun",
    usePrefix: false // 🔥 prefix বাদ
  },

  // command দিয়ে কিছু করবে না
  onStart: async function () {},

  // ✅ MESSAGE LISTENER
  onChat: async function ({ api, event }) {
    try {
      if (!event.body) return;

      // 🔑 TRIGGER (// লিখলে কাজ করবে)
      if (event.body.trim() !== "//") return;

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const captions = [
        "❝ জীবন সুন্দর যদি কারো মায়ায় না পড়ো 🙂💔 ❞",
        "❝ ভাঙা মন আর ভাঙা বিশ্বাস কখনো জোড়া লাগে না ❞",
        "❝ সে বলেছিলো ছাড়বে না… তাহলে চলে গেলো কেন? ❞",
        "❝ প্রয়োজন ছাড়া কেউ খোঁজ নেয় না… ❞",
        "❝ হাসতে হাসতে একদিন সবাইকে কাঁদিয়ে বিদায় নিবো 💔 ❞"
      ];

      const images = [
        "https://i.imgur.com/vnVjD6L.jpeg",
        "https://i.imgur.com/TG3rIiJ.jpeg",
        "https://i.imgur.com/CPK9lur.jpeg",
        "https://i.imgur.com/GggjGf9.jpeg",
        "https://i.imgur.com/xUNknmi.jpeg"
      ];

      const pick = arr => arr[Math.floor(Math.random() * arr.length)];
      const caption = pick(captions);
      const imageUrl = pick(images);

      const imgPath = path.join(cacheDir, `cap_${Date.now()}.jpg`);
      const res = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, Buffer.from(res.data));

      await api.sendMessage(
        {
          body:
`╔═══『 Random Caption 』═══╗

${caption}

— 𝐒𝐇𝐎𝐔𝐑𝐎𝐕 𝐁𝐎𝐓 🤖
Alihsan Shourov
╚════════════════════╝`,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID
      );

      fs.unlinkSync(imgPath);
    } catch (err) {
      console.error(err);
    }
  }
};