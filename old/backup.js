//Old version of code before new separate js files

console.log("NodeJS Version: " + process.version)
const { ButtonBuilder, ActionRowBuilder, ActivityType, ChannelType, Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits, AttachmentBuilder, Partials } = require('discord.js');
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, ],//GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences
    partials: [Partials.Channel]
});
console.log('Discord.js Version: ' + require("discord.js").version)
process.on("unhandledRejection", error => console.error("Promise rejection:", error));

const botStartTime = Date.now();
const startTimeInSeconds = Math.floor(botStartTime / 1000);
const timestamp = `<t:${startTimeInSeconds}:F> || <t:${startTimeInSeconds}:R>`;

//Servers that are verified as 'Good' servers
const verifedServers = ['1252307779511910600', '1007146251508260894', '933723920647991296', '1156413813457965066', '1156212601462734848', '1063525891617071155', '1087898482775429203', '1154950082521731116', '1155625225279512646', '1047316302102007978', '951327502905778177', '333949691962195969', '1252723104044679242']
//Servers that are verified as 'Bad' servers and the bot won't join
const serversToLeave = [];

const convertKeyValue = {
    ' ': '-'
}
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
});
function Converter(str) {
    let upperStr = str.toLowerCase()
    var newStr = ''
    for(let i = 0; i < upperStr.length; i++){
        const current = upperStr.charAt(i);
        newStr += convertKeyValue[current] ? convertKeyValue[current] : current;
    }
    return newStr;
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log('Ready!');
    console.log('In ' + client.guilds.cache.size + ' servers')
    client.user.setPresence({
        activities: [{ name: `⭐️🔻`, type: ActivityType.Custom }],
        status: 'online',
    });
    client.guilds.cache.forEach(guild => {
        if (serversToLeave.includes(guild.id)) {
            const channel = guild.channels.cache.find(channel => channel.type === 0 && channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.SendMessages))
            const messageEmbed = new EmbedBuilder();
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Server is on the Bad server list')
            messageEmbed.setDescription('Leaving server now. Please don\'t try to readd this bot. Nothing will change.')
            channel.send({ embeds: [messageEmbed] , ephemeral: false })
            guild.leave()
            .then(() => console.log(`Left ${guild.name}`))
            const alertChannel = client.channels.cache.get('1253053210789150790');
            const leaveS = new EmbedBuilder();
            leaveS.setColor('Red')
            leaveS.setTitle('Bot left a bad server')
            leaveS.addFields(
                {name: '💾 Servers:', value: `${client.guilds.cache.size}`, inline: true}
            )
            leaveS.setTimestamp()
            alertChannel.send({ embeds: [leaveS] , ephemeral: false })
        }
    });
    const alertChannel = client.channels.cache.get('1253053210789150790');
    const newChannelEmbed = new EmbedBuilder();
    newChannelEmbed.setColor('Yellow')
    newChannelEmbed.setTitle('Bot has started up')
    newChannelEmbed.addFields(
        {name: '💾 Servers:', value: `${client.guilds.cache.size}`, inline: true},
        {name: '✅ Verified Servers:', value: `${verifedServers.length}`, inline: true},
        {name: '❌ Bad Servers:', value: `${serversToLeave.length}`, inline: true}
    )
    newChannelEmbed.setTimestamp()
    alertChannel.send({ embeds: [newChannelEmbed] , ephemeral: false })
});

//list of servers that create channel alerts will be created for
const serversIds = ['1156212601462734848', '1007146251508260894', '1156413813457965066', '1063525891617071155', '1087898482775429203', '1154950082521731116', '1155625225279512646', '1252307779511910600'];
const nSFWask = ['1155625225279512646']
client.on('channelCreate', channel => {
    if (serversIds.includes(channel.guild.id)) {
        //alert channel where alerts will be sent
        const alertChannel = client.channels.cache.get('1171105507256311838');
        const newChannelEmbed = new EmbedBuilder();
        if (channel.type === 0) {
            newChannelEmbed.setColor('Green')
            newChannelEmbed.setTitle('New Channel Created')
            newChannelEmbed.addFields(	
            { name: 'Channel Name:', value: channel.name, inline: true },
            { name: 'Link:', value: `https://discord.com/channels/${channel.guild.id}/${channel.id}`, inline: true },)
            newChannelEmbed.setFooter({text: channel.guild.name, iconURL: channel.guild.iconURL()})
            alertChannel.send({ embeds: [newChannelEmbed] , ephemeral: false })
        }else if (channel.type === 4){
            newChannelEmbed.setColor('#013220')
            newChannelEmbed.setTitle('New Catagory Created')
            newChannelEmbed.addFields(	
                { name: 'Category Name:', value: channel.name, inline: true },)
            newChannelEmbed.setFooter({text: channel.guild.name, iconURL: channel.guild.iconURL()})
            alertChannel.send({ embeds: [newChannelEmbed] , ephemeral: false })
        } else {
            newChannelEmbed.setColor('#90ee90')
            newChannelEmbed.setTitle('New Thing Created')
            newChannelEmbed.addFields(	
                { name: 'Channel Name:', value: channel.name, inline: true },
            )
            newChannelEmbed.setFooter({text: channel.guild.name, iconURL: channel.guild.iconURL()})
            alertChannel.send({ embeds: [newChannelEmbed] , ephemeral: false })
        }
    }
    if (nSFWask.includes(channel.guild.id)) {
        const newChannelEmbed = new EmbedBuilder();
        newChannelEmbed.setTitle('Set NSFW?')
        const button = new ButtonBuilder()
        button.setLabel('Set NSFW')
        button.setCustomId('nsfwyes')
        button.setStyle("Success");
        const button2 = new ButtonBuilder()
        button2.setLabel('Don\'t Set NSFW')
        button2.setCustomId('nsfwno')
        button2.setStyle("Danger"); 
        const row = new ActionRowBuilder()
			.addComponents(button, button2);
        channel.send({embeds: [newChannelEmbed], components: [row], ephemeral: true})
    }
    //list of servers to make all new channels NSFW
    const nsfwServers = ['1087898482775429203', '1156212601462734848', '1154950082521731116', '1252307779511910600'];
    if (nsfwServers.includes(channel.guild.id)) {
        if (channel.type === 4) {return}
        channel.setNSFW(true)
    }
    //list of servers to auto add descriptions
    if (channel.topic){return}
    const descriptionServers = ['1087898482775429203', '1063525891617071155'];
    if (descriptionServers.includes(channel.guild.id)) {
        //description to add
        channel.setTopic('Instagram: \nTwitter/X: \nReddit: \nTikTok: \nTwitch: \nYoutube: \nSnapchat: \nOnlyfans(paid): ')
    }
});

