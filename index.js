import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  MessageFlags
} from 'discord.js'

import requestTour from './commands/request-tour.js'

import dotenv from 'dotenv'
dotenv.config()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions
  ]
})

client.on(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.login(process.env.DISCORD_TOKEN)

client.commands = new Collection()

client.commands.set(requestTour.data.name, requestTour)

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = client.commands.get(interaction.commandName)
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral
      })
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral
      })
    }
  }
})
