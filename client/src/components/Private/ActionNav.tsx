import React, { useEffect } from 'react';
import styled from 'styled-components';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useUserStore, useWalletStore, useCoinStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/logo.png';
import axios from 'axios';

export default function ActionNav() {
    const navigate = useNavigate();
    const user = useUserStore();
    const wallet = useWalletStore();
    const coin = useCoinStore();

    const getCoin = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_SERVER_URL}/coin/${coin.symbol}`, {
                withCredentials: true,
            });
            coin.setCoin(result.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getWallet = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/wallet`, {
                withCredentials: true,
            });

            wallet.setWallet(response.data);
            localStorage.setItem('wallet', JSON.stringify(response.data));
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getWallet();
    }, []);

    useEffect(() => {
        getCoin();
    }, []);

    return (
        <Container>
            <ActionNavTop>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onClick={() => {
                        navigate('/a/home');
                    }}
                >
                    <img
                        style={{
                            display: 'flex',
                            height: '40px',
                            width: '40px',
                            borderRadius: '10px',
                        }}
                        src={Logo}
                        alt="Friend Logo"
                    />
                </div>

                <ActionButton
                    style={{
                        border: '1px solid #d1b48c',
                    }}
                >
                    <WalletDiv
                        onClick={() => {
                            navigate('/a/account');
                        }}
                    >
                        <span>{(wallet.balance / LAMPORTS_PER_SOL).toFixed(3)} | SOL</span>
                        <img src={user.avatar} alt="" />
                    </WalletDiv>
                </ActionButton>
            </ActionNavTop>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    position: sticky;
    width: 100%;
    top: 0;
    z-index: 10;
    flex-direction: column;
    justify-content: space-between;
    height: fit-content;
    border-bottom: 1px solid #d1b48c;
    background-color: #18171e;
    color: #e3e3e3;
`;

const ActionNavTop = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    height: 100%;
    padding: 10px;

    /* @media (min-width: 768px) {
        justify-content: flex-end;
    } */
`;

const ActionButton = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    height: 15px;
    padding: 10px;
    font-weight: 500;
    font-size: 14px;
    border-radius: 25px;

    flex: 50%;
    /* max-width: 130px; */
    max-width: fit-content;
`;

const WalletDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    font-size: 12px;
    width: 100%;

    img {
        height: 25px;
        width: 25px;
        border-radius: 50%;
    }
`;
