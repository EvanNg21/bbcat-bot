const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Send a private message to a user')
    
    .addChannelOption(option =>
        option.setName("channel")
        .setDescription("Where do you want to send the poll")
        .setRequired(true)
    )
    .addStringOption(option =>
        option
          .setName('message')
          .setDescription('The message to send')
          .setRequired(true)
      ),
    
  async execute(interaction) {
    const message = interaction.options.getString('message');
    const channel = interaction.options.getChannel('channel');
    if (!message || !channel) {
        return await interaction.reply({ content: 'Please provide channel or message.', ephemeral: true });
      }

      try {
        // Send a direct message to the mentioned user
        await channel.send(message);
  
        // Reply to the interaction to confirm the message was sent, and set it as ephemeral
        await interaction.reply({ content: 'Message sent!', ephemeral: true });
      } catch (error) {
        console.error(`Error sending a message  ${error}`);
        await interaction.reply({ content: 'There was an error sending the message.', ephemeral: true });
      }
  }
};