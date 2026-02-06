const axios = require("axios");

module.exports = {
  config: {
    name: "sad",
    version: "1.0",
    author: "Shourov",
    role: 0,
    category: "video"
  },

  onStart: async function ({ message }) {
    try {
      const res = await axios.get(
        "https://shourov-api.onrender.com/api/sad"
      );

      // 🔥 SAFE ACCESS
      const quote = res.data.quote || res.data.data?.quote;
      const video = res.data.video || res.data.media || res.data.data?.video;

      if (!video) {
        return message.send("❌ Video পাওয়া যায়নি (API response invalid)");
      }

      message.send({
        body: quote || "💔 Sad Video",
        attachment: await global.utils.getStreamFromURL(video)
      });

    } catch (err) {
      console.error(err);
      message.send("❌ Video আনতে সমস্যা হয়েছে");
    }
  }
};