//The button when someone wants to proceed in playing the game

const chalk = require('chalk');
const { ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
    name: 'proceedanime',
    cooldown: 5,
    async execute(interaction) {
        try {
            const folderPath = 'smash/Anime';
            const numbersFilePath = 'smash/animesmash.txt';
            const numbersFilePath2 = 'smash/animepass.txt';
            const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

            // Read image files
            const files = await fs.readdir(folderPath);
            const imageFiles = files.filter(file => {
                const extension = path.extname(file).toLowerCase();
                return allowedExtensions.includes(extension);
            });

            // Read and update numbers file
            let data = await fs.readFile(numbersFilePath, 'utf8');
            let numbers = data.trim().split('\n').map(Number);
            if (numbers.length < imageFiles.length) {
                numbers = [...numbers, ...Array(imageFiles.length - numbers.length).fill(0)];
                await fs.writeFile(numbersFilePath, numbers.join('\n'), 'utf8');
                console.log(chalk.magenta('animesmash.txt updated successfully.'));
            }

            // Read and update numbers file 2
            data = await fs.readFile(numbersFilePath2, 'utf8');
            let numbers2 = data.trim().split('\n').map(Number);
            if (numbers2.length < imageFiles.length) {
                numbers2 = [...numbers2, ...Array(imageFiles.length - numbers2.length).fill(0)];
                await fs.writeFile(numbersFilePath2, numbers2.join('\n'), 'utf8');
                console.log(chalk.magenta('animepass.txt updated successfully.'));
            }

            // Map image files to people objects
            const people = imageFiles.map((file, index) => ({
                filename: file,
                number: numbers[index],
                number2: numbers2[index]
            }));

            // Create a new message with updated embed
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('exit')
                        .setEmoji('🚫')
                        .setStyle('Secondary'),
                    new ButtonBuilder()
                        .setCustomId('passanime')
                        .setLabel('Pass')
                        .setStyle('Danger'),
                    new ButtonBuilder()
                        .setCustomId('smashanime')
                        .setLabel('Smash')
                        .setStyle('Success'),
                    new ButtonBuilder()
                        .setCustomId('sfwreport')
                        .setEmoji('📢')
                        .setStyle('Secondary')
                );

            const person = Math.floor(Math.random() * people.length);
            const embedmeme = new EmbedBuilder()
                .setColor('#FFC0CB')
                .setTitle(people[person].filename.slice(4).replace(/\..*/, '').replace(/[-_]/g, ' ') + ' I Anime')
                .setImage('attachment://' + encodeURIComponent(people[person].filename))
                .setDescription(`Smashes: ${people[person].number}\nPasses: ${people[person].number2}`)
                .setFooter({ text: people[person].filename });

            await interaction.update({
                embeds: [embedmeme],
                files: [`./smash/Anime/${people[person].filename}`],
                components: [row]
            });
        } catch (error) {
            if (error.code === 10062) {
                console.error('Unknown interaction, cannot update.');
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }
};