//This is the hub for all other js files. Run the instance from this file

const chalk = require('chalk');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require('./config.json');
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, ],
    partials: [Partials.Channel]
});
client.commands = new Collection();
client.cooldowns = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath).filter(folder => folder !== '.DS_Store');
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') && !file.startsWith('.'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);   
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(chalk.redBright('WARNING'), ` The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
client.buttons = new Collection();
const foldersPathbutton = path.join(__dirname, 'buttons');
const buttonFolders = fs.readdirSync(foldersPathbutton).filter(folder => folder !== '.DS_Store');
for (const folder of buttonFolders) {
    const buttonsPath = path.join(foldersPathbutton, folder);
    const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js')&& !file.startsWith('.'));
    for (const file of buttonFiles) {
        const filePath = path.join(buttonsPath, file);
        const button = require(filePath);
        if ('execute' in button) {
            client.buttons.set(button.name, button);
        } else {
            console.log(chalk.redBright('WARNING'), ` The button at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}
const foldersPath2 = path.join(__dirname, 'theservers');
const commandFolders2 = fs.readdirSync(foldersPath2).filter(folder => folder !== '.DS_Store');
for (const folder of commandFolders2) {
	const commandsPath2 = path.join(foldersPath2, folder);
	const commandFiles2 = fs.readdirSync(commandsPath2).filter(file => file.endsWith('.js')&& !file.startsWith('.'));
	for (const file of commandFiles2) {
		const filePath = path.join(commandsPath2, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(chalk.redBright('WARNING'), ` The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const foldersPath3 = path.join(__dirname, 'test');
const commandFolders3 = fs.readdirSync(foldersPath3).filter(folder => folder !== '.DS_Store');
for (const folder of commandFolders3) {
	const commandsPath3 = path.join(foldersPath3, folder);
	const commandFiles3 = fs.readdirSync(commandsPath3).filter(file => file.endsWith('.js')&& !file.startsWith('.'));
	for (const file of commandFiles3) {
		const filePath = path.join(commandsPath3, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(chalk.redBright('WARNING'), ` The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js')&& !file.startsWith('.'));
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
process.on('uncaughtException', (err) => {
    if (err.code === 'EPIPE') {
        console.error('EPIPE error occurred, ignoring...');
    } if (err.code === '10062') {
		console.error('Unknown interaction, cannot respond.');
	}else {
        console.error('An unexpected error occurred:', err);
    }
});

client.login(token);