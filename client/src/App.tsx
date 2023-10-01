import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { SalmonWalletAdapter, PhantomWalletAdapter, CoinbaseWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import React, { FC, ReactNode, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Routes
import PublicRoutes from './layouts/PublicRoutes';
import Home from './pages/Home';
import Twitter from './pages/Twitter';

import PrivateRoutes from './layouts/PrivateRoutes';
import Main from './pages/Private/Main';
import Profile from './pages/Private/Profile';
import Account from './pages/Private/Account';
import Friends from './pages/Private/Friends';
import Activity from './pages/Private/Activity';

require('@solana/wallet-adapter-react-ui/styles.css');

const App: FC = () => {
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response.status === 511) {
                localStorage.clear();
                window.location.reload();
            }

            return Promise.reject(error);
        }
    );

    return (
        <Context>
            <Content />
        </Context>
    );
};
export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
    const network = WalletAdapterNetwork.Devnet;

    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [new PhantomWalletAdapter(), new SalmonWalletAdapter(), new CoinbaseWalletAdapter()],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={true}>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const Content: FC = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path={'/'} element={<PublicRoutes />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth/twitter/callback" element={<Twitter />} />
                    </Route>

                    <Route path={'/a'} element={<PrivateRoutes />}>
                        <Route path="/a/home" element={<Main />} />
                        <Route path="/a/user/:id" element={<Profile />} />
                        <Route path="/a/account" element={<Account />} />
                        <Route path="/a/friends" element={<Friends />} />
                        <Route path="/a/activity" element={<Activity />} />
                    </Route>
                </Routes>
            </Router>

            <ToastContainer position={toast.POSITION.BOTTOM_LEFT} pauseOnFocusLoss={false} limit={3} />
        </>
    );
};
