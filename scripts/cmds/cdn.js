const ax = require("axios");
const nix = "https://raw.githubusercontent.com/aryannix/stuffs/master/raw/apis.json";

module.exports = {
  config: {
    name: "cdn",
    aliases: ["cd"],
    version: "0.0.1",
    author: "ArYAN",
    countDown: 5,
    role: 0,
    category: "media"
  },

  onStart: async ({ api, event }) => {
    let e;
    try {
      const apiConfig = await ax.get(nix);
      e = apiConfig.data && apiConfig.data.api;
      if (!e) throw new Error("Configuration Error: Missing API in GitHub JSON.");
    } catch (error) {
      return api.sendMessage("❌ Failed to fetch API configuration from GitHub.", event.threadID, event.messageID);
    }

    try {
      const a = event.messageReply;

      if (!a?.attachments?.length) {
        return api.sendMessage("❌ Reply to a media file.", event.threadID, event.messageID);
      }

      const b = a.attachments[0].url;
    
      
      const d = await ax.post(e, { url: b }, { headers: { "Content-Type": "application/json" } });

      if (d.data?.link) {
        return api.sendMessage(d.data.link, event.threadID, event.messageID);
      } else {
        return api.sendMessage("❌ Upload failed.", event.threadID, event.messageID);
      }

    } catch (error) {
      console.error("❌ CDN", error.message);
      return api.sendMessage("❌ Failed to upload media.", event.threadID, event.messageID);
    }
  }
};