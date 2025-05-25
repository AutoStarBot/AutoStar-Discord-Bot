//Bot Info Command which sends info about the bot

const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const readline = require('readline');

function getServersToLeave(filePath) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        const serversToLeave = [];

        rl.on('line', (line) => {
            if (line.trim()) {
                serversToLeave.push(line.trim());
            }
        });

        rl.on('close', () => {
            resolve(serversToLeave);
        });

        rl.on('error', (err) => {
            reject(err);
        });
    });
}
function getGoodServers(filePath2) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(filePath2);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        const goodServers = [];

        rl.on('line', (line) => {
            if (line.trim()) {
                goodServers.push(line.trim());
            }
        });

        rl.on('close', () => {
            resolve(goodServers);
        });

        rl.on('error', (err) => {
            reject(err);
        });
    });
}
const filePath = 'servers/toleave.txt';
const filePath2 = 'servers/good.txt';
module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('botinfo')
		.setDescription('Gets some interesting info of this App/Bot'),
	async execute(interaction) {
        const serversToLeave = await getServersToLeave(filePath);
        const verifedServers = await getGoodServers(filePath2);
        const newEmbed = new EmbedBuilder();
        newEmbed.setColor('#36393F');
        newEmbed.setTitle('Bot Info')
        let appOwner = await interaction.client.application.fetch();
        newEmbed.addFields(
            {name: '🏷️ Name:', value: `${interaction.client.user.tag}`, inline: true},
            {name: '📅 Creation:', value: `<t:1666594800:D>`, inline: true},
            {name: '🎨 Creator:', value: `${ await interaction.client.users.fetch(appOwner.owner.ownerId)}`, inline: true},
            {name: '💾 Servers:', value: `${interaction.client.guilds.cache.size}`, inline: true},
            {name: '✅ Verified Servers:', value: `${verifedServers.length}`, inline: true},
            {name: '❌ Bad Servers:', value: `${serversToLeave.length}`, inline: true}
        )
        const button = new ButtonBuilder()
        button.setLabel('Support Server')
        
        //change to your bot support server
        button.setURL('https://discord.gg/mJuydyQeh3')
        button.setStyle("Link");
        const row = new ActionRowBuilder()
			.addComponents(button);
        interaction.reply({embeds: [newEmbed], components: [row], ephemeral: true})
	},
};