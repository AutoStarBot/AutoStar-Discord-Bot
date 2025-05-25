//NSFW Yes Button

module.exports = {
    name: 'nsfwyes',
    cooldown: 5,
	async execute(interaction) {
        interaction.channel.setNSFW(true)
        interaction.message.delete()
	},
};