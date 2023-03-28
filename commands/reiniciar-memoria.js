const { SlashCommandBuilder } = require('discord.js');
const { ChannelType } = require('discord.js') 
const { chatRemoveMessagesID } = require('./../chatgpt.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reiniciar-memoria')
		.setDescription('Reinicia la memoria de un canal especificado.')
		.addChannelOption(option =>
			option
				.setName('canal')
				.setDescription('Selecciona el canal para reiniciar memoria')
				.setRequired(true)
				.addChannelTypes(ChannelType.GuildText)
		),
	async execute(interaction) {
		const value_canal = interaction.options.getChannel('canal');

		if (value_canal) {
        	console.log('Se ha reiniciado la memoria del canal ' + value_canal.name)
            chatRemoveMessagesID(value_canal.id)

			return interaction.reply({ content: 'Se ha reiniciado la memoria del canal ' + value_canal.name, ephemeral: true });
		}
		
		return interaction.reply('Faltan opciones requeridas.');
	},
};