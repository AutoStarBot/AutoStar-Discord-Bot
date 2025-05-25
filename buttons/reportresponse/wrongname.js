//Response if someone reports an image as having the wrong name

const chalk = require('chalk');
const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'wrongname',
    cooldown: 5,
	async execute(interaction) {
        const message = interaction.message;
        const embed = message.embeds[0];
        const title = embed.footer.text;
        const name = embed.title;
        const embedmeme = new EmbedBuilder();
        const alertMessage = new EmbedBuilder();
        const alertChannel = interaction.client.channels.cache.get('1271521076840759387');
        alertMessage.setColor('#ff0000')
        alertMessage.setTitle('New Report: Image With Wrong Name')
        alertMessage.setDescription(`File Name: ` + title)
        alertMessage.setFooter({ text: `Title: ${name}` });
        alertChannel.send({ embeds: [alertMessage] , ephemeral: false })
        embedmeme.setColor('#ff0000')
        embedmeme.setTitle(`File Reported For Having Wrong Name`)
        embedmeme.setDescription('The Error Has Been Noted')
        embedmeme.setFooter({ text:`File Name: ` + title})
        interaction.update({ embeds: [ embedmeme ], content: '', components: [], files: []})
	},
};