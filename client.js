const grammy = require("grammy");
const dotenv = require("dotenv").config();

const client = new grammy.Bot(process.env.CLIENT_TOKEN);

client.command("start", (ctx) => ctx.reply("Hola!"));

client.on("message", (ctx) => 
{
    ctx.reply("Hello!");

    console.log(`Request from ${ctx.from}`);
});

if (process.env.NODE_ENV == "production")
{
    const express = require("express");

    const application = express();

    application.use(express.json());

    application.use(grammy.webhookCallback(client, "express"));

    application.listen(process.env.PORT || 3000, () => console.log("Running"));
}

else
{
    client.start().then(console.log("Started"));
}