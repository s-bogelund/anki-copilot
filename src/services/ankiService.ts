import type { BasicCard } from '@/types';

type CardsCreatedResult = {
	result: number[];
	error: string | null;
};
export async function addNotes(
	uri: string | null,
	deckName: string,
	cards: BasicCard[]
) {
	const notes = cards.map(card => {
		return {
			deckName: deckName,
			modelName: 'Basic',
			fields: {
				Front: card.front,
				Back: card.back,
			},
		};
	});

	const data = {
		action: 'addNotes',
		version: 6,
		params: {
			notes: notes,
		},
	};

	try {
		const response = await fetch(`http://${uri ? uri : 'localhost:8765'}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		const responseData = await response.json();
		if (isCardsCreatedResult(responseData)) {
			return true;
		} else {
			console.log('error:', responseData);
			return false;
		}
	} catch (error) {
		console.error(error);
		return error;
	}
}

function isCardsCreatedResult(obj: any): obj is CardsCreatedResult {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'result' in obj &&
		Array.isArray(obj.result) &&
		obj.result.every((item: any) => typeof item === 'number') &&
		'error' in obj &&
		(obj.error === null || typeof obj.error === 'string')
	);
}
