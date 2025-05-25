//Ping Command which sends info about the client like the uptime

const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const botStartTime = Date.now();
const startTimeInSeconds = Math.floor(botStartTime / 1000);
const timestamp = `<t:${startTimeInSeconds}:F>`;

module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Sends important information about the bot(app) like Uptime and Latency'),
	async execute(interaction) {
		const pong = new EmbedBuilder();
        let days = Math.floor(interaction.client.uptime / 86400000);
        let hours = Math.floor(interaction.client.uptime / 3600000) % 24;
        let minutes = Math.floor(interaction.client.uptime / 60000) % 60;
        let seconds = Math.floor(interaction.client.uptime / 1000) % 60;
        pong.setColor('#36393F')
        await interaction.deferReply( { fetchReply: true }).then (async (resultinteraction) =>{
            if (interaction.client.ws.ping === -1) {
                clientping = 'Not available at this moment'
            }else {
                clientping = interaction.client.ws.ping + 'ms'
            }
            pong.addFields(
                { name: 'Uptime:', value: `${days}d ${hours}h ${minutes}m ${seconds}s`, inline: true },
                { name: 'Latency:', value: `${resultinteraction.createdTimestamp - interaction.createdTimestamp}ms`, inline: true },
                { name: 'API Latency:', value: `${clientping}`, inline: true }
            )
            pong.addFields(
                { name: 'Servers:', value: `${interaction.client.guilds.cache.size}`, inline: true },
                { name: 'NodeJS Version:', value: `${process.version}`, inline: true },
                { name: 'Discord.js Version:', value: `${require("discord.js").version}`, inline: true }
            )
            pong.addFields(
                { name: 'Bot started at:', value: `${timestamp}`, inline: true },
            )
            pong.setTitle('Pong!')
            const attachment = new AttachmentBuilder('./images/Ping-Pong.png', { name: 'Ping-Pong.png' });
            pong.setThumbnail(`attachment://${attachment.name}`)
            await interaction.editReply({ content: '', embeds: [pong], ephemeral: true, files: [attachment] });
        })
	},
};