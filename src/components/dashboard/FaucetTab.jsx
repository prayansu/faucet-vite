
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { useEthersProvider, useEthersSigner } from '../../utils/ethers-adapters';
import { CONFIG } from '../../config/constants';
import { useAds } from '../../hooks/useAds';
import { Button } from '../ui/Button';
import { AdModal } from '../ui/AdModal';
import { CaptchaModal } from '../ui/CaptchaModal';
import { CheckCircle, AlertCircle, Loader2, Clock } from 'lucide-react';

const FAUCET_ABI = [
    "function claimReward() external",
    "function getBalance() external view returns (uint256)",
    "function getUserClaimInfo(address user) external view returns (uint256 lastClaimTime, uint256 claimsToday)",
    "function cooldown() external view returns (uint256)"
];

const HISTORY_KEY = 'faucet_claim_history';

export function FaucetTab() {
    const { address } = useAccount();
    const provider = useEthersProvider();
    const signer = useEthersSigner();
    const { adsWatched, requiredAds, incrementAd, resetAds, isCompleted } = useAds();

    const [faucetBalance, setFaucetBalance] = useState('0.00');
    const [isClaiming, setIsClaiming] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [nextClaimTime, setNextClaimTime] = useState(0);
    const [history, setHistory] = useState([]);
    const [showAdModal, setShowAdModal] = useState(false);
    const [showCaptcha, setShowCaptcha] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(HISTORY_KEY);
        if (saved) {
            try { setHistory(JSON.parse(saved)); } catch (e) { }
        }
    }, []);

    useEffect(() => {
        if (!provider || !address) return;
        const fetchData = async () => {
            try {
                const contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, FAUCET_ABI, provider);
                const bal = await contract.getBalance();
                setFaucetBalance(parseFloat(ethers.formatEther(bal)).toFixed(2));
                const [lastClaimTime] = await contract.getUserClaimInfo(address);
                const cooldown = await contract.cooldown();
                const last = Number(lastClaimTime), cool = Number(cooldown), now = Math.floor(Date.now() / 1000);
                setNextClaimTime(now < last + cool ? last + cool : 0);
            } catch (err) { console.error(err); }
        };
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, [provider, address]);

    const handleAdComplete = () => {
        setShowAdModal(false);
        incrementAd();
    };

    const handleClaimClick = () => {
        setShowCaptcha(true);
    };

    const handleCaptchaVerified = async () => {
        setShowCaptcha(false);
        await executeClaim();
    };

    const executeClaim = async () => {
        if (!isCompleted || !signer) return;
        setIsClaiming(true);
        setStatus({ type: 'info', message: 'Please confirm the transaction in your wallet...' });
        try {
            const contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, FAUCET_ABI, signer);
            const tx = await contract.claimReward();
            setStatus({ type: 'info', message: 'Transaction submitted. Waiting for confirmation...' });
            await tx.wait();
            setStatus({ type: 'success', message: `Successfully claimed ${CONFIG.REWARD_AMOUNT} ETH!` });
            const newEntry = { txHash: tx.hash, timestamp: Date.now(), amount: CONFIG.REWARD_AMOUNT };
            const newHistory = [newEntry, ...history].slice(0, 5);
            setHistory(newHistory);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
            resetAds();
        } catch (err) {
            let msg = 'Transaction failed';
            if (err.reason) msg = err.reason;
            if (err.message?.includes('user rejected')) msg = 'Transaction rejected';
            setStatus({ type: 'error', message: msg });
        } finally {
            setIsClaiming(false);
        }
    };

    const isCoolingDown = nextClaimTime > Math.floor(Date.now() / 1000);

    return (
        <>
            {showAdModal && <AdModal onComplete={handleAdComplete} onClose={() => setShowAdModal(false)} />}
            {showCaptcha && <CaptchaModal onVerified={handleCaptchaVerified} onCancel={() => setShowCaptcha(false)} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">

                {/* Left: Balance + History */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Faucet Balance</h3>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">{faucetBalance}</span>
                            <span className="text-gray-500 dark:text-gray-400 font-medium">Sepolia ETH</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Device History</h3>
                            <span className="text-xs text-gray-400">(Local Log)</span>
                        </div>

                        {isCoolingDown ? (
                            <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-xl flex items-center gap-3">
                                <Loader2 className="h-5 w-5 animate-spin shrink-0" />
                                <div className="text-sm">
                                    <p className="font-semibold">Cooldown Active</p>
                                    <p>Ready at {new Date(nextClaimTime * 1000).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 shrink-0" />
                                <span className="text-sm font-semibold">Ready to claim</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            {history.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-2">No claims yet on this device.</p>
                            ) : history.map((entry, i) => (
                                <div key={i} className="flex justify-between items-center text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                        <Clock className="h-4 w-4" />
                                        <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <span className="font-mono font-medium text-gray-900 dark:text-white">{entry.amount} ETH</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Action */}
                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Watch Ads to Claim</h2>
                            <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full font-mono text-gray-700 dark:text-gray-300">
                                {adsWatched}/{requiredAds}
                            </span>
                        </div>

                        <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-8">
                            <div
                                className="h-full bg-black dark:bg-white transition-all duration-500 ease-out"
                                style={{ width: `${Math.min((adsWatched / requiredAds) * 100, 100)}%` }}
                            />
                        </div>

                        {status.message && (
                            <div className={`mb-6 p-4 rounded-xl text-sm flex items-start gap-3 ${status.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                                status.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                                    'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                }`}>
                                {status.type === 'error' ? <AlertCircle className="h-5 w-5 shrink-0" /> : <CheckCircle className="h-5 w-5 shrink-0" />}
                                {status.message}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {!isCompleted ? (
                            <Button
                                variant="secondary"
                                className="w-full py-6 text-lg"
                                onClick={() => setShowAdModal(true)}
                                disabled={isCoolingDown}
                            >
                                📺 Watch Ad ({requiredAds - adsWatched} remaining)
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                className="w-full py-6 text-lg"
                                onClick={handleClaimClick}
                                isLoading={isClaiming}
                                disabled={isCoolingDown || !signer}
                            >
                                Claim Reward
                            </Button>
                        )}
                        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                            Watching ads supports the faucet maintenance.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
