import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from './components/ui/textarea';
import { generateCardContent } from './services/apiService';

function App() {
	const [prompt, setPrompt] = useState('');

	const testPrompt = async () => {
		const test = await generateCardContent('text', prompt);
		console.log('Test prompt result:', test);
	};

	return (
		<div className="flex min-h-svh flex-col items-center justify-center w-svw">
			<div className="flex flex-col items-center justify-center gap-4 my-7 w-1/2">
				<Textarea
					value={prompt}
					onChange={e => setPrompt(e.target.value)}
					placeholder="Type your message here..."
				/>
				<Button className="hover:cursor-pointer active:scale-95">
					Click me
				</Button>
			</div>
		</div>
	);
}

export default App;
