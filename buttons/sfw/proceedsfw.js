//The button when someone wants to proceed in playing the game

const chalk = require('chalk');
const { ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const fs = require('fs').promises; // Use promises API for cleaner async file operations
const path = require('path');

module.exports = {
    name: 'proceedsfw',
    cooldown: 5,
    async execute(interaction) {
        try {
            const folderPath = 'smash/SFW';
            const numbersFilePath = 'smash/sfwsmash.txt';
            const numbersFilePath2 = 'smash/sfwpass.txt';
            const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

            // Read image files from the directory
            const files = await fs.readdir(folderPath);
            const imageFiles = files.filter(file => allowedExtensions.includes(path.extname(file).toLowerCase()));

            // Read and update smash numbers file
            let data = await fs.readFile(numbersFilePath, 'utf8');
            let numbers = data.trim().split('\n').map(Number);
            if (numbers.length < imageFiles.length) {
                numbers = [...numbers, ...Array(imageFiles.length - numbers.length).fill(0)];
                await fs.writeFile(numbersFilePath, numbers.join('\n'), 'utf8');
                console.log(chalk.magenta('sfwsmash.txt updated successfully.'));
            }

            // Read and update pass numbers file
            data = await fs.readFile(numbersFilePath2, 'utf8');
            let numbers2 = data.trim().split('\n').map(Number);
            if (numbers2.length < imageFiles.length) {
                numbers2 = [...numbers2, ...Array(imageFiles.length - numbers2.length).fill(0)];
                await fs.writeFile(numbersFilePath2, numbers2.join('\n'), 'utf8');
                console.log(chalk.magenta('sfwpass.txt updated successfully.'));
            }

            // Create a list of people objects with image filenames and counts
            const people = imageFiles.map((file, index) => ({
                filename: file,
                number: numbers[index],
                number2: numbers2[index]
            }));

            // Create buttons for interaction
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('exit')
                        .setEmoji('🚫')
                        .setStyle('Secondary'),
                    new ButtonBuilder()
                        .setCustomId('passsfw')
                        .setLabel('Pass')
                        .setStyle('Danger'),
                    new ButtonBuilder()
                        .setCustomId('smashsfw')
                        .setLabel('Smash')
                        .setStyle('Success'),
                    new ButtonBuilder()
                        .setCustomId('sfwreport')
                        .setEmoji('📢')
                        .setStyle('Secondary')
                );

            // Select a random image to show
            const personIndex = Math.floor(Math.random() * people.length);
            const person = people[personIndex];

            // Create embed message
            const embedmeme = new EmbedBuilder()
                .setColor('#FFC0CB')
                .setTitle(person.filename.slice(4).replace(/\..*/, '').replace(/[-_]/g, ' ') + ' I SFW')
                .setImage('attachment://' + encodeURIComponent(person.filename))
                .setDescription(`Smashes: ${person.number}\nPasses: ${person.number2}`)
                .setFooter({ text: person.filename });

            // Update the interaction with the new embed and buttons
            await interaction.update({
                embeds: [embedmeme],
                files: [`${folderPath}/${person.filename}`],
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