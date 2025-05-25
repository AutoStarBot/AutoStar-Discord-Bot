const chalk = require('chalk');
const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const guildIds = ['1063525891617071155', '1155625225279512646', '1007146251508260894', '1252307779511910600', '1156212601462734848', '1156413813457965066', '1298419893573521438', '1298427782463754271', '1315773151434637323'];
const commandFolder = 'theservers';

const commands = [];
const foldersPath = path.join(__dirname, commandFolder);
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(chalk.redBright('WARNING'), ` The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// Deploy commands to each guild
(async () => {
  try {
    console.log(chalk.yellow(`Started refreshing ${commands.length} application (/) commands.`));

    for (const guildId of guildIds) {
      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );

      console.log(chalk.green(`Successfully reloaded ${data.length} application (/) commands for guild ${guildId}.`));
    }
  } catch (error) {
    console.error(chalk.redBright('ERROR'), error);
  }
})();

/* const chalk = require('chalk');
const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const guildIds = ['1063525891617071155']
const commandFolder = 'theservers'

const commands = [];
const foldersPath = path.join(__dirname, commandFolder);
const commandFolders = fs.readdirSync(foldersPath);
guildIds.forEach(guildId => {
	for (const folder of commandFolders) {
		// Grab all the command files from the commands directory you created earlier
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			if ('data' in command && 'execute' in command) {
				commands.push(command.data.toJSON());
			} else {
				console.log(chalk.redBright('WARNING'), ` The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}
});

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(chalk.yellow(`Started refreshing ${commands.length} application (/) commands.`));

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(chalk.green(`Successfully reloaded ${data.length} application (/) commands.`));
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})(); */