const TelegramBot = require('node-telegram-bot-api');

// Замініть 'YOUR_TELEGRAM_BOT_TOKEN' на токен, отриманий від BotFather
const token = '6343783861:AAHeU_rac1XQkTAeBT3hacvgZ7-c2M-pnJo';

// Створюємо бота
const bot = new TelegramBot(token, {polling: true});

// Логіка обробки повідомлень
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(msg);
    // Відправляємо ID чату назад користувачу
    bot.sendMessage(chatId, `Твій ID чату: ${chatId}`);
});