//When a channel is update like its description, it will send a message to an alert channel.
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
//Servers that will send a massage to the alert channel when a  new channel is created
const filePath = 'servers/alertservers.txt';

module.exports = {
    name: Events.ChannelUpdate,
    once: false,
    async execute(oldChannel, newChannel) {
        try {
            const serversIds = await getServersToAlert(filePath);
            if(oldChannel.type === 2) {return} 
            if (serversIds.includes(oldChannel.guild.id)) {
                const alertChannel = newChannel.client.channels.cache.get('1171105507256311838');
                const newChannelEmbed = new EmbedBuilder();
                newChannelEmbed.setColor('Purple')
                newChannelEmbed.setTitle('Channel Updated:')
                if (!(oldChannel.nsfw === newChannel.nsfw)) {return}
                if (oldChannel.position === newChannel.position) {
                    if(!(oldChannel.name === newChannel.name)) {
                        newChannelEmbed.addFields(	
                            { name: 'Old Name:', value: oldChannel.name, inline: true },
                            { name: 'New Name:', value: newChannel.name, inline: true }
                        )
                        if(!(oldChannel.topic === newChannel.topic)) {
                            if(newChannel.topic === 'Instagram: \nTwitter/X: \nReddit: \nTikTok: \nTwitch: \nYoutube: \nOnlyfans(paid): \nFansly(paid):' || newChannel.topic === 'Twitter: \nOnlyfans(paid): \nOnlyfans(free): \nFansly(paid): \nInstagram: \nTikTok: \nYoutube: \nTwitch: \nReddit:'){return}
                            newChannelEmbed.addFields(	
                                { name: 'Old Description:', value: oldChannel.topic || 'None', inline: true },
                                { name: 'New Description', value: newChannel.topic || 'None', inline: true }
                            )
                        }
                    }else if(!(oldChannel.topic === newChannel.topic)) {
                        if(newChannel.topic === 'Instagram: \nTwitter/X: \nReddit: \nTikTok: \nTwitch: \nYoutube: \nOnlyfans(paid): \nFansly(paid):' || newChannel.topic === 'Twitter: \nOnlyfans(paid): \nOnlyfans(free): \nFansly(paid): \nInstagram: \nTikTok: \nYoutube: \nTwitch: \nReddit:'){return}
                        newChannelEmbed.addFields(	
                            { name: 'Old Description:', value: oldChannel.topic || 'None', inline: true },
                            { name: 'New Description', value: newChannel.topic || 'None', inline: true }
                        )
                    } else {
                        return
                    }
                    newChannelEmbed.setFooter({text: oldChannel.guild.name + " │ " + oldChannel.name, iconURL: oldChannel.guild.iconURL()})
                    alertChannel.send({ embeds: [newChannelEmbed] , ephemeral: false })
                } 
            }
        }catch (error) {
            console.error('Error reading the servers to leave:', error);
        }
    },
};