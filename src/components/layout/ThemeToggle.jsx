
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../utils/theme';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Theme"
        >
            <div className="relative w-6 h-6">
                <motion.div
                    initial={false}
                    animate={{
                        scale: theme === 'light' ? 1 : 0,
                        rotate: theme === 'light' ? 0 : 180,
                        opacity: theme === 'light' ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center text-orange-500"
                >
                    <Sun className="w-5 h-5" />
                </motion.div>

                <motion.div
                    initial={false}
                    animate={{
                        scale: theme === 'dark' ? 1 : 0,
                        rotate: theme === 'dark' ? 0 : -180,
                        opacity: theme === 'dark' ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center text-blue-400"
                >
                    <Moon className="w-5 h-5" />
                </motion.div>
            </div>
        </button>
    );
}
