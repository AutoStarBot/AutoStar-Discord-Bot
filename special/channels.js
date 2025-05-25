// Make  a table of content for servers basically list every channel from servers in a channel
const { Client, GatewayIntentBits, EmbedBuilder, ChannelType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const token = '';

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // The channel in which you want the bot to send every channel to
    const alertChannel = await client.channels.fetch('1376308372982333563');
    try {
        if (!alertChannel) {
            console.error('Alert channel not found.');
            return;
        }
        //Put the servers that you want the bot to list all channels
        const lookat = [
            '1007146251508260894', '1087898482775429203', '1063525891617071155', 
            '1155625225279512646', '1156212601462734848', '1252307779511910600', 
            '1298419893573521438', '1156413813457965066', '1298427782463754271', 
            '1154950082521731116', '1315773151434637323', '1375333898757869669'
        ];

        for (const guildId of lookat) {
            try {
                const guild = await client.guilds.fetch(guildId);
                const channels = guild.channels.cache.filter(channel => channel.type !== ChannelType.GuildCategory);

                const gUild = new EmbedBuilder()
                    .setColor('#FFFFFF')
                    .setTitle('New list')
                    .setDescription(`Listing all channels from the server: ${guild.name}`)
                    .addFields(
                        { name: 'Server Name:', value: guild.name, inline: true },
                        { name: 'Channels:', value: channels.size.toString(), inline: true }
                    );

                let sEnt = 0;
                await alertChannel.send({ embeds: [gUild] });

                // Send each channel embed one by one
                for (const channel of channels.values()) {
                    const eMbed = new EmbedBuilder()
                        .setColor(channel.nsfw ? '#ff0000' : '#86c5da')
                        .addFields(
                            { name: 'Channel Name:', value: channel.name, inline: true },
                            { name: 'Link:', value: `https://discord.com/channels/${channel.guild.id}/${channel.id}`, inline: true }
                        );
                    if (channel.parent) {
                        eMbed.addFields({ name: 'Channel Category:', value: channel.parent.name, inline: true });
                    }
                    try {
                        await alertChannel.send({ embeds: [eMbed] });
                        sEnt += 1;
                        console.log(`${sEnt}/${channels.size} (${(sEnt / channels.size * 100).toFixed(2)}%)`);
                    } catch (error) {
                        console.error(`Failed to send message for channel: ${channel.name}`, error);
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (error) {
            if (error.code === 10003) {
                console.error(`Guild not found or bot not in guild (ID: ${guildId})`);
            } else {
                console.error(`Failed to process guild ${guildId}`, error);
            }
        }
        }
    } catch (error) {
        console.error('An error occurred while setting up the bot:', error);
    }
    const gUild = new EmbedBuilder()
        .setColor('#FFFFFF')
        .setTitle('Listing is done');
    let sEnt = 0;
    await alertChannel.send({ embeds: [gUild] });
    client.destroy();
});

client.login(token);