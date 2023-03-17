const fs = require('node:fs');
const path = require('node:path');
// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const  { chatgpt, chatAddMessage, chat_log, max_chat_log } = require('./chatgpt.js')

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`¡${c.user.tag} se ha conectado a Discord!`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.on("messageCreate", (message) => {
    if (message.author.bot || message.mentions.everyone) return;

    if (message.mentions.has(client.user.id)) {
		console.log(message.channelId + ": " + message.author.username + ": " + message.cleanContent)
		chatAddMessage(message.channelId, { role: "user", content: message.author.username + ": " + message.cleanContent})

		let i = 0
		for (i = 0; i < chat_log.length; i++) {
			if (chat_log[i].id === message.channelId) {
				if (chat_log[i].messages.length > max_chat_log) {
					const position = chat_log[i].messages.length - max_chat_log;
					chat_log[i].messages.splice(0, position);
				}
				break;
			}
		}

		console.log("chat_log[i].messages.length: " + chat_log[i].messages.length)

		chatgpt(chat_log[i].messages)
		.then((response) => {
			chatAddMessage(message.channelId, { role: response["data"]["choices"][0]["message"]["role"], content: response["data"]["choices"][0]["message"]["content"]})
			console.log(message.channelId + ": " + "Nidori: " + response["data"]["choices"][0]["message"]["content"])

			message.reply(response["data"]["choices"][0]["message"]["content"]);
		})
		.catch((err) => {
			console.error(err)
			return
		});
    }
});

// Log in to Discord with your client's token
client.login(token);