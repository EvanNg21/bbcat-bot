const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lol')
		.setDescription('gets lol stats')
        .addStringOption(option =>
            option.setName('summoner_name')
            .setDescription("enter summoner name")
            .setRequired(true)
        ),
	async execute(interaction) {
       
       try{
        const apiKey = 'RGAPI-a63e4fdd-7aab-4fdb-99be-61add3e11084';
        const summonerName = interaction.options.getString('summoner_name');
        //finds summoner info
        const summonerInfoResponse = await axios.get(
            `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
              summonerName
            )}`,
            {
              headers: {
                'X-Riot-Token': apiKey,
              },
            }
          );
    
          const summonerInfo = summonerInfoResponse.data;
    
          // Get ranked stats
          const rankedStatsResponse = await axios.get(
            `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerInfo.id}`,
            {
              headers: {
                'X-Riot-Token': apiKey,
              },
            }
          );

          const rankedStats = rankedStatsResponse.data;
            
          // Process and display the stats
          
          let statsText = `Ranked Stats\n\n`;
          rankedStats.forEach((stat) => {
            statsText += `Queue: ${stat.queueType}\n`;
            statsText += `Tier: ${stat.tier} ${stat.rank}\n`;
            statsText += `LP: ${stat.leaguePoints}\n`;
            statsText += `Wins: ${stat.wins}\n`;
            statsText += `Losses: ${stat.losses}\n`;
            statsText += 'Winrate: ' + (Math.round(stat.wins/(stat.losses+stat.wins)*100))+'%\n\n';
          });
          
          const embed = new EmbedBuilder()
            .setColor("Yellow")
            .addFields({name:`Summoner Stats for: ${summonerName}` ,value: statsText});
        
        await interaction.reply({embeds:[embed]});
    } catch (error) {
      console.error('Error retrieving stats:', error);
      await interaction.reply('An error occurred while retrieving stats.');
    }
       
	},
};