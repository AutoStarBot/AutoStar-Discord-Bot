//For when someone reports a sfw image

const { ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: 'sfwreport',
    cooldown: 5,
    async execute(interaction) {
        try {
            const message = interaction.message;
            const embed = message.embeds[0];
            const title = embed.footer.text;
            const name = embed.title;

            // Create a row of buttons for reporting issues
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('exit')
                        .setEmoji('🚫')
                        .setStyle('Secondary'),
                    new ButtonBuilder()
                        .setCustomId('wrongtype')
                        .setLabel('Not SFW')
                        .setStyle('Secondary'),
                    new ButtonBuilder()
                        .setCustomId('wrongsmash')
                        .setLabel('Wrong Smash/Pass Category')
                        .setStyle('Secondary'),
                    new ButtonBuilder()
                        .setCustomId('wrongname')
                        .setLabel('Wrong Name')
                        .setStyle('Secondary'),
                    new ButtonBuilder()
                        .setCustomId('underage')
                        .setLabel('Underaged')
                        .setStyle('Secondary')
                );

            // Create an embed message for the report
            const embedmeme = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle(`Reporting File: ${name}`)
                .setDescription('Content type set as: SFW')
                .setFooter({ text: title });

            // Update the interaction with the new embed and buttons
            await interaction.update({ embeds: [embedmeme], components: [row] });

        } catch (error) {
            if (error.code === 10062) {
                console.error('Unknown interaction, cannot update.');
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }
};
