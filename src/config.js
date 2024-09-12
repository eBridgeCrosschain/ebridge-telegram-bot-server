const NETWORK_ENV = process.env.BUILD_ENV;

const configMap = {
  mainnet: {
    appUrl: "https://ebridge.exchange/bridge",
    bridgeUrl: "https://ebridge.exchange/bridge",
    twitterUrl: "https://x.com/eBridge_Web3",
    botToken: process.env.TELEGRAM_BOT_TOKEN_MAINNET,
    serviceUrl: "https://ebridge.exchange",
  },
  testnet: {
    appUrl: "https://test.ebridge.exchange/bridge",
    bridgeUrl: "https://t.me/eBridgeTest_bot/eBridge",
    twitterUrl: "https://x.com/eBridge_Web3",
    botToken: process.env.TELEGRAM_BOT_TOKEN_TESTNET,
    serviceUrl: "https://test.ebridge.exchange",
  },
};

module.exports = configMap[NETWORK_ENV];
