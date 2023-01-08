const TelegramApi = require("node-telegram-bot-api");
const token = "5535733319:AAE0KfRxKuxEWmd8MftkwaSL2_dyHoEKgMs";
const bot = new TelegramApi(token, { polling: true });
const { gameButtons, playAgain } = require("./gameButtons");
const chats = {};

const startGame = (chatId) => {
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  return bot.sendMessage(chatId, "Отгадывай!", gameButtons);
};

//новый

const start = () => {
  bot.on("message", async (message) => {
    const text = message.text;
    const chatId = message.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/4.webp"
      );
      return bot.sendMessage(chatId, `Добро пожаловать в чат!!`);
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Я знаю что тебя зовут ${message.from.first_name}`
      );
    }
    if (text === "/game") {
      await bot.sendMessage(
        chatId,
        "Сейчас я загадаю число от 0 до 9 а ты попробуй его угадать ;)"
      );
      return startGame(chatId);
    }

    return bot.sendMessage(
      chatId,
      "Я тебя не понимаю попробуй написать еще раз"
    );
  });

  bot.on("callback_query", (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") {
      return startGame(chatId);
    }

    if (data == chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю ты отгадал цифру ${chats[chatId]}`,
        playAgain
      );
    } else {
      return bot.sendMessage(
        chatId,
        `К сожалению ты не отгадал, бот загадал цифру ${chats[chatId]}`,
        playAgain
      );
    }
  });
};

start();
