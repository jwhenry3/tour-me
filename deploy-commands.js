import { REST, Routes } from 'discord.js'
import ping from './commands/ping.js'
import requestTour from './commands/request-tour.js'

import dotenv from 'dotenv'
dotenv.config()

const commands = [ping.data.toJSON(), requestTour.data.toJSON()]

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN)

// and deploy your commands!
;(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    )

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(process.env.APP_ID),
      { body: commands }
    )

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    )
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error)
  }
})()
