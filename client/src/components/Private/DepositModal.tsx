import React from 'react';
import styled from 'styled-components';
import { useWalletStore } from '../../store';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { BsDownload, BsUpload, BsCheckCircle } from 'react-icons/bs';
import { BiCopy } from 'react-icons/bi';

import QRCode from 'react-qr-code';

export default function DepositModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const wallet = useWalletStore();
    const [copied, setCopied] = React.useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(wallet.address);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
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
                <BsDownload />
            </Button>
            <StyledModal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Container>
                    <ContainerHeader>Deposit</ContainerHeader>

                    <ContainerBody>
                        <QRCode value={wallet.address} size={150} />

                        <WalletAddress onClick={copyToClipboard}>
                            <span>
                                {wallet.address.slice(0, 10) + '...' + wallet.address.slice(-10)}
                                {copied ? (
                                    <BsCheckCircle
                                        style={{
                                            color: '#0096e5',
                                            fontSize: '1.3rem',
                                        }}
                                    />
                                ) : (
                                    <BiCopy />
                                )}
                            </span>
                        </WalletAddress>
                    </ContainerBody>

                    <ContainerFooter>
                        <StyledButton onClick={handleClose}>Okay</StyledButton>
                    </ContainerFooter>
                </Container>
            </StyledModal>
        </>
    );
}

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
    max-height: fit-content;
    width: 90%;
    height: 400px;
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

const WalletAddress = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: fit-content;
    flex-direction: column;
    color: #a3a3a3;
    cursor: pointer;

    span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: fit-content;
        padding: 10px 0px;
        gap: 10px;
    }
`;

const ContainerFooter = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: fit-content;
    border-top: 1px solid #e6e6e6;
    flex: 20%;
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
