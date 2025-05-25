//Set NSFW Command which lets you change the channel to either a NSFW or SFW channel

const { SlashCommandBuilder, InteractionContextType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('setnsfw')
		.setDescription('Turns NSFW on/off for channel')
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
	async execute(interaction) {
		const messageEmbed = new EmbedBuilder();
        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageChannels)){
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'Bot Missing Permission\'')
            messageEmbed.setDescription('This bot can not perform that action without `Manage Channels` permission')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
            return
        }
        const channel = interaction.channel;
        if (channel.nsfw === false) {
            channel.setNSFW(true)
            messageEmbed.setColor('#9F2B68')
            messageEmbed.setTitle('Channel set as NSFW')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
        } else {
            channel.setNSFW(false)
            messageEmbed.setColor('#9F2B68')
            messageEmbed.setTitle('Channel set as not NSFW')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
        }
	},
};