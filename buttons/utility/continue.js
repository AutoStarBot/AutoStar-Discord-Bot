//Continue Button

module.exports = {
    name: 'continue',
    cooldown: 5,
	async execute(interaction) {
        interaction.message.delete()
	},
};