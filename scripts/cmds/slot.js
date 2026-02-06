const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

const SPIN_GIF = "https://files.catbox.moe/c2t4m0.gif";

module.exports = {
  config: {
    name: "slot",
    version: "3.0",
    author: "Alihsan Shourov",
    role: 0,
    category: "FUN & GAME",
    shortDescription: {
      en: "Animated Slot Machine"
    },
    guide: {
      en: "{pn} <amount>"
    }
  },

  onStart: async function ({ message, event, usersData, args }) {
    const senderID = event.senderID;
    const bet = parseInt(args[0]);

    if (isNaN(bet) || bet <= 0) {
      return message.reply("❌ Enter a valid bet amount");
    }

    const userData = await usersData.get(senderID);
    let balance = userData.money || 0;

    if (bet > balance) {
      return message.reply("❌ Not enough balance");
    }

    /* 🎰 SLOT SYMBOLS */
    const symbols = ["🤍", "🖤", "💚"];
    const spin = () => symbols[Math.floor(Math.random() * symbols.length)];

    /* 🎞️ SEND SPIN GIF */
    const spinMsg = await message.reply({
      body: "🎰 Spinning...",
      attachment: await global.utils.getStreamFromURL(SPIN_GIF)
    });

    /* ⏳ SPIN DELAY (animation time) */
    setTimeout(async () => {
      const s1 = spin();
      const s2 = spin();
      const s3 = spin();

      let winAmount = 0;
      let resultText = "";

      /* 🧮 CALCULATION */
      if (s1 === s2 && s2 === s3) {
        if (s1 === "💚") {
          winAmount = bet * 5;
          resultText = "💎 JACKPOT!";
        } else {
          winAmount = bet * 3;
          resultText = "🔥 BIG WIN!";
        }
      } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        winAmount = bet * 2;
        resultText = "✨ You Won!";
      } else {
        winAmount = -bet;
        resultText = "💔 You Lost!";
      }

      /* 💰 UPDATE BALANCE */
      balance += winAmount;

      await usersData.set(senderID, {
        money: balance,
        data: userData.data
      });

      /* ❌ UNSEND SPIN GIF */
      message.unsend(spinMsg.messageID);

      /* 📩 FINAL RESULT MESSAGE */
      const finalMsg =
`🎰 SLOT RESULT
━━━━━━━━━━━━━━
[ ${s1} | ${s2} | ${s3} ]

${resultText}
${winAmount > 0 ? `➕ Won: $${winAmount}` : `➖ Lost: $${Math.abs(winAmount)}`}
💰 Balance: $${balance}
━━━━━━━━━━━━━━`;

      message.reply(finalMsg);

    }, 3500); // GIF visible time
  }
};