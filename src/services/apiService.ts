import {
	createPartFromUri,
	createUserContent,
	GoogleGenAI as Gemini,
	type GenerateContentResponse,
} from '@google/genai';
import { audioPrompt, imagePrompt, textPrompt } from '@/prompts';

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
	const payload = await prepareLLMPayload(dataType, data);

	if (!payload) {
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

async function prepareLLMPayload(dataType: AnkiDataType, data: InputData) {
	const ai = new Gemini({ apiKey: geminiApiKey });
	const prompt = getPromptForDataType(dataType);
	const file = await fetch('/dummy_image_1.png'); // Placeholder for actual audio file
	const blob = await file.blob();
	let response = {};

	switch (dataType) {
		case 'text':
			response = await generateContentFromText(ai, data as string, prompt);
			break;
		case 'audio':
			response = await generateContentFromAudio(ai, blob, prompt);
			break;
		case 'image':
			response = await generateContentFromImage(ai, blob, prompt);
			break;
		default:
			console.error(`Unsupported data type: $dataType`);
			return null;
	}

	return response as GenerateContentResponse;
}

async function generateContentFromText(
	ai: Gemini,
	data: string,
	prompt: string
) {
	const response = await ai.models.generateContent({
		model: 'gemini-2.5-pro',
		contents: `${prompt} ${data}`,
		config: {
			thinkingConfig: {
				thinkingBudget: -1,
			},
			responseMimeType: 'application/json',
		},
	});
	return response;
}

async function generateContentFromAudio(
	ai: Gemini,
	data: File | Blob | string,
	prompt: string
) {
	const audioFile = await ai.files.upload({
		file: data,
		config: { mimeType: 'audio/mp3' },
	});

	if (!audioFile || !audioFile.uri || !audioFile.mimeType) {
		console.error('Failed to upload audio file', audioFile);
		throw new Error('Failed to upload audio file');
	}

	const response = await ai.models.generateContent({
		model: 'gemini-2.5-pro',
		contents: createUserContent([
			createPartFromUri(audioFile.uri, audioFile.mimeType),
			prompt,
		]),
		config: {
			thinkingConfig: {
				thinkingBudget: -1,
			},
			responseMimeType: 'application/json',
		},
	});
	return response;
}

async function generateContentFromImage(
	ai: Gemini,
	data: File | Blob | string,
	prompt: string
) {
	const imageFile = await ai.files.upload({
		file: data,
		config: { mimeType: 'image/png' },
	});

	if (!imageFile || !imageFile.uri || !imageFile.mimeType) {
		console.error('Failed to upload image file', imageFile);
		throw new Error('Failed to upload image file');
	}

	const response = await ai.models.generateContent({
		model: 'gemini-2.5-pro',
		contents: createUserContent([
			createPartFromUri(imageFile.uri, imageFile.mimeType),
			prompt,
		]),
		config: {
			thinkingConfig: {
				thinkingBudget: -1,
			},
			responseMimeType: 'application/json',
		},
	});
	return response;
}
