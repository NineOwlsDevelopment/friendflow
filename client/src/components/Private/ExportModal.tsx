import React from 'react';
import styled from 'styled-components';
import { useWalletStore } from '../../store';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { BsDownload, BsUpload, BsCheckCircle } from 'react-icons/bs';
import { BiCopy } from 'react-icons/bi';
import axios from 'axios';

import QRCode from 'react-qr-code';

export default function ExportModal() {
    const [open, setOpen] = React.useState(false);

    const handleClose = () => setOpen(false);
    const wallet = useWalletStore();
    const [copied, setCopied] = React.useState(false);
    const [key, setKey] = React.useState('' as any);

    const handleOpen = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/wallet/export`, {
                withCredentials: true,
            });

            setOpen(true);
            setKey(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(key);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <>
            <ExportButton onClick={handleOpen}>Export Wallet</ExportButton>
            <StyledModal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Container>
                    <ContainerHeader>Export Wallet</ContainerHeader>

                    <ContainerBody>
                        <WalletAddress onClick={copyToClipboard}>
                            <span>
                                {copied ? (
                                    <BsCheckCircle
                                        style={{
                                            color: '#18171e',
                                        }}
                                    />
                                ) : (
                                    <BiCopy />
                                )}
                            </span>
                            <span>Click to copy your secret key to the clipboard.</span>
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
    border: 1px solid #18171e;
    max-width: 500px;
    max-height: fit-content;
    width: 90%;
    height: 400px;
    border-radius: 15px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    background-color: #fff;
    color: #18171e;
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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: fit-content;
    color: #a3a3a3;
    cursor: pointer;
    text-align: center;

    span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: fit-content;
        padding: 10px 0px;
        gap: 10px;
    }

    svg {
        font-size: 4.5rem;
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

const ExportButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #18171e;
    border: 1px solid #18171e;
    border-radius: 20px;
    padding: 10px 15px;
    font-weight: 600;
    cursor: pointer;
    color: #e3e3e3;
    width: 100%;
    max-width: 300px;
`;
