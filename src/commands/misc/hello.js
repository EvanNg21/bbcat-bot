const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('Replies with hello!'),
	async execute(interaction) {
		const user = interaction.user;
		return interaction.reply(`hello! ${user.toString()}`);
	},
};