//Pass Button

module.exports = {
    name: 'pass',
    cooldown: 5,
	async execute(interaction) {
        interaction.message.delete()
	},
};