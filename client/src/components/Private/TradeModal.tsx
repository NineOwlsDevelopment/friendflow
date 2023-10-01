import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useWalletStore, useProfileStore, useUserStore } from '../../store';

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import { toast } from 'react-toastify';

import axios from 'axios';

import debounce from 'lodash.debounce';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { get, set } from 'lodash';

export default function TradeModal({ label }: { label: string }) {
    const wallet = useWalletStore();
    const user = useUserStore();
    const profile = useProfileStore();

    const [tab, setTab] = React.useState('buy');
    const [open, setOpen] = React.useState(false);
    const [pending, setPending] = React.useState(false);
    const [tx, setTx] = React.useState('');
    const [formData, setFormData] = React.useState({
        side: 'buy',
        influencer: '',
        amount: 0.5,
    });

    const [estimatedCost, setEstimatedCost] = React.useState({
        price: 0,
        fee: 0,
        total: 0,
    });

    const handleOpen = () => {
        setOpen(true);
        setFormData({ ...formData, influencer: profile._id });
        getCostEstimate();
    };

    const handleClose = () => {
        setFormData({
            side: 'buy',
            influencer: '',
            amount: 0.5,
        });
        setTab('buy');
        setTx('');
        setEstimatedCost({
            price: 0,
            fee: 0,
            total: 0,
        });
        setOpen(false);
    };

    const handleTabChange = (e: any, newValue: string) => {
        setTab(newValue);
        setFormData({ ...formData, side: newValue });
    };

    const handleTrade = async () => {
        try {
            if (formData.amount < 0.001) {
                toast.error('Amount must be between 0.001 and 100.');
                return;
            }

            if (formData.amount > 100) {
                toast.error('Amount must be between 0.001 and 100.');
                return;
            }

            if (isNaN(formData.amount)) {
                toast.error('Amount must be a number.');
                return;
            }

            if (formData.side === 'buy' && estimatedCost.total / LAMPORTS_PER_SOL > wallet.balance / LAMPORTS_PER_SOL) {
                toast.error('Not enough SOL.');
                return;
            }

            if (formData.side === 'sell' && formData.amount > (profile.keysOwned || 0)) {
                toast.error("You don't own that many keys.");
                return;
            }

            setPending(true);

            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/trade/${formData.side}`,
                {
                    side: formData.side,
                    amount: formData.amount,
                    influencer: formData.influencer,
                },
                {
                    withCredentials: true,
                }
            );

            setPending(false);

            if (response.status === 200) {
                profile.setProfile(response.data);
                handleClose();

                if (formData.side === 'buy') {
                    toast.success(`Purchase of ${formData.amount} ${profile.displayName} key(s) successful.`);
                    profile.setKeysOwned(Number(profile.keysOwned) + Number(formData.amount));
                    wallet.setBalance(wallet.balance - estimatedCost.total);
                } else {
                    toast.success(`Sale of ${formData.amount} ${profile.displayName} key(s) successful.`);
                    profile.setKeysOwned(Number(profile.keysOwned) - Number(formData.amount));
                    wallet.setBalance(wallet.balance + estimatedCost.total);
                }
            }
        } catch (err: any) {
            console.log(err);
            toast.error('Something went wrong. Please try again later.');
            setPending(false);
        }
    };

    const handleInputChange = async (e: any) => {
        if (isNaN(e.target.value)) {
            setFormData({ ...formData, amount: 0 });
        }

        if (e.target.value > 100) {
            return setFormData({ ...formData, amount: 100 });
        }

        setFormData({ ...formData, amount: e.target.value });
    };

    const getCostEstimate = async () => {
        try {
            if (!formData.influencer) return;

            if (!formData.amount) return;

            if (formData.amount < 0.001 || formData.amount > 100) {
                return;
            }

            if (isNaN(formData.amount)) {
                return;
            }

            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/trade/estimate/${formData.side}/${formData.amount}/${formData.influencer}`,
                { withCredentials: true }
            );

            const price = response.data.price;
            const fee = price * 0.1;
            const total = formData.side === 'buy' ? price + fee : price - fee;

            setEstimatedCost({
                price: price,
                fee: fee,
                total: total,
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (!open) return;

        if (formData.amount <= 0 || formData.amount > 100) {
            return;
        }

        getCostEstimate();
    }, [formData.amount, formData.side, formData.influencer]);

    return (
        <>
            <BuyButton onClick={handleOpen}>
                <span>{label}</span>
            </BuyButton>

            <StyledModal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Container>
                    {pending && (
                        <PendingContainer>
                            <CustomSpinnner />
                        </PendingContainer>
                    )}

                    {!pending && (
                        <>
                            <ContainerHeader>
                                <span>
                                    {tab.slice(0, 1).toUpperCase() + tab.slice(1)} <strong> {profile.username}</strong>{' '}
                                    access keys
                                </span>

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: '10px',
                                    }}
                                >
                                    <span>
                                        Keys Owned: <strong>{profile.keysOwned?.toFixed(2)} </strong>
                                    </span>
                                </div>
                            </ContainerHeader>

                            <ContainerBody>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        width: '100%',
                                        height: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexDirection: 'column',
                                        padding: '10px 0px',
                                    }}
                                >
                                    <StyledTabs value={tab} onChange={handleTabChange}>
                                        <Tab value={'buy'} label="Buy" />
                                        <Tab value={'sell'} label="Sell" />
                                    </StyledTabs>

                                    <InputContainer>
                                        <InputLabel htmlFor="amount">Number of Keys</InputLabel>

                                        {/* create a grid of 3 buttons and 1 input  */}
                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(2, 1fr)',
                                                gap: '10px',
                                                width: '100%',
                                            }}
                                        >
                                            <StyledKeyButton onClick={() => setFormData({ ...formData, amount: 10 })}>
                                                10
                                            </StyledKeyButton>

                                            <StyledKeyButton onClick={() => setFormData({ ...formData, amount: 5 })}>
                                                5
                                            </StyledKeyButton>

                                            <StyledKeyButton onClick={() => setFormData({ ...formData, amount: 2 })}>
                                                2
                                            </StyledKeyButton>

                                            <Input
                                                value={formData.amount}
                                                type="number"
                                                max={100}
                                                min={0.001}
                                                placeholder={formData.amount.toString()}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </InputContainer>

                                    <PurchaseSummary>
                                        <PurchaseSummaryItem>
                                            <span>Price</span>
                                            <span>{(estimatedCost.price / LAMPORTS_PER_SOL).toFixed(8)} SOL</span>
                                        </PurchaseSummaryItem>

                                        <PurchaseSummaryItem>
                                            <span>Fee</span>
                                            <span>{(estimatedCost.fee / LAMPORTS_PER_SOL).toFixed(8)} SOL</span>
                                        </PurchaseSummaryItem>

                                        <PurchaseSummaryItem>
                                            <span>Total</span>
                                            <span>{(estimatedCost.total / LAMPORTS_PER_SOL).toFixed(8)} SOL</span>
                                        </PurchaseSummaryItem>
                                    </PurchaseSummary>
                                </Box>
                            </ContainerBody>

                            <ContainerFooter>
                                <span>
                                    Balance: <strong>{(wallet.balance / LAMPORTS_PER_SOL).toFixed(3)} SOL</strong>
                                </span>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '10px',
                                    }}
                                >
                                    {!tx && (
                                        <>
                                            <StyledCancel onClick={handleClose}>Cancel</StyledCancel>
                                            <StyledButton onClick={handleTrade}>
                                                {tab === 'buy' ? `Buy ` : `Sell `}
                                            </StyledButton>
                                        </>
                                    )}

                                    {tx && <StyledCancel onClick={handleClose}>Done</StyledCancel>}
                                </div>
                            </ContainerFooter>
                        </>
                    )}
                </Container>
            </StyledModal>
        </>
    );
}

const BuyButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #d1b48c;
    font-size: 0.7rem;
    border: none;
    border-radius: 20px;
    padding: 10px 15px;
    font-weight: 600;
    cursor: pointer;
    color: #18171e;
    width: 80px;
    font-size: 0.9rem;
`;

const PendingContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px;
    justify-content: center;
    align-items: center;
    gap: 20px;
`;

const CustomSpinnner = styled(CircularProgress)`
    color: #d1b48c !important;
`;

const StyledModal = styled(Modal)`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #000;
    max-width: 550px;
    width: 90%;
    height: 550px;
    max-height: fit-content;
    border-radius: 15px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    background-color: #18171e;
    color: #e3e3e3;
`;

const ContainerHeader = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: fit-content;
    width: 100%;
    border-bottom: 1px solid #d1b48c;
    flex: 20%;
    color: #d1b48c;
`;

const ContainerBody = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: space-between;
    width: 100%;
    height: fit-content;
    flex-direction: column;
    flex: 50%;
    color: #e3e3e3;
`;

const ViewTransaction = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    font-size: 1.2rem;
    text-decoration: underline;
    cursor: pointer;
    color: #a3a3a3 !important;

    a {
        color: #a3a3a3 !important;
        text-decoration: none;
    }

    &:hover {
        color: #000 !important;
        a {
            color: #000 !important;
        }
    }

    svg {
        color: #a3a3a3 !important;
        font-size: 1.5rem;
    }
`;

const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    gap: 10px;
`;

const InputLabel = styled.label`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 1rem;
    font-weight: 600;
    color: #d1b48c;
`;

const Input = styled.input`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #e6e6e6;
    outline: none;
    height: 20px;
    width: 120px;
    border-radius: 10px;
    padding: 10px 0px;
    text-align: center;
    font-size: 1.1rem;
`;

const ContainerFooter = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: fit-content;
    border-top: 1px solid #d1b48c;
    flex: 30%;
`;

const StyledButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #d1b48c;
    color: #18171e;
    border: 1px solid #d1b48c;
    border-radius: 25px;
    width: 120px;
    padding: 10px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &:hover {
        color: #000;
        background-color: #fff;
        border: 1px solid #000;
    }
`;

const StyledKeyButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #d1b48c;
    color: #18171e;
    font-weight: 600;
    border: 1px solid #d1b48c;
    border-radius: 10px;
    width: 120px;
    padding: 10px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
`;

const StyledCancel = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #e3e3e3;
    color: #18171e;
    border: 1px solid #d1b48c;
    border-radius: 25px;
    width: 120px;
    padding: 10px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &:hover {
        color: #18171e;
        background-color: #d1b48c;
        border: 1px solid #18171e;
    }
`;

const PurchaseSummary = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    color: #e3e3e3;
`;

const PurchaseSummaryItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 0.9rem;

    span {
        padding: 5px 30px;
    }
`;

const StyledTabs = styled(Tabs)`
    display: flex;
    width: 100% !important;

    justify-content: center !important;
    align-items: center !important;

    .MuiTabs-flexContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    .MuiTabs-indicator {
        background-color: #d1b48c;
    }

    .Mui-selected {
        color: #d1b48c !important;
        font-weight: bold;
    }

    .MuiTab-root {
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: none;
        color: #e3e3e3;
        padding: 0;
        margin: 0;
    }
`;
