const ax = require("axios");
const nix = "https://raw.githubusercontent.com/aryannix/stuffs/master/raw/apis.json";

module.exports = {
  config: {
    name: "font",
    aliases: ["ft"],
    version: "0.0.1",
    author: "ArYAN",
    countDown: 5,
    role: 0,
    category: "tools",
    shortDescription: "Stylish text generator",
    longDescription: "Generate stylish text with different font styles.",
    guide: {
      en: "{p}font list\n{p}font <number> <text>"
    }
  },

  onStart: async function ({ api, event, args }) {
    let e;
    try {
      const apiConfig = await ax.get(nix);
      e = apiConfig.data && apiConfig.data.api;
      if (!e) throw new Error("Configuration Error: Missing API in GitHub JSON.");
    } catch (error) {
      return api.sendMessage("❌ Failed to fetch API configuration from GitHub.", event.threadID, event.messageID);
    }
    
    const fontApiUrl = `${e}/font`;

    if (!args[0]) {
      return api.sendMessage(
        "❌ | Please provide arguments.\nUse:\nfont list\nfont <number> <text>",
        event.threadID,
        event.messageID
      );
    }

    let styles = [];
    try {
      const r = await ax.get(fontApiUrl);
      styles = r.data.available_styles || [];
    } catch {
      return api.sendMessage("❌ | Failed to fetch font styles from API.", event.threadID, event.messageID);
    }

    if (args[0].toLowerCase() === "list") {
      let msg = "📜 | Available Font Styles:\n\n";
      styles.forEach((style, i) => {
        msg += `${i + 1}. ${style}\n`;
      });
      return api.sendMessage(msg, event.threadID, (err, info) => {
        if (!err) setTimeout(() => api.unsendMessage(info.messageID), 15000);
      }, event.messageID);
    }

    const index = parseInt(args[0]);
    if (isNaN(index) || index < 1 || index > styles.length) {
      return api.sendMessage("❌ | Invalid style number.\nType: font list", event.threadID, event.messageID);
    }

    const style = styles[index - 1];
    const text = args.slice(1).join(" ");
    if (!text) return api.sendMessage("❌ | Please provide text to style.", event.threadID, event.messageID);

    try {
      const url = `${fontApiUrl}?style=${style}&text=${encodeURIComponent(text)}`;
      const r = await ax.get(url);
      const styledText = r.data.result || "❌ API error.";
      return api.sendMessage(styledText, event.threadID, event.messageID);
    } catch {
      return api.sendMessage("❌ | Failed to fetch styled text.", event.threadID, event.messageID);
    }
  }
};
