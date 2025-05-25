const chalk = require('chalk');
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const rest = new REST().setToken(token);
rest.delete(Routes.applicationGuildCommand(clientId, guildId, '1266525509936742441'))
	.then(() => console.log(chalk.green('Successfully deleted guild command')))
	.catch(console.error);