//Exit Button

module.exports = {
    name: 'exit',
    cooldown: 5,
	async execute(interaction) {
        interaction.message.delete()
	},
};