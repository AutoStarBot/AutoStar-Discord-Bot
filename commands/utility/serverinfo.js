//Server Info Command which sends info about the server

const { SlashCommandBuilder, InteractionContextType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
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
		.setName('serverinfo')
        .setContexts(InteractionContextType.Guild)
		.setDescription('Gets info about the server this channel is in'),
	async execute(interaction) {
        const verifedServers = await getGoodServers(filePath2);
        const newEmbed = new EmbedBuilder();
        const memberCache = interaction.guild.members.cache
        const channelCache = interaction.guild.channels.cache
        const roleCache = interaction.guild.roles.cache
        if (interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ViewAuditLog) && interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.BanMembers)){
            banCache = await interaction.guild.bans.fetch();
        }else{
            banCache = {size: 'Missing Permission(s)'}
        }
        newEmbed.setColor((await interaction.guild.fetchOwner()).displayHexColor)
        newEmbed.setTitle('Server Info')
        newEmbed.addFields(
            {name: '👑 Owner:', value: `${await interaction.guild.fetchOwner()}`, inline: true},
            {name: '🏷️ Name:', value: `${interaction.guild.name}`, inline: true},
            {name: '🆔 ID:', value: `${interaction.guild.id}`, inline: true},
            {name: '📅 Creation:', value: `<t:${Math.round(interaction.guild.createdTimestamp/1000, 10)}>`, inline: true},
            {name: '👥 Members:', value: `${interaction.guild.memberCount} (${memberCache.filter((m) => !m.user.bot).size} cached)`, inline: true},
            {name: '🤖 Bots/Apps:', value: `${memberCache.filter((m) => m.user.bot).size}`, inline: true},
            {name: '🟢 Online Members:', value: `${memberCache.filter((m) => m.presence?.status == "online" && !m.user.bot).size}`, inline: true},
            {name: '🩷 Boosts:', value: `${interaction.guild.premiumSubscriptionCount}`, inline: true},
            {name: '📺 Channels:', value: `${channelCache.size}`, inline: true},
            {name: '📚 Catagories:', value: `${channelCache.filter((c) => c.type === 4).size}`, inline: true},
            {name: '💬 Text Channels:', value: `${channelCache.filter((c) => c.type === 0).size}`, inline: true},
            {name: '🎤 Voice Channels:', value: `${channelCache.filter((c) => c.type === 2).size}`, inline: true},
            {name: '🔞 NSFW Channels:', value: `${channelCache.filter((c) => c.nsfw).size}`, inline: true},
            {name: '💼 Roles:', value: `${roleCache.size - memberCache.filter((m) => m.user.bot).size}`, inline: true},
            {name: '🧑‍⚖️ Bans:', value: `${banCache.size}`, inline: true}
        )
        newEmbed.setThumbnail(interaction.channel.guild.iconURL())
        if(verifedServers.includes(interaction.guildId)) {
            newEmbed.setFooter({ text:'✅ Verfied Server'})
        }
        interaction.reply({embeds: [newEmbed], ephemeral: true})
	},
};