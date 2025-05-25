console.log("NodeJS Version: " + process.version)
const { ActivityType, Client, GatewayIntentBits, EmbedBuilder, Partials} = require('discord.js');
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences],
    partials: [Partials.Channel]
});

process.on("unhandledRejection", error => console.error("Promise rejection:", error));

//Servers that are verified as 'Good' servers
const verifedServers = ['1252307779511910600', '1007146251508260894', '933723920647991296', '1156413813457965066', '1156212601462734848', '1063525891617071155', '1087898482775429203', '1154950082521731116', '1155625225279512646', '1047316302102007978', '951327502905778177', '333949691962195969']
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
    const alertChannel = client.channels.cache.get('1253055652486447124');
    const newChannelEmbed = new EmbedBuilder();
    newChannelEmbed.setColor('Blue')
    newChannelEmbed.setTitle('Rules - Must Follow')
    newChannelEmbed.addFields(
        {name: `1. Follow Discord's Terms of Service`, value: `If you don't read them or forgot pls reread or read: https://discord.com/terms`, inline: false},
        {name: `2. No advertising`, value: `Do not advertise any servers, ref links, invites or any content for your own attention on any channel. No one wants to see it.`, inline: false},
        {name: `3. Nothing disturbing`, value: `Nothing gross like Blood and Dead animals.`, inline: false},
        {name: `4. No swearing`, value: `Keep it PG`, inline: false},
        {name: `5. No links to malware/scams`, value: `Why would you?`, inline: false},
        {name: `6. No weird text`, value: `No spam or spaced/weird font/newline/cap lock messages - Write like a human being.`, inline: false},
        {name: `7. English only`, value: `This server was founded and run by English speaking people. We can't read/write/listen and moderate other languages so please only talk in English.`, inline: false},
        {name: `8. No bots and self bots`, value: `Nothing to add just don't do.`, inline: false},
        {name: `9. Respect Mods/Admins`, value: `When moderator/admin says you shouldn't do something, you should do as they say.`, inline: false},
        {name: `10. No pings, ping replies, DMs or Friend Requests`, value: `Don't randomly ping, add people to friends or DM people for support, just ask your question in server and wait patiently. Thanks.`, inline: false},
        {name:`11. Treat EVERYONE with respect and Kindness`, value: `Please treat others the way you would like to be treated, and assume best intentions. Don’t harass or attack others, and don’t engage in hateful or generally malicious behavior (e.g. sexism, racism, homophobia, etc.) Don't ruin someone else's day when you are having a bad day or not.`, inline: false},
        {name:`12. Don’t share Personally Identifiable Information (yours and/or others)`, value: `Please refrain from sharing any personal or sensitive information in the server — whether that be yours or others (including doxxing). If you need to share this type of information, please only do so through Direct Messages.`, inline: false},
        {name:`13. Stay away from political discussions`, value: `Users from all over the world frequent this server, and there’s no way to have a nuanced discussion of conflicting world views on Discord. Use your best judgment in determining whether something might classify as political content — yes it’s murky, but we trust that you’ll be able to!`, inline: false}
    )
    newChannelEmbed.setTimestamp()
    alertChannel.send({ embeds: [newChannelEmbed] , ephemeral: false })
});

client.login('')