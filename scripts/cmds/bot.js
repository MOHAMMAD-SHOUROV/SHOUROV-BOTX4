const axios = require("axios");

module.exports = {
  config: {
    name: "bot",
    version: "2.3.1",
    role: 0,
    credits: "Alihsan Shourov",
    description: "Chat with a Simsimi-like bot (reply + trigger words support)",
    prefix: false,
    category: "fun",
    guide: {
      en: "{pn} [message]\n{pn} teach ask=[q]&ans=[a]\n{pn} delete ask=[q]&ans=[a]\n{pn} edit old=[q]&new=[new]\n{pn} askinfo [q]\n{pn} info"
    }
  },

  
  onStart: async function ({ api, event, args, usersData }) {
    const { threadID, messageID, senderID } = event;
    const query = args.join(" ");

    try {
      const { data } = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json");
      const apiUrl = data.sim;
      const apiUrl2 = data.api2;
      const userName = (await usersData.getName(senderID)) || "User";

      
      if (!query) {
        const greetings = [
          "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘",
          "কি গো সোনা আমাকে ডাকছ কেনো",
          "বার বার আমাকে ডাকস কেন😡",
          "আহ শোনা আমার আমাকে এতো ডাক্তাছো কেনো আসো বুকে আশো🥱",
          "হুম জান তোমার অইখানে উম্মমাহ😷😘",
          "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি",
          "আমাকে এতো না ডেকে বস সৌরভ'কে একটা গফ দে 🙄",
          "jang hanga korba",
          "jang bal falaba🙂"
        ];
        const rand = greetings[Math.floor(Math.random() * greetings.length)];
        return api.sendMessage({
          body: `「 ${userName} 」\n\n${rand}`,
          mentions: [{ tag: userName, id: senderID }]
        }, threadID, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              type: "reply",
              commandName: this.config.name,
              author: senderID
            });
          }
        }, messageID);
      }

      
      if (query.startsWith("teach")) {
        const params = query.replace("teach", "").trim().split("&");
        const question = params[0]?.replace("ask=", "").trim();
        const answer = params[1]?.replace("ans=", "").trim();
        if (!question || !answer) return api.sendMessage("⚠️ Format: teach ask=[q]&ans=[a]", threadID, messageID);

        const res = await axios.get(`${apiUrl}/sim?type=teach&ask=${encodeURIComponent(question)}&ans=${encodeURIComponent(answer)}`);
        const { msg, data } = res.data;
        return api.sendMessage(
          msg.includes("already")
            ? `📝 Already in DB\n1️⃣ ASK: ${data.ask}\n2️⃣ ANS: ${data.ans}`
            : `📝 Added Successfully\n1️⃣ ASK: ${data.ask}\n2️⃣ ANS: ${data.ans}`,
          threadID, messageID
        );
      }

      
      if (query.startsWith("delete")) {
        const params = query.replace("delete", "").trim().split("&");
        const question = params[0]?.replace("ask=", "").trim();
        const answer = params[1]?.replace("ans=", "").trim();
        if (!question || !answer) return api.sendMessage("⚠️ Format: delete ask=[q]&ans=[a]", threadID, messageID);

        const res = await axios.get(`${apiUrl}/sim?type=delete&ask=${encodeURIComponent(question)}&ans=${encodeURIComponent(answer)}&uid=${senderID}`);
        return api.sendMessage(res.data.msg || "✅ Deleted successfully!", threadID, messageID);
      }

      
      if (query.startsWith("edit")) {
        const params = query.replace("edit", "").trim().split("&");
        const oldQ = params[0]?.replace("old=", "").trim();
        const newQ = params[1]?.replace("new=", "").trim();
        if (!oldQ || !newQ) return api.sendMessage("⚠️ Format: edit old=[q]&new=[new]", threadID, messageID);

        const res = await axios.get(`${apiUrl}/sim?type=edit&old=${encodeURIComponent(oldQ)}&new=${encodeURIComponent(newQ)}&uid=${senderID}`);
        return api.sendMessage(res.data.msg || "✏️ Edited successfully!", threadID, messageID);
      }

      
      if (query.startsWith("info")) {
        const res = await axios.get(`${apiUrl}/sim?type=info`);
        return api.sendMessage(`📊 Total Ask: ${res.data.data.totalKeys}\n📊 Total Ans: ${res.data.data.totalResponses}`, threadID, messageID);
      }

      
      if (query.startsWith("askinfo")) {
        const question = query.replace("askinfo", "").trim();
        if (!question) return api.sendMessage("⚠️ Please provide a question.", threadID, messageID);

        const res = await axios.get(`${apiUrl}/sim?type=keyinfo&ask=${encodeURIComponent(question)}`);
        const answers = res.data.data.answers || [];
        if (!answers.length) return api.sendMessage(`❌ No info for "${question}"`, threadID, messageID);

        const replyMsg = `ℹ️ Info for "${question}":\n` +
          answers.map((ans, i) => `📌 ${i + 1}. ${ans}`).join("\n") +
          `\n\nTotal answers: ${answers.length}`;
        return api.sendMessage(replyMsg, threadID, messageID);
      }

      
      const res = await axios.get(`${apiUrl}/sim?type=ask&ask=${encodeURIComponent(query)}`);
      const reply = res.data.data.msg;

      const font = await axios.get(`${apiUrl2}/bold?text=${reply}&type=serif`);
      const styledText = font.data.data.bolded;

      api.sendMessage(styledText, threadID, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            type: "reply",
            commandName: this.config.name,
            author: senderID
          });
        }
      }, messageID);

    } catch (e) {
      console.error("Bot error:", e);
      api.sendMessage("⚠️ An error occurred, try later.", threadID, messageID);
    }
  },

  
  onReply: async ({ api, event, Reply }) => {
    const { threadID, messageID, senderID, body } = event;
    if (Reply.author !== senderID) return;

    try {
      const { data } = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json");
      const apiUrl = data.sim;
      const apiUrl2 = data.api2;

      const res = await axios.get(`${apiUrl}/sim?type=ask&ask=${encodeURIComponent(body)}`);
      const reply = res.data.data.msg;

      const font = await axios.get(`${apiUrl2}/bold?text=${reply}&type=serif`);
      const styledText = font.data.data.bolded;

      api.sendMessage(styledText, threadID, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            type: "reply",
            commandName: "bot",
            author: senderID
          });
        }
      }, messageID);

    } catch (e) {
      console.error("Reply error:", e);
      api.sendMessage("⚠️ Error while replying.", threadID, messageID);
    }
  }

};
