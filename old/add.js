console.log("NodeJS Version: " + process.version)

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds ] });

const { MessageEmbed } = require('discord.js');

client.once('ready', async () => {
    const alertChannel = client.channels.cache.get('1171105507256311838');
    const data = {
        name: 'nsfwsmashorpass',
        description: 'The world known smashorpass game (NSFW version)',
    };
    const command = await client.application?.commands.create(data);
    console.log('done')
    const newCommand = new EmbedBuilder();
    newCommand.setColor('Blurple')
    newCommand.setTitle('New Command has been Created')
    newCommand.addFields(
        {name: 'Command Name:', value: data.name},
        {name: 'Description:', value: data.description}
    );
    alertChannel.send({ embeds: [newCommand] , ephemeral: false })
});
client.login('')