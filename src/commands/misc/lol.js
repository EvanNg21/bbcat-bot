const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lol')
        .setDescription('Gets League of Legends stats')
        .addStringOption(option =>
            option.setName('riot_id')
            .setDescription("Enter Riot ID")
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('tagline')
            .setDescription("Enter tagline")
            .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const apiKey = process.env.LOL_KEY;
            console.log(apiKey);
            const riotId = interaction.options.getString('riot_id');
            const tagline = interaction.options.getString('tagline');
            console.log('ID: ' + riotId);
            console.log('tagline: ' + tagline);
            // Get account info by Riot ID and tagline
            const accountInfoResponse = await axios.get(
                `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${riotId}/${tagline}?api_key=${apiKey}`,
                
            );

            

            const accountInfo = accountInfoResponse.data;
            
            
            // Find summoner ID
            const puuid = accountInfo.puuid;
            console.log('PUUID: ' + puuid);
            // Get ranked stats
            const summonerStatsResponse = await axios.get(
                `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${apiKey}`,
                
            );

            const summoner = summonerStatsResponse.data;
            const summonerid= summoner.id;
            console.log('Summoner ID: ' + summonerid);

            const rankedStatsResponse = await axios.get(
                `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerid}?api_key=${apiKey}`,
                
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
                statsText += 'Winrate: ' + (Math.round(stat.wins / (stat.losses + stat.wins) * 100)) + '%\n\n';
            });

            const embed = new EmbedBuilder()
                .setColor(0xFFFF00)
                .addFields({ name: `Summoner Stats for: ${riotId}#${tagline}`, value: statsText });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error retrieving stats:', error);
            await interaction.reply('An error occurred while retrieving stats.');
        }

    },
};
