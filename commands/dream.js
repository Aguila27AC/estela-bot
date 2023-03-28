const { SlashCommandBuilder } = require('discord.js');
const { ChannelType } = require('discord.js') 
const { chat } = require('./../chatgpt.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dream')
		.setDescription('Visiones difusas de un mundo desconocido.')
		.addChannelOption(option =>
			option
				.setName('canal')
				.setDescription('Selecciona el canal')
				.setRequired(true)
				.addChannelTypes(ChannelType.GuildText)
		),
	async execute(interaction) {
		const value_canal = interaction.options.getChannel('canal');

		if (value_canal) {
            console.log("Haz un anuncio sobre: ")
			chat([
				{ role: "user", content: "Haz un anuncio sobre: "}
			])
				.then((response) => {
					value_canal.send(response["data"]["choices"][0]["message"]["content"]);
				})
				.catch((err) => {
					console.error(err)
					value_canal.send('Error al enviar el sueño');
					return
				});

			return interaction.reply({ content: 'Se ha enviado un sueño a: ' + value_canal.name, ephemeral: true });
		}
		
		return interaction.reply('Faltan opciones requeridas.');
	},
};