const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rps')
		.setDescription('play rock paper scissors'),
	async execute(interaction) {

        const rand = Math.floor(Math.random()*3)+1;

        const rock = new ButtonBuilder()
			.setCustomId('rock')
			.setLabel('rock')
			.setStyle(ButtonStyle.Danger);
		const scissors = new ButtonBuilder()
			.setCustomId('scissors')
			.setLabel('scissors')
			.setStyle(ButtonStyle.Secondary);
        const paper = new ButtonBuilder()
			.setCustomId('paper')
			.setLabel('paper')
			.setStyle(ButtonStyle.Primary);    
        const row = new ActionRowBuilder()
			.addComponents(rock, paper, scissors); 
        const response = await interaction.reply({
            content: "Rock Paper Scissors!",
            components: [row],
        });   

        const collectorFilter = i => i.user.id === interaction.user.id;
            try{
                const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000});
                if(confirmation.customId == 'rock' && rand == 1){
                    await confirmation.update({content: "we both chose rock, Its a tie", components:[]});
                }
                else if(confirmation.customId == 'rock' && rand == 2){
                    await confirmation.update({content: "I chose scissors, you won", components:[]});
                }
                else if(confirmation.customId == 'rock' && rand == 3){
                    await confirmation.update({content: "I chose paper, I win", components:[]});
                }

                if(confirmation.customId == 'paper' && rand == 3){
                    await confirmation.update({content: "we both chose paper, Its a tie", components:[]});
                }
                else if(confirmation.customId == 'paper' && rand == 1){
                    await confirmation.update({content: "I chose rock, you win", components:[]});
                }
                else if(confirmation.customId == 'paper' && rand == 2){
                    await confirmation.update({content: "I chose scissors, I win", components:[]});
                }

                if(confirmation.customId == 'scissors' && rand == 2){
                    await confirmation.update({content: "we both chose scissors, Its a tie", components:[]});
                }
                else if(confirmation.customId == 'scissors' && rand == 1){
                    await confirmation.update({content: "I chose rock, I win", components:[]});
                }
                else if(confirmation.customId == 'scissors' && rand == 3){
                    await confirmation.update({content: "I chose paper, you win", components:[]});
                }
                
            }
            catch (e) {
	await response.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
}

        

         
    }
};