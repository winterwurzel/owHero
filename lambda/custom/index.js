/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const cookbook = require('./cookbook.js');

const SKILL_NAME = 'Zufälliger Overwatch Held';
const GET_HERO_MESSAGE = 'Dein zufälliger Held: ';
const HELP_MESSAGE = 'Du kannst mich nach einem zufälligen Overwatch Helden fragen.';
const HELP_REPROMPT = 'Wie kann ich dir helfen?';
const STOP_MESSAGE = 'Viel erfolg beim spielen!';
const ERROR_MESSAGE = 'Ich hab dich leider nicht verstanden, kannst du die Frage wiederholen?';

const data = [
  'Mercy',
  'Ana',
  'Lucio',
  'Moira',
  'Zenyatta'
];

// const LaunchRequestHandler = {
//   canHandle(handlerInput) {
//     return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
//   },
//   handle(handlerInput) {
//     const speechText = 'Welcome to the Alexa Skills Kit, you can say hello!';
//     return handlerInput.responseBuilder
//       .speak(speechText)
//       .reprompt(speechText)
//       .withSimpleCard(SKILL_NAME, speechText)
//       .getResponse();
//   },
// };

const GetOwHeroIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
      && request.intent.name === 'GetOwHeroIntent');
  },
  handle(handlerInput) {
    const randomFact = cookbook.getRandomItem(data);
    const speechText = GET_HERO_MESSAGE + randomFact;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = HELP_MESSAGE;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(HELP_REPROMPT)
      .withSimpleCard(SKILL_NAME, speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = STOP_MESSAGE;

    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .withSimpleCard(SKILL_NAME, speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak(ERROR_MESSAGE)
      .reprompt(ERROR_MESSAGE)
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetOwHeroIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
