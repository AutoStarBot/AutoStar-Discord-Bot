//Next Person Button

module.exports = {
    name: 'nextperson',
    cooldown: 5,
	async execute(interaction) {
        interaction.message.delete()
	},
};