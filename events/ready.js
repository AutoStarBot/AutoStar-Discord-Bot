//When the bot starts up, this checks to see if the bot is in bad servers and also updates the status of the bot

const chalk = require('chalk');
const { ActivityType, Events, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
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
function getGoodservers(filePathg) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(filePathg);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        const verifedServers = [];

        rl.on('line', (line) => {
            if (line.trim()) {
                verifedServers.push(line.trim());
            }
        });

        rl.on('close', () => {
            resolve(verifedServers);
        });

        rl.on('error', (err) => {
            reject(err);
        });
    });
}
const filePath = 'servers/toleave.txt';
const filePathg = 'servers/good.txt'
module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        try {
            const serversToLeave = await getServersToLeave(filePath);
            const verifedServers = await getGoodservers(filePathg);
            console.log(chalk.blue(`Logged in as ${client.user.tag}!`));
            console.log(chalk.blue('In ' + client.guilds.cache.size + ' servers'));

            client.user.setPresence({
                activities: [{ name: `⭐️🔻 Alpha`, type: ActivityType.Custom }],
                status: 'online',
            });

            client.guilds.cache.forEach(guild => {
                if (serversToLeave.includes(guild.id)) {
                    const channel = guild.channels.cache.find(channel => channel.type === 0 && channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.SendMessages));
                    const messageEmbed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('Server is on the Bad server list')
                        .setDescription('Leaving server now. Please don\'t try to readd this bot. Nothing will change.');

                    channel.send({ embeds: [messageEmbed], ephemeral: false });
                    guild.leave().then(() => console.log(`Left ${guild.name}`));

                    const alertChannel = client.channels.cache.get('1253053210789150790');
                    const leaveS = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('Bot left a bad server')
                        .addFields({ name: '💾 Servers:', value: `${client.guilds.cache.size}`, inline: true })
                        .setTimestamp();

                    alertChannel.send({ embeds: [leaveS], ephemeral: false });
                }
            });

            const alertChannel = client.channels.cache.get('1253053210789150790');
            const newChannelEmbed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('Bot has started up')
                .addFields(
                    { name: '💾 Servers:', value: `${client.guilds.cache.size}`, inline: true },
                    { name: '✅ Verified Servers:', value: `${verifedServers.length}`, inline: true },
                    { name: '❌ Bad Servers:', value: `${serversToLeave.length}`, inline: true }
                )
                .setTimestamp();

            alertChannel.send({ embeds: [newChannelEmbed], ephemeral: false });
        } catch (error) {
            console.error('Error reading the servers to leave:', error);
        }
    },
};