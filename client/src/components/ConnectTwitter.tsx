import styled from 'styled-components';
import { useState } from 'react';
import { useUserStore } from '../store';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal, WalletMultiButton, WalletModal } from '@solana/wallet-adapter-react-ui';
import { useEffect } from 'react';
import AccountDropDown from './AccountDropDown';
import socketService from '../utils/socketService';
import axios from 'axios';

export default function ConnectTwitter() {
    const { username, setUser } = useUserStore();
    const [twitterUrl, setTwitterUrl] = useState('');

    const handleLogin = async () => {
        axios
            .get(`${process.env.REACT_APP_SERVER_URL}/auth/twitter-login`, { withCredentials: true })
            .then((res) => {
                console.log(res);
                setTwitterUrl(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

        console.log('twitter login');
    };

    useEffect(() => {
        if (!twitterUrl) return;

        window.location.href = twitterUrl;
    }, [twitterUrl]);

    return (
        <div>
            <ConnectTwitterButton onClick={handleLogin}>Connect Twitter</ConnectTwitterButton>
        </div>
    );
}

const ConnectTwitterButton = styled.button`
    background-color: #18171e;
    border: 1px solid #18171e;

    color: #fff;
    border-radius: 25px;
    padding: 10px 20px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    margin: 0 10px;

    &:hover {
        background-color: #fff;
        color: #18171e;
        cursor: pointer;
    }
`;
