const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Creates a poll")  
    .addStringOption(option =>
        option.setName("description")
        .setDescription("Describe the poll")
        .setRequired(true)
    )

    .addChannelOption(option =>
        option.setName("channel")
        .setDescription("Where do you want to send the poll")
        .setRequired(true)
    ),

    async execute(interaction){
        const {options} =interaction;

        const channel = options.getChannel("channel");
        const description = options.getString("description");

        const embed = new EmbedBuilder()
            .setColor("DarkAqua")
            .setDescription(description)
            .setTimestamp();
    try {
        const m = await channel.send({embeds: [embed]});
        await m.react("✅");
        await m.react("❌");
        await interaction.reply({content: "⚠POLL⚠", ephermeral: true});
    }catch(err){
        console.log(err);
    }

    }
}