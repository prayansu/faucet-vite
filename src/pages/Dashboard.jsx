
import { useState } from 'react';
import { FaucetTab } from '../components/dashboard/FaucetTab';
import { SpinWheelTab } from '../components/dashboard/SpinWheelTab';
import { DonateTab } from '../components/dashboard/DonateTab';
import { BonusTab } from '../components/dashboard/BonusTab';
import { Droplets, CircleDashed, Heart, Rocket } from 'lucide-react';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('faucet');

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

            <div className="flex justify-center overflow-x-auto">
                <div className="inline-flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 transition-colors whitespace-nowrap">
                    <TabButton
                        active={activeTab === 'faucet'}
                        onClick={() => setActiveTab('faucet')}
                        icon={<Droplets className="w-4 h-4" />}
                        label="Faucet"
                    />
                    <TabButton
                        active={activeTab === 'spin'}
                        onClick={() => setActiveTab('spin')}
                        icon={<CircleDashed className="w-4 h-4" />}
                        label="Spin Wheel"
                    />
                    <TabButton
                        active={activeTab === 'bonus'}
                        onClick={() => setActiveTab('bonus')}
                        icon={<Rocket className="w-4 h-4" />}
                        label="Bonus Program"
                    />
                    <TabButton
                        active={activeTab === 'donate'}
                        onClick={() => setActiveTab('donate')}
                        icon={<Heart className="w-4 h-4" />}
                        label="Donate"
                    />
                </div>
            </div>

            <div className="min-h-[500px]">
                {activeTab === 'faucet' && <FaucetTab />}
                {activeTab === 'spin' && <SpinWheelTab />}
                {activeTab === 'bonus' && <BonusTab />}
                {activeTab === 'donate' && <DonateTab />}
            </div>

        </div>
    );
}

function TabButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`
        flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
        ${active
                    ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                }
      `}
        >
            {icon}
            {label}
        </button>
    );
}
