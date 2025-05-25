//The slash command for the smash or pass game

const chalk = require('chalk');
const { ButtonBuilder, EmbedBuilder, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
//The locations of the images for the smash or pass game
const categories = {
    sfw: 'smash/SFW',
    anime: 'smash/Anime',
    sfwcosplay: 'smash/CosplaySFW',
    sfwgenshin: 'smash/GenshinSFW',
    nsfw: 'smash/NSFW',
    hentai: 'smash/Hentai',
    nsfwcosplay: 'smash/CosplayNSFW',
    nsfwgenshin: 'smash/GenshinNSFW'
};

async function handleSubcommand(interaction, category) {
    const folderPath = categories[category];
    const numbersFilePath = `smash/${category}smash.txt`;
    const numbersFilePath2 = `smash/${category}pass.txt`;

    const files = await fs.readdir(folderPath);
    const imageFiles = files.filter(file => allowedExtensions.includes(path.extname(file).toLowerCase()));

    let numbers = await fs.readFile(numbersFilePath, 'utf8').then(data => data.trim().split('\n').map(Number));
    let numbers2 = await fs.readFile(numbersFilePath2, 'utf8').then(data => data.trim().split('\n').map(Number));

    // Ensure numbers arrays are the same length as imageFiles
    const updateArray = (arr, length) => arr.concat(Array(length - arr.length).fill(0));
    numbers = updateArray(numbers, imageFiles.length);
    numbers2 = updateArray(numbers2, imageFiles.length);

    await fs.writeFile(numbersFilePath, numbers.join('\n'), 'utf8');
    await fs.writeFile(numbersFilePath2, numbers2.join('\n'), 'utf8');

    const people = imageFiles.map((file, index) => ({
        filename: file,
        number: numbers[index],
        number2: numbers2[index]
    }));

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setCustomId('exit').setEmoji('🚫').setStyle('Secondary'),
            new ButtonBuilder().setCustomId(`pass${category}`).setLabel('Pass').setStyle('Danger'),
            new ButtonBuilder().setCustomId(`smash${category}`).setLabel('Smash').setStyle('Success'),
            new ButtonBuilder().setCustomId('nsfwreport').setEmoji('📢').setStyle('Secondary')
        );

    const person = people[Math.floor(Math.random() * people.length)];
    let catName
    if (category === 'nsfwgenshin'){
        catName = 'NSFW Genshin'
    } else if (category === 'nsfwcosplay'){
        catName = 'NSFW Cosplay'
    } else if (category === 'nsfw'){
        catName = 'NSFW'
    }else if (category === 'hentai'){
        catName = 'Hentai'
    }else {
        catName = '?'
    }
    const embedmeme = new EmbedBuilder()
        .setColor('#FFC0CB')
        .setTitle(person.filename.slice(4).replace(/\..*/, '').replace(/[-_]/g, ' ') + ' I ' + catName)
        .setImage('attachment://' + encodeURIComponent(person.filename))
        .setDescription(`Smashes: ${person.number}\nPasses: ${person.number2}`)
        .setFooter({ text: person.filename });

    await interaction.reply({ embeds: [embedmeme], files: [`./${folderPath}/${person.filename}`], components: [row] });
}

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('smashorpass')
        .setDescription('The world renowned smash or pass game but on discord')
        .addSubcommand(subcommand => subcommand.setName('sfw').setDescription('SFW version'))
        .addSubcommand(subcommand => subcommand.setName('anime').setDescription('Anime version'))
        .addSubcommand(subcommand => subcommand.setName('sfwcosplay').setDescription('SFW Cosplay version'))
        .addSubcommand(subcommand => subcommand.setName('sfwgenshin').setDescription('Genshin SFW version'))
        .addSubcommand(subcommand => subcommand.setName('nsfw').setDescription('NSFW version'))
        .addSubcommand(subcommand => subcommand.setName('hentai').setDescription('Hentai version'))
        .addSubcommand(subcommand => subcommand.setName('nsfwcosplay').setDescription('NSFW Cosplay version'))
        .addSubcommand(subcommand => subcommand.setName('nsfwgenshin').setDescription('Genshin NSFW version')),
    async execute(interaction) {
        /*if (await interaction.client.users.fetch('433829814445670401')) {
            interaction.reply("This command is not real");
            return
        } */

        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'nsfw' || subcommand === 'hentai' || subcommand === 'nsfwcosplay' || subcommand === 'nsfwgenshin') {
            if (!interaction.channel.nsfw && !interaction.channel.isDMBased()) {
                return interaction.reply("This command can only be used in NSFW channels.");
            }
        }

        if (['nsfw', 'hentai', 'nsfwcosplay', 'nsfwgenshin'].includes(subcommand)) {
            await handleSubcommand(interaction, subcommand);
        } else {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setCustomId(`proceed${subcommand}`).setLabel('Proceed').setStyle('Success'),
                    new ButtonBuilder().setCustomId('exit').setLabel('No').setStyle('Danger'),
                );

            const embedmeme = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Warning')
                .setDescription("Although this is a SFW command, keep in mind that it contains images that you still might not want others to see.\n\nWould you like to continue?")
                .setFooter({ text: `More Smash or Pass versions that arn't coming soon (Pokemon, Fortnite, Avatar, Grand/Fate Order, etc) because the creator is done.` });
            await interaction.reply({ embeds: [embedmeme], components: [row] });
        }
    },
};
