const os = require("os");

if (!global.botStartTime) global.botStartTime = Date.now();

function createGraphBar(percentage, length = 15) {
  percentage = Number(percentage) || 0;
  const filled = Math.round((percentage / 100) * length);
  const empty = length - filled;
  return "█".repeat(filled) + "░".repeat(empty) + ` ${percentage.toFixed(1)}%`;
}

module.exports = {
  config: {
    name: "upx",
    aliases: ["uptx"],
    version: "8.0",
    author: "Alihsan Shourov (Ultra Safe)",
    role: 0,
    category: "system",
    guide: "{pn}"
  },

  onStart: async function ({ message, api, event }) {
    try {

      // ========= UPTIME =========
      const ms = Date.now() - global.botStartTime;
      const d = Math.floor(ms / 86400000);
      const h = Math.floor(ms / 3600000) % 24;
      const m = Math.floor(ms / 60000) % 60;
      const s = Math.floor(ms / 1000) % 60;
      const uptimeStr = `${d}d ${h}h ${m}m ${s}s`;

      // ========= CPU =========
      let cpuPercent = 0;
      try {
        const load = os.loadavg()[0];
        const cores = os.cpus().length;
        cpuPercent = (load / cores) * 100;
      } catch {}

      const cpuBar = createGraphBar(cpuPercent);

      // ========= RAM =========
      let ramPercent = 0;
      try {
        const total = os.totalmem();
        const free = os.freemem();
        ramPercent = ((total - free) / total) * 100;
      } catch {}

      const ramBar = createGraphBar(ramPercent);

      // ========= SYSTEM =========
      const platform = os.platform();
      const arch = os.arch();
      const hostname = os.hostname();
      const nodeVer = process.version;
      const botID = api.getCurrentUserID();

      // ========= GROUP INFO =========
      let groupName = "Unknown";
      let totalUsers = 0;
      let adminCount = 0;

      try {
        const info = await api.getThreadInfo(event.threadID);
        groupName = info.threadName || "Unnamed Group";
        totalUsers = info.participantIDs.length;
        adminCount = info.adminIDs.length;
      } catch {}

      // ========= FINAL MESSAGE =========
      const msg = `
💫 SHOUROV-BOT STATUS

⏳ Uptime : ${uptimeStr}

💻 CPU : ${cpuBar}
🧠 RAM : ${ramBar}

🖥 OS  : ${platform} (${arch})
🖥 Node: ${nodeVer}
🏷 Host: ${hostname}
🤖 Bot ID: ${botID}

👥 Group : ${groupName}
👤 Members: ${totalUsers}
🛡 Admins : ${adminCount}

👑 Owner : Alihsan Shourov
`;

      return message.reply({ body: msg });

    } catch (err) {
      console.error("UPX ERROR:", err);
      return message.reply("❌ System info failed but bot is running fine.");
    }
  }
};