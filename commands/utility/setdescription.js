//Set Description Command which lets you change the channels description

const chalk = require('chalk');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, InteractionContextType } = require('discord.js');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('setdescription')
        .setDescription('Add/change channel description')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const messageEmbed = new EmbedBuilder();
        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageChannels)){
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'Bot Missing Permission\'')
            messageEmbed.setDescription('This bot can not perform that action without `Manage Channels` permission')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
            return
        }
        const modal = new ModalBuilder()
			.setCustomId('myModal')
			.setTitle('My Modal');
        const topicInput = new TextInputBuilder()
			.setCustomId('topicInput')
            .setMaxLength(1_024)
			.setLabel("Description:")
            .setPlaceholder("What description do you want to set this channel to?")
			.setStyle(TextInputStyle.Paragraph)
            .setRequired(true);
        const actionRow = new ActionRowBuilder().addComponents(topicInput); 
        modal.addComponents(actionRow);
        await interaction.showModal(modal);
        const collectorFilter = i => i.user.id === interaction.user.id;
        try {
            const modalSubmitInteraction = await interaction.awaitModalSubmit({ filter: collectorFilter, time: 60_000 });
            const newChannelId = interaction.channel.id;
            const namingchannel = interaction.guild.channels.cache.get(newChannelId);
            const topic = modalSubmitInteraction.fields.getTextInputValue('topicInput');
            namingchannel.setTopic(topic)
            messageEmbed.setColor('Blurple');
            messageEmbed.setTitle('Channel Description Updated Successfully');
            messageEmbed.setDescription(`This channel's description has been updated to: \`\`\`${topic}\`\`\``);
            await modalSubmitInteraction.reply({ embeds: [messageEmbed], ephemeral: true });
        } catch (e) {
            await interaction.reply({ content: 'Modal not received within 1 minute, cancelling', components: [] });
        }
    },
};