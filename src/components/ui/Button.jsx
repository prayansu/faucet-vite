
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function Button({ children, className, variant = 'primary', size = 'md', isLoading, disabled, ...props }) {
    const variants = {
        primary: 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200',
        secondary: 'bg-white text-black border border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-800 dark:hover:bg-gray-800',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900',
        ghost: 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
}
