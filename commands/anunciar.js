const { SlashCommandBuilder } = require('discord.js');
const { ChannelType } = require('discord.js') 
const { chatgpt } = require('./../chatgpt')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('anunciar')
		.setDescription('Realiza un anuncio.')
		.addChannelOption(option =>
			option
				.setName('canal')
				.setDescription('Selecciona el canal para publicar el anuncio')
				.setRequired(true)
				.addChannelTypes(ChannelType.GuildText)
		)
        .addStringOption(option => 
            option
                .setName('plataforma')
				.setDescription('Selecciona una plataforma')
				.setRequired(true)
				.addChoices(
					{ name: 'Ninguna', value: '.' },
					{ name: 'Twitch', value: 'Debes incluir al final el enlace de twitch: https://www.twitch.tv/aguila27ac' },
					{ name: 'Youtube', value: 'Debes incluir al final el enlace de youtube: https://www.youtube.com/@Aguila27AC' },
					{ name: 'Twitter', value: 'Debes incluir al final el enlace de twitter: https://twitter.com/Aguila27AC' },
					{ name: 'Discord', value: 'Debes incluir al final la invitacion de discord: https://discord.com/invite/GxFQNT7FEJ' },
				)
        )
        .addStringOption(option => 
            option
                .setName('anuncio')
				.setDescription('Sobre que trata el anuncio')
				.setRequired(true)
        ),
	async execute(interaction) {
		const value_canal = interaction.options.getChannel('canal');
		const value_plataforma = interaction.options.getString('plataforma');
		const value_anuncio = interaction.options.getString('anuncio');

		if (value_canal && value_plataforma && value_anuncio) 

			console.log(interaction.user.username + ": " + "Haz un anuncio sobre: " + value_anuncio + ". " + value_plataforma)
			chatgpt([{ role: "user", content: interaction.user.username + ": " + "Haz un anuncio sobre: " + value_anuncio + "." + value_plataforma}])
			.then((response) => {
				value_canal.send('@here' + response["data"]["choices"][0]["message"]["content"]);
				console.log("Nidori: " + response["data"]["choices"][0]["message"]["content"])
			})
			.catch((err) => {
				console.error(err)
				value_canal.send('Error al enviar anuncio');
				return
			});

			return interaction.reply('Preparando anuncio...');
		return interaction.reply('No option was provided!');
	},
};