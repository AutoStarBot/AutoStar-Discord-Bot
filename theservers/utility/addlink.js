//Use the bot to add a link to a social

const chalk = require('chalk');
const {PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');
Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('addlink')
        .setDescription('Add link to channel description')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption(option =>
            option.setName('type')
                .setDescription('What link would you like to add?')
                .setRequired(true)
                .addChoices(
                    { name: 'Otherside', value: 'otherside' },
                    { name: 'Instagram', value: 'instagram' },
                    { name: 'X/Twitter', value: 'twitter' },
                    { name: 'Reddit', value: 'reddit' },
                    { name: 'TikTok', value: 'tiktok' },
                    { name: 'Twitch', value: 'twitch' },
                    { name: 'Youtube', value: 'youtube' },
                    { name: 'Snapchat', value: 'snapchat' },
                    { name: 'Onlyfans(paid)', value: 'onlyfanspaid' },
                    { name: 'Onlyfans(free)', value: 'onlyfansfree' },
                    { name: 'Fansly(paid)', value: 'fansly' },
                ))
        .addStringOption(option =>
            option
                .setName('link')
                .setDescription('The link')
                .setRequired(true)),
        
    async execute(interaction) {
        const adddescription = interaction.options.getString('type');
        const link = interaction.options.getString('link');
        const description = interaction.channel.topic;
        const topicDescription = description ? description : "";
        interaction.channel.setTopic(`${adddescription.capitalize()}: ${link}\n` + topicDescription);
        interaction.reply({content: `Added Link`, ephemeral: true})
    }
};