import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from 'discord-interactions';

// Create and configure express app
const app = express();

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), function (req, res) {
  // Interaction type and data
  const { type, data } = req.body;
  /**
   * Handle slash command requests
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    // Slash command with name of "test"
    if (data.name === 'test') {
      // Send a modal as response
      return res.send({
        type: InteractionResponseType.MODAL,
        data: {
          custom_id: 'my_modal',
          title: 'Modal title',
          components: [
            {
              // Text inputs must be inside of an action component
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  // See https://discord.com/developers/docs/interactions/message-components#text-inputs-text-input-structure
                  type: MessageComponentTypes.INPUT_TEXT,
                  custom_id: 'player_name',
                  style: 1,
                  label: 'In Game Name',
                },
              ],
            },
            {
              // Text inputs must be inside of an action component
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  // See https://discord.com/developers/docs/interactions/message-components#text-inputs-text-input-structure
                  type: MessageComponentTypes.STRING_SELECT,
                  custom_id: 'reaction',
                  options: [
                    {
                      label: '#1',
                      value: '1',
                    },
                    {
                      label: '#2',
                      value: '2',
                    },
                    {
                      label: '#3',
                      value: '3',
                    },
                    {
                      label: '#4',
                      value: '4',
                    },
                  ],
                  label: 'Reaction Needed',
                },
              ],
            },
          ],
        },
      });
    }
  }

  /**
   * Handle modal submissions
   */
  if (type === InteractionType.MODAL_SUBMIT) {
    // custom_id of modal
    const modalId = data.custom_id;
    // user ID of member who filled out modal
    const userId = req.body.member.user.id;

    if (modalId === 'my_modal') {
      let modalValues = '';
      // Get value of text inputs
      for (let action of data.components) {
        let inputComponent = action.components[0];
        modalValues += `${inputComponent.label}: ${inputComponent.value}\n`;
      }

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `<@${userId}> Needs your help!\n\n${modalValues}`,
        },
        components: [
          {
            type: MessageComponentTypes.SECTION,
            components: [
              {
                type: MessageComponentTypes.TEXT_DISPLAY,
                text: modalValues,
              },
            ],
          }
        ]
      });
    }
  }
});
app.get('/interactions', (req, res) => {
  res.send('Hello World!');
});
app.listen(3000, () => {
  console.log('Listening on port 3000');
});
