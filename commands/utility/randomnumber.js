//Random Number Command which sends a random number between two numbers

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('randomnumber')
        .setDescription('Generate a *random* number between two values')
        .addStringOption(low =>
            low.setName('low')
                .setDescription('What should the low value be')
                .setRequired(true)
                .setMaxLength(100))
        .addStringOption(high =>
            high.setName('high')
                .setDescription('What should the high value be')
                .setRequired(true)
                .setMaxLength(100)),
    async execute(interaction) {
        const messageEmbed = new EmbedBuilder();
        messageEmbed.setColor('White')
        messageEmbed.setTitle('Random Value Generated')
        const min = parseInt(interaction.options.getString('low'), 10);
        const max = parseInt(interaction.options.getString('high'), 10);
        if (isNaN(min) || isNaN(max) || min > max) {
            return interaction.reply({ content: 'Please provide valid numbers, with the minimum being less than or equal to the maximum.', ephemeral: true });
        }
        const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
        messageEmbed.setDescription(`${randomValue}`)
        messageEmbed.setFooter({ text: `Min: ${min} | Max: ${max}` })
        interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
    },
}