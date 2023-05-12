const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('flip')
		.setDescription('Replies with heads or tails'),
	async execute(interaction) {
        const randomNumber = Math.floor(Math.random() * 2) + 1;
        if(randomNumber == 1){
            return interaction.reply('tails!');
        }
        else{
            return interaction.reply('heads!');

        }
    }
};