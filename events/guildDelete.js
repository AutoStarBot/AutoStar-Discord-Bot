//When the bot has been removed from a server

const chalk = require('chalk');
const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildDelete,
    once: false,
    async execute(g) {
        const alertChannel = g.client.channels.cache.get('1253053210789150790');
        const newChannelEmbed = new EmbedBuilder();
        newChannelEmbed.setColor('Red')
        newChannelEmbed.setTitle('Bot has been removed from a server')
        newChannelEmbed.addFields(
            {name: '💾 Servers:', value: `${g.client.guilds.cache.size}`, inline: true}
        )
        newChannelEmbed.setTimestamp()
        alertChannel.send({ embeds: [newChannelEmbed] , ephemeral: false })
    },
};