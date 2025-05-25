//Clone Channel Command which clones the channel

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
        .setName('clonechannel')
        .setDescription('Clones the channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setContexts(InteractionContextType.Guild)
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name of new channel')
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
        const newchannel =  interaction.channel.clone()
        .then(newchannel => {
            if (interaction.options.getString('name')){
            newchannel.setName(interaction.options.getString('name'))
            }
            messageEmbed.setColor('Blurple')
            messageEmbed.setTitle('Channel Cloned Successfully')
            if (interaction.options.getString('name')){
                messageEmbed.setDescription(`This channel has been cloned with the name of: \`\`\`${Converter(interaction.options.getString('name'))}\`\`\``)
            } else {
            messageEmbed.setDescription(`This channel has been cloned with the name of: \`\`\`${newchannel.name}\`\`\``)
            }
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
        })
    },
};