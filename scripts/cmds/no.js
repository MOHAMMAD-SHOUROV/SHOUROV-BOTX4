module.exports = {
	config: {
		name: "assalamualaikum",
		version: "1.0",
		author: "MAHBUB ULLASH",
		countDown: 5,
		role: 0,
		shortDescription: "noprefix custom question and answer",
		longDescription: "noprefix custom question and answe",
		category: "reply",
	},

	onStart: async function () {},

	onChat: async function ({ event, message }) {

		if (!event.body) return;
		const msg = event.body.toLowerCase();

		const qaList = [
			{
				keyullash: ["assalamualaikum", "আসসালামু আলাইকুম", "assalamu alaikum"],
				reply: "𝐖𝐚𝐥𝐢𝐤𝐮𝐦𝐚𝐬𝐬𝐚𝐥𝐚𝐦"
			},
			{
				keyullash: ["kemon aso", "কেমন আছো", "how are you"],
				reply: "আমি ভালো আছি, আলহামদুলিল্লাহ! 😊"
			},
			{
				keyullash: ["name ki", "তোমার নাম কি", "what is your name"],
				reply: "আমি একটি বট, আমার নাম সেট করা হয়নি। 😊"
			},
			{
				keyullash: ["tumi ki korso", "কি করছো", "what are you doing"],
				reply: "আমি আপনার জন্য অপেক্ষা করছিলাম! 😄"
			},
			{
				keyullash: ["shourov bai", "Shourov"],
				reply: "Shourov বস ব্যস্ত আছে কি বলবি আমাকে বল ❤️"
			}
		];

		for (const item of qaList) {
			if (item.keyullash.some(kw => msg.includes(kw))) {
				return message.reply(item.reply);
			}
		}
	}
};
