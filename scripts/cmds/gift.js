module.exports = {
  config: {
    name: "gift",
    aliases: ["pay"],
    version: "1.1",
    author: "Shourov (fixed by ChatGPT)",
    role: 0,
    category: "𝗪𝗔𝗟𝗟𝗘𝗧",
    guide: {
      en: "{pn} @user <amount> OR reply + {pn} <amount>"
    }
  },

  langs: {
    en: {
      missingInput:
        "❌ Please tag a user or reply to someone and specify a valid amount.\nExample:\n/gift @user 100\nor\n(reply) /gift 100",
      invalidAmount: "❌ Amount must be a positive number.",
      notEnough: "❌ You don't have enough balance.",
      success: "✅ Successfully sent %1 coins to %2 💸"
    }
  },

  onStart: async function ({ message, event, args, usersData, getLang }) {
    let targetUID;

    // 1️⃣ Detect target user (mention OR reply)
    if (Object.keys(event.mentions).length > 0) {
      targetUID = Object.keys(event.mentions)[0];
    } else if (event.messageReply) {
      targetUID = event.messageReply.senderID;
    }

    // 2️⃣ Detect amount
    const amount = parseInt(args[args.length - 1]);

    if (!targetUID || isNaN(amount) || amount <= 0) {
      return message.reply(getLang("missingInput"));
    }

    // 3️⃣ Get sender data
    const senderData = await usersData.get(event.senderID);
    if (!senderData || (senderData.money || 0) < amount) {
      return message.reply(getLang("notEnough"));
    }

    // 4️⃣ Get receiver data
    const receiverData = await usersData.get(targetUID);

    // 5️⃣ Update balances
    await usersData.set(event.senderID, {
      ...senderData,
      money: (senderData.money || 0) - amount
    });

    await usersData.set(targetUID, {
      ...receiverData,
      money: (receiverData?.money || 0) + amount
    });

    // 6️⃣ Receiver name
    let receiverName = "User";
    if (event.mentions[targetUID]) {
      receiverName = event.mentions[targetUID].replace("@", "");
    } else if (receiverData?.name) {
      receiverName = receiverData.name;
    }

    return message.reply(
      getLang("success", amount, receiverName)
    );
  }
};