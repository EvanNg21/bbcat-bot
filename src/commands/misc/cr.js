const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cr_stats')
        .setDescription('Gets clash royale stats')
        .addStringOption(option =>
            option.setName('playertag')
            .setDescription("clash royale player tag")
            .setRequired(true)
        ),
    async execute(interaction) {
        try {
            await interaction.deferReply(); // Defer reply early

            const apiKey = process.env.CR_TOKEN;
            const playerTag = encodeURIComponent(interaction.options.getString('playertag'));

            const playerData = await fetchPlayerData(playerTag, apiKey);
            if (playerData) {
                const embed = new EmbedBuilder().setColor(0xFFFF00).setTitle(`Clash Royale Stats for: ${playerData.name}, ${playerData.tag}`).setDescription(
                        `Trophies: ${String(playerData.trophies || 'N/A')}\n` +
                        `Wins: ${String(playerData.wins || 'N/A')} WinRate: %${String(((playerData.wins / playerData.battleCount).toFixed(4)) * 100 || 'N/A')}\n` +
                        `Losses: ${String(playerData.losses || 'N/A')}\n` +
                        `Battle Count: ${String(playerData.battleCount || 'N/A')}\n` +
                        `Arena: ${String(playerData.arena.name || 'N/A')}\n` +
                        `Clan: ${String(playerData.clan.name || 'N/A')}\n` +
                        `Total Donations: ${String(playerData.totalDonations || 'N/A')}\n` +
                        `\nCurrent Deck`
                    );

                
                if (playerData.currentDeck && playerData.currentDeck.length > 0) {
                    playerData.currentDeck.forEach(card => {
                        embed.addFields({
                            name: card.name,
                            value: `Level: ${card.level}\nElixir Cost: ${card.elixirCost}\nRarity: ${card.rarity}`,
                            inline: true
                        });
                    });
                }

                await interaction.followUp({ embeds: [embed] });
            } else {
                await interaction.followUp({ content: 'Failed to fetch player data.', ephemeral: true });
            }
        } catch (error) {
            console.error("An error occurred while executing the command:", error);
            await interaction.followUp({ content: 'There was an error executing the command.', ephemeral: true });
        }
    }
};
async function fetchPlayerData(playerTag, apiKey) {
    if (!playerTag){
        console.error("No playerTag provided");
        return;
    }
    try{
        const response = await fetch(`https://api.clashroyale.com/v1/players/${playerTag}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });
        if (response.ok){
            const data = await response.json();
            return data;
        }
        else{
            console.error("Failed to fetch player data");
            return;
        }
    } catch(error){
        console.error(error);
        return;
    }
};