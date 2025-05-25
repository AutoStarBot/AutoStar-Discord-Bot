//Channel delete Command which deletes the channel

const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, InteractionContextType } = require('discord.js');

module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('channeldelete')
		.setDescription('Delete the channel')
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
        messageEmbed.setTitle('Safety Step!')
        messageEmbed.setDescription('Are you sure you want to delete channel?')
        const row = new ActionRowBuilder()
            .addComponents(
            new ButtonBuilder()
                .setCustomId('dontdeletechannel')
                .setLabel('No')
                .setEmoji('⛔')
                .setStyle('Success'),
            new ButtonBuilder()
                .setCustomId('deletechannel')
                .setLabel('Yes')
                .setEmoji('✅')
                .setStyle('Danger'),
            )
            const response = await interaction.reply({ embeds: [messageEmbed] , ephemeral: false, components: [row] });
            const collectorFilter = i => i.user.id === interaction.user.id
            try {
                const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
                if (confirmation.customId === 'deletechannel') {
                    confirmation.channel.delete()
                } else if (confirmation.customId === 'dontdeletechannel') {
                    confirmation.message.delete()
                }
            } catch (e) {
                await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
            }
	},
};