
import { useState, useEffect } from 'react';
import { CONFIG } from '../config/constants';

const STORAGE_KEY = 'faucet_ads_watched';

export function useAds() {
    const [adsWatched, setAdsWatched] = useState(0);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setAdsWatched(parseInt(saved, 10));
    }, []);

    const incrementAd = () => {
        const newVal = adsWatched + 1;
        setAdsWatched(newVal);
        localStorage.setItem(STORAGE_KEY, newVal.toString());
    };

    const resetAds = () => {
        setAdsWatched(0);
        localStorage.setItem(STORAGE_KEY, '0');
    };

    return {
        adsWatched,
        requiredAds: CONFIG.REQUIRED_ADS,
        incrementAd,
        resetAds,
        isCompleted: adsWatched >= CONFIG.REQUIRED_ADS
    };
}
