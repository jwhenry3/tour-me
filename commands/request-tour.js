import {
  EmbedBuilder,
  ModalBuilder,
  SlashCommandBuilder,
  TextInputBuilder,
  StringSelectMenuBuilder
} from 'discord.js'
const emojis = ['😃', '😎', '🤗', '😍', '🧙']

export default {
  data: new SlashCommandBuilder()
    .setName('request-tour')
    .setDescription('Request a tour')
    .addStringOption((option) =>
      option
        .setName('in_game_name')
        .setDescription('Your in-game name')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .addChoices(
          emojis.map((emoji) => ({
            name: emoji,
            value: emoji
          }))
        )
        .setName('reaction')
        .setDescription('Reaction needed')
        .setRequired(true)
    ),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Tour Request')
      .setDescription(
        `A tour has been requested by ${interaction.user.toString()}!`
      )
      .addFields({
        name: 'In Game Name',
        value: interaction.options.getString('in_game_name')
      })
      .addFields({
        name: 'Reaction',
        value: interaction.options.getString('reaction')
      })

    await interaction.reply({ embeds: [embed], ephemeral: true })

    await interaction.channel.send({ embeds: [embed] })
  }
}
