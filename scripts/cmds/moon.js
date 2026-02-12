const moment = require("moment-timezone");
const fs = require("fs-extra");
const axios = require("axios");
const cheerio = require("cheerio");
const Canvas = require("canvas");
const https = require("https");

const agent = new https.Agent({
  rejectUnauthorized: false
});

module.exports = {
  config: {
    name: "moon",
    version: "2.0",
    author: "Alihsan Shourov",
    countDown: 5,
    role: 0,
    category: "image",
    guide: "{p}moon DD/MM/YYYY (optional caption)"
  },

  onStart: async function ({ args, message }) {
    try {
      if (!args[0]) {
        return message.reply("❌ Please provide date like: 12/02/2026");
      }

      const date = checkDate(args[0]);
      if (!date)
        return message.reply("❌ Invalid date format. Use DD/MM/YYYY");

      const linkCrawl = `https://lunaf.com/lunar-calendar/${date}`;

      let imgSrc;

      // ===== Try Crawl =====
      try {
        const html = await axios.get(linkCrawl, { httpsAgent: agent });
        const $ = cheerio.load(html.data);
        const href = $("figure img").attr("data-ezsrcset") || "";
        const match = href.match(/phase-(\d+)\.png/);

        if (match) {
          const number = Number(match[1]);
          imgSrc = moonImages[number];
        }
      } catch (err) {
        console.log("Crawl failed, using fallback moon image.");
      }

      // ===== Fallback =====
      if (!imgSrc) {
        const randomMoon = Math.floor(Math.random() * moonImages.length);
        imgSrc = moonImages[randomMoon];
      }

      // ===== If caption exists =====
      if (args[1]) {
        const captionText = args.slice(1).join(" ");
        const canvas = Canvas.createCanvas(1080, 1920);
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 1080, 1920);

        const moon = await Canvas.loadImage(imgSrc);
        ctx.drawImage(moon, 55, 300, 970, 970);

        ctx.fillStyle = "white";
        ctx.font = "60px Arial";
        ctx.textAlign = "center";

        const lines = getLines(ctx, captionText, 900);
        let y = 1450;

        for (const line of lines) {
          ctx.fillText(line, 540, y);
          y += 75;
        }

        const pathSave = __dirname + "/tmp/moon.png";
        fs.writeFileSync(pathSave, canvas.toBuffer());

        return message.reply({
          body: `🌕 Moon on ${args[0]}`,
          attachment: fs.createReadStream(pathSave)
        }, () => fs.unlinkSync(pathSave));
      }

      // ===== Without Caption =====
      const stream = await axios.get(imgSrc, { responseType: "stream" });
      return message.reply({
        body: `🌕 Moon on ${args[0]}`,
        attachment: stream.data
      });

    } catch (err) {
      console.log(err);
      return message.reply("⚠️ Moon command error.");
    }
  }
};

// ===== Date Check =====
function checkDate(date) {
  const [day, month, year] = (date || "").split('/');
  const formatted = `${year}/${month}/${day}`;
  return moment(formatted, 'YYYY/MM/DD', true).isValid()
    ? formatted
    : false;
}

// ===== Text Wrap =====
function getLines(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(`${currentLine} ${word}`).width;

    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

// ===== Moon PNG Fallback =====
const moonImages = [
  'https://i.ibb.co/9shyYH1/moon-0.png',
  'https://i.ibb.co/vBXLL37/moon-1.png',
  'https://i.ibb.co/0QCKK9D/moon-2.png',
  'https://i.ibb.co/Dp62X2j/moon-3.png',
  'https://i.ibb.co/xFKCtfd/moon-4.png',
  'https://i.ibb.co/m4L533L/moon-5.png',
  'https://i.ibb.co/VmshdMN/moon-6.png',
  'https://i.ibb.co/4N7R2B2/moon-7.png',
  'https://i.ibb.co/C2k4YB8/moon-8.png',
  'https://i.ibb.co/F62wHxP/moon-9.png',
  'https://i.ibb.co/Gv6R1mk/moon-10.png',
  'https://i.ibb.co/0ZYY7Kk/moon-11.png',
  'https://i.ibb.co/KqXC5F5/moon-12.png',
  'https://i.ibb.co/BGtLpRJ/moon-13.png',
  'https://i.ibb.co/jDn7pPx/moon-14.png',
  'https://i.ibb.co/kykn60t/moon-15.png',
  'https://i.ibb.co/qD4LFLs/moon-16.png',
  'https://i.ibb.co/qJm9gcQ/moon-17.png',
  'https://i.ibb.co/yYFYZx9/moon-18.png',
  'https://i.ibb.co/8bc7vpZ/moon-19.png',
  'https://i.ibb.co/jHG7DKs/moon-20.png',
  'https://i.ibb.co/5WD18Rn/moon-21.png',
  'https://i.ibb.co/3Y06yHM/moon-22.png',
  'https://i.ibb.co/4T8Zdfy/moon-23.png',
  'https://i.ibb.co/n1CJyP4/moon-24.png',
  'https://i.ibb.co/zFwJRqz/moon-25.png',
  'https://i.ibb.co/gVBmMCW/moon-26.png',
  'https://i.ibb.co/hRY89Hn/moon-27.png',
  'https://i.ibb.co/7C13s7Z/moon-28.png',
  'https://i.ibb.co/2hDTwB4/moon-29.png',
  'https://i.ibb.co/Rgj9vpj/moon-30.png',
  'https://i.ibb.co/s5z0w9R/moon-31.png'
];