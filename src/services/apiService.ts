import {
	GoogleGenAI as Gemini,
	type GenerateContentResponse,
} from '@google/genai';
import { audioPrompt, imagePrompt, textPrompt } from '@/prompts';
import type { GeminiResponse } from '@/types';

type AnkiDataType = 'text' | 'image' | 'audio';
type InputData = string | File | Blob;

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Generates Anki Flashcard content using some LLM API
 */
export const generateCardContent = async (
	dataType: AnkiDataType,
	data: InputData
): Promise<GenerateContentResponse | null> => {
	const prompt = getPromptForDataType(dataType);

	const payload = await prepareLLMPayload(dataType, data, prompt);

	if (!payload) {
		console.error('Failed to prepare LLM payload');
		throw new Error('Failed to prepare LLM payload');
	}
	console.log('LLM payload prepared successfully:', payload);

	return payload as GenerateContentResponse;
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
	const ai = new Gemini({ apiKey: geminiApiKey });
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
			config: {
				thinkingConfig: {
					thinkingBudget: 0,
				},
				responseMimeType: 'application/json',
			},
		});
		return response;
	}
}
