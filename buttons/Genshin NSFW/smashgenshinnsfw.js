//The button when someone smashes on the nsfw genshin smash or pass game 

const chalk = require('chalk');
const { ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const fs = require('fs').promises; // Use promises API for async file operations
const path = require('path');

module.exports = {
    name: 'smashnsfwgenshin',
    cooldown: 5,
    async execute(interaction) {
        try {
            const folderPath = 'smash/GenshinNSFW';
            const numbersFilePath = './smash/nsfwgenshinsmash.txt';
            const numbersFilePath2 = './smash/nsfwgenshinpass.txt';
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
                console.log(chalk.hex('#b700ff')('Genshin NSFW smash updated successfully.'));
            }

            // Read and update pass numbers file
            data = await fs.readFile(numbersFilePath2, 'utf8');
            let numbers2 = data.trim().split('\n').map(Number);
            if (numbers2.length < imageFiles.length) {
                numbers2 = [...numbers2, ...Array(imageFiles.length - numbers2.length).fill(0)];
                await fs.writeFile(numbersFilePath2, numbers2.join('\n'), 'utf8');
                console.log(chalk.hex('#b700ff')('Genshin NSFW pass updated successfully.'));
            }

            // Create a list of people objects with image filenames and counts
            const people = imageFiles.map((file, index) => ({
                filename: file,
                number: numbers[index],
                number2: numbers2[index]
            }));

            // Find the current person and update their smash count
            const message = interaction.message;
            const embed = message.embeds[0];
            const title = embed.footer.text;
            const person = people.find(meme => meme.filename === title);

            if (person) {
                const personIndex = people.indexOf(person);
                person.number += 1;
                numbers[personIndex] = person.number;
                await fs.writeFile(numbersFilePath, numbers.join('\n'), 'utf8');
            }

            // Create buttons for interaction
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('exit')
                        .setEmoji('🚫')
                        .setStyle('Secondary'),
                    new ButtonBuilder()
                        .setCustomId('passnsfwgenshin')
                        .setLabel('Pass')
                        .setStyle('Danger'),
                    new ButtonBuilder()
                        .setCustomId('smashnsfwgenshin')
                        .setLabel('Smash')
                        .setStyle('Success'),
                    new ButtonBuilder()
                        .setCustomId('nsfwreport')
                        .setEmoji('📢')
                        .setStyle('Secondary')
                );

            // Select a random image to show
            const randomPerson = people[Math.floor(Math.random() * people.length)];
            // Create embed message
            const embedmeme = new EmbedBuilder()
                .setColor('#FFC0CB')
                .setTitle(randomPerson.filename.slice(4).replace(/\..*/, '').replace(/-/g, ' ') + ' I NSFW Genshin')
                .setImage('attachment://' + encodeURIComponent(randomPerson.filename))
                .setDescription(`Smashes: ${randomPerson.number}\nPasses: ${randomPerson.number2}`)
                .setFooter({ text: randomPerson.filename });

            // Update the interaction with the new embed and buttons
            await interaction.update({
                embeds: [embedmeme],
                files: [`${folderPath}/${randomPerson.filename}`],
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
