import styled from 'styled-components';
import { useState } from 'react';
import { useUserStore } from '../store';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal, WalletMultiButton, WalletModal } from '@solana/wallet-adapter-react-ui';
import { useEffect } from 'react';
import AccountDropDown from './AccountDropDown';
import socketService from '../utils/socketService';
import axios from 'axios';

export default function ConnectWallet() {
    const { wallet, publicKey, connected, signMessage, disconnect, connect } = useWallet();
    const { username, solanaAddress, balance, setUser } = useUserStore();

    const handleLogin = async () => {
        if (!wallet || !signMessage || !publicKey) return;

        const message = new TextEncoder().encode(`Login as ${publicKey?.toBase58()}`);

        const signature = await signMessage(message).catch(() => {
            return null;
        });

        if (!signature) {
            return handleLogout();
        }

        const data = {
            publicKey: publicKey?.toBase58(),
            signature: signature,
        };

        axios
            .post(`${process.env.REACT_APP_SERVER_URL}/auth/login`, data, { withCredentials: true })
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleLogout = async () => {
        await disconnect();
    };

    useEffect(() => {
        // axios
        //     .get(`${process.env.REACT_APP_SERVER_URL}/user`, { withCredentials: true })
        //     .then((res) => {
        //         console.log(res);
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
    }, []);

    useEffect(() => {
        if (!connected) {
            console.log(connected);
            return;
        }

        handleLogin();
    }, [connected, wallet]);

    return (
        <>
            {!connected && (
                <>
                    <WalletMultiButton />
                </>
            )}

            <AccountDropDown />
        </>
    );
}
