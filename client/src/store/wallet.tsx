import { create } from 'zustand';

interface WalletState {
    _id: string;
    chain: string;
    address: string;
    balance: number;
    transactions: string[];
    setWallet: (walletData: WalletState) => void;
    setBalance: (balance: number) => void;
}

const useWalletStore = create<WalletState>((set) => ({
    _id: '',
    chain: '',
    address: '',
    balance: 0,
    transactions: [],
    setWallet: (walletData: WalletState) => set(walletData),
    setBalance: (balance: number) => set({ balance }),
}));

export default useWalletStore;
