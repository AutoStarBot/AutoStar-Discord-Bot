//Export a channel to another server (this does not move images)

const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, InteractionContextType } = require('discord.js');
module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('export')
        .setDescription('Export channel (wo content) to another server')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setContexts(InteractionContextType.Guild)
        .addStringOption(option =>
            option.setName('server')
                .setDescription('What server do you want to export to?')
                .setRequired(true)
                .setMaxLength(20) 
        ),
    async execute(interaction) {
        const messageEmbed = new EmbedBuilder();
        
        if (interaction.options.getString('server') === '1063525891617071155'){
            guild = interaction.client.guilds.cache.get('1063525891617071155');
            cataS = "+"
        }else{
            guild = interaction.client.guilds.cache.get(interaction.options.getString('server'));
            cataS = "0"
        }
        if (!guild) {
            interaction.reply({content: 'Guild not found in cache.', ephemeral: true });
            return;
        }
        const categories = guild.channels.cache
            .filter(channel => channel.type === 4)
            .sort((a, b) => a.position - b.position)
        if (cataS === '+') {
            secondLowestCategory = categories.size > 1 ? categories.at(categories.size - 3) : null;
        }else{
            secondLowestCategory = categories.size > 1 ? categories.at(categories.size - 1) : null;
        }

        if (!secondLowestCategory) {
            messageEmbed.setColor('Red')
                .setTitle('Error: No Categories Found')
                .setDescription('No categories found in the guild to add the new channel.');
            interaction.reply({ embeds: [messageEmbed], ephemeral: true });
            return;
        }
  
            guild.channels.create({
                name: interaction.channel.name,
                type: 0,
                parent: secondLowestCategory.id,
                topic: interaction.channel.topic
            })
            .then(newchannel => {
                const newChannelId = newchannel.id;
                interaction.reply({embeds: [],content: `The channel has been made with the name of: \`\`\`${newchannel.name}\`\`\` \n Here is a link to the channel: https://discord.com/channels/${guild.id}/${newChannelId}`, ephemeral: true});
                interaction.channel.setName('Exported Channel')
                return
            })
    },
};