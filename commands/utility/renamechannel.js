//Rename Channel Command which lets you rename a channel

const { InteractionContextType, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const convertKeyValue = {
    ' ': '-'
}

function Converter(str) {
    let upperStr = str.toLowerCase()
    var newStr = ''
    for(let i = 0; i < upperStr.length; i++){
        const current = upperStr.charAt(i);
        newStr += convertKeyValue[current] ? convertKeyValue[current] : current;
    }
    return newStr;
}

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('renamechannel')
        .setDescription('Rename a the channel with a command')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setContexts(InteractionContextType.Guild)
        .addStringOption(option =>
            option.setName('name')
                .setDescription('What should channel be called?')
                .setRequired(true)
                .setMaxLength(100)),
    async execute(interaction) {
        const messageEmbed = new EmbedBuilder();
        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageChannels)){
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'Bot Missing Permission\'')
            messageEmbed.setDescription('This bot can not perform that action without `Manage Channels` permission')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
            return
        }
        const newChannelId = interaction.channel.id;
        const namingchannel = interaction.guild.channels.cache.get(newChannelId);
        namingchannel.setName(interaction.options.getString('name'))
        messageEmbed.setColor('Blurple')
        messageEmbed.setTitle('Channel Renamed Successfully')
        messageEmbed.setDescription(`This channel has been renamed with the name of: \`\`\`${Converter(interaction.options.getString('name').toLowerCase())}\`\`\``)
        interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
    },
};