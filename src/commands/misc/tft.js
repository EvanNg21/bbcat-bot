const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tft')
        .setDescription('Gets TFT stats')
        .addStringOption(option =>
            option.setName('summoner_name')
                .setDescription('Enter the summoner name')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const apiKey = 'RGAPI-a63e4fdd-7aab-4fdb-99be-61add3e11084';
            const summonerName = interaction.options.getString('summoner_name');

            const tftSummonerInfoResponse = await axios.get(
                `https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${encodeURIComponent(
                    summonerName
                )}`,
                {
                    headers: {
                        'X-Riot-Token': apiKey,
                    },
                }
            );

            const tftSummonerInfo = tftSummonerInfoResponse.data;

            // Get TFT ranked stats
            const tftStatsResponse = await axios.get(
                `https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${tftSummonerInfo.id}`,
                {
                    headers: {
                        'X-Riot-Token': apiKey,
                    },
                }
            );

            const tftMatchIdsResponse = await axios.get(
                `https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${tftSummonerInfo.puuid}/ids?count=3`,
                {
                    headers: {
                        'X-Riot-Token': apiKey,
                    },
                }
            );

            const tftMatchIds = tftMatchIdsResponse.data;

            const tftMatchResults = [];

            for (const matchId of tftMatchIds) {
                const tftMatchResponse = await axios.get(
                    `https://americas.api.riotgames.com/tft/match/v1/matches/${matchId}`,
                    {
                        headers: {
                            'X-Riot-Token': apiKey,
                        },
                    }
                );

                const tftMatchData = tftMatchResponse.data;

                const participant = tftMatchData.info.participants.find(p => p.puuid === tftSummonerInfo.puuid);
                const place = participant ? participant.placement : 'N/A';
                
                const matchResult = {
                    gameId: tftMatchData.metadata.match_id,
                    gameDuration: tftMatchData.info.game_length,
                    place: place,
                    level: participant.level,
                    date: tftMatchData.info.game_datetime,
                    
                };

                tftMatchResults.push(matchResult);
            }

            const tftStats = tftStatsResponse.data;

            let statsText = `Ranked Stats\n\n`;
            tftStats.forEach((stat) => {
                statsText += `Queue: ${stat.queueType}\n`;
                statsText += `Tier: ${stat.tier} ${stat.rank}\n`;
                statsText += `LP: ${stat.leaguePoints}\n`;
                statsText += `Wins: ${stat.wins}\n`;
                statsText += `Losses: ${stat.losses}\n`;
                statsText += `Winrate: ${Math.round((stat.wins / (stat.losses + stat.wins)) * 100)}%\n\n`;
            });

            statsText += `Last 3 TFT Matches\n\n`;
            tftMatchResults.forEach((matchResult) => {
                const totalSeconds = matchResult.gameDuration;
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                statsText += `Match ID: ${matchResult.gameId}\n`;
                statsText += `Game Duration: ${minutes}:${seconds < 10 ? '0' : ''}${Math.round(seconds)}\n`;
                statsText += `Date: ${Date(matchResult.date)}\n`;
                statsText += `Place: ${matchResult.place}\n`;
                statsText += `Level: ${matchResult.level}\n\n`;
                
                
            });

            const embed = new EmbedBuilder()
                .setColor('DarkPurple')
                .setTitle(`TFT Stats for: ${summonerName}`)
                .setDescription(statsText);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error retrieving stats:', error);
            await interaction.reply('An error occurred while retrieving stats.');
        }
    },
};
