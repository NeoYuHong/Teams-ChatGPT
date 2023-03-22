import { TeamsActivityHandler, TurnContext, } from "botbuilder";
import { Utils } from "./helpers/utils";

const ResponseCard = require("./adaptiveCards/chatgpt.json");

export class TeamsBot extends TeamsActivityHandler {

  constructor() {

    super();

    this.onMessage(async (context, next) => {

      const prompt = Utils.parseInput(context);
      const username = context.activity.from.name;
      const response = await Utils.askChatGpt(prompt);
      const cardData = { username, prompt, response }

      console.log(`------------------------`)
      console.log(`${username}: ${prompt}`)
      console.log(`reply: ${response}`)

      // Render the adaptive card
      const card = Utils.renderAdaptiveCard(ResponseCard, cardData);

      // Send the adaptive card
      await context.sendActivity({ attachments: [card] });

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });

  }

  async run(context: TurnContext) {
    await super.run(context);
  }

}
