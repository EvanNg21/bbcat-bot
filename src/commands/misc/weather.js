const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const apiKey = '027e12c0a7b30e999d68779289cf095a';
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
        const prec = weatherData.precip;
        const tempf = Math.round(temperature * 9 / 5) + 32;
        const description = weatherData.weather_descriptions[0];
        const humid = weatherData.humidity;
        const windSpeed = weatherData.wind_speed;
        const windMph = (Math.round(windSpeed/1.609344));
        const uv = weatherData.uv_index;
        const feel = weatherData.feelslike;
        const feelf = Math.round(feel * 9 / 5) + 32;
        const windDir = weatherData.wind_dir;
        const clouds = weatherData.cloudcover; 
        
        

        await interaction.reply(`The current weather in ${location} is ${description} with a temperature of ${tempf}°F, but feels like ${feelf}°F.
        Humidity: ${humid}%
        Wind: ${windMph} mph, heading ${windDir}
        UV Index: ${uv} (1-11+)
        CloudCover: ${clouds}%
        Precipitation: ${prec}`);
        
        } catch (error) {
        console.error(error);
        await interaction.reply('Sorry, there was an error while fetching the weather.');
        }
    }
};