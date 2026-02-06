const axios = require("axios");

module.exports = {
  config: {
    name: "funny",
    version: "1.0",
    author: "Shourov",
    role: 0,
    category: "video"
  },

  onStart: async function ({ message }) {
    try {
      const res = await axios.get("https://shourov-api.vercel.app/api/funny");

      const { quote, video } = res.data.data;

      message.send({
        body: quote,
        attachment: await global.utils.getStreamFromURL(video)
      });

    } catch (e) {
      message.send("❌ Funny video আনতে সমস্যা হয়েছে");
    }
  }
};