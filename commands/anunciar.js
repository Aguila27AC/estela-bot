const { SlashCommandBuilder } = require('discord.js');
const { ChannelType } = require('discord.js') 
const { chat } = require('./../chatgpt.js')

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
                .setName('enlace')
				.setDescription('Añade un enlace')
				.setRequired(true)
				.addChoices(
					{ name: 'NINGUNO', value: ' ' },
					{ name: 'Twitch', value: 'https://www.twitch.tv/aguila27ac' },
					{ name: 'Youtube', value: 'https://www.youtube.com/@Aguila27AC' },
					{ name: 'Twitter', value: 'https://twitter.com/Aguila27AC' },
					{ name: 'Discord', value: 'https://discord.com/invite/GxFQNT7FEJ' },
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
		const value_enlace = interaction.options.getString('enlace');
		const value_anuncio = interaction.options.getString('anuncio');

		if (value_canal && value_enlace && value_anuncio) {

			console.log(interaction.user.username + ": " + "Haz un anuncio sobre " + value_anuncio)
			chat([
				{ role: "user", content: interaction.user.username + ": " + "Haz un anuncio sobre " + value_anuncio}
			])
				.then((response) => {
					value_canal.send('@here' + " " + response["data"]["choices"][0]["message"]["content"] + " " + value_enlace);
					console.log("Nidori:" + " " + response["data"]["choices"][0]["message"]["content"] + " " + value_enlace)
				})
				.catch((err) => {
					console.error(err)
					value_canal.send('Error al enviar anuncio.');
					return
				});

			return interaction.reply({ content: 'Preparando anuncio...', ephemeral: true });
		}

		return interaction.reply('Faltan opciones requeridas.');
	},
};