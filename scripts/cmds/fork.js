module.exports = {
  config: {
    name: "frok",
    version: "1.0.3",
    author: "King_Shourov",
    role: 0,
    description: "📦 Shourov GitHub fork link (prefix + no prefix)",
    category: "system",
    guide: "Type: frok | fork | repo (with or without prefix)"
  },

  // ================= PREFIX COMMAND =================
  onStart: async function ({ api, event }) {
    const reply = `
╭━━〔 🚀 SHOUROV BOT OFFICIAL FORK 〕━━╮

🔰 GitHub Repository (Fork Here)
👉 fork চাইলে বিচি কান্দে তুলে দিবো, 

🌐 Facebook Profile
👉 https://www.facebook.com/profile.php?id=61588161951831

💎 GitHub Profile
👉 https://giমনে নাই তার পর

╰━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

    return api.sendMessage(reply, event.threadID, event.messageID);
  },

  // ================= NO PREFIX TRIGGER =================
  handleEvent: async function ({ api, event }) {
    if (!event.body) return;

    const msg = event.body.trim().toLowerCase();

    const keywords = [
      "frok",
      "fork",
      "forklink",
      "myfork",
      "myfrok",
      "github",
      "githublink",
      "repo",
      "git",
      "gitlink",
      "shourov"
    ];

    if (!keywords.includes(msg)) return;

    const reply = `
╭━━〔 🚀 SHOUROV BOT OFFICIAL FORK 〕━━╮

🔰 GitHub Repository (Fork Here)
👉 https://github.com/MOHAMMAD-SHOUROV/SHOUROV-BOTV2

🌐 Facebook Profile
👉 https://www.facebook.com/www.xsxx.com365

💎 GitHub Profile
👉 https://github.com/MOHAMMAD-SHOUROV

╰━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

    return api.sendMessage(reply, event.threadID, event.messageID);
  }
};