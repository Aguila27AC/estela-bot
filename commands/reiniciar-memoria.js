const { SlashCommandBuilder } = require('discord.js');
const { ChannelType } = require('discord.js') 
const { chatRemoveID } = require('./../chatgpt.js')

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

        console.log(value_canal.id)
        console.log(value_canal.name)

		if (value_canal)
            chatRemoveID(value_canal.id)

			return interaction.reply({ content: 'Se ha reiniciado la memoria del canal ' + value_canal.name, ephemeral: true });
		return interaction.reply('No option was provided!');
	},
};