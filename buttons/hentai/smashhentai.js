//The button when someone smashes on the hentai smash or pass game 

const chalk = require('chalk');
const { ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
    name: 'smashhentai',
    cooldown: 5,
    async execute(interaction) {
        try {
            const folderPath = 'smash/Hentai';
            const numbersFilePath = './smash/hentaismash.txt';
            const numbersFilePath2 = './smash/hentaipass.txt';
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
                console.log(chalk.hex('#b700ff')('hentaismash.txt updated successfully.'));
            }

            // Read and update pass numbers file
            data = await fs.readFile(numbersFilePath2, 'utf8');
            let numbers2 = data.trim().split('\n').map(Number);
            if (numbers2.length < imageFiles.length) {
                numbers2 = [...numbers2, ...Array(imageFiles.length - numbers2.length).fill(0)];
                await fs.writeFile(numbersFilePath2, numbers2.join('\n'), 'utf8');
                console.log(chalk.hex('#b700ff')('hentaipass.txt updated successfully.'));
            }

            // Create a list of people objects with image filenames and counts
            const people = imageFiles.map((file, index) => ({
                filename: file,
                number: numbers[index],
                number2: numbers2[index]
            }));

            // Find the person being smashed and update their smash count
            const message = interaction.message;
            const embed = message.embeds[0];
            const title = embed.footer.text;
            const person2 = people.find(person => person.filename === title);
            if (person2) {
                const personIndex = people.indexOf(person2);
                person2.number += 1;
                numbers[personIndex] = person2.number;
                await fs.writeFile(numbersFilePath, numbers.join('\n'), 'utf8');
            } else {
                console.log('Could not find ' + title + ' in ' + folderPath)
            }

            // Create buttons for interaction
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('exit')
                        .setEmoji('🚫')
                        .setStyle('Secondary'),
                    new ButtonBuilder()
                        .setCustomId('passhentai')
                        .setLabel('Pass')
                        .setStyle('Danger'),
                    new ButtonBuilder()
                        .setCustomId('smashhentai')
                        .setLabel('Smash')
                        .setStyle('Success'),
                    new ButtonBuilder()
                        .setCustomId('nsfwreport')
                        .setEmoji('📢')
                        .setStyle('Secondary')
                );

            // Select a random image to show
            const person = people[Math.floor(Math.random() * people.length)];
                        const embedmeme = new EmbedBuilder()
                .setColor('#FFC0CB')
                .setTitle(person.filename.slice(4).replace(/\..*/, '').replace(/-/g, ' ') + ' I Hentai')
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
