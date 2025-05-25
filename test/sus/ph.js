const { SlashCommandBuilder, Client, AttachmentBuilder, EmbedBuilder, Partials} = require('discord.js');
module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('ph')
		.setDescription('A random number generator because you have an addiction'),
	async execute(interaction) {
        const messageEmbed = new EmbedBuilder();
        const ranNumbs = Math.floor(Math.random() * 75) + 1
        const attachment = new AttachmentBuilder('./images/p.png', { name: 'p.png' });
        messageEmbed.setColor('#ffa31a')
        messageEmbed.setTitle('Your path is Pornhub!')
        messageEmbed.setImage(`attachment://${attachment.name}`);
        messageEmbed.setDescription(`Random number: ${ranNumbs}`)
        interaction.reply({ embeds: [messageEmbed] , ephemeral: true, files: [attachment]})
    },
};