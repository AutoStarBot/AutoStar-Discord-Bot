//The button when someone smashes on the sfw smash or pass game 

const chalk = require('chalk');
const { ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const fs = require('fs').promises; // Use promises API for better async handling
const path = require('path');

module.exports = {
    name: 'smashsfw',
    cooldown: 5,
    async execute(interaction) {
        try {
            const folderPath = 'smash/SFW';
            const numbersFilePath = './smash/sfwsmash.txt';
            const numbersFilePath2 = './smash/sfwpass.txt';
            const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

            // Read image files
            const files = await fs.readdir(folderPath);
            const imageFiles = files.filter(file => allowedExtensions.includes(path.extname(file).toLowerCase()));

            // Read numbers file
            let data = await fs.readFile(numbersFilePath, 'utf8');
            let numbers = data.trim().split('\n').map(Number);

            // Update numbers file if needed
            if (numbers.length !== imageFiles.length) {
                numbers = [...numbers, ...Array(imageFiles.length - numbers.length).fill(0)];
                await fs.writeFile(numbersFilePath, numbers.join('\n'), 'utf8');
                console.log(chalk.magenta('sfwsmash.txt updated successfully.'));
            }

            // Read and update numbers file 2
            data = await fs.readFile(numbersFilePath2, 'utf8');
            let numbers2 = data.trim().split('\n').map(Number);

            if (numbers2.length !== imageFiles.length) {
                numbers2 = [...numbers2, ...Array(imageFiles.length - numbers2.length).fill(0)];
                await fs.writeFile(numbersFilePath2, numbers2.join('\n'), 'utf8');
                console.log(chalk.magenta('sfwpass.txt updated successfully.'));
            }

            const people = imageFiles.map((file, index) => ({
                filename: file,
                number: numbers[index],
                number2: numbers2[index]
            }));

            const embed = interaction.message.embeds[0];
            const title = embed.footer.text;
            const person2 = people.find(meme => meme.filename === title);
            if (person2) {
                person2.number += 1;
                const personIndex = people.indexOf(person2);
                numbers[personIndex] = person2.number;
                await fs.writeFile(numbersFilePath, numbers.join('\n'), 'utf8');
            }

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

            const person = Math.floor(Math.random() * people.length);
            const embedmeme = new EmbedBuilder()
                .setColor('#FFC0CB')
                .setTitle(people[person].filename.slice(4).replace(/\..*/, '').replace(/-/g, ' ') + ' I SFW')
                .setImage('attachment://' + encodeURIComponent(people[person].filename))
                .setDescription(`Smashes: ${people[person].number}\nPasses: ${people[person].number2}`)
                .setFooter({ text: people[person].filename });

            await interaction.update({ embeds: [embedmeme], files: ['./smash/SFW/' + people[person].filename], components: [row] });

        } catch (error) {
            if (error.code === 10062) {
                console.error('Unknown interaction, cannot update.');
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }
};
