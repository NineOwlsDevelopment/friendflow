import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import { RiVerifiedBadgeFill } from 'react-icons/ri';
import { AiFillClockCircle, AiFillEye } from 'react-icons/ai';
import { BiSolidUpArrowAlt, BiSolidDownArrowAlt } from 'react-icons/bi';

import ActionNav from '../../components/Private/ActionNav';
import BottomNav from '../../components/Private/BottomNav';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function Activity() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = React.useState<any>([]);
    const [loading, setLoading] = React.useState<boolean>(true);

    const getTransactions = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/transaction`, {
                withCredentials: true,
            });

            setTransactions(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getTransactions();
    }, []);

    const handleDisplayTimeSinceTrade = (date: string) => {
        const now = new Date().getTime();
        const tradeDate = new Date(date).getTime();
        const diff = now - tradeDate;

        const diffInMinutes = Math.floor(diff / 1000 / 60);
        const diffInHours = Math.floor(diff / 1000 / 60 / 60);
        const diffInDays = Math.floor(diff / 1000 / 60 / 60 / 24);

        if (diffInMinutes < 60) {
            return `${diffInMinutes}m`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h`;
        } else {
            return `${diffInDays}d`;
        }
    };

    return (
        <>
            <ActionNav />
            <Container>
                {transactions.map((transaction: any) => (
                    <TransactionCard key={transaction._id}>
                        <TransactionCardTop>
                            <div>
                                <img src={transaction.user.avatar} alt="" />
                                <img src={transaction.influencer.avatar} alt="" />
                            </div>

                            {/* open solscan on click of the eye */}
                            {/* <span onClick={() => window.open(`https://solscan.io/tx/${transaction.txid}`, '_blank')}>
                                <AiFillEye />
                            </span> */}
                        </TransactionCardTop>

                        <TransactionCardMiddle>
                            <p>
                                <span
                                    style={{
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #d1b48c',
                                        fontWeight: '500',
                                        color: '#e3e3e3',
                                    }}
                                    onClick={() => navigate(`/a/user/${transaction.user._id}`)}
                                >
                                    {transaction.user.displayName}
                                </span>
                                <RiVerifiedBadgeFill
                                    style={{
                                        color: '#fffc00',
                                    }}
                                />
                                {'  '}
                                <span
                                    style={{
                                        fontWeight: '600',
                                        color: transaction.type === 'buy' ? '#d1b48c' : '#e3e3e3',
                                    }}
                                >
                                    {transaction.type === 'buy' ? 'bought' : 'sold'}
                                </span>{' '}
                                <span
                                    style={{
                                        fontWeight: '600',
                                        color: transaction.type === 'buy' ? '#d1b48c' : '#e3e3e3',
                                    }}
                                >
                                    {transaction.quantity}
                                </span>{' '}
                                {/*  */}
                                <span>
                                    <span
                                        onClick={() => navigate(`/a/user/${transaction.influencer._id}`)}
                                        style={{
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #d1b48c',
                                            fontWeight: '500',
                                            color: '#e3e3e3',
                                        }}
                                    >
                                        {transaction.influencer.displayName}
                                    </span>
                                    {transaction.influencer.claimed ? (
                                        <RiVerifiedBadgeFill
                                            style={{
                                                color: '#fffc00',
                                            }}
                                        />
                                    ) : (
                                        <RiVerifiedBadgeFill
                                            style={{
                                                color: '#a3a3a3',
                                            }}
                                        />
                                    )}{' '}
                                    {transaction.quantity === 1 ? 'key' : 'keys'}
                                </span>{' '}
                            </p>
                        </TransactionCardMiddle>

                        <TransactionCardBottom>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    gap: '5px',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        fontWeight: '500',
                                        gap: '5px',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    {transaction.type === 'buy' ? (
                                        <BiSolidUpArrowAlt style={{ fontSize: '1.2rem', color: '#00e513' }} />
                                    ) : (
                                        <BiSolidDownArrowAlt style={{ fontSize: '1.2rem', color: 'red' }} />
                                    )}
                                    <span
                                        style={{
                                            color: '#d1b48c',
                                        }}
                                    >
                                        {(transaction.total / LAMPORTS_PER_SOL).toFixed(8)}
                                    </span>{' '}
                                    <span>SOL</span>
                                </div>
                            </div>

                            <CreatedAt>
                                {' '}
                                <AiFillClockCircle /> {handleDisplayTimeSinceTrade(transaction.createdAt)}
                            </CreatedAt>
                        </TransactionCardBottom>
                    </TransactionCard>
                ))}
            </Container>
            <BottomNav />
        </>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: fit-content;
    gap: 10px;
    margin-bottom: 13vh;
`;

const TransactionCard = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    padding: 10px 0px;
    height: fit-content;
    border-bottom: 1px solid #d1b48c;

    span {
        font-size: 1rem;
        color: #e3e3e3;
    }
`;

const TransactionCardTop = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    flex: 33%;

    img {
        width: 30px;
        border-radius: 50%;

        &:nth-last-child(1) {
            margin-left: -10px;
        }
    }

    span {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #a3a3a3;
        cursor: pointer;
        gap: 10px;

        svg {
            padding: 3px;
            background-color: #d1b48c;
            border-radius: 50%;
            color: #18171e;
            font-size: 1.2rem;
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        }

        &:hover {
            color: #000;
        }
    }
`;

const TransactionCardMiddle = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 10px 20px;
    flex: 33%;
    letter-spacing: 0.5px;
    color: #e3e3e3;

    p {
        color: #e3e3e3;
        margin: 0;
        padding: 0;
    }
`;

const TransactionCardBottom = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    flex: 33%;
    color: #d1b48c;
    /* background-color: aquamarine; */
`;

const CreatedAt = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 5px;
    font-size: small;
    color: #d1b48c;

    svg {
        color: #d1b48c;
    }
`;
