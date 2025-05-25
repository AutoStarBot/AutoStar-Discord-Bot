//When a channel is deleted, this will send a message that a channel was deleted to an alert channel

const chalk = require('chalk');
const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const readline = require('readline');

function getServersToAlert(filePath) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        const serversToAlert = [];

        rl.on('line', (line) => {
            if (line.trim()) {
                serversToAlert.push(line.trim());
            }
        });

        rl.on('close', () => {
            resolve(serversToAlert);
        });

        rl.on('error', (err) => {
            reject(err);
        });
    });
}

const filePath = 'servers/alertservers.txt';
module.exports = {
    name: Events.ChannelDelete,
    once: false,
    async execute(channel) {
        try {
            const serversIds = await getServersToAlert(filePath);
            if (serversIds.includes(channel.guild.id)) {
                const alertChannel = channel.client.channels.cache.get('1171105507256311838');
                const newChannelEmbed = new EmbedBuilder();
                newChannelEmbed.setColor('Red')
                newChannelEmbed.setTitle('Channel Deleted')
                newChannelEmbed.addFields({ name: 'Channel Name:', value: channel.name, inline: true })
                newChannelEmbed.setFooter({text: channel.guild.name, iconURL: channel.guild.iconURL()})
                alertChannel.send({ embeds: [newChannelEmbed] , ephemeral: false })
            }
        }catch (error) {
            console.error('Error reading the servers to leave:', error);
        }
    },
};