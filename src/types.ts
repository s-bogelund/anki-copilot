export type AnkiCardType = 'basic' | 'cloze';

export type GeminiResponse = {
	text: string;
	others: object;
};

export type BasicCard = {
	front: string;
	back: string;
};
