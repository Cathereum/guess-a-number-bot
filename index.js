const TelegramApi = require("node-telegram-bot-api");
const token = "5535733319:AAE0KfRxKuxEWmd8MftkwaSL2_dyHoEKgMs";
const bot = new TelegramApi(token, { polling: true });
const { gameButtons, playAgain } = require("./gameButtons");
const sequelize = require("./db");
const UserModel = require("./models");

const chats = {};

const startGame = (chatId) => {
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  return bot.sendMessage(chatId, "Отгадывай!", gameButtons);
};

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (e) {
    console.log("Подключение к бд сломалось", e);
  }

  bot.on("message", async (message) => {
    const text = message.text;
    const chatId = message.chat.id;

    try {
      if (text === "/start") {
        await UserModel.create({ chatId });

        await bot.sendSticker(
          chatId,
          "https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/4.webp"
        );
        return bot.sendMessage(chatId, `Добро пожаловать в чат!!`);
      }
      if (text === "/info") {
        const user = await UserModel.findOne({ chatId });

        return bot.sendMessage(
          chatId,
          `Я знаю что тебя зовут ${message.from.first_name}, сейчас у тебя ${user.right} правильных ответов, и ${user.wrong} неправильных`
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
    } catch (e) {
      bot.sendMessage(chatId, "Произошла какая-то ошибка");
    }
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    const user = await UserModel.findOne({ chatId });

    if (data === "/again") {
      return startGame(chatId);
    }

    if (data == chats[chatId]) {
      user.right += 1;
      bot.sendMessage(
        chatId,
        `Поздравляю ты отгадал цифру ${chats[chatId]}`,
        playAgain
      );
    } else {
      user.wrong += 1;
      bot.sendMessage(
        chatId,
        `К сожалению ты не отгадал, бот загадал цифру ${chats[chatId]}`,
        playAgain
      );
    }
    await user.save();
  });
};

start();
