const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");
const config = require("./config");
const path = require('path');

const bot = new TelegramBot(config.botToken, {
  polling: true,
	request: {
	  url: undefined,
	  proxy: "http://127.0.0.1:7890",
	},
});
// {
// 	polling: true,
// 	request: {
// 	  url: undefined,
// 	  proxy: "http://127.0.0.1:7890",
// 	},
// }

const app = express();
app.use(bodyParser.json());

const serviceUrl = config.serviceUrl;
const webhookPath = "/bot-server/path-to-webhook";
const webhookUrl = `${serviceUrl}${webhookPath}`;
console.log("serviceUrl:", serviceUrl);
console.log("webhookUrl:", webhookUrl);

bot.onText(/\/start/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const relativePath = 'images/banner-img.png';
		const absolutePath = path.resolve(__dirname, relativePath);
    bot.sendPhoto(chatId, absolutePath, {
			caption:
				'eBridge enables secure, fast, and cost-effective asset transfers between aelf and other blockchain ecosystems.',
			reply_markup: {
				inline_keyboard: [
          [
            {
              text: "Bridge",
              web_app: {
                url: config.bridgeUrl,
              },
            },
          ],
          [
            {
              text: "Join Community",
              web_app: {
                url: config.communityUrl,
              },
            },
            {
              text: "Follow X",
              url: config.twitterUrl,
            },
          ],
        ],
			},
		});
  } catch (error) {
    console.error("onText error", error);
  }
});

async function clearWebhook() {
  try {
    await bot.setWebHook();
    console.log("Webhook cleared");
  } catch (error) {
    console.error("Error clearing webhook:", error);
  }
}

async function setWebhook() {
  try {
    const res = await bot.setWebHook(webhookUrl, {
      max_connections: 1000,
      drop_pending_updates: true,
      allowed_updates: [
        "message",
        "callback_query",
        "inline_query",
        "chosen_inline_result",
        "edited_message",
        "channel_post",
        "edited_channel_post",
        "poll",
        "my_chat_member",
        "chat_member",
        "poll_answer",
        "chat_join_request",
      ],
    });
    console.log(`res:${res} Webhook set to ${webhookUrl}`);
  } catch (error) {
    console.error("Error setting webhook:", error);
  }
}

app.post(webhookPath, (req, res) => {
  try {
    console.log("==request", req?.body?.message?.text);
    bot.processUpdate(req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error handling webhook update:", error);
    res.sendStatus(500);
  }
});

app.get("/bot-server/test", (req, res) => {
  res.send("work!");
});

app.listen(3333, async () => {
  console.log("Webhook server is listening on port 3333");
  await clearWebhook();
  setWebhook();
});

module.exports = app;
