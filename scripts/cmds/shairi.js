const axios = require("axios");

module.exports = {
  config: {
    name: "shairi",
    version: "1.0",
    author: "Shourov",
    role: 0,
    category: "video"
  },

  onStart: async function ({ message }) {
    try {
      const res = await axios.get(
        "https://shourov-video-api1.onrender.com/api/shairi"
      );

      // 🔥 SAFE ACCESS (no crash)
      const shairi =
        res.data?.data?.shairi ||
        res.data?.shairi ||
        "💔 Shairi";

      const video =
        res.data?.data?.video ||
        res.data?.video ||
        res.data?.media;

      if (!video) {
        return message.send("❌ Video পাওয়া যায়নি (API response error)");
      }

      message.send({
        body: `${shairi}\n\n— SHOUROV-BOT —`,
        attachment: await global.utils.getStreamFromURL(video)
      });

    } catch (err) {
      console.error(err);
      message.send("❌ Shairi আনতে সমস্যা হয়েছে");
    }
  }
};