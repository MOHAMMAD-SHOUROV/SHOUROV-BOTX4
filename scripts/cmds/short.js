const axios = require("axios");

module.exports = {
  config: {
    name: "short",
    version: "1.0",
    author: "Shourov",
    role: 0,
    category: "video"
  },

  onStart: async function ({ message }) {
    try {
      const res = await axios.get(
        "https://shourov-api.onrender.com/api/short"
      );

      const { video } = res.data.data;
      const title = res.data.body;

      message.send({
        body: title,
        attachment: await global.utils.getStreamFromURL(video)
      });

    } catch (e) {
      message.send("❌ Video load failed");
    }
  }
};