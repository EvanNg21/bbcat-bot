const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('clears last amount of messages')
        
        .addIntegerOption(option => 
        option.setName('amount')
        .setDescription('number of messages to delete')
        .setRequired(true)),
        async execute(interaction) {
            const ServerOwner = interaction.guild.ownerId == interaction.user.id;
            if (ServerOwner){
                 const amount = interaction.options.getInteger('amount');
                 const messages = await interaction.channel.messages.fetch({limit: amount});
                 interaction.channel.bulkDelete(messages);
                 return interaction.reply( amount + ' messages have been cleared')
            }
            else{
                return interaction.reply("Only server owner can use this command")
            }
    }

};