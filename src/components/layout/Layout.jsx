
import { Navbar } from './Navbar';

export function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-black py-8 transition-colors">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 dark:text-gray-600 text-sm">
                    <p>© {new Date().getFullYear()} Sepolia Faucet. Built for developers.</p>
                </div>
            </footer>
        </div>
    );
}
