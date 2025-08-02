import { GoogleGenAI as Gemini } from '@google/genai';
import { audioPrompt, imagePrompt, textPrompt } from '@/prompts';

type AnkiDataType = 'text' | 'image' | 'audio';
type InputData = string | File | Blob;

/**
 * Generates Anki Flashcard content using some API
 */
export const generateCardContent = async (
	dataType: AnkiDataType,
	data: InputData
) => {
	const prompt = getPromptForDataType(dataType);

	const payload = await prepareLLMPayload(dataType, data, prompt);
	if (!payload) {
		console.error('Failed to prepare LLM payload');
		throw new Error('Failed to prepare LLM payload');
	} else {
		console.log('LLM payload prepared successfully:', payload);
	}

	return [payload];
};

function getPromptForDataType(dataType: AnkiDataType): string {
	switch (dataType) {
		case 'text':
			return textPrompt;
		case 'image':
			return imagePrompt;
		case 'audio':
			return audioPrompt;
		default:
			throw new Error(`Unsupported data type: ${dataType}`);
	}
}

async function prepareLLMPayload(
	dataType: AnkiDataType,
	data: InputData,
	prompt: string
) {
	const ai = new Gemini({});
	let response = {};
	if (dataType === 'text') {
		const config = {
			thinkingConfig: {
				thinkingBudget: 0,
			},
		};

		response = await ai.models.generateContent({
			model: 'gemini-2.5-flash-lite',
			contents: `${prompt} ${data}`,
			config: config,
		});
		return response;
	}
}
