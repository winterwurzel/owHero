/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const cookbook = require('./cookbook.js');

const SKILL_NAME = 'Zufälliger Overwatch Held';
const GET_HERO_MESSAGE = 'Dein zufälliger Held: ';
const HELP_MESSAGE = 'Ich kann einen Overwatch Helden für dein nächstes Match aus allen verfügbaren Helden oder aus einer der drei Kategorien Tank, Support und Damage auswählen. ';
const HELP_REPROMPT = 'Wie kann ich dir helfen?';
const STOP_MESSAGE = 'Viel erfolg beim match!';
const ERROR_MESSAGE = 'Ich hab dich leider nicht verstanden, kannst du die Frage wiederholen?';

const supports = [
  'Ana',
  'Brigitte',
  'Lusio',
  'Mercy',
  'Moira',
  'Zenyatta'
];

const tanks = [
  'DiVa',
  'Orisa',
  'Reinhardt',
  'Roadhog',
  'Winston',
  'Wrecking Ball',
  'Sarya'
];

const damage = [
  'Bastion',
  'Doomfist',
 	'Genji',
 	'Hanzo',
  'Junkrat',
  'McCree',
  'Mei',
  'Pharah',
  'Reaper',
  'Soldier 76',
  'Sombra',
  'Symmetra',
  'Torbjörn',
  'Tracer',
  'Widowmaker'
]

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    
    const randomHero = cookbook.getRandomItem(supports.concat(tanks).concat(damage));
    const speechText = GET_HERO_MESSAGE + randomHero;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(SKILL_NAME, randomHero)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const GetOwHeroIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'GetOwHeroIntent';
  },
  handle(handlerInput) {
    const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
    const slotValues = cookbook.getSlotValues(filledSlots);
    
    var randomHero = '';
    var speechText = '';

    if (slotValues.class.resolved === 'Tank') {
      randomHero = cookbook.getRandomItem(tanks);
      speechText = `Dein zufälliger ${slotValues.class.resolved} Held: ` + randomHero;
    } else if (slotValues.class.resolved === 'Support') {
      randomHero = cookbook.getRandomItem(supports);
      speechText = `Dein zufälliger ${slotValues.class.resolved} Held: ` + randomHero;
    } else if (slotValues.class.resolved === 'Damage') {
      randomHero = cookbook.getRandomItem(damage);
      speechText = `Dein zufälliger ${slotValues.class.resolved} Held: ` + randomHero;
    } else {
      randomHero = cookbook.getRandomItem(supports.concat(tanks).concat(damage));
      speechText = GET_HERO_MESSAGE + randomHero;
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(SKILL_NAME, randomHero)
      .withShouldEndSession(false)
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
    LaunchRequestHandler,
    GetOwHeroIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
