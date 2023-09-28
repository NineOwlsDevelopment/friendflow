import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useWalletStore } from '../../store';

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { BsUpload } from 'react-icons/bs';
import CircularProgress from '@mui/material/CircularProgress';
import { MdOutlineViewInAr } from 'react-icons/md';

import { toast } from 'react-toastify';

import axios from 'axios';

export default function WithdrawModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const wallet = useWalletStore();
    const [copied, setCopied] = React.useState(false);
    const [pending, setPending] = React.useState(false);
    const [tx, setTx] = React.useState('');

    const [formData, setFormData] = React.useState({
        amount: 0.0,
        address: '',
    });

    // const [formData, setFormData] = React.useState({
    //     amount: 0.01,
    //     address: '6K4ZiGkpN3PpTKd9WUf5WiNWsmSmkhk7XqJPzjRUy449',
    // });

    const handleClose = () => {
        setOpen(false);
        setTx('');
        setFormData({
            amount: 0,
            address: '',
        });
    };

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleWithdraw = async () => {
        try {
            if (formData.amount <= 0) {
                toast.error('Amount must be greater than 0.');
                return;
            }

            if (!formData.address) {
                toast.error('Address is required.');
                return;
            }

            setPending(true);
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/wallet/withdraw`,
                {
                    amount: formData.amount,
                    address: formData.address,
                },
                {
                    withCredentials: true,
                }
            );

            if (response.data) {
                setTx(response.data.signature);
                wallet.setWallet(response.data.wallet);
                localStorage.setItem('wallet', JSON.stringify(response.data));
            }
        } catch (err: any) {
            console.log(err);
            toast.error(err.response.data.message);
        } finally {
            setTimeout(() => {
                setPending(false);
            }, 2000);
        }
    };

    return (
        <>
            <Button
                style={{
                    backgroundColor: '#d1b48c',
                    color: '#000',
                    borderRadius: '10px',
                    padding: '10px',
                    margin: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onClick={handleOpen}
            >
                <BsUpload />
            </Button>

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
                            <ContainerHeader>Withdraw</ContainerHeader>

                            <ContainerBody>
                                {tx && (
                                    <ViewTransaction>
                                        <MdOutlineViewInAr />
                                        <a
                                            href={`https://explorer.solana.com/tx/${tx}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            View Transaction
                                        </a>
                                    </ViewTransaction>
                                )}

                                {!tx && (
                                    <InputWrapper>
                                        <InputContainer>
                                            <InputLabel>Amount</InputLabel>
                                            <Input
                                                onChange={handleChange}
                                                name="amount"
                                                value={formData.amount || ''}
                                                type="number"
                                                placeholder="Amount of SOL to withdraw from your wallet."
                                                autoComplete="off"
                                            />
                                        </InputContainer>

                                        <InputContainer>
                                            <InputLabel>Address</InputLabel>
                                            <Input
                                                onChange={handleChange}
                                                name="address"
                                                value={formData.address}
                                                type="text"
                                                placeholder="Address you want the SOL sent to."
                                                autoComplete="off"
                                            />
                                        </InputContainer>
                                    </InputWrapper>
                                )}
                            </ContainerBody>

                            <ContainerFooter>
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
                                            <StyledButton onClick={handleClose}>Cancel</StyledButton>
                                            <StyledButton onClick={handleWithdraw}>Withdraw</StyledButton>
                                        </>
                                    )}

                                    {tx && <StyledButton onClick={handleClose}>Done</StyledButton>}
                                </div>
                            </ContainerFooter>
                        </>
                    )}
                </Container>
            </StyledModal>
        </>
    );
}

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
    color: #e6e6e6 !important;
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
    max-width: 500px;
    width: 90%;
    height: 400px;
    max-height: fit-content;
    border-radius: 15px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    background-color: #fff;
    color: #000;
`;

const ContainerHeader = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: fit-content;
    width: 100%;
    border-bottom: 1px solid #e6e6e6;
    flex: 20%;
    font-size: 1.3rem;
`;

const ContainerBody = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: fit-content;
    flex: 60%;
    flex-direction: column;
    color: #a3a3a3;
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
    color: #000;
`;

const Input = styled.input`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #e6e6e6;
    border-radius: 10px;
    outline: none;
    height: 35px;
    width: 90%;
    padding: 10px;
    text-align: center;
`;

const ContainerFooter = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: fit-content;
    border-top: 1px solid #e6e6e6;
    flex: 20%;
    gap: 10px;
`;

const StyledButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #18171e;
    color: #e3e3e3;
    border: 1px solid #18171e;
    border-radius: 25px;
    width: 120px;
    padding: 10px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &:hover {
        color: #000;
        background-color: #fff;
        border: 1px solid #000;
    }
`;
