
const chalk = require('chalk');
const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');
const rest = new REST().setToken(token);
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log(chalk.green('Successfully deleted all application commands.')))
	.catch(console.error);
