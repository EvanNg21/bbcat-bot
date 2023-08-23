const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lastgames')
        .setDescription('Gets the general results of a person\'s last three games')
        .addStringOption(option =>
            option.setName('summoner_name')
                .setDescription('Enter the summoner name')
                .setRequired(true)
        ),
    async execute(interaction) {
        const apiKey = 'RGAPI-1853f676-81ec-460d-adb3-89ce7061c506';
        const summonerName = interaction.options.getString('summoner_name');

        try {
            // Get summoner info
            const summonerResponse = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}?api_key=${apiKey}`);
            const summonerData = summonerResponse.data;
            const puuid = summonerData.puuid;

            // Get match IDs for the summoner's recent matches
            const matchIdsResponse = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=3&api_key=${apiKey}`);
            const matchIds = matchIdsResponse.data;

            // Fetch details of each match
            const matchResults = [];
            for (const matchId of matchIds) {
                const matchResponse = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiKey}`);
                const matchData = matchResponse.data;
                const matchResult = {
                    gameId: matchData.metadata.matchId,                      
                    gameDuration: matchData.info.gameDuration,
                    gameCreation: matchData.info.gameCreation,
                    gameMode: matchData.info.queueId,
                    win: false,
                    player: null,
                };


                // Find the participant data for the summoner
                const participant = matchData.info.participants.find(p => p.puuid === puuid);
                if (participant) {
                    matchResult.win = participant.win;
                    matchResult.player = {
                        summonerName: participant.summonerName,
                        championName: participant.championName,
                        totalDamageDealt: participant.totalDamageDealt,
                        kills: participant.kills,
                        deaths: participant.deaths,
                        assists: participant.assists
                    };
                }

                matchResults.push(matchResult);
            }

            // Process and display match results
            let resultText = `Recent Matches\n\n`;
            for (const matchResult of matchResults) {
                const result = matchResult.win ? 'Victory' : 'Defeat';
                const totalSeconds = matchResult.gameDuration;
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                let queue = matchResult.gameMode;
                if(queue==420){
                    queue ="Ranked Solo/Duo";
                }
                else if(queue==440){
                    queue ="Ranked Flex";
                }
                else if(queue==450){
                    queue ="ARAM";
                }
                else if(queue==400){
                    queue ="Draft Pick"
                }
                else if(queue==400){
                    queue ="Blind Pick"
                }
                else{
                    queue ="Other";
                }
                resultText += `Game ID: ${matchResult.gameId}\n`;
                resultText += `Date: ${new Date(matchResult.gameCreation)}\n`;
                resultText += `Game Duration: ${minutes}:${seconds < 10 ? '0' : ''}${seconds} \n`;
                resultText += `Game Mode: ${queue}\n`;
                resultText += `Result: ${result}\n`;

                if (matchResult.player) {
                    const player = matchResult.player;
                    resultText += `Champion: ${player.championName}\n`;
                    resultText += `Kills: ${player.kills}\n`;
                    resultText += `Deaths: ${player.deaths}\n`;
                    resultText += `Assists: ${player.assists}\n`;
                    resultText += `TotalDamage: ${player.totalDamageDealt}\n\n`;
                }

                resultText += '\n';
            }

            const embed = new EmbedBuilder()
                .setColor('DarkRed')
                .addFields({ name: `Stats Of Last 3 Games for: ${summonerName}`, value: resultText });
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error retrieving match results:', error);
            await interaction.reply('An error occurred while retrieving match results.');
        }
    },
};
