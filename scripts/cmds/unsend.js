module.exports = {
  config: {
    name: "unsend",
    aliases: ["del","uns"],
    version: "1.3",
    author: "Alihsan Shourov",
    role: 0,
    category: "box chat",
    guide: {
      en: "Reply to a bot message and type {pn}"
    }
  },

  langs: {
    en: {
      syntaxError: "❌ Please reply to a bot message to unsend it.",
      notBot: "❌ You can only unsend bot's own messages.",
      success: "✅ Message removed"
    }
  },

  onStart: async function ({ message, event, api, getLang }) {
    // 1️⃣ Must reply
    if (!event.messageReply) {
      return message.reply(getLang("syntaxError"));
    }

    // 2️⃣ Check if message is from bot
    const botID = api.getCurrentUserID();
    if (event.messageReply.senderID != botID) {
      return message.reply(getLang("notBot"));
    }

    // 3️⃣ Unsend message
    try {
      await api.unsendMessage(event.messageReply.messageID);
    } catch (err) {
      console.error(err);
    }
  }
};