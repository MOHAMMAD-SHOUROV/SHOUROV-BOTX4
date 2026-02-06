// Strict Author Check for 'Rocky'
if (typeof global.module === 'undefined') {
    // This is a common fix for some bot environments
    global.module = {};
    global.module.exports = {};
}

module.exports = {
	config: {
		name: "sm",
		aliases: ["sm"],
		version: "1.0",
		author: "Shourov", // This name must not be changed
		countDown: 0,
		role: 0,
		shortDescription: "Caption",
		longDescription: "random caption.",
		category: "Love",
		guide: "{pn}",
	},
	onStart: async function () { return; },
	onChat: async function ({ message, api, event }) {
		if (this.config.author !== "Shourov") {
			const errorMsg = "🛑 ফাইলটি এরর দিচ্ছে! শুধুমাত্র Shourov-এর নামে এই কমান্ডটি কাজ করবে। (Author: 'Shourov' must not be changed).";
			return api.sendMessage({ body: errorMsg }, event.threadID, event.messageID);
		}
		const body = event.body ? event.body.toLowerCase() : '';
		const prefix = '.'; 
		
		if (body === "ss" || body === prefix + "sm") {
			const captions = [
				`**sm** তুমি আমার জীবনের সেই কারণ, যার জন্য আমি প্রতিদিন হাঁসি।
				Tomake Chhara Amar Jibon Shudhu Shukhno Kotha, No more boring life.
				**Shourov** শুধু তোমাকেই চায়, I promise to be yours forever. ❤️`,

				`Tomar oi mishti hashi ta, amar moner kache ekta magic er moto.
				Protidin tomar dike takiye thaka, this is my biggest addiction.
				তুমিই আমার সবথেকে সুন্দর অভ্যাস, **sm**. 🌷`,

				`Whenever I feel low, your name is my biggest strength.
				Jiboner ei poth chola te, **Shourov** shudhu tomakei support kore.
				Tumi amar jibon, amar shanti, you are my everything. 🔒`,
                
				`আমার হৃদয়ের প্রতিটা কোণে, শুধু তোমারই আনাগোনা, **My Love**.
				Tomake valobashi, karon tumi amar bhalobashar joggo.
				**sm**, তুমি আমার সবচেয়ে প্রিয় মানুষ, forever and always. ✨`,
                
				`I fell in love with your soul before I even saw your eyes clearly.
				Tumi amar jiboner shobcheye boro asha, amar shukher karon.
				**Shourov**-er shobchaite boro shwapno, shudhu tomake niye. 💍`,
                
				`তোমার ওই মায়াবী চাহনিতে আমার পুরো পৃথিবীটা আটকে গেছে।
				Amar jibone tumi chhara ar kono roshni nei, you are my moonlight.
				**sm**, তুমি আমার ক্রাশ, my only crush. 💚`,

				`Every beat of my heart whispers your name, **sm**.
				Ei bhalobashata kakhono purono hobe na, this feeling is brand new every day.
				**sm** er shobcheye boro obhimaan, shudhu tomar jonno. 💖`,

				`Tumi amar jiboner shesh station, ar kono poth ekhon khola nei.
				My world revolves around you, my queen.
				**sm**, তুমি আমার স্বপ্নের রানী, my dream girl. 👸`,
                
				`Bhalobasha mane shudhu tomakei chawa, ar kauke na.
				When I'm with you, I feel safe, I feel complete.
				**Shourov** er mon bole, tumi shudhu amar. 🦋`,
                
				`তোমার ঐ নরম হাত দুটো, I want to hold them forever.
				Tumi amar jiboner onek shundor ekta golpo, a fairy tale.
				**sm**, তুমি আমার সেই হাসি, যা কখনো থামে না। 😊`,
                
				`তুমি ছাড়া আমার জীবনটা যেন রং ছাড়া ক্যানভাস, colorless and dull.
				You paint my world with the most beautiful shades of happiness.
				**Shourov** will be there for you, every step of the way. 👣`,
                
				`Tomar shathe kotha na bolle, my day feels incomplete and empty.
				তুমি আমার সেই গোপন ইচ্ছে, যা আমি সব সময় পূরণ করতে চাই.
				**sm**, তুমি আমার সবথেকে প্রিয় অভ্যাস। 🌹`,
                
				`আমার জীবনের প্রতিটি মোড়, আমি চাই তুমি আমার পাশে থাকো.
				Your presence is the most comforting thing in my chaotic world.
				**Shourov** shudhu tomakei valobashe, don't ever forget that. 💯`,
                
				`Tumi amar jiboner shanti, you are my calm in the storm.
				তোমার ঐ নরম স্পর্শ, আমার কাছে সেটাই একমাত্র আশ্রয়.
				**sm**, তুমি আমার পৃথিবী, my precious world. 🌍`,
                
				`আমার চোখের দিকে তাকাও, you will see your reflection in my heart.
				Tomake chhara jibon-er kono mane nei, I mean it.
				**sm** er jibone tumi chhara shob shunno. 💔`,
                
				`I wish I could freeze time whenever I am with you.
				Tumi amar shobcheye boro shukher karon, my biggest joy.
				**sm**, তুমি আমার সেই জাদু, যা আমাকে বাঁচিয়ে রাখে। ✨`,

				`You are the best chapter in the book of my life.
				Tumi amar kache onek beshi dami, more than gold.
				**Shourov** তোমার প্রেমে বারবার পড়েছে, and I'll keep falling. 🔄`,

				`আমার সমস্ত কবিতা আর গান, all are dedicated to you, my love.
				Tumi amar jiboner alok barti, my guiding light.
				**Shourov**, তুমি আমার শ্বাস, you are my oxygen. 🌬️`,

				`Just seeing your name pop up on my screen makes my day brighter.
				Tomar bhalobasha amar jiboner sobcheye boro power.
				**Shourov** will protect you always, my shield is for you. 🛡️`,

				`Bhalobasha mane shudhu tomakei dekha, ar kotha mane shudhu tomar kotha shona.
				You are my first thought in the morning and my last thought at night.
				**sm**, তুমি আমার স্বপ্ন, my reality. 🌌`,
                
				`I want to spend every single sunrise and sunset holding your hand.
				Tumi amar hridoyer rani, my queen forever.
				**Shourov** শুধু তোমাকেই চায়, and no one else. 👑`,

				`তোমার ঐ মিষ্টি হাসি, amar moner kache ekta perfect melody.
				You are the answer to all my silent prayers.
				**sm**, তুমি আমার সবথেকে প্রিয় উপহার। 🎁`,

				`I love the way you make me feel—alive and deeply loved.
				Tomake amar jibone peye ami dhonno, I am grateful for you.
				**sm** er jiboner shobcheye boro satisfaction, shudhu tumi. ✅`,

				`তুমি আমার জীবনের সেই উপহার, যা আমি কখনোই হারাতে চাই না।
				Your love is the anchor that keeps me grounded.
				**sm**, তুমি আমার বিশ্বাস, my destiny. 🔗`,
                
				`Tumi amar jiboner shesh icche, I need you till my last breath.
				You are the most precious star in my sky.
				**sm** এর চোখে তুমি ছাড়া কেউ নেই। 🌟`,
                
				`I'm lost without you, **sm**. You are my compass.
				Tomar valobasha amar jiboner shobcheye boro thikana.
				**Shourov** er bhalobasha chironton, I promise you eternity. ♾️`,
                
				`আমার মনের কথাগুলো, shudhu tomakei bolte chai, only you.
				You are my secret wish, my open pride.
				**sm**, তুমি আমার জীবনের সবচেয়ে সুন্দর সত্য। 💖`,
                
				`Every moment spent with you is a memory I will cherish forever.
				Tumi amar shobcheye boro obhimaan, my deepest desire.
				**shourov** তোমার ঐ মায়ায় বাঁধা পড়েছে। 🎀`,
                
				`You are the reason I believe in love, in magic, in everything good.
				Tomake chhara amar jibon ta shudhu shukhno, like a desert.
				**sm**, তুমি আমার হৃদয়ের স্পন্দন, my lifeline. ❤️‍🔥`,
                
				`আমার জীবনের প্রতিটি মোড়, I want to share that path only with you.
				Tumi amar shobcheye boro dhon, my greatest treasure.
				**Shourov** loves you more than words can say. 💬`
			];
			const randomIndex = Math.floor(Math.random() * captions.length);
			const randomCaption = captions[randomIndex];
			api.sendMessage({ body: randomCaption }, event.threadID, event.messageID);
		}
	}
};