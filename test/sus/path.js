const { SlashCommandBuilder, Client, AttachmentBuilder, EmbedBuilder, Partials} = require('discord.js');
module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('path')
		.setDescription('Which path will it be today?'),
	async execute(interaction) {
        const path = Math.floor(Math.random() * 5) + 1
        const messageEmbed = new EmbedBuilder();
        if (path === 1) {
            const attachment = new AttachmentBuilder('./images/r.png', { name: 'g.png' });
            messageEmbed.setColor('#FFFFFF')
            messageEmbed.setTitle('Your path is Game!')
            messageEmbed.setImage(`attachment://${attachment.name}`);
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true , files: [attachment]})
        }else if (path === 3) {
            const attachment = new AttachmentBuilder('./images/i.png', { name: 'instagram.png' });
            messageEmbed.setColor('#ffc0cb')
            messageEmbed.setTitle('Your path is Instagram!')
            messageEmbed.setImage(`attachment://${attachment.name}`);
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true , files: [attachment]})
        }else if (path === 4) { 
            const ranNumbs = Math.floor(Math.random() * 114) + 1
            const attachment = new AttachmentBuilder('./images/p.png', { name: 'p.png' });
            messageEmbed.setColor('#ffa31a')
            messageEmbed.setTitle('Your path is Pornhub!')
            messageEmbed.setImage(`attachment://${attachment.name}`);
            messageEmbed.setDescription(`Random number: ${ranNumbs}`)
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true , files: [attachment]})
        }else if (path === 5) {
            const attachment = new AttachmentBuilder('./images/x.png', { name: 'x.png' });
            messageEmbed.setColor('#000000')
            messageEmbed.setTitle('Your path is Twitter/X!')
            messageEmbed.setImage(`attachment://${attachment.name}`);
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true , files: [attachment]})
        }
    },
};