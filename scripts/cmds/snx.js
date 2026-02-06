const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const nix = "https://raw.githubusercontent.com/aryannix/stuffs/master/raw/apis.json";

async function getStream(url) {
	const res = await axios({ url, responseType: "stream" });
	return res.data;
}

module.exports = {
	config: {
		name: "xnx",
		version: "0.0.1",
		author: "ArYAN",
		countDown: 5,
		role: 0,
		shortDescription: { en: "Search and download videos" },
		description: { en: "Search and download videos via reply" },
		category: "media",
		guide: { en: "{pn} <keyword>" }
	},

	onStart: async function ({ api, args, message, event, commandName }) {
		let base;
		try {
			const configRes = await axios.get(nix);
			base = configRes.data?.api;
			if (!base) throw new Error();
		} catch (e) {
			api.setMessageReaction("❌", event.messageID, () => {}, true);
			return api.sendMessage("❌ Failed to fetch API configuration.", event.threadID, event.messageID);
		}

		const query = args.join(" ");
		if (!query) return api.sendMessage("⚠️ Please provide a keyword.", event.threadID, event.messageID);

		api.setMessageReaction("⏳", event.messageID, () => {}, true);

		try {
			const res = await axios.get(`${base}/xnx?q=${encodeURIComponent(query)}`);
			const results = res.data.result;

			if (!results || results.length === 0) {
				api.setMessageReaction("❌", event.messageID, () => {}, true);
				return api.sendMessage("❌ No results found.", event.threadID, event.messageID);
			}

			const limitedResults = results.slice(0, 6);
			let msg = "";
			const thumbnails = [];

			for (let i = 0; i < limitedResults.length; i++) {
				const v = limitedResults[i];
				msg += `${i + 1}. ${v.title}\n⏱ ${v.duration || 'N/A'} | 👀 ${v.views || 'N/A'}\n\n`;

				if (v.thumbnail) {
					try {
						thumbnails.push(await getStream(v.thumbnail));
					} catch (e) {}
				}
			}

			api.setMessageReaction("✅", event.messageID, () => {}, true);
			return api.sendMessage(
				{ 
					body: msg + "Reply with number (1-6) to download video",
					attachment: thumbnails 
				},
				event.threadID,
				(err, info) => {
					global.GoatBot.onReply.set(info.messageID, {
						results: limitedResults,
						messageID: info.messageID,
						author: event.senderID,
						commandName: commandName,
						base
					});
				},
				event.messageID
			);
		} catch (e) {
			api.setMessageReaction("❌", event.messageID, () => {}, true);
			return api.sendMessage("❌ Failed to search.", event.threadID, event.messageID);
		}
	},

	onReply: async function ({ api, event, Reply }) {
		const { results, author, messageID, base } = Reply;
		if (event.senderID !== author) return;

		const choice = parseInt(event.body);
		if (isNaN(choice) || choice < 1 || choice > results.length) {
			return api.sendMessage("❌ Invalid selection.", event.threadID, event.messageID);
		}

		const selected = results[choice - 1];
		await api.unsendMessage(messageID);
		api.setMessageReaction("⏳", event.messageID, () => {}, true);

		try {
			const dlRes = await axios.get(`${base}/xnxdl?url=${encodeURIComponent(selected.link)}`);
			const data = dlRes.data.result;
			const videoUrl = data.files.high || data.files.low;

			const cachePath = path.join(__dirname, 'cache');
			if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);
			const filePath = path.join(cachePath, `vid_${Date.now()}.mp4`);

			const vidData = await axios.get(videoUrl, { responseType: "arraybuffer" });
			fs.writeFileSync(filePath, Buffer.from(vidData.data));

			const body = `• Title: ${data.title}\n• Duration: ${data.duration || 'N/A'}\n• Views: ${data.info || 'N/A'}\n• Downloaded successfully!`;

			await api.sendMessage(
				{ body: body, attachment: fs.createReadStream(filePath) },
				event.threadID,
				() => {
					fs.unlinkSync(filePath);
					api.setMessageReaction("✅", event.messageID, () => {}, true);
				},
				event.messageID
			);
		} catch (e) {
			api.setMessageReaction("❌", event.messageID, () => {}, true);
			return api.sendMessage("❌ Failed to download video.", event.threadID, event.messageID);
		}
	}
};