client.on('channelDelete', channel => {
    if (serversIds.includes(channel.guild.id)) {
        const alertChannel = client.channels.cache.get('1171105507256311838');
        const newChannelEmbed = new EmbedBuilder();
        newChannelEmbed.setColor('Red')
        newChannelEmbed.setTitle('Channel Deleted')
        newChannelEmbed.addFields({ name: 'Channel Name:', value: channel.name, inline: true })
        newChannelEmbed.setFooter({text: channel.guild.name, iconURL: channel.guild.iconURL()})
        alertChannel.send({ embeds: [newChannelEmbed] , ephemeral: false })
    }
});

client.on('channelUpdate', (oldChannel, newChannel) => {
    if(oldChannel.type === 2) {return} 
    if (serversIds.includes(oldChannel.guild.id)) {
        const alertChannel = client.channels.cache.get('1171105507256311838');
        const newChannelEmbed = new EmbedBuilder();
        newChannelEmbed.setColor('Purple')
        newChannelEmbed.setTitle('Channel Updated:')
        if (!(oldChannel.nsfw === newChannel.nsfw)) {return}
        if (oldChannel.position === newChannel.position) {
            if(!(oldChannel.name === newChannel.name)) {
                newChannelEmbed.addFields(	
                    { name: 'Old Name:', value: oldChannel.name, inline: true },
                    { name: 'New Name:', value: newChannel.name, inline: true }
                )
                newChannelEmbed.setFooter({text: oldChannel.guild.name + " │ " + oldChannel.name, iconURL: oldChannel.guild.iconURL()})
                 alertChannel.send({ embeds: [newChannelEmbed] , ephemeral: false })
            }
            if(!(oldChannel.topic === newChannel.topic)|| (!oldChannel.topic && newChannel.topic)) {
                if(newChannel.topic === 'Instagram: \nTwitter/X: \nReddit: \nTikTok: \nTwitch: \nYoutube: \nSnapchat: \nOnlyfans(paid):'){return}
                newChannelEmbed.addFields(	
                    { name: 'Old Description:', value: oldChannel.topic || 'None', inline: true },
                    { name: 'New Description', value: newChannel.topic || 'None', inline: true }
                )
                newChannelEmbed.setFooter({text: oldChannel.guild.name + " │ " + oldChannel.name, iconURL: oldChannel.guild.iconURL()})
                alertChannel.send({ embeds: [newChannelEmbed] , ephemeral: false })
            }
        } 
    }
});

client.on('guildCreate', (g) => {
    const channel = g.channels.cache.find(channel => channel.type === 0 && channel.permissionsFor(g.members.me).has(PermissionFlagsBits.SendMessages))
    const messageEmbed = new EmbedBuilder();
    if (serversToLeave.includes(g.id)) {
        messageEmbed.setColor('Red')
        messageEmbed.setTitle('Server is on the Bad server list')
        messageEmbed.setDescription('Leaving server now')
        channel.send({ embeds: [messageEmbed] , ephemeral: false })
        g.leave()
        .then(() => console.log(`Left ${g.name}`))
        .catch(err => console.error('Error leaving the guild:', err));
        const alertChannel = client.channels.cache.get('1253053210789150790');
        const newChannelEmbed = new EmbedBuilder();
        newChannelEmbed.setColor('Red')
        newChannelEmbed.setTitle('Bot left a bad server')
        newChannelEmbed.addFields(
            {name: '💾 Servers:', value: `${client.guilds.cache.size}`, inline: true}
        )
        newChannelEmbed.setTimestamp()
        alertChannel.send({ embeds: [newChannelEmbed] , ephemeral: false })
    }else{
        if(!channel) return
        messageEmbed.setColor('White')
        messageEmbed.setTitle('Thank you for inviting me!')
        messageEmbed.setDescription("I have a list of channel names (bot-commands, rules, welcome, general, .etc) I wont react in but if you don't want me to react to messages in a channel, just make it so that I can't see the channel. \n If you dont want me to react to a message send message with (copy code box above) at the beginning")
        channel.send({content: `\`\`\`‎\`\`\``, embeds: [messageEmbed] , ephemeral: false, files: ["./images/example.png"] });
    }
    const alertChannel = client.channels.cache.get('1253053210789150790');
    const newChannelEmbed = new EmbedBuilder();
    newChannelEmbed.setColor('Green')
    newChannelEmbed.setTitle('Bot has been added to a server')
    newChannelEmbed.addFields(
        {name: '💾 Servers:', value: `${client.guilds.cache.size}`, inline: true}
    )
    newChannelEmbed.setTimestamp()
    alertChannel.send({ embeds: [newChannelEmbed] , ephemeral: false })
})

client.on('guildDelete', (g) => {
    const alertChannel = client.channels.cache.get('1253053210789150790');
    const newChannelEmbed = new EmbedBuilder();
    newChannelEmbed.setColor('Red')
    newChannelEmbed.setTitle('Bot has been removed from a server')
    newChannelEmbed.addFields(
        {name: '💾 Servers:', value: `${client.guilds.cache.size}`, inline: true}
    )
    newChannelEmbed.setTimestamp()
    alertChannel.send({ embeds: [newChannelEmbed] , ephemeral: false })
})

client.on("messageCreate", message => { 
    const channelIDs = [];
    const channelNames = ['bot-commands', 'general', 'main-chat', 'rules', 'announcements', 'welcome', 'news', 'info', 'rules-and-info', 'english', 'offtopic', 'questions', '👋welcome', '💬general', '📋help', '🤖bot-testing-chat', 'gaming-chat', 'dyno-logs', 'admin-logs', 'server-logs', 'log-channel', '😎staff-chat', 'staff-chat', 'admin-chat', 'roles', 'bot-spam', 'no-rules', 'logging-channel', 'moderator-only', 'chat📱', 'general-2', 'hw-help', 'resources', 'introductions', 'no-mic', 'guidelines', 'self-roles', 'role-info', 'mod-discussion', 'event-chat', 'planning', 'main', 'collab', 'faq', 'theories', 'bug-reports', 'bot-testing'];
    const messageChannelID = message.channel.id;
    const messageChannelName = message.channel.name;
    if (channelIDs.includes(messageChannelID) || channelNames.includes(messageChannelName) || message.content.startsWith('‎') || message.author.id === '1034252855651074068'){return}
    if (message.channel.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.AddReactions)){
        message.react("⭐"); 
        message.react("🔻"); 
    }
});

