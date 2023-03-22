import { CardFactory, Attachment } from "botbuilder";
import ACData = require("adaptivecards-templating");
import { Configuration, OpenAIApi } from "openai";
import { TurnContext } from "botbuilder";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export class Utils {


  static parseInput(context: TurnContext): string {

    let { text } = context.activity;

    // remove the mention of this bot
    const removedMentionText = TurnContext.removeRecipientMention(context.activity);

    // Remove the line break
    if (removedMentionText)
      text = removedMentionText.toLowerCase().replace(/\n|\r/g, "").trim();

    return text;
  }

  // Bind AdaptiveCard with data
  static renderAdaptiveCard(rawCardTemplate: any, dataObj?: any): Attachment {
    const cardTemplate = new ACData.Template(rawCardTemplate);
    const cardWithData = cardTemplate.expand({ $root: dataObj });
    const card = CardFactory.adaptiveCard(cardWithData);
    return card;
  }

  static async askChatGpt(prompt: string): Promise<string> {

    try {

      // https://openai.com/blog/introducing-chatgpt-and-whisper-apis
      // gpt-3.5-turbo It is priced at $0.002 per 1k tokens, which is 10x cheaper than our existing GPT-3.5 models
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        n: 1,
      });

      const response = completion.data.choices[0].message.content;
      return response;

    } catch (error) {

      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }

      return "Error occured try again later.";
    }

  }

}
