
import { useState } from 'react';
import { ethers } from 'ethers';
import { useEthersSigner } from '../../utils/ethers-adapters';
import { CONFIG } from '../../config/constants';
import { Button } from '../ui/Button';
import { Heart, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function DonateTab() {
    const signer = useEthersSigner();
    const [amount, setAmount] = useState('');
    const [isDonating, setIsDonating] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleDonate = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setStatus({ type: 'error', message: 'Please enter a valid amount' });
            return;
        }

        if (!signer) {
            setStatus({ type: 'error', message: 'Wallet not connected' });
            return;
        }

        setIsDonating(true);
        setStatus({ type: 'info', message: 'Please confirm donation in your wallet...' });

        try {
            const tx = await signer.sendTransaction({
                to: CONFIG.CONTRACT_ADDRESS,
                value: ethers.parseEther(amount.toString())
            });

            setStatus({ type: 'info', message: 'Transaction submitted. Waiting for confirmation...' });
            await tx.wait();

            setStatus({ type: 'success', message: `Thank you for donating ${amount} ETH!` });
            setAmount('');
        } catch (err) {
            console.error(err);
            let msg = 'Donation failed';
            if (err.message && err.message.includes("user rejected")) msg = "Transaction rejected";
            setStatus({ type: 'error', message: msg });
        } finally {
            setIsDonating(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-8 animate-in fade-in duration-500 text-center">
            <div className="space-y-4">
                <div className="inline-flex p-3 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-full">
                    <Heart className="h-8 w-8 fill-current" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Support the Faucet</h2>
                <p className="text-gray-500 dark:text-gray-400">
                    Your donations keep the faucet running for everyone.
                    All funds go directly to the smart contract.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 space-y-6 text-left transition-colors">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Donation Amount (ETH)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.01"
                        step="0.001"
                        min="0.001"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-black dark:focus:border-white transition-colors"
                        disabled={isDonating}
                    />
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {[0.001, 0.01, 0.05, 0.1].map((val) => (
                        <button
                            key={val}
                            onClick={() => setAmount(val.toString())}
                            className="py-2 px-1 text-sm border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            disabled={isDonating}
                        >
                            {val}
                        </button>
                    ))}
                </div>

                {status.message && (
                    <div className={`p-4 rounded-xl text-sm flex items-start gap-3 ${status.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                            status.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                                'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        }`}>
                        {status.type === 'error' ? <AlertCircle className="h-5 w-5 shrink-0" /> :
                            status.type === 'success' ? <CheckCircle className="h-5 w-5 shrink-0" /> :
                                <Loader2 className="h-5 w-5 shrink-0 animate-spin" />}
                        {status.message}
                    </div>
                )}

                <Button
                    variant="primary"
                    className="w-full py-4 text-lg"
                    onClick={handleDonate}
                    isLoading={isDonating}
                    disabled={!signer}
                >
                    Donate
                </Button>
            </div>
        </div>
    );
}
