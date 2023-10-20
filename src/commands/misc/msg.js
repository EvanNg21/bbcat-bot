const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('senddm')
    .setDescription('Send a private message to a user')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user you want to send a DM to')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('The message to send')
        .setRequired(true)
    ),
  async execute(interaction) {
    // Get the mentioned user from the command options
    const user = interaction.options.getUser('user');
    const message = interaction.options.getString('message');

    // Check if the user and message are provided
    if (!user || !message) {
      return await interaction.reply({ content: 'Please provide a user and a message.', ephemeral: true });
    }

    try {
      // Send a direct message to the mentioned user
      await user.send(message);

      // Reply to the interaction to confirm the message was sent, and set it as ephemeral
      await interaction.reply({ content: 'Message sent!', ephemeral: true });
    } catch (error) {
      console.error(`Error sending a message to ${user.tag}: ${error}`);
      await interaction.reply({ content: 'There was an error sending the message.', ephemeral: true });
    }
  },
};
