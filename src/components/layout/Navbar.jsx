import { Link, useNavigate } from 'react-router-dom';
import { Droplets } from 'lucide-react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ThemeToggle } from './ThemeToggle';
import { useEffect } from 'react';

export function Navbar() {
    const { isConnected } = useAccount();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isConnected) {
            navigate('/');
        }
    }, [isConnected, navigate]);

    return (
        <nav className="border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-black dark:bg-white text-white dark:text-black p-1.5 rounded-lg transition-colors">
                            <Droplets className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white transition-colors">Sepolia Faucet</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <ConnectButton
                            showBalance={false}
                            accountStatus={{
                                smallScreen: 'avatar',
                                largeScreen: 'full',
                            }}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}
