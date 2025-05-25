//When the bot is added to a new server

const chalk = require('chalk');
const { Events, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const readline = require('readline');

function getServersToLeave(filePath) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        const serversToLeave = [];

        rl.on('line', (line) => {
            if (line.trim()) {
                serversToLeave.push(line.trim());
            }
        });

        rl.on('close', () => {
            resolve(serversToLeave);
        });

        rl.on('error', (err) => {
            reject(err);
        });
    });
}

const filePath = 'servers/toleave.txt';

module.exports = {
    name: Events.GuildCreate,
    once: false,
    async execute(g) {
        try {
            const serversToLeave = await getServersToLeave(filePath);
            const channel = g.channels.cache.find(channel => channel.type === 0 && channel.permissionsFor(g.members.me).has(PermissionFlagsBits.SendMessages))
            const messageEmbed = new EmbedBuilder();
            if (serversToLeave.includes(g.id)) {
                messageEmbed.setColor('Red')
                messageEmbed.setTitle('Server is on the Bad server list')
                messageEmbed.setDescription('Leaving server now')
                channel.send({ embeds: [messageEmbed] , ephemeral: false })
                g.leave()
                .then(() => console.log(chalk.redBright(`Left ${g.name}`)))
                .catch(err => console.error('Error leaving the guild:', err));
                const alertChannel = g.client.channels.cache.get('1253053210789150790');
                const newChannelEmbed = new EmbedBuilder();
                newChannelEmbed.setColor('Red')
                newChannelEmbed.setTitle('Bot left a bad server')
                newChannelEmbed.addFields(
                    {name: '💾 Servers:', value: `${g.client.guilds.cache.size}`, inline: true}
                )   
                newChannelEmbed.setTimestamp()
                alertChannel.send({ embeds: [newChannelEmbed] , ephemeral: false })
            }else{
                if(!channel) return
                messageEmbed.setColor('White')
                messageEmbed.setTitle('Thank you for inviting me!')
                // messageEmbed.setDescription("I have a list of channel names (bot-commands, rules, welcome, general, .etc) I wont react in but if you don't want me to react to messages in a channel, just make it so that I can't see the channel. \n If you don't want me to react to a message send message with (copy code box above) at the beginning")
                messageEmbed.setDescription("I have a list of channel names (bot-commands, rules, welcome, general, .etc) I wont react in but if you don't want me to react to messages in a channel, just make it so that I can't see the channel.")
                //channel.send({content: `\`\`\`‎\`\`\``, embeds: [messageEmbed] , ephemeral: false, files: ["./images/example.png"] });
                channel.send({embeds: [messageEmbed] , ephemeral: false, files: ["./images/example.png"] });
            }
            const alertChannel = g.client.channels.cache.get('1253053210789150790');
            const newChannelEmbed = new EmbedBuilder();
            newChannelEmbed.setColor('Green')
            newChannelEmbed.setTitle('Bot has been added to a server')
            newChannelEmbed.addFields(
                { name: '💾 Servers:', value: `${g.client.guilds.cache.size}`, inline: true}
            )
            newChannelEmbed.setTimestamp()
            alertChannel.send({ embeds: [newChannelEmbed] , ephemeral: false })
        }catch (error) {
            console.error('Error reading the servers to leave:', error);
        }
    },
};