const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName("8ball")
	.setDescription("Replies to question")
    .addStringOption(option =>
        option.setName("question")
        .setDescription("ask a question")
        .setRequired(true)
        )
    .addChannelOption(option =>
        option.setName("channel")
        .setDescription("Where do you want to send the poll")
        .setRequired(true)
     ),
	async execute(interaction) {
        const {options} =interaction;
        const channel = options.getChannel("channel");
        const question = options.getString("question");
        
        const responses = [
            ' It is certain.',
            'It is decidedly so.',
            'Without a doubt.',
            ' Yes definitely.',
            'As I see it, yes.',
            'Most likely.',
            'Outlook good.',
            'Yes.',
            'Signs point to yes.',
            'Reply hazy, try again.',
            'Ask again later.',
            ' Better not tell you now.',
            'Concentrate and ask again.',
            ' My reply is no.',
            ' My sources say no.',
            'Outlook not so good.',
            'Very doubtful.',
        ];
        const rand = Math.floor(Math.random() * responses.length);
        const response = responses[rand];
        
        
        const embed = new EmbedBuilder()
            .setColor("LuminousVividPink")
            .setDescription(question)
            .addFields({name:'🎱Magic 8Ball says', value: response})
            .setTimestamp();
    try {
        const m = await channel.send({embeds: [embed]});
        await interaction.reply({content: "🎱Magic 8Ball", ephermeral: true});
    }catch(err){
        console.log(err);
    }
     
        
        
    }
};