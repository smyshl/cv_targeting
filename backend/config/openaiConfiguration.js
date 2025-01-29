const { OpenAI } = require("openai");
const fs = require('fs');
const { getEnvVariable } = require('./env.js');


const openai = new OpenAI({
    apiKey: getEnvVariable('OPENAI_API_KEY'),
  });

const openaiChatConfigJson = (() => {
  const fileContent =  fs.readFileSync('./config/openaiChatConfig.json', 'utf8');
  const configJson = JSON.parse(fileContent);
  return configJson;
})();


module.exports = {
    openai,
    openaiChatConfigJson,

}