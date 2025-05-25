//When a message is sent, this decides if the bot should react to the message with the star and down vote

const chalk = require('chalk');
const { Events, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const readline = require('readline');

function getChannelNames(filePath) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        const channelNames = [];

        rl.on('line', (line) => {
            if (line.trim()) {
                channelNames.push(line.trim());
            }
        });

        rl.on('close', () => {
            resolve(channelNames);
        });

        rl.on('error', (err) => {
            reject(err);
        });
    });
}
function getChannelIDs(filePath2) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(filePath2);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        const channelIDs = [];

        rl.on('line', (line) => {
            if (line.trim()) {
                channelIDs.push(line.trim());
            }
        });

        rl.on('close', () => {
            resolve(channelIDs);
        });

        rl.on('error', (err) => {
            reject(err);
        });
    });
}
const filePath = 'ignore/channelNames.txt';
const filePath2 = 'ignore/channelIDs.txt';
module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        try {
            const channelNames = await getChannelNames(filePath);
            const channelIDs = await getChannelIDs(filePath2);
            const messageChannelID = message.channel.id;
            const messageChannelName = message.channel.name;
            if (channelIDs.includes(messageChannelID) || channelNames.includes(messageChannelName) || message.content.startsWith('‎') || message.author.id === '1034252855651074068' || message.author.id === '1034252855651074068' || message.author.id === '1317627150278459402'){
                return
            }
            if (message.channel.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.AddReactions)){
                message.react("⭐"); 
                message.react("🔻"); 
            }
        }catch (error) {
            console.error('Error reading the servers to leave:', error);
        }
    },
};