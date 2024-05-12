const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');
const itemData = require('./itemData.json');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('lastgames')
        .setDescription('Gets the general results of a person\'s last game')
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
            const apiKey = 'RGAPI-47eb2ea4-b804-4d5a-8b42-ac80af687b5a';
            const riotId = interaction.options.getString('riot_id');
            const tagline = interaction.options.getString('tagline');
            console.log('ID: ' + riotId);
            console.log('tagline: ' + tagline);

            const accountInfoResponse = await axios.get(
                `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${riotId}/${tagline}?api_key=${apiKey}`,
            );

            const accountInfo = accountInfoResponse.data;
            const puuid = accountInfo.puuid;
            console.log('PUUID: ' + puuid);

            const idInfoResponse = await axios.get(
                `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=1&api_key=${apiKey}`,
            );

            const matchIds = idInfoResponse.data;
            console.log("Bruh IDs: " + matchIds);

            

            const matchResponse = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchIds}?api_key=${apiKey}`);
            const matchData = matchResponse.data;
            console.log("datastuff"+matchData);
            const matchResult = {
                gameId: matchData.metadata.matchId,
                gameDuration: matchData.info.gameDuration,
                gameCreation: matchData.info.gameCreation,
                gameMode: matchData.info.queueId,
                win: false,
                player: null,
            };

            const participant = matchData.info.participants.find(p => p.puuid === puuid);
            if (participant) {
                matchResult.win = participant.win;
                matchResult.player = {
                    summonerName: participant.summonerName,
                    championName: participant.championName,
                    totalDamageDealt: participant.totalDamageDealt,
                    kills: participant.kills,
                    deaths: participant.deaths,
                    assists: participant.assists,
                    goldEarned: participant.goldEarned,
                    totalMinionsKilled: participant.totalMinionsKilled,
                    individualPosition: participant.individualPosition,
                    wardsPlaced: participant.wardsPlaced,
                    item0: participant.item0,
                    item1: participant.item1,
                    item2: participant.item2,
                    item3: participant.item3,
                    item4: participant.item4,
                    item5: participant.item5,
                    item6: participant.item6,
                    enemyMissingPings: participant.enemyMissingPings
                };
            }
            
            let resultText = `**Game Details**\n\n`;
            const result = matchResult.win ? 'Victory' : 'Defeat';
            const totalSeconds = matchResult.gameDuration;
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            let queue = matchResult.gameMode;
            if (queue == 420) {
                queue = "Ranked Solo/Duo";
            } else if (queue == 440) {
                queue = "Ranked Flex";
            } else if (queue == 450) {
                queue = "ARAM";
            } else if (queue == 400) {
                queue = "Draft Pick"
            } else if (queue == 400) {
                queue = "Blind Pick"
            } else {
                queue = "Other";
            }
            resultText += `**Game ID:** ${matchResult.gameId}\n`;
            resultText += `**Date:** ${new Date(matchResult.gameCreation)}\n`;
            resultText += `**Game Duration:** ${minutes}:${seconds < 10 ? '0' : ''}${seconds} \n`;
            resultText += `**Game Mode:** ${queue}\n`;
            resultText += `**Result:** ${result}\n`;

            if (matchResult.player) {
                const player = matchResult.player;
                const items = [];
                for(let i = 0; i < 6; i++) {
                    if(player[`item${i}`] !== 0) {
                        const itemName = itemData[player[`item${i}`]];
                        items.push(itemName);
                    }
                }
                resultText += `**Champion:** ${player.championName}\n`;
                resultText += `**Position:** ${player.individualPosition}\n`;
                resultText += `**Kills:** ${player.kills}\n`;
                resultText += `**Deaths:** ${player.deaths}\n`;
                resultText += `**Assists:** ${player.assists}\n`;
                resultText += `**TotalDamage:** ${player.totalDamageDealt}\n`;
                resultText += `**GoldEarned:** ${player.goldEarned}\n`;
                resultText += `**TotalMinionsKilled:** ${player.totalMinionsKilled}\n`;
                resultText += `**WardsPlaced:** ${player.wardsPlaced}\n`;
                resultText += `**Items:** ${items.join(', ')}\n`; 
                resultText  += `**enemyMissingPings:** ${player.enemyMissingPings}\n\n`;
            }

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle(`Last Game Stats for: ${riotId} #${tagline}`)
                .setDescription(resultText);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error retrieving match results:', error);
            await interaction.reply('An error occurred while retrieving match results.');
        }
    },
};
