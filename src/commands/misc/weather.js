const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const apiKey = '450707fc8e0bd6677fedbdb45742a3be';
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
            `http://api.weatherstack.com/current?access_key=${apiKey}&query=${location}`
        );

        const weatherData = response.data.current;
        const temperature = weatherData.temperature;
        const tempf = Math.round(temperature * 9 / 5) + 32;
        const description = weatherData.weather_descriptions[0];
        const humid = weatherData.humidity;
        const windSpeed = weatherData.wind_speed;
        const windMph = (Math.round(windSpeed/1.609344));
        const uv = weatherData.uv_index;
        

        await interaction.reply(`The current weather in ${location} is ${description} with a temperature of ${tempf}°F.
        Humidity: ${humid}%
        WindSpeed: ${windMph} mph
        UV Index: ${uv} (1-11+)`);
        
        } catch (error) {
        console.error(error);
        await interaction.reply('Sorry, there was an error while fetching the weather.');
        }
    }
};