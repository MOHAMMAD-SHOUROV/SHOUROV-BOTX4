const axios = require("axios");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "admin",
    aliases: [], // ❌ amin বাদ
    version: "1.1.2",
    author: "Alihsan Shourov",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Show admin info" },
    longDescription: { en: "Show admin & bot information with video" },
    category: "Information"
    // ❌ guide পুরো বাদ
  },

  onStart: async function ({ message, global }) {
    try {
      // ⏳ Loading message
      const wait = await message.reply("⏳ Loading admin info...");
      setTimeout(() => {
        try {
          message.unsend(wait.messageID);
        } catch {}
      }, 3000);

      // 🔹 Bot Info
      const botName = "𝐒𝐇𝐎𝐔𝐑𝐎𝐕_𝐁𝐎𝐓";
      const prefix = global.GoatBot.config.prefix;
      const owner = "𝐀𝐋𝐈𝐇𝐒𝐀𝐍 𝐒𝐇𝐎𝐔𝐑𝐎𝐕";
      const fb = "https://www.facebook.com/shourov.sm24";
      const whatsapp = "01709281334";
      const status = "SINGLE";

      // 🕒 Date & Time
      const now = moment().tz("Asia/Dhaka");
      const date = now.format("DD/MM/YYYY");
      const time = now.format("hh:mm:ss A");

      // ⚙ Uptime
      const up = process.uptime();
      const uptime =
        Math.floor(up / 86400) + "d " +
        Math.floor((up % 86400) / 3600) + "h " +
        Math.floor((up % 3600) / 60) + "m " +
        Math.floor(up % 60) + "s";

      // 🎥 Video API
      let videoStream = null;
      try {
        const res = await axios.get(
          "https://shourov-api.onrender.com/api/admin"
        );

        let video = res.data?.data;
        if (video) {
          // Google Drive link fix
          if (video.includes("drive.google.com")) {
            const id = video.match(/[-\w]{25,}/);
            if (id) video = `https://drive.google.com/uc?id=${id[0]}`;
          }
          videoStream = await global.utils.getStreamFromURL(video);
        }
      } catch (e) {
        videoStream = null;
      }

      // 📩 Final Message
      await message.reply({
        body:
`╭───[ 👑 ADMIN INFO ]───╮
│
│ 👤 Owner   : ${owner}
│ 🤖 Bot     : ${botName}
│ 🔰 Prefix  : ${prefix}
│ ❤️ Status  : ${status}
│
│ 📆 Date    : ${date}
│ ⏰ Time    : ${time}
│ ⚙ Uptime  : ${uptime}
│
│ 🌐 FB      : ${fb}
│ 📱 WhatsApp: ${whatsapp}
│
╰────────────────────╯`,
        attachment: videoStream
      });

    } catch (err) {
      console.error("ADMIN CMD ERROR:", err);
      message.reply("❌ Admin info load করতে সমস্যা হয়েছে।");
    }
  }
};