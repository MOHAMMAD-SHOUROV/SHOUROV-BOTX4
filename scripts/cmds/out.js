const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "out",
    aliases: ["leave", "bye"],
    version: "1.2",
    author: "Sandy & NIB",
    countDown: 5,
    role: 2,
    shortDescription: "Make the bot leave the group",
    longDescription: "This command lets the bot leave a specific group or the current one.",
    category: "admin",
    guide: {
      en: "{pn} [tid (optional)] — Make the bot leave the group.\nExample:\n{pn} → leave current group\n{pn} 123456789 → leave group by ID"
    }
  },

  onStart: async function ({ api, event, args }) {
    let threadID;

    if (!args[0]) {
      threadID = event.threadID;
    } else {
      threadID = parseInt(args[0]);
      if (isNaN(threadID)) {
        return api.sendMessage("⚠️ | Invalid thread ID provided.", event.threadID);
      }
    }

    // Send styled leaving message
    const leaveMsg = `
▣আমি  সৌরভ  বট আপনাদের গ্রুপ থেকে লিভ 𝗟𝗘𝗔𝗩𝗘 নিচ্ছি:\n》আমি মেসেঞ্জার চ্যাট বট , আমাকে আপনাদের বিনোদন দেওয়ার জন্য বানানো হয়েছে। আমার কথায় যদি কেউ মনে কষ্ট পেয়ে থাকেন, তাহলে আমাকে ক্ষমা করে দিবেন 🙂 .\n\n🎵 ⇆ㅤ◁ㅤ ❚❚ㅤ ▷ㅤ↻\n\n➤সবাই নিজের খেয়াল রাখবেন, আল্লাহ হাফেজ 🌺
`;

    api.sendMessage(leaveMsg, threadID, () => {
      api.removeUserFromGroup(api.getCurrentUserID(), threadID);
    });
  }
};