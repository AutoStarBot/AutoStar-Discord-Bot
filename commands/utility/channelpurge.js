//Channel purge Command which remakes the channel with no messages

const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, InteractionContextType } = require('discord.js');

module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('channelpurge')
		.setDescription('Removes all messages from a channel by cloning and removing channel')
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
        messageEmbed.setDescription('Are you sure you want to delete the channel?')
        const row = new ActionRowBuilder()
            .addComponents(
            new ButtonBuilder()
                .setCustomId('dontdeletechannel')
                .setLabel('No')
                .setStyle('Success')
                .setEmoji('⛔'),
            new ButtonBuilder()
                .setCustomId('purgechannel')
                .setLabel('Yes')
                .setEmoji('✅')
                .setStyle('Danger'),
            )
        const response = await interaction.reply({ embeds: [messageEmbed] , ephemeral: false, components: [row] });
        const collectorFilter = i => i.user.id === interaction.user.id
        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
            if (confirmation.customId === 'purgechannel') {
                confirmation.channel.clone()
                confirmation.channel.delete()
                } else if (confirmation.customId === 'dontdeletechannel') {
                confirmation.message.delete()
            }
        } catch (e) {
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
        }
	},
};