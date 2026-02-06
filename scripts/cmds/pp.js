const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "profile",
    aliases: ["pp", "dp", "pfp"],
    version: "1.0.2",
    author: "ASIF",
    countDown: 3,
    role: 0,
    shortDescription: "View Facebook profile picture",
    category: "utility",
    guide: {
      en: "{pn} [reply/@mention/link/uid]"
    }
  },

  onStart: async function ({ api, event, args }) {
    const cachePath = __dirname + "/cache/profile.png";

    try {
      let uid;

      if (event.type === "message_reply") {
        uid = event.messageReply.senderID;
      }
      else if (Object.keys(event.mentions || {}).length > 0) {
        uid = Object.keys(event.mentions)[0];
      }
      else if (args[0] && args[0].includes(".com/")) {
        uid = await api.getUID(args[0]);
      }
      else if (args[0] && !isNaN(args[0])) {
        uid = args[0];
      }
      else {
        uid = event.senderID;
      }

      const imageUrl = `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      const callback = () => {
        api.sendMessage(
          {
            attachment: fs.createReadStream(cachePath)
          },
          event.threadID,
          () => {
            if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
          },
          event.messageID
        );
      };

      request(encodeURI(imageUrl))
        .pipe(fs.createWriteStream(cachePath))
        .on("close", callback);

    } catch (err) {
      console.error(err);
      api.sendMessage(
        "Error: Could not fetch profile picture. Make sure the UID/Link is correct.",
        event.threadID,
        event.messageID
      );
    }
  }
};