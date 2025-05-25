const { REST, Routes } = require('discord.js');
const rest = new REST().setToken('');
const commandID = '1041825349836742677' //set to command's Id
rest.delete(Routes.applicationCommand('1034252855651074068', commandID))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);