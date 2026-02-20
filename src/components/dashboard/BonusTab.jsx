import { useState } from 'react';
import { useAccount } from 'wagmi';
import { CONFIG } from '../../config/constants';
import { Button } from '../ui/Button';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export function BonusTab() {
    const { address } = useAccount();
    const [formData, setFormData] = useState({
        name: '',
        projectName: '',
        projectLink: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!address) {
            setStatus({ type: 'error', message: 'Please connect your wallet first.' });
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: 'info', message: 'Submitting your application...' });

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_key: CONFIG.WEB3FORMS_KEY,
                    subject: `New Bonus Program Application - ${formData.projectName}`,
                    from_name: formData.name,
                    wallet: address,
                    project_name: formData.projectName,
                    project_link: formData.projectLink,
                    description: formData.description,
                    timestamp: new Date().toISOString(),
                })
            });

            const result = await response.json();
            if (!result.success) throw new Error(result.message || 'Submission failed');

            setStatus({ type: 'success', message: 'Application submitted! We will review it shortly.' });
            setFormData({ name: '', projectName: '', projectLink: '', description: '' });
        } catch (error) {
            console.error('Submission error:', error.message);
            setStatus({ type: 'error', message: 'Failed to submit. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Bonus Program</h2>
                <p className="text-gray-500 dark:text-gray-400">
                    Building something cool on Sepolia? Apply for a bonus grant of 0.1 ETH.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 transition-colors">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Wallet Address</label>
                            <input
                                type="text"
                                value={address || 'Connect Wallet'}
                                disabled
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Name</label>
                        <input
                            type="text"
                            name="projectName"
                            required
                            value={formData.projectName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            placeholder="My Sepolia dApp"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Link (GitHub/Demo)</label>
                        <input
                            type="url"
                            name="projectLink"
                            required
                            value={formData.projectLink}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            placeholder="https://github.com/..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Description</label>
                        <textarea
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            placeholder="Tell us what you are building..."
                        />
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

                    <Button className="w-full py-4 text-lg" isLoading={isSubmitting} disabled={!address || isSubmitting}>
                        Submit Application <Send className="ml-2 h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
