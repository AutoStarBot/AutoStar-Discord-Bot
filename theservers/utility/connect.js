//Connect one channel to another channel using an id of one of the channels

const chalk = require('chalk');
const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');
module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('connect')
        .setDescription('Connect a sfw channel to nsfw channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption(option =>
            option
                .setName('channelid')
                .setDescription('ID of the other channel')
                .setRequired(true)),
    async execute(interaction) {
        const channelid = interaction.options.getString('channelid');
        const channel = await interaction.client.channels.fetch(channelid);
        const guildid = channel.guild.id
        const description = interaction.channel.topic;
        const topicDescription = description ? description : "";
        const otherdescrip = channel.topic;
        const othertopicDescrip = otherdescrip ? otherdescrip : "";
        if (othertopicDescrip.includes('Otherside:')) {
            interaction.reply({content: `Other Channel Already Connected. Maybe you copied the wrong id.` , ephemeral: true})
            return
        }
        interaction.channel.setTopic(`Otherside: https://discord.com/channels/${guildid}/${channelid}\n` + topicDescription);
        channel.setTopic(`Otherside: https://discord.com/channels/${interaction.guildId}/${interaction.channel.id}\n` + othertopicDescrip);
        interaction.reply({content: `Linked channel to: https://discord.com/channels/${guildid}/${channelid}` , ephemeral: true})
    }
};