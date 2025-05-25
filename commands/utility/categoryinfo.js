//Category Command which sends info about the category

const { SlashCommandBuilder, InteractionContextType, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const readline = require('readline');

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
const filePath2 = 'servers/good.txt';
module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('categoryinfo')
        .setContexts(InteractionContextType.Guild)
		.setDescription('Gets info about the category this channel is in'),
	async execute(interaction) {
        const verifedServers = await getGoodServers(filePath2);
        const cataGory = interaction.guild.channels.cache.filter(channel => channel.parentId === interaction.channel.parentId);
        const newEmbed = new EmbedBuilder();
        if (interaction.guildId === null) {
            newEmbed.setColor('Red')
            newEmbed.setTitle('Error \'A DM is not a server\'')
            newEmbed.setDescription('The bot can\'t get category info for something that isn\'t a server and has no channels')
            interaction.reply({ embeds: [newEmbed] , ephemeral: false });
            return
        }
        if (!(interaction.channel.parent == null)){
            newEmbed.setColor('#36393F');
            newEmbed.setTitle('Category Info')
            newEmbed.addFields(
                {name: '🏷️ Name:', value: `${interaction.channel.parent.name}`, inline: true},
                {name: '💾 Server Name:', value: `${interaction.channel.guild.name}`, inline: true},
                {name: '🗂️ Channels:', value: `${cataGory.size}`, inline: true},
                {name: '🆔 Id:', value: `${interaction.channel.parent.id}`, inline: true},
                {name: '📅 Creation:', value: `<t:${Math.round(interaction.channel.parent.createdTimestamp/1000, 10)}>`, inline: true},
                {name: '📚 🧭 Category Postion:', value: `${interaction.channel.parent.position + 1}`, inline: true}
            )
            if(verifedServers.includes(interaction.guildId)) {
                newEmbed.setFooter({ text:'✅ Verified Server'})
            }
        }else{
            newEmbed.setColor('#DC143C');
            newEmbed.setTitle('Error: No Category')
            newEmbed.setDescription('Channel is not in Category')
        }
        interaction.reply({embeds: [newEmbed], ephemeral: true})
	},
};