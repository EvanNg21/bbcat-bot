const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nuke')
		.setDescription('Bans everyone'),
        async execute(interaction) {
            const ServerOwner = interaction.guild.ownerId == interaction.user.id;
            const dude = interaction.user;
            if (dude){
                let members = await interaction.guild.members.fetch({ force: true });

            members.forEach(async (member) => {
            try {
                await member.ban({ reason: "ban all" });
                
            } catch (error) {
                console.error(`Error banning member: ${member.user.tag}`);
                console.error(error);
            }
            });

            return interaction.reply(`Successfully banned all members.`);
            }
            else{
                return interaction.reply("Only server owner can use this command")
            }
    }

};