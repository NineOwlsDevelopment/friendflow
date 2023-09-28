import { create } from 'zustand';

interface CoinState {
    _id: string;
    name: string;
    symbol: string;
    price: number;
    image: string;
    setCoin: (coin: CoinState) => void;
}

const useCoinStore = create<CoinState>((set) => ({
    _id: '',
    name: 'solana',
    symbol: 'SOL',
    price: 0,
    image: 'https://solana.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FsolanaLogoMark.17260911.svg&w=128&q=75',
    setCoin: (coin: CoinState) => set(coin),
}));

export default useCoinStore;
