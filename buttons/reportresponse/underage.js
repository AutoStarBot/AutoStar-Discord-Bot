//Response if someone reports an image as being underage

const { EmbedBuilder} = require('discord.js');
module.exports = {
    name: 'underage',
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
        alertMessage.setTitle('New Report: Image Flagged As Underaged Content')
        alertMessage.setDescription(`File Name: ` + title)
        alertMessage.setFooter({ text: `Title: ${name}` });
        alertChannel.send({ embeds: [alertMessage] , ephemeral: false })
        embedmeme.setColor('#ff0000')
        embedmeme.setTitle(`File Reported For Containing Underage Content`)
        embedmeme.setDescription('Bot can\'t shutdown to protect from false flagging but we take these reports very suriously and will look into it as soon as possible')
        embedmeme.setFooter({ text:`File Name: ` + title})
        interaction.update({ embeds: [ embedmeme ], content: '', components: [], files: []})
	},
};