import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AD_VIDEOS = [
    '79phlhutGLg',
    'A4WZF74dAg4',
    'boDKFEpgzwI',
    'CcfZqA_R7Tc',
    '3yaGukMEb9s'
];

export function AdModal({ onComplete, onClose }) {
    const [countdown, setCountdown] = useState(5);
    const [canClose, setCanClose] = useState(false);
    const [videoId] = useState(() => AD_VIDEOS[Math.floor(Math.random() * AD_VIDEOS.length)]);

    useEffect(() => {
        if (countdown <= 0) {
            setCanClose(true);
            return;
        }
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown]);

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Sponsored</span>
                    <div className="text-sm font-mono text-gray-500 dark:text-gray-400">
                        {canClose ? '✓ Done' : `Skip in ${countdown}s`}
                    </div>
                </div>

                <div className="aspect-video bg-black">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Advertisement"
                    />
                </div>

                <div className="px-5 py-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-400">Watch the ad to earn your claim credit</p>
                    <button
                        onClick={onComplete}
                        disabled={!canClose}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${canClose
                            ? 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {canClose ? 'Claim Credit →' : `Wait ${countdown}s...`}
                    </button>
                </div>
            </div>
        </div>
    );
}
