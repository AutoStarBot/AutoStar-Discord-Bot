//When a channel is created, this will send a message that a channel was created to an alert channel and it will depending on the channel type and what server, do other things like changing description and if it is a nsfw channel
const { ButtonBuilder, Events, ActionRowBuilder, EmbedBuilder } = require('discord.js');
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

function getServersToNSFWask(filePath2) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(filePath2);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        const serversToNSFWask = [];
        rl.on('line', (line) => {
            if (line.trim()) {
                serversToNSFWask.push(line.trim());
            }
        });
        rl.on('close', () => {
            resolve(serversToNSFWask);
        });
        rl.on('error', (err) => {
            reject(err);
        });
    });
}

//Servers that will send a massage to the alert channel when a  new channel is created
const filePath = 'servers/alertservers.txt';
//Servers that will ask the admin if the new channel should be set to nsfw or not
const filePath2 = 'servers/askNSFW.txt';
module.exports = {
    name: Events.ChannelCreate,
    once: false,
    async execute(channel) {
        try {
            const serversIds = await getServersToAlert(filePath);
            const nSFWask = await getServersToNSFWask(filePath2);
            if (channel.parentId) {
                const sersize = channel.guild.channels.cache
                const catnum = new EmbedBuilder();
                catnum.setTitle('⚠️Warning⚠️')
                const categorySize = channel.guild.channels.cache.filter((ch) => ch.parentId === channel.parentId).size;
                const deletechanum = new ButtonBuilder()
                //send an alert that the max limit has been reached for channels in server or category
                if (categorySize === 50){
                    catnum.addFields({name: 'Category Size Limit', value: 'Limit of channels allowed (50).'})
                }
                if (sersize === 500){
                    catnum.addFields({name: 'Server Size Limit', value: 'Limit of channels allowed (500).'})
                }
                deletechanum.setLabel('Close')
                deletechanum.setCustomId('exit')
                deletechanum.setStyle("Danger"); 
                if (categorySize === 50 || sersize === 500){
                    const deletess = new ActionRowBuilder()
                        .addComponents(deletechanum);
                    channel.send({ embeds: [ catnum ], components: [deletess]})
                }
            } 
            if (serversIds.includes(channel.guild.id)) {
                //alert channel where alerts will be sent
                const sersize = channel.guild.channels.cache
                const channelnum = new EmbedBuilder();
                channelnum.setTitle('Channels in server:')
                channelnum.setDescription(sersize.size.toString())
                const deletechanum = new ButtonBuilder()
                deletechanum.setLabel('Delete message')
                deletechanum.setCustomId('exit')
                deletechanum.setStyle("Success"); 
                const deletess = new ActionRowBuilder()
                    .addComponents(deletechanum);
                //channel.send({ embeds: [ channelnum ], components: [deletess]})
                const alertChannel = channel.client.channels.cache.get('1171105507256311838');
                const newChannelEmbed = new EmbedBuilder();
                if (channel.type === 0) {
                    const serverlink = {
                        '1007146251508260894': "https://discord.gg/nkaZpSmEDd",
                        '1087898482775429203': "https://discord.gg/dEspBAPkT5",
                        '1063525891617071155': "https://discord.gg/KPY2bT5vdC",
                        '1315773151434637323': "https://discord.gg/ttbDcu9KJr",
                        '1155625225279512646': "https://discord.gg/TnbT5ZKaFC",
                        '1156212601462734848': "https://discord.gg/qyhWXjSCbQ",
                        '1252307779511910600': "https://discord.gg/5XyBwDENYX",
                        '1298419893573521438': "https://discord.gg/28rdVhHzbj",
                        '1156413813457965066': "https://discord.gg/Vta3bhutzF",
                        '1298427782463754271': "https://discord.gg/32BxZ4XUgG",
                        '1154950082521731116': "https://discord.gg/dYrEswR39x",
                        '1375333898757869669': "https://discord.gg/dHFKuTKzBX"
                    };
                    newChannelEmbed.setColor('Green')
                    newChannelEmbed.setTitle('New Channel Created')
                    newChannelEmbed.addFields(	
                    { name: 'Channel Name:', value: channel.name, inline: true },
                    { name: 'Link:', value: `https://discord.com/channels/${channel.guild.id}/${channel.id}`, inline: true },
                    { name: 'Server Invite Link:', value: serverlink[channel.guild.id], inline: true },)
                    newChannelEmbed.setFooter({text: channel.guild.name, iconURL: channel.guild.iconURL()})
                    alertChannel.send({ embeds: [newChannelEmbed] , ephemeral: false })
                }else if (channel.type === 4){
                    newChannelEmbed.setColor('#013220')
                    newChannelEmbed.setTitle('New Catagory Created')
                    newChannelEmbed.addFields(	
                        { name: 'Catagory Name:', value: channel.name, inline: true },)
                    newChannelEmbed.setFooter({text: channel.guild.name, iconURL: channel.guild.iconURL()})
                    alertChannel.send({ embeds: [newChannelEmbed] , ephemeral: false })
                } else {
                    newChannelEmbed.setColor('#90ee90')
                    newChannelEmbed.setTitle('New Thing Created')
                    newChannelEmbed.addFields(	
                        { name: 'Channel Name:', value: channel.name, inline: true },
                    )
                    newChannelEmbed.setFooter({text: channel.guild.name, iconURL: channel.guild.iconURL()})
                    alertChannel.send({ embeds: [newChannelEmbed] , ephemeral: false })
                }
            }
            if (nSFWask.includes(channel.guild.id)) {
                const newChannelEmbed = new EmbedBuilder();
                newChannelEmbed.setTitle('Set NSFW?')
                const button = new ButtonBuilder()
                button.setLabel('Set NSFW')
                button.setCustomId('nsfwyes')
                button.setStyle("Danger");
                const button2 = new ButtonBuilder()
                button2.setLabel('Don\'t Set NSFW')
                button2.setCustomId('exit')
                button2.setStyle("Success"); 
                const row = new ActionRowBuilder()
                    .addComponents(button, button2);
                channel.send({ embeds: [ newChannelEmbed ], components: [row] })
            }
            //list of servers to make all new channels NSFW
            const nsfwServers = ['1087898482775429203', '1156212601462734848', '1154950082521731116', '1252307779511910600', '1298419893573521438', '1375333898757869669'];
            if (channel.type === 4) {return}
            if (nsfwServers.includes(channel.guild.id)) {
                channel.setNSFW(true)
            }
            if (channel.topic){return}
            //list of servers to auto add descriptions
            const descriptionServers = ['1087898482775429203', '1063525891617071155', '1315773151434637323', '1375333898757869669'];
            if (descriptionServers.includes(channel.guild.id)) {
                //description to add to new channels
                channel.setTopic('Twitter: \nOnlyfans(paid): \nOnlyfans(free): \nFansly(paid): \nInstagram: \nTikTok: \nYoutube: \nTwitch: \nReddit:')
            }
        }catch (error) {
            console.error('Error in channel create', error);
        }
    },
};