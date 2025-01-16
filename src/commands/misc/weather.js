const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.WEATHER_KEY;
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
            await interaction.deferReply({ ephemeral: false});
            console.log("deffered")

            const response = await axios.get(
                `http://api.weatherstack.com/current?access_key=${apiKey}&query=${location}`
            );

            console.log(`http://api.weatherstack.com/current?access_key=${apiKey}&query=${location}`);

            const weatherData = response.data.current;
            const temperature = weatherData.temperature;
            const prec = weatherData.precip;
            const tempf = Math.round(temperature * 9 / 5) + 32;
            const description = weatherData.weather_descriptions[0];
            const humid = weatherData.humidity;
            const windSpeed = weatherData.wind_speed;
            const windMph = (Math.round(windSpeed / 1.609344));
            const uv = weatherData.uv_index;
            const feel = weatherData.feelslike;
            const feelf = Math.round(feel * 9 / 5) + 32;
            const windDir = weatherData.wind_dir;
            const clouds = weatherData.cloudcover;

            await interaction.followUp(`The current weather in ${location} is ${description} with a temperature of ${tempf}°F, but feels like ${feelf}°F.
                Humidity: ${humid}%
                Wind: ${windMph} mph, heading ${windDir}
                UV Index: ${uv} (1-11+)
                CloudCover: ${clouds}%
                Precipitation: ${prec}`);
        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: 'There was an error fetching weather data.', ephemeral: true });
        }
    }
};
