//Random Channel Command which sends a link to a random channel

const { InteractionContextType, SlashCommandBuilder, EmbedBuilder, ChannelType} = require('discord.js');

module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('randomchannel')
        .setContexts(InteractionContextType.Guild)
		.setDescription('Sends a link to a random text channel from the server'),
	async execute(interaction) {
        const messageEmbed = new EmbedBuilder();
        const guild = interaction.guild;
        const channels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText);
        if (channels.size < 2) {
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'Only One Text Channel\'')
            messageEmbed.setDescription('No other text channels found in this small server')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
            return
        };
        const channelArray = Array.from(channels.values());
        const randomChannel = channelArray[Math.floor(Math.random() * channelArray.length)];
        if (!randomChannel) return console.log(chalk.redBright('Failed to select a random channel!'));
        const channelLink = `https://discord.com/channels/${guild.id}/${randomChannel.id}`;
        interaction.reply({content: `Random Channel: ${channelLink}`, ephemeral: true});
	},
};