const { Configuration, OpenAIApi } = require('openai')
const { openaiToken, characterDescription } = require('./config.json');

const configuration = new Configuration({
    apiKey: openaiToken,
});

const description = characterDescription

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

function chatCutMessages(id) {
	for (let i = 0; i < chat_log.length; i++) {
		if (chat_log[i].id === id) {
			if (chat_log[i].messages.length > max_chat_log) {
				chat_log[i].messages.splice(0, (chat_log[i].messages.length - max_chat_log));
			}
			break;
		}
	}
}

function chatGetMessages(id) {
	for (let i = 0; i < chat_log.length; i++) {
		if (chat_log[i].id === id) {
			return chat_log[i].messages;
		}
	}

	return [];
}

function chatRemoveMessagesID(id) {
	for (let i = 0; i < chat_log.length; i++) {
		if (chat_log[i].id === id) {
			chat_log.splice(i, 1);
			return true;
		}
	}

	return false;
}

const chat = async (messages) => {
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
    chat,
    chatAddMessage,
	chatCutMessages,
	chatGetMessages,
    chatRemoveMessagesID
}