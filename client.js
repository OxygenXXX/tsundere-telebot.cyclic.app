const grammy = require("grammy");
const dotenv = require("dotenv").config();

const client = new grammy.Bot(process.env.CLIENT_TOKEN);

client.command("start", (context) =>
{
    console.log(`Client started by ${context.from.id}`);
});

if (process.env.NODE_ENV == "production")
{
    const express = require("express");
    const datetime = require("node-datetime");

    const client_port = process.env.PORT || 3000;

    const application = express();

    application.use(express.urlencoded({ extended: true }));
    application.use(express.json());

    application.use((request, response, handler) =>
    {
        const timestamp = datetime.create();

        console.log(`Time: ${timestamp.format("H:M:S Y.m.d")}`);

        handler();
    });

    application.use(grammy.webhookCallback(client, "express"));

    const server = application.listen(client_port, () =>
    {
        console.log(`Client port: ${server.address().port}`);
    });
}

if (process.env.NODE_ENV == "development")
{
    const server = client.start().then
    (
        console.log(`Client started using long-polling`)
    ); 
}