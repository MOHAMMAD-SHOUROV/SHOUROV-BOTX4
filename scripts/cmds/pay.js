module.exports = {
  config: {
    name: "gift",
    version: "1.1",
    author: "Shourov (fixed)",
    role: 0,
    category: "economy",
    guide: "/gift (reply) amount"
  },

  onStart: async function ({ message, event, usersData, args }) {
    let receiverID = null;

    // 1️⃣ Reply-based (BEST)
    if (event.messageReply) {
      receiverID = event.messageReply.senderID;
    }

    // 2️⃣ Mention-based
    else if (event.mentions && Object.keys(event.mentions).length > 0) {
      receiverID = Object.keys(event.mentions)[0];
    }

    // ❌ No receiver
    if (!receiverID) {
      return message.reply(
        "❌ User পাওয়া যায়নি\n\n" +
        "✅ ব্যবহার করুন:\n" +
        "Reply করে লিখুন → /gift 500"
      );
    }

    // Amount
    const amount = parseInt(args[0]);
    if (!amount || amount <= 0) {
      return message.reply("❌ সঠিক amount দিন\nExample: /gift 500");
    }

    const senderID = event.senderID;

    if (receiverID === senderID) {
      return message.reply("❌ নিজেকে টাকা দিতে পারবেন না");
    }

    const senderData = await usersData.get(senderID);
    const receiverData = await usersData.get(receiverID);

    if (!senderData || senderData.money < amount) {
      return message.reply("❌ আপনার balance যথেষ্ট না");
    }

    // Update balances
    await usersData.set(senderID, {
      money: senderData.money - amount,
      data: senderData.data
    });

    await usersData.set(receiverID, {
      money: (receiverData?.money || 0) + amount,
      data: receiverData?.data || {}
    });

    return message.reply(
      `🎁 Gift Successful!\n\n` +
      `➖ আপনার থেকে: ${amount}\n` +
      `➕ Receiver পেল: ${amount}`
    );
  }
};