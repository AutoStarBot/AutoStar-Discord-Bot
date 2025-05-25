//IDK what is different about this one

const chalk = require('chalk');
const { ButtonBuilder, EmbedBuilder, ActionRowBuilder} = require('discord.js');

function randomPost() {
    const fs = require('fs');
    const path = require('path');
    const folderPath = 'smash/NSFW';
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const report = './smash/nsfwreported.txt';
    fs.readdir(folderPath, (err, files) => {
            if (err) {
            console.error('Error reading directory:', err);
            return;
            }
            const imageFiles = files.filter(file => {
            const extension = path.extname(file).toLowerCase();
            return allowedExtensions.includes(extension);
            });
            const people = imageFiles.map((file) => ({
            filename: file,
            }));
            const personMaybe = Math.floor(Math.random() * people.length);
            fs.readFile(report, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading numbers file:', err);
                    return;
                }
                const reportnumbers = data.trim().split('\n').map(Number);
                console.log(reportnumbers)
                if (!reportnumbers.includes(personMaybe)) {
                    const person = personMaybe
                } else {
                    console.log('nope')
                    randomPost(); // Repeat the prompt
                }
            })
        })
}
module.exports = {
    name: 'smashnsfwwork',
    cooldown: 5,
	async execute(interaction) {
        const fs = require('fs');
        const path = require('path');
        const folderPath = 'smash/NSFW';
        const numbersFilePath = './smash/nsfwsmash.txt';
        const numbersFilePath2 = './smash/nsfwpass.txt';
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        fs.readdir(folderPath, (err, files) => {
            if (err) {
            console.error('Error reading directory:', err);
            return;
            }
            const imageFiles = files.filter(file => {
            const extension = path.extname(file).toLowerCase();
            return allowedExtensions.includes(extension);
            });
            fs.readFile(numbersFilePath, 'utf8', (err, data) => {
                
                if (err) {
                  console.error('Error reading numbers file:', err);
                  return;
                }
            
                const numbers = data.trim().split('\n').map(Number);
                
                if (numbers.length !== imageFiles.length) {
                  
                    while (numbers.length < imageFiles.length) {
                        numbers.push(0);
                    }
                    while (numbers.length < imageFiles.length) {
                        numbers.push(0);
                    }
                    const updatedNumbers = numbers.join('\n');
                    fs.writeFile(numbersFilePath, updatedNumbers, 'utf8', (err) => {
                        if (err) {
                            console.error('Error writing numbers file:', err);
                            return;
                        }
                        console.log('nsfwsmash.txt updated successfully.');
                    });
                }
                fs.readFile(numbersFilePath2, 'utf8', (err, data) => {
                    if (err) {
                        console.error('Error reading numbers file:', err);
                        return;
                    }
                    const numbers2 = data.trim().split('\n').map(Number);
                    if (numbers2.length !== imageFiles.length) {
                        
                        while (numbers2.length < imageFiles.length) {
                            numbers2.push(0);
                        }
                        while (numbers2.length < imageFiles.length) {
                            numbers2.push(0);
                        }
                        const updatedNumbers = numbers2.join('\n');
                        fs.writeFile(numbersFilePath2, updatedNumbers, 'utf8', (err) => {
                            if (err) {
                                console.error('Error writing numbers file:', err);
                                return;
                            }
                            console.log('nsfwpass.txt updated successfully.');
                        });
                    }
                    const people = imageFiles.map((file, index) => ({
                    filename: file,
                    number: numbers[index],
                    number2: numbers2[index]
                    }));

                    const message = interaction.message;
                    const embed = message.embeds[0];
                    const title = embed.footer.text;
                    const person2= people.find(meme => meme.filename === title);
                    const personIndex = people.indexOf(person2);
                    person2.number += 1
                    numbers[personIndex] = person2.number;
                    const updatedNumbers = numbers.join('\n');
                    fs.writeFile(numbersFilePath, updatedNumbers, 'utf8', err => {
                        if (err) {
                        console.error('Error writing numbers file:', err);
                        return;
                        }
                    });

                    const row = new ActionRowBuilder()
                    .addComponents(
                    new ButtonBuilder()
                        .setCustomId('exit')
                        .setEmoji('🚫')
                        .setStyle('Secondary'),
                    new ButtonBuilder()
                        .setCustomId('passnsfw')
                        .setLabel('Pass')
                        .setStyle('Danger'),
                    new ButtonBuilder()
                        .setCustomId('smashnsfw')
                        .setLabel('Smash')
                        .setStyle('Success'),
                    new ButtonBuilder()
                        .setCustomId('nsfwreport')
                        .setEmoji('📢')
                        .setStyle('Secondary'),
                    )
                    randomPost();
                    const embedmeme = new EmbedBuilder();
                    let cooltitle = people[person].filename.slice(4)
                    cooltitle = cooltitle.replace(/\..*/, '').replace(/-/g, ' ');
                    embedmeme.setColor('#FFC0CB')
                    embedmeme.setTitle(cooltitle)
                    embedmeme.setImage('attachment://' + encodeURIComponent(people[person].filename))
                    embedmeme.setDescription("Smashes: " + people[person].number + '\nPasses: '+ people[person].number2)
                    embedmeme.setFooter({ text:people[person].filename})
                    interaction.update({ embeds: [ embedmeme ], files: ['./smash/NSFW/' + people[person].filename], components: [row] })
                });
            });
        });
	},
};