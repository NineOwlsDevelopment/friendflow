import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { SalmonWalletAdapter, PhantomWalletAdapter, CoinbaseWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import React, { FC, ReactNode, useMemo } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Routes
import PublicRoutes from './layouts/PublicRoutes';
import Home from './pages/Home';

require('@solana/wallet-adapter-react-ui/styles.css');

const App: FC = () => {
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
                    </Route>
                </Routes>
            </Router>

            {/* <ToastContainer position={toast.POSITION.BOTTOM_LEFT} pauseOnFocusLoss={false} limit={3} /> */}
        </>
    );
};
