//Help Command which sends info about each command the bot has

const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Sends important information about the bot(app) like Uptime and Latency'),
	async execute(interaction) {
        const modCommands = new EmbedBuilder();
        const infoCommands = new EmbedBuilder();
        const funCommands = new EmbedBuilder();
        modCommands.setColor('#36393F');
        modCommands.setTitle('Utility Commands:')
        modCommands.setDescription(`(These commands will only be visible to mods/admins with the needed permissions)`)
        modCommands.addFields(
            { name: '📁 /setdescription', value: `Change the description of the channel`, inline: false },
            { name: '🏷️ /renamechannel', value: `Change the channel's name`, inline: false },
            { name: '🗑️ /channeldelete', value: `Delete the channel`, inline: false },
            { name: '🔄 /channelpurge', value: `Deletes everything in channel by cloning the Channel`, inline: false },
            { name: '👥 /clonechannel', value: `Clones the channel and asks for a new name`, inline: false },
            { name: '🔞 /setnsfw', value: `Sets the channel NSFW or sets the channel not NSFW`, inline: false },
            { name: '🤖 /verifyserver', value: `Sends an invite to the server so it can be verified by a verifier`, inline: false } 
        )
        infoCommands.setColor('#ff7f50');
        infoCommands.setTitle('Info Commands:')
        infoCommands.addFields(
            { name: '📺 /channelinfo', value: `Information about the channel`, inline: false },
            { name: '📚 /categoryinfo', value: `Information about the channel`, inline: false },
            { name: '💾 /serverinfo', value: `Information about the server`, inline: false },
            { name: '🤖 /botinfo', value: `Information about this bot`, inline: false },
            { name: '❓ /help', value: `This command`, inline: false },
            { name: '🏓 /ping', value: `Sends important information about the bot like uptime and latency`, inline: false },
        )
        funCommands.setColor('#ff69b4');
        funCommands.setTitle('Fun Commands:')
        funCommands.addFields(
            { name: '🤷 /randomchannel', value: `Sends link to a random text channel in the server`, inline: false },
            { name: '😍 /smashorpass `type`', value: `Smash or pass game with images`, inline: false }
        )
        const button = new ButtonBuilder()
        button.setLabel('Support Server')
        button.setURL('https://discord.gg/mJuydyQeh3')
        button.setStyle("Link");
        const row = new ActionRowBuilder()
			.addComponents(button);
        if (interaction.guildId === null || interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            interaction.reply({ embeds: [modCommands, infoCommands, funCommands], components: [row], ephemeral: true }) 
        }else{
            interaction.reply({ embeds: [funCommands, infoCommands], components: [row], ephemeral: true }) 
        }
	},
};