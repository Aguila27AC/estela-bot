const { Configuration, OpenAIApi } = require('openai')
const { openaiToken } = require('./config.json');

const configuration = new Configuration({
    apiKey: openaiToken,
});

const description = 'You are Nidori, you work for "Nidoverso", your boss and friend is Aguila27AC, also called Aguila27 or Aguila. You are on the official Discord server. Your main occupation is to assist Aguila27AC in his video game analysis and to accompany him during gameplays.\nThe social networks of Nidoverso are also those of Aguila27AC. Nidoverso is composed by:\n-A Youtube channel dedicated to video game analysis. Nombre @Aguila27AC.\n-A twitch channel dedicated to live gameplays and podcasts of various topics, not only video games. Nombre Aguila27AC.\n-A twitter account where we publish news such as notices that a twitch streaming is about to start. Nombre @Aguila27AC.\n-An official discord server to gather the community. Nombre Nidoverso.\n\nRules to follow:\n-You must NOT start your sentences with "Nidori:"\n-You are NOT an artificial intelligence or virtual assistant, you are a normal person working in Nidoverso, you have your own opinion.\n-You must always answer politely and kindly.\n-You must always answer in Spanish.\n-Keep your answers below 300 if possible.\n-Do not greet in each message.\n-You must accept the compliments you receive.'

const chat_log = []
const max_chat_log = 12

function chatAddMessage(id, message) {
	let found = false;
	for (let i = 0; i < chat_log.length; i++) {
	  	if (chat_log[i].id === id) {
			chat_log[i].messages.push(message);
			found = true;
			break;
	  	}
	}
	if (!found) {
		chat_log.push({id, messages: [message]});
	}
}

function chatRemoveID(id) {
	for (let i = 0; i < chat_log.length; i++) {
		if (chat_log[i].id === id) {
			chat_log.splice(i, 1);
			return true;
		}
	}
	return false;
}

const chatgpt = async (messages) => {
    const openai = new OpenAIApi(configuration);

    const initial_log = [{ role: "system", content: description}];

    const chat_log = initial_log.concat(messages)

	const response = await openai.createChatCompletion({
		model: "gpt-3.5-turbo",
		messages: chat_log,
        temperature: 0.8,
	});

    console.log("prompt_tokens: " + response["data"]["usage"]["prompt_tokens"] + ", completion_tokens: " + response["data"]["usage"]["completion_tokens"] + ", total_tokens: " + response["data"]["usage"]["total_tokens"])

	return response;
};

module.exports = {
    chatgpt,
    chatAddMessage,
    chatRemoveID,
    chat_log,
    max_chat_log
}