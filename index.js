const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf('8234596960:AAGAzgSOsaMJ3nl2bqgo6kW-CzBOPJ6Odig');

// O‘yinlar ro‘yxati
const games = [
  { title: "🐍 Snake", url: "https://yourdomain.com/snake" },
  { title: "🚀 Rocket Dash", url: "https://yourdomain.com/rocket" },
  { title: "⚽ Football", url: "https://yourdomain.com/football" },
  { title: "💣 Minesweeper", url: "https://yourdomain.com/minesweeper" },
  { title: "🏹 Archery", url: "https://yourdomain.com/archery" },
  { title: "🎯 Aim Trainer", url: "https://yourdomain.com/aim" },
  { title: "🏎️ Racer", url: "https://yourdomain.com/racer" },
  { title: "🧠 Memory Match", url: "https://yourdomain.com/memory" },
  { title: "🎲 Dice Roll", url: "https://yourdomain.com/dice" },
  { title: "🕹️ Tetris+", url: "https://yourdomain.com/tetris" },
];

bot.start((ctx) => {
  // 2 tadan qilib qatorlarga bo‘lamiz
  const buttons = [];
  for (let i = 0; i < games.length; i += 2) {
    const row = games
      .slice(i, i + 2)
      .map(g => Markup.button.webApp(g.title, g.url));
    buttons.push(row);
  }

  ctx.reply(
    "🎮 *Salom, Gamer!* \n\n👇 Quyidagi o‘yinlardan birini tanlang va mazza qiling!",
    {
      parse_mode: "Markdown",
      ...Markup.keyboard(buttons),
    }
  );
});

bot.launch();
