//Clones the channel to another server that has opposite identity (NSFW to SFW or vis verse)

const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, InteractionContextType } = require('discord.js');
module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('otherside')
        .setDescription('Creates channel in opposite server with same info')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const messageEmbed = new EmbedBuilder();
        if (interaction.channel.guildId === '1087898482775429203' || interaction.channel.guildId === '1375333898757869669'){
            guild = interaction.client.guilds.cache.get('1315773151434637323');
            nameds = 'remove'
            cataS = "+"
        }else if(interaction.channel.guildId === '1063525891617071155' || interaction.channel.guildId === '1315773151434637323'){
            guild = interaction.client.guilds.cache.get('1375333898757869669');
            nameds = 'add'
            cataS = 'n0'
        }else if(interaction.channel.guildId === '1156212601462734848' || interaction.channel.guildId === '1252307779511910600' || interaction.channel.guildId === '1298419893573521438'){
            guild = interaction.client.guilds.cache.get('1298427782463754271');
            nameds = 'remove'
            cataS = 'n0'
        }else if(interaction.channel.guildId === '1156413813457965066' ||interaction.channel.guildId === '1298427782463754271'){
            guild = interaction.client.guilds.cache.get('1298419893573521438');
            nameds = 'add'
            cataS = 'n0'
        }else {
            interaction.reply({content: 'No other server for this server', ephemeral: true })
            return
        }
        if (!guild) {
            interaction.reply({content: 'Guild not found in cache.', ephemeral: true });
            return;
        }
        const categories = guild.channels.cache
            .filter(channel => channel.type === 4) // 4 represents GUILD_CATEGORY
            .sort((a, b) => a.position - b.position)
        if (cataS === '+') {
            secondLowestCategory = categories.size > 1 ? categories.at(categories.size - 3) : null;
        }else{
            secondLowestCategory = categories.size > 1 ? categories.at(categories.size - 1) : null;
        }

        if (!secondLowestCategory) {
            messageEmbed.setColor('Red')
                .setTitle('Error: No Categories Found')
                .setDescription('No categories found in the guild to add the new channel.');
            interaction.reply({ embeds: [messageEmbed], ephemeral: true });
            return;
        }
        if (interaction.channel.topic || !interaction.channel.topic === 'null'){
            if (nameds === 'remove') {
                guild.channels.create({
                    name: interaction.channel.name.substring(1),
                    type: 0, // 0 represents GUILD_TEXT
                    parent: secondLowestCategory.id,
                    topic: `Otherside: https://discord.com/channels/${interaction.guildId}/${interaction.channel.id} \n ${interaction.channel.topic}`
                })
                .then(newchannel => {
                    const newChannelId = newchannel.id;
                    interaction.reply({embeds: [],content: `The channel has been made with the name of: \`\`\`${newchannel.name}\`\`\` \n Here is a link to the channel: https://discord.com/channels/${guild.id}/${newChannelId}`, ephemeral: true});
                    interaction.channel.setTopic(`Otherside: https://discord.com/channels/${guild.id}/${newChannelId}  \n ${interaction.channel.topic}`)
                    return
                })
            }else{
                guild.channels.create({
                    name: '🔞' + interaction.channel.name,
                    type: 0, // 0 represents GUILD_TEXT
                    parent: secondLowestCategory.id,
                    topic: `Otherside: https://discord.com/channels/${interaction.guildId}/${interaction.channel.id} \n ${interaction.channel.topic}`
                })
                .then(newchannel => {
                    const newChannelId = newchannel.id;
                    interaction.reply({embeds: [],content: `The channel has been made with the name of: \`\`\`${newchannel.name}\`\`\` \n Here is a link to the channel: https://discord.com/channels/${guild.id}/${newChannelId}`, ephemeral: true});
                    interaction.channel.setTopic(`Otherside: https://discord.com/channels/${guild.id}/${newChannelId}  \n ${interaction.channel.topic}`)
                    return
                })
            }
        } else {
            if (nameds === 'remove') {
                guild.channels.create({
                    name: interaction.channel.name.substring(1),
                    type: 0, // 0 represents GUILD_TEXT
                    parent: secondLowestCategory.id,
                    topic: `Otherside: https://discord.com/channels/${interaction.guildId}/${interaction.channel.id}`
                })
                .then(newchannel => {
                    const newChannelId = newchannel.id;
                    interaction.reply({embeds: [],content: `The channel has been made with the name of: \`\`\`${newchannel.name}\`\`\` \n Here is a link to the channel: https://discord.com/channels/${guild.id}/${newChannelId}`, ephemeral: true});
                    interaction.channel.setTopic(`Otherside: https://discord.com/channels/${guild.id}/${newChannelId}  \n ${interaction.channel.topic}`)
                    return
                })
            }else{
                guild.channels.create({
                    name: '🔞' + interaction.channel.name,
                    type: 0, // 0 represents GUILD_TEXT
                    parent: secondLowestCategory.id,
                    topic: `Otherside: https://discord.com/channels/${interaction.guildId}/${interaction.channel.id}`
                })
                .then(newchannel => {
                    const newChannelId = newchannel.id;
                    interaction.reply({embeds: [],content: `The channel has been made with the name of: \`\`\`${newchannel.name}\`\`\` \n Here is a link to the channel: https://discord.com/channels/${guild.id}/${newChannelId}`, ephemeral: true});
                    interaction.channel.setTopic(`Otherside: https://discord.com/channels/${guild.id}/${newChannelId}  \n ${interaction.channel.topic}`)
                    return
                })
            }
        }
    },
};