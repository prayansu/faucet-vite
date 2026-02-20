
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from './Button';

function generateQuestion() {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let answer;
    if (op === '+') answer = a + b;
    else if (op === '-') answer = Math.max(a, b) - Math.min(a, b);
    else answer = a * b;
    const display = op === '-' ? `${Math.max(a, b)} − ${Math.min(a, b)}` : `${a} ${op === '*' ? '×' : op} ${b}`;
    return { display, answer: answer.toString() };
}

export function CaptchaModal({ onVerified, onCancel }) {
    const [q, setQ] = useState(generateQuestion);
    const [input, setInput] = useState('');
    const [error, setError] = useState('');

    const refresh = () => {
        setQ(generateQuestion());
        setInput('');
        setError('');
    };

    const check = () => {
        if (input.trim() === q.answer) {
            onVerified();
        } else {
            setError('Wrong answer! Try again.');
            setInput('');
            setQ(generateQuestion());
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center space-y-6">
                <div>
                    <div className="text-4xl mb-3">🤖</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Verify you're human</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Solve the math to claim your reward</p>
                </div>

                <div className="flex items-center justify-center gap-3">
                    <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-xl">
                        {q.display} = ?
                    </div>
                    <button onClick={refresh} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <RefreshCw className="h-4 w-4" />
                    </button>
                </div>

                <input
                    type="number"
                    value={input}
                    onChange={e => { setInput(e.target.value); setError(''); }}
                    onKeyDown={e => e.key === 'Enter' && check()}
                    placeholder="Your answer..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black text-gray-900 dark:text-white text-center text-xl font-mono focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                    autoFocus
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex gap-3">
                    <Button variant="secondary" className="flex-1" onClick={onCancel}>Cancel</Button>
                    <Button className="flex-1" onClick={check} disabled={!input}>Verify →</Button>
                </div>
            </div>
        </div>
    );
}
