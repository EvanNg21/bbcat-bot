const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('overwatch')
        .setDescription('Gets Overwatch stats')
        .addStringOption(option =>
            option.setName('name')
            .setDescription("Enter overwatch name")
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('battletag')
            .setDescription("Enter battletag")
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('hero')
            .setDescription("Enter hero")
            .setRequired(false)
        ),
    async execute(interaction) {
        try {
            
            const owName = interaction.options.getString('name');
            const owTag = interaction.options.getString('battletag');
            const hero = interaction.options.getString('hero');
             // Get account info by Riot ID and tagline
             const accountInfoResponse = await axios.get(
                `https://overfast-api.tekrop.fr/players/${owName}-${owTag}/summary`,
                    
            );
            const accountInfo = accountInfoResponse.data;

            const playerInfoResponse = await axios.get(
                `https://overfast-api.tekrop.fr/players/${owName}-${owTag}/stats/summary?gamemode=competitive`,
                    
            );
            const playerInfo = playerInfoResponse.data;

            
            
            let responseEmbed;
            if(hero) {
                const heroStuff = await axios.get(
                    `https://overfast-api.tekrop.fr/heroes`,
                        
                );
                const heroThing = heroStuff.data;
                const heroPic = heroThing.find(heroObj => heroObj.name.trim().toLowerCase() === hero.trim().toLowerCase());
                const heroInfo = playerInfo.heroes[hero];
                const heroText = `
                    **Username:** ${accountInfo.username}
                    **Games played:** ${heroInfo.games_played}
                    **Wins:** ${heroInfo.games_won}
                    **Losses:** ${heroInfo.games_lost}
                    **Time played:** ${heroInfo.time_played}
                    **Kills:** ${heroInfo.total.eliminations} **Average kills:** ${heroInfo.average.eliminations}
                    **Deaths:** ${heroInfo.total.deaths} **Average deaths:** ${heroInfo.average.deaths}
                    **Healing:** ${heroInfo.total.healing} **Average healing:** ${heroInfo.average.healing}
                    **Hero KDA:** ${heroInfo.kda}
                    **Winrate:** ${heroInfo.winrate}%
                `;
                responseEmbed = new EmbedBuilder()
                    .setColor(0xFFFF00)
                    .setThumbnail(accountInfo.avatar)
                    .setImage(heroPic.portrait)
                    .addFields({ name: `Competitve Hero Stats for: ${owName}#${owTag} on ${hero}`, value: heroText });
            } else {
                const statsText = `
                    **Username:** ${accountInfo.username}
                    **Games played:** ${playerInfo.general.games_played}
                    **Eliminated:** ${playerInfo.general.total.eliminations} **Average kills:** ${playerInfo.general.average.eliminations}
                    **Deaths:** ${playerInfo.general.total.deaths} **Average deaths:** ${playerInfo.general.average.deaths}
                    **KDA:** ${playerInfo.general.kda} 
                    **Games won:** ${playerInfo.general.games_won}
                    **Games lost:** ${playerInfo.general.games_lost}
                    **Time played:** ${playerInfo.general.time_played}
                    **Winrate:** ${playerInfo.general.winrate}%
                `;
                responseEmbed = new EmbedBuilder()
                    .setColor(0xFFFF00)
                    .setThumbnail(accountInfo.avatar)
                    .addFields({ name: `Competitve Player Stats for: ${owName}#${owTag}`, value: statsText });
            }

            await interaction.reply({ embeds: [responseEmbed] });
           
        } catch (error) {
            console.error('Error retrieving stats:', error);
            await interaction.reply('Error retrieving stats, Player not found or Player profile is private.');
        }
    },
        
}
