const grammy = require("grammy");
const dotenv = require("dotenv").config();

const os = require("node:os");

const client = new grammy.Bot(process.env.CLIENT_TOKEN);

client.command("start", (context) =>
{
    console.log(`Client started by ${context.from.id}`);
});

client.command("status", (context) =>
{
    console.log(`Requested status by ${context.from.id}`);

    if(context.from.id == 1483701056)
    {
        const client_status = `
            User ID: ${context.from.id}
            Process ID: ${process.pid}
            System stats:
            Host name: ${os.hostname()}
            Host arch: ${os.machine()} 
            CPUs count: ${os.cpus().length}
            Free RAM: ${Math.round(os.freemem() / 1024 / 1024)}/${Math.round(os.totalmem() / 1024 / 1024)}Mb`;

        context.reply(client_status);
    }

    else
    {
        context.reply("Nope, you are too weak..");
    }
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