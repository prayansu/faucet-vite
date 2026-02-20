import { useRef, useEffect, useState } from 'react';
import canvasConfetti from 'canvas-confetti';
import { CONFIG } from '../../config/constants';
import { Button } from '../ui/Button';
import { useTheme } from '../../utils/theme';

const SEGMENTS = [
    { text: '0.0001 ETH', prize: 0.0001, color: 'bg-black dark:bg-white', textCol: 'text-white dark:text-black' },
    { text: 'Better Luck', prize: 0, color: 'bg-gray-100 dark:bg-gray-800', textCol: 'text-gray-400 dark:text-gray-500' },
    { text: '0.0005 ETH', prize: 0.0005, color: 'bg-gray-100 dark:bg-gray-800', textCol: 'text-black dark:text-white' },
    { text: 'Better Luck', prize: 0, color: 'bg-gray-100 dark:bg-gray-800', textCol: 'text-gray-400 dark:text-gray-500' },
    { text: '0.001 ETH', prize: 0.001, color: 'bg-black dark:bg-white', textCol: 'text-white dark:text-black' },
    { text: 'Better Luck', prize: 0, color: 'bg-gray-100 dark:bg-gray-800', textCol: 'text-gray-400 dark:text-gray-500' },
    { text: 'Better Luck', prize: 0, color: 'bg-black dark:bg-white', textCol: 'text-white dark:text-black' },
    { text: 'Better Luck', prize: 0, color: 'bg-gray-100 dark:bg-gray-800', textCol: 'text-gray-400 dark:text-gray-500' },
];

const getSegmentColor = (index, theme) => {
    const isDark = theme === 'dark';
    const seg = SEGMENTS[index];
    if (seg.color.includes('bg-black')) return { bg: isDark ? '#ffffff' : '#171717', text: isDark ? '#000000' : '#ffffff' };
    return { bg: isDark ? '#1f2937' : '#f3f4f6', text: '#9ca3af' };
};

const COOLDOWN_KEY = 'spin_wheel_cooldown';

export function SpinWheelTab() {
    const canvasRef = useRef(null);
    const { theme } = useTheme();
    const [isSpinning, setIsSpinning] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [spinResult, setSpinResult] = useState(null);
    const [currentRotation, setCurrentRotation] = useState(0);

    useEffect(() => {
        const lastSpin = localStorage.getItem(COOLDOWN_KEY);
        if (lastSpin) {
            const diff = Date.now() - parseInt(lastSpin, 10);
            const remaining = (CONFIG.SPIN_COOLDOWN_HOURS * 3600 * 1000) - diff;
            if (remaining > 0) {
                setCooldown(Date.now() + remaining);
            }
        }
        drawWheel(0);
    }, []);

    useEffect(() => {
        drawWheel(currentRotation);
    }, [theme]);

    const drawWheel = (rotation) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = canvas.width / 2 - 20;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const arc = (2 * Math.PI) / SEGMENTS.length;

        SEGMENTS.forEach((segment, i) => {
            const angle = i * arc + rotation;
            const colors = getSegmentColor(i, theme);

            ctx.beginPath();
            ctx.fillStyle = colors.bg;
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, angle, angle + arc);
            ctx.lineTo(centerX, centerY);
            ctx.fill();
            ctx.stroke();

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle + arc / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = colors.text;
            ctx.font = "bold 14px Inter";
            ctx.fillText(segment.text, radius - 10, 5);
            ctx.restore();
        });

        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - radius + 10);
        ctx.lineTo(centerX + 15, centerY - radius - 10);
        ctx.lineTo(centerX - 15, centerY - radius - 10);
        ctx.fill();
    };

    const spin = async () => {
        if (isSpinning || cooldown > 0) return;

        setIsSpinning(true);
        setSpinResult(null);

        const winningIndex = Math.floor(Math.random() * SEGMENTS.length);
        const segment = SEGMENTS[winningIndex];

        const arc = (2 * Math.PI) / SEGMENTS.length;
        const targetAngle = -(Math.PI / 2) - (winningIndex * arc + arc / 2);
        const spins = 5;
        const totalRotation = targetAngle - (2 * Math.PI * spins);

        const duration = 5000;
        const startObj = { val: currentRotation % (2 * Math.PI) };
        const endVal = totalRotation;
        const startTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const currentVal = startObj.val + (endVal - startObj.val) * ease;
            setCurrentRotation(currentVal);
            drawWheel(currentVal);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setIsSpinning(false);
                if (segment.prize > 0) {
                    canvasConfetti();
                    setSpinResult(`You won ${segment.text}! (Demo Mode)`);
                } else {
                    setSpinResult("Better luck next time!");
                }
                const cd = Date.now() + (CONFIG.SPIN_COOLDOWN_HOURS * 3600 * 1000);
                setCooldown(cd);
                localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
            }
        };

        requestAnimationFrame(animate);
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Spin Wheel</h2>
                <p className="text-gray-500 dark:text-gray-400">Spin for a chance to win extra ETH</p>
            </div>

            <div className="relative mt-8">
                <canvas
                    ref={canvasRef}
                    width="400"
                    height="400"
                    className="max-w-full h-auto rounded-full shadow-2xl shadow-gray-200 dark:shadow-none border-4 border-white dark:border-gray-800"
                />
            </div>

            <div className="text-center space-y-4">
                {spinResult && (
                    <div className="text-xl font-medium animate-in bounce-in text-gray-900 dark:text-white">
                        {spinResult}
                    </div>
                )}

                {cooldown > Date.now() ? (
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 dark:text-gray-400 font-mono">
                        Next Spin: {new Date(cooldown).toLocaleString()}
                    </div>
                ) : (
                    <Button size="lg" onClick={spin} disabled={isSpinning} className="px-12 py-4 text-xl">
                        {isSpinning ? 'Spinning...' : 'Spin Wheel'}
                    </Button>
                )}
            </div>
        </div>
    );
}
