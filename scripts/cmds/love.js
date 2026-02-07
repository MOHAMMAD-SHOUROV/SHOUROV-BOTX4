const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs")


module.exports = {
    config: {
        name: "love",
        aliases: ["love 2 love"],
        version: "1.0",
        author: "MOHAMMAD-BADOL",
        countDown: 5,
        role: 0,
        shortDescription: "love dp",
        longDescription: "",
        category: "photo",
        guide: ""
    },

    onStart: async function ({ message, event, args, resolveTargetID }) {
        const targetID = resolveTargetID(args);
        if (!targetID) return message.reply("💚আপনি যাকে ভালোবাসেন তাকে মেনশন করুন প্লিজ✅");
        const one = event.senderID, two = targetID;
        bal(one, two).then(ptth => { message.reply({ body: "ইগো আর ভালোবাসা লড়াই হলে ভালোবাসা টাই হেরে যায়.💔🥀", attachment: fs.createReadStream(ptth) }) })
    }
};

async function bal(one, two) {
   let avone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
    avone.circle()
    let avtwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
    avtwo.circle()
    let pth = "spiderman.png"
    let img = await jimp.read("https://i.imgur.com/LjpG3CW.jpeg")
    img.resize(1440, 1080).composite(avone.resize(470, 470), 125, 210).composite(avtwo.resize(470, 470), 800, 200);

    await img.writeAsync(pth)
    return pth
}