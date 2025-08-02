import type { GenerateContentResponse } from '@google/genai';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from './components/ui/textarea';
import { addNotes } from './services/ankiService';
import { generateCardContent } from './services/apiService';
import type { BasicCard } from './types';

function App() {
	const [prompt, setPrompt] = useState('');

	const testPrompt = async () => {
		const test: GenerateContentResponse | null = await generateCardContent(
			'text',
			prompt
		);

		if (!test) {
			console.error('Failed to generate content');
			return;
		}
		console.log('Test prompt result:', test.text);
		if (!test.text) {
			console.error('No text generated from the prompt');
			return;
		}
		const cardsToAdd: BasicCard[] = JSON.parse(test.text) as BasicCard[];

		console.log('Cards to add:', cardsToAdd);

		addNotes('localhost:8765', 'test', cardsToAdd);
	};

	return (
		<div className="flex min-h-svh flex-col items-center justify-center w-svw">
			<div className="flex flex-col items-center justify-center gap-4 my-7 w-1/2">
				<Textarea
					value={prompt}
					onChange={e => setPrompt(e.target.value)}
					placeholder="Type your message here..."
				/>
				<Button
					className="hover:cursor-pointer active:scale-95"
					onClick={() => testPrompt()}
				>
					Click me
				</Button>
			</div>
		</div>
	);
}

export default App;
