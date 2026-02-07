const axios = require("axios");
const https = require("https");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
 config: {
 name: "dog",
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 5,
 role: 0,
 shortDescription: { en: "random dog image" },
 longDescription: { en: "Sends a random dog image" },
 category: "fun",
 guide: { en: "+dog" }
 },

 onStart: async function ({ message, event, args, resolveTargetID }) {
   const targetID = resolveTargetID(args);
   // The original dog command didn't use mentions, but following instructions to update it.
   // If a targetID is provided (mention or reply), we could potentially do something with it,
   // but the instructions just say "Update these command files ONLY to use the helper: ... dog.js"
   // and "Inside commands, use ONLY this: const targetID = resolveTargetID(args);"
   const res = await axios.get("https://dog.ceo/api/breeds/image/random");
 const url = res.data.message;
 const cachePath = path.join(__dirname, "cache/dog.jpg");

 const file = fs.createWriteStream(cachePath);
 https.get(url, (response) => {
 response.pipe(file);
 file.on("finish", () => {
 message.reply({
 body: "🐶 Here's a cute doggo!",
 attachment: fs.createReadStream(cachePath)
 });
 });
 });
 }
};
