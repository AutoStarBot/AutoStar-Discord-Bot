//Channel info Command which sends info about the channel

const { SlashCommandBuilder, EmbedBuilder, InteractionContextType } = require('discord.js');
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
		.setName('channelinfo')
        .setContexts(InteractionContextType.Guild)
		.setDescription('Gets info about the channel'),
	async execute(interaction) {
        const verifedServers = await getGoodServers(filePath2);
        const newEmbed = new EmbedBuilder();
        newEmbed.setColor('#36393F');
        newEmbed.setTitle('Channel Info')
        newEmbed.addFields(
            {name: '🏷️ Name:', value: `${interaction.channel.name}`, inline: true},
            {name: '💾 Server Name:', value: `${interaction.channel.guild.name}`, inline: true},
            {name: '📁 Topic:', value: `${interaction.channel.topic}`, inline: true},
            {name: '🆔 Id:', value: `${interaction.channel.id}`, inline: true},
            {name: '📅 Creation:', value: `<t:${Math.round(interaction.channel.createdTimestamp/1000, 10)}>`, inline: true},
            {name: '🔞 Marked NSFW:', value: `${interaction.channel.nsfw}`, inline: true}
        )
        if(!(interaction.channel.parent == null)){
            newEmbed.addFields(
                {name: '🧭 Position in category:', value: `${interaction.channel.position + 1}`, inline: true},
                {name: '📚 🧭 Category Position:', value: `${interaction.channel.parent.position + 1}`, inline: true},
                {name: '📚 Category:', value: `${interaction.channel.parent.name}`, inline: true}
            )
        }
        if(verifedServers.includes(interaction.guildId)) {
            newEmbed.setFooter({ text:'✅ Verified Server'})
        }
        interaction.reply({embeds: [newEmbed], ephemeral: true})
	},
};