client.on('interactionCreate', async interaction => {
    const interationNamed = interaction.commandName;
    const alertChannelinteration = client.channels.cache.get('1253478339293876244');
    if (interaction.guild) {
    if(!interaction.member.user.id === '873453034091450368') {alertChannelinteration.send(interationNamed + ' command was used')}
    }
    if (interaction.commandName === 'setnsfw') {
        const messageEmbed = new EmbedBuilder();
        if (interaction.guildId === null) {
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'DM NSFW\'')
            messageEmbed.setDescription('Can\'t set a DM NSFW')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: false });
            return
        }
        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageChannels)){
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'Bot Missing Permission\'')
            messageEmbed.setDescription('This bot can not perform that action without `Manage Channels` permission')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
            return
        }
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'User Missing Permission\'')
            messageEmbed.setDescription('Only someone with Manage Channels permission can use this command!')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: false });
            return;
        } 
        const channel = interaction.channel;
        if (channel.nsfw === false) {
            channel.setNSFW(true)
            messageEmbed.setColor('#9F2B68')
            messageEmbed.setTitle('Channel set as NSFW')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
        } else {
            channel.setNSFW(false)
            messageEmbed.setColor('#9F2B68')
            messageEmbed.setTitle('Channel set as not NSFW')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
        }
    }

    if (interaction.commandName === 'randomchannel') {
        if (interaction.guildId === null){
            interaction.reply('DMs don\'t have channels'); 
            return
        }
        const guild = interaction.guild;
        const channels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText);
        if (channels.size < 2) {
            interaction.reply('No other text channels found!'); 
            return
        };
        const channelArray = Array.from(channels.values());
        const randomChannel = channelArray[Math.floor(Math.random() * channelArray.length)];
        if (!randomChannel) return console.log('Failed to select a random channel!');
        const channelLink = `https://discord.com/channels/${guild.id}/${randomChannel.id}`;
        interaction.reply(`Random Channel: ${channelLink}`);
    }

    if (interaction.commandName === 'path') {
        const path = Math.floor(Math.random() * 5) + 1
        const messageEmbed = new EmbedBuilder();
        if (path === 1) {
            const attachment = new AttachmentBuilder('./images/r.png', { name: 'reddit.png' });
            messageEmbed.setColor('#FF5700')
            messageEmbed.setTitle('Your path is Reddit!')
            messageEmbed.setImage(`attachment://${attachment.name}`);
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true , files: [attachment]})
        } else if (path === 2) {
            const attachment = new AttachmentBuilder('./images/d.png', { name: 'discord.png' });
            messageEmbed.setColor('#5539CC')
            messageEmbed.setTitle('Your path is Discord!')
            messageEmbed.setImage(`attachment://${attachment.name}`);
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true , files: [attachment]})
        }else if (path === 3) {
            const attachment = new AttachmentBuilder('./images/i.png', { name: 'instagram.png' });
            messageEmbed.setColor('#ffc0cb')
            messageEmbed.setTitle('Your path is Instagram!')
            messageEmbed.setImage(`attachment://${attachment.name}`);
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true , files: [attachment]})
        }else if (path === 4) { 
            const ranNumbs = Math.floor(Math.random() * 75) + 1
            const attachment = new AttachmentBuilder('./images/p.png', { name: 'p.png' });
            messageEmbed.setColor('#ffa31a')
            messageEmbed.setTitle('Your path is Pornhub!')
            messageEmbed.setImage(`attachment://${attachment.name}`);
            messageEmbed.setDescription(`Random number: ${ranNumbs}`)
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true , files: [attachment]})
        }else if (path === 5) {
            const attachment = new AttachmentBuilder('./images/x.png', { name: 'x.png' });
            messageEmbed.setColor('#000000')
            messageEmbed.setTitle('Your path is Twitter/X!')
            messageEmbed.setImage(`attachment://${attachment.name}`);
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true , files: [attachment]})
        }
    }

    if (interaction.commandName === 'ph') {
        const messageEmbed = new EmbedBuilder();
        const ranNumbs = Math.floor(Math.random() * 75) + 1
        const attachment = new AttachmentBuilder('./images/p.png', { name: 'p.png' });
        messageEmbed.setColor('#ffa31a')
        messageEmbed.setTitle('Your path is Pornhub!')
        messageEmbed.setImage(`attachment://${attachment.name}`);
        messageEmbed.setDescription(`Random number: ${ranNumbs}`)
        interaction.reply({ embeds: [messageEmbed] , ephemeral: true , files: [attachment]})
    }

    if (interaction.commandName === 'channeldelete') {
        const messageEmbed = new EmbedBuilder();

        if (interaction.guildId === null) {
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'DM Deletion\'')
            messageEmbed.setDescription('Bots can not delete DMs')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: false });
            return
        }
        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageChannels)){
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'Bot Missing Permission\'')
            messageEmbed.setDescription('This bot can not perform that action without `Manage Channels` permission')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
            return
        }
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'User Missing Permission\'')
            messageEmbed.setDescription('Only someone with Manage Channels permission can use this command!')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: false });
            return;
        } 
        messageEmbed.setTitle('Safety Step!')
        messageEmbed.setDescription('Are you sure you want to delete channel?')
        const row = new ActionRowBuilder()
            .addComponents(
            new ButtonBuilder()
                .setCustomId('exit')
                .setLabel('No')
                .setStyle('Success'),
            new ButtonBuilder()
                .setCustomId('agreedelete')
                .setLabel('Yes')
                .setStyle('Danger'),
            )
        interaction.reply({ embeds: [messageEmbed] , ephemeral: false, components: [row] });
    };

    if (interaction.customId === 'disagreedelete'){
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'User Missing Permission\'')
            messageEmbed.setDescription('Only someone with Manage Channels permission can use this command!')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: false });
            return;
        } 
        interaction.message.delete()
    }

    if (interaction.customId === 'exit'){
        interaction.message.delete()
    }

    if (interaction.commandName === 'channelpurge') {
        const messageEmbed = new EmbedBuilder();

        if (interaction.guildId === null) {
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'DM Purge\'')
            messageEmbed.setDescription('Bots can not purge DMs')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: false });
            return
        }
        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageChannels)){
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'Bot Missing Permission\'')
            messageEmbed.setDescription('This bot can not perform that action without `Manage Channels` permission')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
            return
        }
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'User Missing Permission\'')
            messageEmbed.setDescription('Only someone with Manage Channels permission can use this command!')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: false });
            return;
        }
        messageEmbed.setTitle('Safety Step!')
        messageEmbed.setDescription('Are you sure you want to channel purge? (channel will be cloned and then deleted)\nRetype channel name to delete')
        interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
        const filter = m => m.author.id === interaction.user.id
        const guild = interaction.guild;
        const delteChannelId = interaction.channel.id;
        interaction.channel.awaitMessages({ filter, max: 1, time: 60000 })
        .then(message => {
            const messageEmbed = new EmbedBuilder();
            if (message.size === 0) {
                messageEmbed.setColor('Red')
                messageEmbed.setTitle('Error \'Timeout\'')
                messageEmbed.setDescription('You took to long to respond. Command Ended')
                interaction.editReply({ embeds: [messageEmbed] , ephemeral: true });
                return
            }
            channelNamed = message.first()
            if (!channelNamed.author.id === interaction.user.id){
                messageEmbed.setColor('Red')
                messageEmbed.setTitle('Error \'Another Message Sent\'')
                messageEmbed.setDescription('Someone else sent a message before you. Command Ended')
                interaction.editReply({ embeds: [messageEmbed] , ephemeral: true });
                return
            };
            if(!(channelNamed.content === interaction.channel.name)){
                messageEmbed.setColor('Red')
                messageEmbed.setTitle('Error \'Wrong Channel Name\'')
                messageEmbed.setDescription('You typed wrong name. (Make sure you added dashes) Command Ended')
                interaction.editReply({ embeds: [messageEmbed] , ephemeral: true });
                setTimeout(() => {
                    if (interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageMessages)) {
                        channelNamed.delete()
                    }
                }, 1000);
                return;
            };
        setTimeout(() => {
            interaction.channel.clone()
            interaction.channel.delete()
        }, 1000);
        return
        })
        .catch(error => {
            console.error('Error while awaiting message:', error);
        })
    };

    if (interaction.customId === 'agreedelete') {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'User Missing Permission\'')
            messageEmbed.setDescription('Only someone with Manage Channels permission can use this command!')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: false });
            return;
        } 
        interaction.channel.delete()
    }

    if (interaction.commandName === 'clonechannel'){
        const messageEmbed = new EmbedBuilder();

        if (interaction.guildId === null) {
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'DM Clone\'')
            messageEmbed.setDescription('Bots can not clone DMs')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: false });
            return
        }
        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageChannels)){
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'Bot Missing Permission\'')
            messageEmbed.setDescription('This bot can not perform that action without `Manage Channels` permission')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
            return
        }
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'User Missing Permission\'')
            messageEmbed.setDescription('Only someone with Manage Channels permission can use this command!')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: false });
            return;
        }
        messageEmbed.setTitle('Name Channel')
        messageEmbed.setDescription('What is the name you want to use?')
        interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
        const filter = m => m.author.id === interaction.user.id
        const newchannel =  interaction.channel.clone()
        .then(newchannel => {
            const guild = interaction.guild;
            const newChannelId = newchannel.id;
            interaction.channel.awaitMessages({ filter, max: 1, time: 60000 })
            .then(message => {
                const messageEmbed = new EmbedBuilder();
                if (message.size === 0) {
                    messageEmbed.setColor('Red')
                    messageEmbed.setTitle('Error \'Timeout\'')
                    messageEmbed.setDescription('You took to long to respond. Command Ended')
                    interaction.editReply({ embeds: [messageEmbed] , ephemeral: true });
                    setTimeout(() => {
                        newchannel.delete()
                    }, 1000);
                    return
                }
                newName = message.first()
                if (!(newName.author.id === interaction.user.id)){
                    messageEmbed.setColor('Red')
                    messageEmbed.setTitle('Error \'Another Message Sent\'')
                    messageEmbed.setDescription('Someone else sent a message before you. Command Ended/Cloned channel deleted')
                    interaction.editReply({ embeds: [messageEmbed] , ephemeral: true });
                    newchannel.delete(); 
                    return
                } 
                if (newName.content === '' || newName.content === '‎'){
                    messageEmbed.setColor('Red')
                    messageEmbed.setTitle('Error \'Invalid channel name\'')
                    messageEmbed.setDescription('(channel names cant be invisible). Command Ended/Cloned channel deleted')
                    interaction.editReply({ embeds: [messageEmbed] , ephemeral: true }); 
                    newchannel.delete(); 
                    if (interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageMessages)) {
                        newName.delete()
                    }
                    return
                } 
                const guild = interaction.guild;
                const clonedChannel = guild.channels.cache.get(newChannelId);
                clonedChannel.setName(newName.content)
                interaction.editReply({embeds: [],content: `The channel has been cloned with the name of: \`\`\`${Converter(newName.content.toLowerCase())}\`\`\` \n Here is a link to the channel: https://discord.com/channels/${guild.id}/${newChannelId}`, ephemeral: true});
                setTimeout(() => {
                    if (interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageMessages)) {
                        console.log('2')
                        newName.delete()
                    }
                }, 1000);
                return
            })
        })
        .catch(error => {
            console.error('Error while awaiting message:', error);
        })
    }

    if (interaction.commandName === 'otherside'){
        const messageEmbed = new EmbedBuilder();
        if (interaction.channel.guildId === '1087898482775429203'){
            guild = client.guilds.cache.get('1063525891617071155');
            nameds = 'remove'
            cataS = "+"
        }else if(interaction.channel.guildId === '1063525891617071155'){
            guild = client.guilds.cache.get('1087898482775429203');
            nameds = 'add'
            cataS = 'n0'
        }else if(interaction.channel.guildId === '1156212601462734848' || interaction.channel.guildId === '1252307779511910600'){
            guild = client.guilds.cache.get('1156413813457965066');
            nameds = 'remove'
            cataS = 'n0'
        }else if(interaction.channel.guildId === '1156413813457965066'){
            guild = client.guilds.cache.get('1252307779511910600');
            nameds = 'add'
            cataS = 'n0'
        }else {
            interaction.reply('No other server for this server')
            return
        }
        if (!guild) {
            interaction.reply('Guild not found in cache.');
            return;
        }

        const botMember = interaction.guild.members.me;
        const userMember = interaction.guild.members.cache.get(interaction.user.id);
        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageChannels)){
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'Bot Missing Permission\'')
            messageEmbed.setDescription('This bot can not perform that action without `Manage Channels` permission')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
            return
        }
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'User Missing Permission\'')
            messageEmbed.setDescription('Only someone with manage channels permission can use this command!')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: false });
            return;
        } 
        const categories = guild.channels.cache
            .filter(channel => channel.type === 4)
            .sort((a, b) => a.position - b.position)
        if (cataS === '+') {
            secondLowestCategory = categories.size > 1 ? categories.at(categories.size - 2) : null;
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
        if (nameds === 'remove') {
        guild.channels.create({
            name: interaction.channel.name.substring(1),
            type: 0,
            parent: secondLowestCategory.id,
            topic: interaction.channel.topic
        })
        .then(newchannel => {
            const newChannelId = newchannel.id;
            const messageEmbed = new EmbedBuilder();
            const clonedChannel = guild.channels.cache.get(newChannelId);
            interaction.reply({embeds: [],content: `The channel has been cloned with the name of: \`\`\`${newchannel.name}\`\`\` \n Here is a link to the channel: https://discord.com/channels/${guild.id}/${newChannelId}`, ephemeral: true});
            return
        })
        }else{
            guild.channels.create({
                name: '🔞' + interaction.channel.name,
                type: 0,
                parent: secondLowestCategory.id,
                topic: interaction.channel.topic
            })
            .then(newchannel => {
                const newChannelId = newchannel.id;
                const messageEmbed = new EmbedBuilder();
                const clonedChannel = guild.channels.cache.get(newChannelId);
                interaction.reply({embeds: [],content: `The channel has been cloned with the name of: \`\`\`${newchannel.name}\`\`\` \n Here is a link to the channel: https://discord.com/channels/${guild.id}/${newChannelId}`, ephemeral: true});
                return
            })
        }
    }

    if (interaction.commandName === 'renamechannel'){
        const messageEmbed = new EmbedBuilder();

        messageEmbed.setColor('Red')
        messageEmbed.setTitle('Command being remade')
        messageEmbed.setDescription('Command is being updated to work without message content intent')
        interaction.reply({ embeds: [messageEmbed] , ephemeral: false });
        return

        if (interaction.guildId === null) {
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'DMs can\'t be renamed\'')
            messageEmbed.setDescription('Bots can\'t rename DMs and so ca\'t you')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: false });
            return
        }
        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageChannels)){
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'Bot Missing Permission\'')
            messageEmbed.setDescription('This bot can not perform that action without `Manage Channels` permission')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
            return
        }
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'User Missing Permission\'')
            messageEmbed.setDescription('Only someone with manage channels permission can use this command!')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: false });
            return;
        } 
        messageEmbed.setTitle('Name Channel')
        messageEmbed.setDescription('What is the name you want to use?')
        interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
        const filter = m => m.author.id === interaction.user.id
            const guild = interaction.guild;
            const newChannelId = interaction.channel.id;
            interaction.channel.awaitMessages({ filter, max: 1, time: 60000 })
            .then(message => {
                const messageEmbed = new EmbedBuilder();
                if (message.size === 0) {
                    messageEmbed.setColor('Red')
                    messageEmbed.setTitle('Error \'Timeout\'')
                    messageEmbed.setDescription('You took to long to respond. Command Ended')
                    interaction.editReply({ embeds: [messageEmbed] , ephemeral: true });
                    setTimeout(() => {
                    }, 1000);
                    return
                }
                newName = message.first()
                if (!(newName.author.id === interaction.user.id)){
                    messageEmbed.setColor('Red')
                    messageEmbed.setTitle('Error \'Another Message Sent\'')
                    messageEmbed.setDescription('Someone else sent a message before you. Command Ended')
                    interaction.editReply({ embeds: [messageEmbed] , ephemeral: true });
                    return
                } 
                if (newName.content === '' || newName.content === '‎'){
                    messageEmbed.setColor('Red')
                    messageEmbed.setTitle('Error \'Invaild Channel Name\'')
                    messageEmbed.setDescription('(channel names cant be invisable). Command Ended')
                    interaction.editReply({ embeds: [messageEmbed] , ephemeral: true }); 
                    return
                } 
                const guild = interaction.guild;
                const namingchannel = guild.channels.cache.get(newChannelId);
                if (newName.content.length < 101) {
                    namingchannel.setName(newName.content)
                interaction.editReply({embeds: [],content: `The channel has been renamed with the name of: \`\`\`${Converter(newName.content.toLowerCase())}\`\`\``, ephemeral: true});
                }else{
                    namingchannel.setName(newName.content.slice(0,100))
                    interaction.editReply({embeds: [],content: `The channel has been renamed with the name of: \`\`\`${Converter(newName.content.slice(0,100).toLowerCase())}\`\`\`\nMessage was above 100 characters so it has been shortened`, ephemeral: true});
                }
                setTimeout(() => {
                    newName.delete()
                }, 1000);
                return
            })
        
        .catch(error => {
            console.error('Error while awaiting message:', error);
        })
    }

    if (interaction.commandName === 'setdescription'){
        const messageEmbed = new EmbedBuilder();

        messageEmbed.setColor('Red')
        messageEmbed.setTitle('Command being remade')
        messageEmbed.setDescription('Command is being updated to work without message content intent')
        interaction.reply({ embeds: [messageEmbed] , ephemeral: false });
        return

        if (interaction.guildId === null) {
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'DMs do\'t have descriptions\'')
            messageEmbed.setDescription('Bots can\'t change the descriptions of channels that can\'t have descriptions')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: false });
            return
        }
        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageChannels)){
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'Bot Missing Permission\'')
            messageEmbed.setDescription('This bot can not perform that action without `Manage Channels` permission')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
            return
        }
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'User Missing Permission\'')
            messageEmbed.setDescription('Only someone with manage channels permission can use this command!')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: false });
            return;
        } 
        messageEmbed.setTitle('Channel Description')
        messageEmbed.setDescription('What is the description you want to use?')
        interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
        const filter = m => m.author.id === interaction.user.id
            const guild = interaction.guild;
            const newChannelId = interaction.channel.id;
            interaction.channel.awaitMessages({ filter, max: 1, time: 60000 })
            .then(message => {
                const messageEmbed = new EmbedBuilder();
                if (message.size === 0) {
                    messageEmbed.setColor('Red')
                    messageEmbed.setTitle('Error \'Timeout\'')
                    messageEmbed.setDescription('You took to long to respond. Command Ended')
                    interaction.editReply({ embeds: [messageEmbed] , ephemeral: true });
                    setTimeout(() => {
                    }, 1000);
                    return
                }
                newDescrip = message.first()
                if (!(newDescrip.author.id === interaction.user.id)){
                    messageEmbed.setColor('Red')
                    messageEmbed.setTitle('Error \'Another Message Sent\'')
                    messageEmbed.setDescription('Someone else sent a message before you. Command Ended')
                    interaction.editReply({ embeds: [messageEmbed] , ephemeral: true });
                    return
                } 
                const guild = interaction.guild;
                const descripchannel = guild.channels.cache.get(newChannelId);
                descripchannel.setTopic(newDescrip.content)
                interaction.editReply({embeds: [],content: `The channel description has been changed to: \`\`\`${newDescrip.content.toLowerCase()}\`\`\``, ephemeral: true});
                setTimeout(() => {
                    newDescrip.delete()
                }, 1000);
                return
            })
        
        .catch(error => {
            console.error('Error while awaiting message:', error);
        })
    }

    if (interaction.commandName === 'ping') {
        const pong = new EmbedBuilder();
        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let seconds = Math.floor(client.uptime / 1000) % 60;
        pong.setColor('#36393F')
        await interaction.reply( {content: '...', fetchReply: true }).then (async (resultinteraction) =>{
            if (client.ws.ping === -1) {
                clientping = 'Not available at this moment'
            }else {
                clientping = client.ws.ping + 'ms'
            }
            pong.addFields(
                { name: 'Uptime:', value: `${days}d ${hours}h ${minutes}m ${seconds}s`, inline: true },
                { name: 'Latency:', value: `${resultinteraction.createdTimestamp - interaction.createdTimestamp}ms`, inline: true },
                { name: 'API Latency:', value: `${clientping}`, inline: true }
            )
            pong.addFields(
                { name: 'Servers:', value: `${client.guilds.cache.size}`, inline: true },
                { name: 'NodeJS Version:', value: `${process.version}`, inline: true },
                { name: 'Discord.js Version:', value: `${require("discord.js").version}`, inline: true }
            )
            pong.addFields(
                { name: 'Bot started at:', value: `${timestamp}`, inline: true },
            )
            pong.setTitle('Pong!')
            pong.setThumbnail('https://www.pngkit.com/png/full/284-2843649_ping-pong-paddle-png-ping-pong-racket-png.png')
            await interaction.editReply({ content: '', embeds: [pong] , ephemeral: true });
        })
    }
    if (interaction.commandName === 'channelinfo') {
        const newEmbed = new EmbedBuilder();
        if (interaction.guildId === null) {
            const newEmbed = new EmbedBuilder();
            newEmbed.setColor('Red')
            newEmbed.setTitle('Error \'A DM is not a server\'')
            newEmbed.setDescription('The bot can\'t get channel info for something that isn\'t a server and has no channels')
            interaction.reply({ embeds: [newEmbed] , ephemeral: false });
            return
        }
        newEmbed.setColor('#36393F');
        newEmbed.setTitle('Channel Info')
        newEmbed.addFields(
            {name: '🏷️ Name:', value: `${interaction.channel.name}`, inline: true},
            {name: '💾 Server Name:', value: `${interaction.channel.guild.name}`, inline: true},
            {name: '📚 Category:', value: `${interaction.channel.parent.name}`, inline: true},
            {name: '📁 Topic:', value: `${interaction.channel.topic}`, inline: true},
            {name: '🧭 Position in category:', value: `${interaction.channel.position + 1}`, inline: true},
            {name: '📚 🧭 Category Position:', value: `${interaction.channel.parent.position + 1}`, inline: true},
            {name: '🆔 Id:', value: `${interaction.channel.id}`, inline: true},
            {name: '📅 Creation:', value: `<t:${Math.round(interaction.channel.createdTimestamp/1000, 10)}>`, inline: true},
            {name: '🔞 Marked NSFW:', value: `${!interaction.channel.nsfw}`, inline: true}
        )
        if(verifedServers.includes(interaction.guildId)) {
            newEmbed.setFooter({ text:'✅ Verified Server'})
        }
        interaction.reply({embeds: [newEmbed], ephemeral: true})
    }
    if (interaction.commandName === 'categoryinfo') {
        const cataGory = interaction.guild.channels.cache.filter(channel => channel.parentId === interaction.channel.parentId);
        const newEmbed = new EmbedBuilder();
        if (interaction.guildId === null) {
            const newEmbed = new EmbedBuilder();
            newEmbed.setColor('Red')
            newEmbed.setTitle('Error \'A DM is not a server\'')
            newEmbed.setDescription('The bot can\'t get category info for something that isn\'t a server and has no channels')
            interaction.reply({ embeds: [newEmbed] , ephemeral: false });
            return
        }
        newEmbed.setColor('#36393F');
        newEmbed.setTitle('Category Info')
        newEmbed.addFields(
            {name: '🏷️ Name:', value: `${interaction.channel.parent.name}`, inline: true},
            {name: '💾 Server Name:', value: `${interaction.channel.guild.name}`, inline: true},
            {name: '🗂️ Channels:', value: `${cataGory.size}`, inline: true},
            {name: '🆔 Id:', value: `${interaction.channel.id}`, inline: true},
            {name: '📅 Creation:', value: `<t:${Math.round(interaction.channel.createdTimestamp/1000, 10)}>`, inline: true}
        )
        if(verifedServers.includes(interaction.guildId)) {
            newEmbed.setFooter({ text:'✅ Verified Server'})
        }
        interaction.reply({embeds: [newEmbed], ephemeral: true})
    }
    if (interaction.commandName ==='verifyserver') {
        const messageEmbed = new EmbedBuilder();
        if (interaction.guildId === null) {
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'DMs aren\'t servers')
            messageEmbed.setDescription('Bots can\'t verify a DM because it is not a server')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: false });
            return
        }
        if (interaction.guildId === null) {
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'A DM is not a server\'')
            messageEmbed.setDescription('The bot does not need to verify a DM')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: false });
            return
        }
        if(verifedServers.includes(interaction.guildId)) {
            messageEmbed.setColor('Green')
            messageEmbed.setTitle('Error \'Server is already verified\'')
            messageEmbed.setDescription('You can\'t verify a server twice can you?')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
            return
        }
        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.CreateInstantInvite)){
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'Bot Missing Permission\'')
            messageEmbed.setDescription('This bot can not perform that action without Create Invite permission')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: true });
            return
        }
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'User Missing Permission\'')
            messageEmbed.setDescription('Only someone with administrator can use this command!')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: false });
            return;
        } 
        const row = new ActionRowBuilder()
        .addComponents(
        new ButtonBuilder()
            .setCustomId('continue')
            .setLabel('Continue')
            .setStyle('Success'),
        )
        const embedmeme = new EmbedBuilder();
        embedmeme.setColor('#ff0000')
        embedmeme.setTitle('Warning')
        embedmeme.setDescription("An invite link to this server will be created and sent to a verifier. Would you like to continue?")
        interaction.reply({ embeds: [ embedmeme ], components: [row] })
    }
    if (interaction.customId === 'continue') {
        const informationAlert = new EmbedBuilder();
        const invite = await interaction.channel.createInvite(
            {
              maxAge: 10 * 60 * 1000, //maximum time for the invite, in milliseconds
              maxUses: 1 //maximum times it can be used
            },
            `Requested with command by ${interaction.user.tag}`
        )
        const alertChannel = client.channels.cache.get('1231316661802373251'); //alert channel for server where verifier is
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
                {name: '📚 Categories:', value: `${channelCache.filter((c) => c.type === 4).size}`, inline: true},
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
    if (interaction.commandName === 'botinfo') {
        const newEmbed = new EmbedBuilder();
        newEmbed.setColor('#36393F');
        newEmbed.setTitle('Bot Info')
        let appOwner = await client.application.fetch();
        newEmbed.addFields(
            {name: '🏷️ Name:', value: `${client.user.tag}`, inline: true},
            {name: '📅 Creation:', value: `<t:1666594800:D>`, inline: true},
            {name: '🎨 Creator:', value: `${appOwner.owner}`, inline: true},
            {name: '💾 Servers:', value: `${client.guilds.cache.size}`, inline: true},
            {name: '✅ Verified Servers:', value: `${verifedServers.length}`, inline: true},
            {name: '❌ Bad Servers:', value: `${serversToLeave.length}`, inline: true}
        )
        const button = new ButtonBuilder()
        button.setLabel('Support Server')
        button.setURL('https://discord.gg/mJuydyQeh3')
        button.setStyle("Link");
        const row = new ActionRowBuilder()
			.addComponents(button);
        interaction.reply({embeds: [newEmbed], components: [row], ephemeral: true})
    }

    if (interaction.commandName === 'serverinfo') {
        if (interaction.guildId === null) {
            const messageEmbed = new EmbedBuilder();
            messageEmbed.setColor('Red')
            messageEmbed.setTitle('Error \'A DM is not a server\'')
            messageEmbed.setDescription('The bot can\'t get server info for something that isn\'t a server')
            interaction.reply({ embeds: [messageEmbed] , ephemeral: false });
            return
        }
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
            {name: '📺 Channels:', value: `${channelCache.size - channelCache.filter((c) => c.type === 4).size}`, inline: true},
            {name: '📚 Categories:', value: `${channelCache.filter((c) => c.type === 4).size}`, inline: true},
            {name: '💬 Text Channels:', value: `${channelCache.filter((c) => c.type === 0).size}`, inline: true},
            {name: '🎤 Voice Channels:', value: `${channelCache.filter((c) => c.type === 2).size}`, inline: true},
            {name: '🔞 NSFW Channels:', value: `${channelCache.filter((c) => c.nsfw).size}`, inline: true},
            {name: '💼 Roles:', value: `${roleCache.size - memberCache.filter((m) => m.user.bot).size}`, inline: true},
            {name: '🧑‍⚖️ Bans:', value: `${banCache.size}`, inline: true}
        )
        newEmbed.setThumbnail(interaction.channel.guild.iconURL())
        if(verifedServers.includes(interaction.guildId)) {
            newEmbed.setFooter({ text:'✅ Verified Server'})
        }
        interaction.reply({embeds: [newEmbed], ephemeral: true})
    }
    //list of commands that don't yet work
    const brokenCommands = ['aitakeover', 'userinfo', 'verifiedservers'];
    const brokenfunCommands = ['pokemonsmashorpass', 'genshinsmashorpass', 'fortnitesmashorpass'];
    if (brokenCommands.includes(interationNamed)) {
        const damnBroken = new EmbedBuilder();
        damnBroken.setColor('Red')
        damnBroken.setTitle('Error!')
        damnBroken.setDescription(interaction.commandName + ' command is not finished at the moment')
        interaction.reply({ embeds: [damnBroken] , ephemeral: true })
        return 
    }

    //list of every command and what they do
    if (interaction.commandName === 'help') {
        const helpCommand = new EmbedBuilder();
        const otherCommand = new EmbedBuilder();
        helpCommand.setColor('#36393F');
        helpCommand.setTitle('Utility commands:')
        helpCommand.addFields(
            { name: '📁 /setdescription', value: `change the description of the channel`, inline: false },
            { name: '🏷️ /renamechannel', value: `change the channel's name`, inline: false },
            { name: '🗑️ /channeldelete', value: `delete the channel`, inline: false },
            { name: '🔄 /channelpurge', value: `deletes everything in channel by cloning the Channel`, inline: false },
            { name: '👥 /clonechannel', value: `clones the channel and asks for a new name`, inline: false },
            { name: '📺 /channelinfo', value: `Information about the channel`, inline: false },
            { name: '📚 /catagoryinfo', value: `Information about the channel`, inline: false },
            { name: '💾 /serverinfo', value: `Information about the server`, inline: false },
            { name: '🤖 /botinfo', value: `Information about this bot`, inline: false },
            { name: '❓ /help', value: `this command`, inline: false },
            { name: '🏓 /ping', value: `sends important information about the bot like uptime and latency`, inline: false },
            { name: '🔞 /setnsfw', value: `sets the channel NSFW or sets the channel not NSFW`, inline: false },
            { name: '🤖 /verifyserver', value: `Sends an invite to the server so it can be verified by a verifier`, inline: false },
            { name: '⏱️ Commands coming soon', value: '/' + brokenCommands.join(', /'), inline: false }  
        )
        otherCommand.setColor('#ff69b4');
        otherCommand.setTitle('Fun commands:')
        otherCommand.addFields(
            { name: '🤷 /randomchannel', value: `sends link to a random text channel in the server`, inline: false },
            { name: '😍 /smashorpass', value: `A simple game of sfw smash or pass`, inline: false },
            { name: '🔞 /nsfwsmashorpass', value: `A simple game of nsfw smash or pass`, inline: false },
            { name: '⏱️ Commands coming soon', value: '/' + brokenfunCommands.join(', /'), inline: false }  
        )
        const button = new ButtonBuilder()
        button.setLabel('Support Server')
        button.setURL('https://discord.gg/mJuydyQeh3')
        button.setStyle("Link");
        const row = new ActionRowBuilder()
			.addComponents(button);
        interaction.reply({ embeds: [helpCommand, otherCommand], components: [row], ephemeral: true }) 
    }
    if (interaction.commandName ==='smashorpass') {
        const row = new ActionRowBuilder()
        .addComponents(
        new ButtonBuilder()
            .setCustomId('proceedsfw')
            .setLabel('Proceed')
            .setStyle('Success'),
        )
        const embedmeme = new EmbedBuilder();
        embedmeme.setColor('#ff0000')
        embedmeme.setTitle('Warning')
        embedmeme.setDescription("Although this is a sfw command, keep in mind that it contains images that you still might not want others to see.\n\n Would you like to continue?")
        embedmeme.setFooter({ text:`more smashorpass versions coming soon (pokemon, anime, NSFW, genshin, etc)`})
        interaction.reply({ embeds: [ embedmeme ], components: [row] })
    }

    if (interaction.customId ==='nsfwyes') {
        interaction.channel.setNSFW(true)
       await interaction.message.delete()
    }
    if (interaction.customId ==='nsfwno') {
       await interaction.message.delete()
    }

    if (interaction.customId ==='smashsfw'|| interaction.customId ==='passsfw'|| interaction.customId ==='proceedsfw'){
        const fs = require('fs');
        const path = require('path');
        const folderPath = 'smash/SFW';
        const numbersFilePath = './smash/sfwsmash.txt';
        const numbersFilePath2 = './smash/sfwpass.txt';
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
                        console.log('sfwsmash.txt updated successfully.');
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
                            console.log('sfwpass.txt updated successfully.');
                        });
                    }
                    const people = imageFiles.map((file, index) => ({
                    filename: file,
                    number: numbers[index],
                    number2: numbers2[index]

                    }));
                    if (interaction.customId ==='smashsfw') {
                        const row = new ActionRowBuilder()
                        .addComponents(
                        new ButtonBuilder()
                            .setCustomId('exit')
                            .setEmoji('🚫')
                            .setStyle('Secondary'),
                        new ButtonBuilder()
                            .setCustomId('passsfw')
                            .setLabel('Pass')
                            .setStyle('Danger'),
                        new ButtonBuilder()
                            .setCustomId('smashsfw')
                            .setLabel('Smash')
                            .setStyle('Success'),
                        
                        )
                        var person = Math.floor(Math.random() * people.length);
                        const embedmeme = new EmbedBuilder();
                        let cooltitle = people[person].filename.slice(4)
                        cooltitle = cooltitle.replace(/\..*/, '').replace(/-/g, ' ');
                        embedmeme.setColor('#FFC0CB')
                        embedmeme.setTitle(cooltitle)
                        embedmeme.setImage('attachment://' + encodeURIComponent(people[person].filename))
                        embedmeme.setDescription("Smashes: " + people[person].number + '\nPasses: '+ people[person].number2)
                        embedmeme.setFooter({ text:people[person].filename})
                        interaction.update({ embeds: [ embedmeme ], files: ['./smash/SFW/' + people[person].filename], components: [row] })
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
                    }
                    if (interaction.customId ==='passsfw') {
                        const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId('exit')
                            .setEmoji('🚫')
                            .setStyle('Secondary'),
                        new ButtonBuilder()
                            .setCustomId('passsfw')
                            .setLabel('Pass')
                            .setStyle('Danger'),
                        new ButtonBuilder()
                            .setCustomId('smashsfw')
                            .setLabel('Smash')
                            .setStyle('Success'),
                        )
                        var person = Math.floor(Math.random() * people.length);
                        const embedmeme = new EmbedBuilder();
                        let cooltitle = people[person].filename.slice(4)
                        cooltitle = cooltitle.replace(/\..*/, '').replace(/-/g, ' ');
                        embedmeme.setColor('#FFC0CB')
                        embedmeme.setTitle(cooltitle)
                        embedmeme.setImage('attachment://' + encodeURIComponent(people[person].filename))
                        embedmeme.setDescription("Smashes: " + people[person].number + '\nPasses: '+ people[person].number2)
                        embedmeme.setFooter({ text:people[person].filename})
                        interaction.update({ embeds: [ embedmeme ], files: ['./smash/SFW/' + people[person].filename], components: [row] })
                        const message = interaction.message;
                        const embed = message.embeds[0];
                        const title = embed.footer.text;
                        const person2 = people.find(meme => meme.filename === title);
                        const personIndex = people.indexOf(person2);
                        person2.number2 += 1
                        numbers[personIndex] = person2.number2;
                        const updatedNumbers2 = numbers.join('\n');
                        fs.writeFile(numbersFilePath2, updatedNumbers2, 'utf8', err => {
                            if (err) {
                            console.error('Error writing numbers file:', err);
                            return;
                            }
                        });
                    }
                    if (interaction.customId ==='proceedsfw'){
                        const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId('exit')
                            .setEmoji('🚫')
                            .setStyle('Secondary'),
                        new ButtonBuilder()
                            .setCustomId('pass')
                            .setLabel('passsfw')
                            .setStyle('Danger'),
                        new ButtonBuilder()
                            .setCustomId('smashsfw')
                            .setLabel('Smash')
                            .setStyle('Success'),
                        
                        )
                        var person = Math.floor(Math.random() * people.length);
                        const embedmeme = new EmbedBuilder();
                        let cooltitle = people[person].filename.slice(4)
                        cooltitle = cooltitle.replace(/\..*/, '').replace(/[-_]/g, ' ');
                        embedmeme.setColor('#FFC0CB')
                        embedmeme.setTitle(cooltitle)
                        embedmeme.setImage('attachment://' + encodeURIComponent(people[person].filename))
                        embedmeme.setDescription("Smashes: " + people[person].number + '\nPasses: '+ people[person].number2)
                        embedmeme.setFooter({ text:people[person].filename})
                        interaction.update({ embeds: [ embedmeme ], files: ['./smash/SFW/' + people[person].filename], components: [row]});  
                    }
                })
            })
        });
        
    } 

    if (interaction.customId ==='smashnsfw'|| interaction.customId ==='passnsfw'|| interaction.commandName ==='nsfwsmashorpass'){
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
                    if (interaction.customId ==='smashnsfw') {
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
                        
                        )
                        var person = Math.floor(Math.random() * people.length);
                        const embedmeme = new EmbedBuilder();
                        let cooltitle = people[person].filename.slice(4)
                        cooltitle = cooltitle.replace(/\..*/, '').replace(/-/g, ' ');
                        embedmeme.setColor('#FFC0CB')
                        embedmeme.setTitle(cooltitle)
                        embedmeme.setImage('attachment://' + encodeURIComponent(people[person].filename))
                        embedmeme.setDescription("Smashes: " + people[person].number + '\nPasses: '+ people[person].number2)
                        embedmeme.setFooter({ text:people[person].filename})
                        interaction.update({ embeds: [ embedmeme ], files: ['./smash/NSFW/' + people[person].filename], components: [row] })
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
                    }
                    if (interaction.customId ==='passnsfw') {
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
                        )
                        var person = Math.floor(Math.random() * people.length);
                        const embedmeme = new EmbedBuilder();
                        let cooltitle = people[person].filename.slice(4)
                        cooltitle = cooltitle.replace(/\..*/, '').replace(/-/g, ' ');
                        embedmeme.setColor('#FFC0CB')
                        embedmeme.setTitle(cooltitle) 
                        embedmeme.setImage('attachment://' + encodeURIComponent(people[person].filename))
                        embedmeme.setDescription("Smashes: " + people[person].number + '\nPasses: '+ people[person].number2)
                        embedmeme.setFooter({ text:people[person].filename})
                        interaction.update({ embeds: [ embedmeme ], files: ['./smash/NSFW/' + people[person].filename], components: [row] })
                        const message = interaction.message;
                        const embed = message.embeds[0];
                        const title = embed.footer.text;
                        const person2 = people.find(meme => meme.filename === title);
                        const personIndex = people.indexOf(person2);
                        person2.number2 += 1
                        numbers[personIndex] = person2.number2;
                        const updatedNumbers2 = numbers.join('\n');
                        fs.writeFile(numbersFilePath2, updatedNumbers2, 'utf8', err => {
                            if (err) {
                            console.error('Error writing numbers file:', err);
                            return;
                            }
                        });
                    }
                    if (interaction.commandName ==='nsfwsmashorpass'){
                        const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId('exit')
                            .setEmoji('🚫')
                            .setStyle('Secondary'),
                        new ButtonBuilder()
                            .setCustomId('pass')
                            .setLabel('passnsfw')
                            .setStyle('Danger'),
                        new ButtonBuilder()
                            .setCustomId('smashnsfw')
                            .setLabel('Smash')
                            .setStyle('Success'),
                        
                        )
                        var person = Math.floor(Math.random() * people.length);
                        const embedmeme = new EmbedBuilder();
                        let cooltitle = people[person].filename.slice(4)
                        cooltitle = cooltitle.replace(/\..*/, '').replace(/[-_]/g, ' ');
                        embedmeme.setColor('#FFC0CB')
                        embedmeme.setTitle(cooltitle)
                        embedmeme.setImage('attachment://' + encodeURIComponent(people[person].filename))
                        embedmeme.setDescription("Smashes: " + people[person].number + '\nPasses: '+ people[person].number2)
                        embedmeme.setFooter({ text:people[person].filename})
                        interaction.reply({ embeds: [ embedmeme ], files: ['./smash/NSFW/' + people[person].filename], components: [row]});  
                    }
                })
            })
        });
        
    } 
});

client.login('')