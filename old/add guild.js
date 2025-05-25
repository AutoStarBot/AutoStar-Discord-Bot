console.log("NodeJS Version: " + process.version)

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds,] });

const { MessageEmbed } = require('discord.js');

client.once('ready', async () => {
    const data = {
        name: 'otherside',
        description: 'clones channel to otherside (NSFW ↔ SFW)',
    };
    const guild = client.guilds.cache.get('1156413813457965066');
    const command = await guild.commands.create(data);
});
client.login('')