//Post images using the bot to by pass discord's spam moderation

const { Client, GatewayIntentBits, EmbedBuilder, ChannelType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const fs = require('fs').promises;
const path = require('path');
const token = '';

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    try {
        const postChannel = await client.channels.fetch('1338078259803328664');
        if (!postChannel) {
            console.error('Alert channel not found.');
            return;
        }

        const folderPath = 'post';
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        const files = await fs.readdir(folderPath);
        const imageFiles = files.filter(file =>
            allowedExtensions.includes(path.extname(file).toLowerCase())
        );

        if (imageFiles.length === 0) {
            console.log('No image files found in the folder.');
            return;
        }

        for (const imageFile of imageFiles) {
            try {
                const filePath = path.join(folderPath, imageFile);
                console.log(`Sending file: ${imageFile}`);
                
                // Send the image file
                const message = await postChannel.send({
                    files: [filePath],
                });
                console.log(`Sent file: ${imageFile}`);

                // React to the message
                await message.react('⭐');
                await message.react('🔻');
                console.log(`Reactions added to: ${imageFile}`);

                // Delay to avoid hitting rate limits
                await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (fileError) {
                console.error(`Error processing file: ${imageFile}`, fileError);
            }
        }
    } catch (error) {
        console.error('An error occurred while setting up the bot:', error);
    } finally {
        client.destroy();
    }
});

client.login(token);