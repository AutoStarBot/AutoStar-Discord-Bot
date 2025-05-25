//Smash Button

module.exports = {
    name: 'smash',
    cooldown: 5,
	async execute(interaction) {
        interaction.message.delete()
	},
};