
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Gift } from 'lucide-react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '../components/ui/Button';

export default function Landing() {
    const { isConnected } = useAccount();
    const navigate = useNavigate();

    useEffect(() => {
        if (isConnected) {
            navigate('/dashboard');
        }
    }, [isConnected, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 text-center space-y-12 py-20 bg-gray-50 dark:bg-black transition-colors">

            <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Operational & Funds Available
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Sepolia ETH <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">for Students</span>
                </h1>

                <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Free Sepolia ETH for students learning Web3 development.
                    No gatekeeping — just connect your wallet and get started.
                </p>

                <div className="pt-4 flex justify-center">
                    <ConnectButton.Custom>
                        {({
                            account,
                            chain,
                            openAccountModal,
                            openChainModal,
                            openConnectModal,
                            authenticationStatus,
                            mounted,
                        }) => {
                            const ready = mounted && authenticationStatus !== 'loading';
                            const connected =
                                ready &&
                                account &&
                                chain &&
                                (!authenticationStatus ||
                                    authenticationStatus === 'authenticated');

                            return (
                                <div
                                    {...(!ready && {
                                        'aria-hidden': true,
                                        'style': {
                                            opacity: 0,
                                            pointerEvents: 'none',
                                            userSelect: 'none',
                                        },
                                    })}
                                >
                                    {(() => {
                                        if (!connected) {
                                            return (
                                                <Button
                                                    size="lg"
                                                    className="text-lg px-8 py-6 rounded-xl shadow-xl shadow-gray-200 dark:shadow-none hover:shadow-2xl transition-all hover:-translate-y-1 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                                                    onClick={openConnectModal}
                                                >
                                                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                                                </Button>
                                            );
                                        }
                                        return (
                                            <Button
                                                size="lg"
                                                onClick={() => navigate('/dashboard')}
                                            >
                                                Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                                            </Button>
                                        );
                                    })()}
                                </div>
                            );
                        }}
                    </ConnectButton.Custom>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full pt-16">
                <FeatureCard
                    icon={<Zap className="h-6 w-6" />}
                    title="Instant Delivery"
                    desc="Receive 0.05 Sepolia ETH immediately — no waiting, no queues."
                />
                <FeatureCard
                    icon={<ShieldCheck className="h-6 w-6" />}
                    title="For Students"
                    desc="Built for learners exploring Web3. Test your dApps freely on Sepolia."
                />
                <FeatureCard
                    icon={<Gift className="h-6 w-6" />}
                    title="Bonus Rewards"
                    desc="Spin the daily wheel for a chance to earn extra Sepolia ETH."
                />
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow text-left space-y-4">
            <div className="h-12 w-12 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-black dark:text-white">
                {icon}
            </div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
        </div>
    );
}
