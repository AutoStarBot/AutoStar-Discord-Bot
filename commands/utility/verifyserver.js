//Verify Command which lets an admin verify their server with the bot

const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, EmbedBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');

module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('verifyserver')
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDescription('Sends invite link for server to a reviewer so it can be verified'),
	async execute(interaction) {
        const row = new ActionRowBuilder()
        .addComponents(
        new ButtonBuilder()
            .setCustomId('continueverify')
            .setLabel('Continue')
            .setEmoji('✅')
            .setStyle('Danger'),
        new ButtonBuilder()
            .setCustomId('exit')
            .setLabel('No')
            .setEmoji('⛔')
            .setStyle('Success'),
        )
        const embedmeme = new EmbedBuilder();
        embedmeme.setColor('#ff0000')
        embedmeme.setTitle('Warning')
        embedmeme.setDescription("An invite link to this server will be created and sent to a verifier. Would you like to continue?")
        const response = await interaction.reply({ embeds: [ embedmeme ], components: [row] })
        const collectorFilter = i => i.user.id === interaction.user.id
        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
            if (confirmation.customId === 'continueverify') {
                const informationAlert = new EmbedBuilder();
                const invite = await interaction.channel.createInvite(
                    {
                    maxAge: 10 * 60 * 1000, //maximum time for the invite, in milliseconds
                    maxUses: 1 //maximum times it can be used
                    },
                    `Requested with command by ${interaction.user.tag}`
                )
                const alertChannel = client.channels.cache.get('1266089470856527949'); //alert channel for server where verifier is
                const messageEmbed = new EmbedBuilder();
                if (invite) {
                    const memberCache = interaction.guild.members.cache
                    const channelCache = interaction.guild.channels.cache
                    const roleCache = interaction.guild.roles.cache
                    if (interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ViewAuditLog) && interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.BanMembers)){
                        banCache = await interaction.guild.bans.fetch();
                    }else{
                        banCache = {size: 'Missing Permission(s)'}
                    }
                    messageEmbed.setTitle('Success')
                    messageEmbed.setColor('Green')
                    messageEmbed.setDescription('Invite link has been sent and your server will be reviewed shortly by a reviewer. If it fails the bot will be removed.')
                    informationAlert.setTitle('New Server Verify Request')
                    informationAlert.setColor('Gold')
                    informationAlert.addFields(
                        {name: '👑 Owner:', value: `${await interaction.guild.fetchOwner()}`, inline: true},
                        {name: '🏷️ Name:', value: `${interaction.guild.name}`, inline: true},
                        {name: '🆔 ID:', value: `${interaction.guild.id}`, inline: true},
                        {name: '📅 Creation:', value: `<t:${Math.round(interaction.guild.createdTimestamp/1000, 10)}>`, inline: true},
                        {name: '👥 Members:', value: `${memberCache.filter((m) => !m.user.bot).size}`, inline: true},
                        {name: '🤖 Bots/Apps:', value: `${memberCache.filter((m) => m.user.bot).size}`, inline: true},
                        {name: '🟢 Online Members:', value: `${memberCache.filter((m) => m.presence?.status == "online" && !m.user.bot).size}`, inline: true},
                        {name: '🩷 Boosts:', value: `${interaction.guild.premiumSubscriptionCount}`, inline: true},
                        {name: '📺 Channels:', value: `${channelCache.size - channelCache.filter((c) => c.type === 4).size}`, inline: true},
                        {name: '📚 Catagories:', value: `${channelCache.filter((c) => c.type === 4).size}`, inline: true},
                        {name: '💬 Text Channels:', value: `${channelCache.filter((c) => c.type === 0).size}`, inline: true},
                        {name: '🎤 Voice Channels:', value: `${channelCache.filter((c) => c.type === 2).size}`, inline: true},
                        {name: '🔞 NSFW Channels:', value: `${channelCache.filter((c) => c.nsfw).size}`, inline: true},
                        {name: '💼 Roles:', value: `${roleCache.size - memberCache.filter((m) => m.user.bot).size}`, inline: true},
                        {name: '🧑‍⚖️ Bans:', value: `${banCache.size}`, inline: true},
                        {name: 'Invite Link:', value: `${invite}`, inline: false}
                    )
                } else {
                    messageEmbed.setTitle('Whoops')
                    messageEmbed.setColor('Red')
                    messageEmbed.setDescription('There has been an error during the creation of the invite')
                    informationAlert.setColor('Red')
                    informationAlert.setTitle('Error in creating invite')
                    informationAlert.setDescription('Someone tried to use /verifyserver command but it failed')
                }
                interaction.reply({embeds: [messageEmbed], ephemeral: true})
                alertChannel.send({embeds: [informationAlert], ephemeral: true})
            }
        } catch (e) {
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling (or another error occurred)', components: [] });
        }
	},
};