const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const apiKey = 'bd5a73030ed24ce5b3159e32c42e8113'
module.exports = {
	data: new SlashCommandBuilder()
		.setName('weather')
		.setDescription('sends weather data')
        
        .addStringOption(option =>
            option.setName('location')
            .setDescription('find the weather of a location')
            .setRequired(true)),
	async execute(interaction) {
        const location = interaction.options.getString('location');

        try {
        const response = await axios.get(
            `https://api.weatherbit.io/v2.0/current?city=${location}&key=${apiKey}`
        );

        const weatherData = response.data.data[0];
        const temperature = weatherData.temp;
        const tempf = Math.round(temperature * 9/5)+32;
        const description = weatherData.weather.description;

        await interaction.reply(`The current weather in ${location} is ${description} with a temperature of ${tempf}°F.`);
        } catch (error) {
        console.error(error);
        await interaction.reply('Sorry, there was an error while fetching the weather.');
        }
    }
};