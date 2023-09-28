import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore, useWalletStore } from '../store';
import axios from 'axios';
import styled from 'styled-components';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import socketService from '../utils/socketService';
import { toast } from 'react-toastify';

export default function Twitter() {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);

    const user = useUserStore();
    const wallet = useWalletStore();

    const sendTwitterData = async (oauth_token: string, oauth_verifier: string) => {
        if (!oauth_token || !oauth_verifier) return;

        axios
            .post(
                `${process.env.REACT_APP_SERVER_URL}/auth/twitter-callback`,
                {
                    oauth_token,
                    oauth_verifier,
                },
                { withCredentials: true }
            )
            .then((res) => {
                user.setUser(res.data.user);
                wallet.setWallet(res.data.wallet);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('wallet', JSON.stringify(res.data.wallet));
                localStorage.setItem('isAuth', 'true');
                socketService.connect();
                navigate('/a/home');
            })
            .catch((err) => {
                console.log(err);
                toast.error('Error logging in with Twitter. Please Try again.');
                navigate('/');
            });
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const oauth_token = urlParams.get('oauth_token');
        const oauth_verifier = urlParams.get('oauth_verifier');

        console.log(oauth_token, oauth_verifier);

        if (oauth_token && oauth_verifier) {
            sendTwitterData(oauth_token, oauth_verifier);
        }
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
        }, 400);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <>
            <Container>
                <div>
                    <h2>Authenticating...</h2>
                </div>
                <Stack spacing={2} direction="row">
                    <CustomSpinnner size={100} thickness={2.5} variant="determinate" value={progress} />
                </Stack>
            </Container>
        </>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 70vh;

    -webkit-text-stroke-width: 1px; /* Adjust the width as needed */
    -webkit-text-stroke-color: black;
    -webkit-text-fill-color: #fff; /* Ensures the text color is transparent */
    font-size: 30px;
`;

const CustomSpinnner = styled(CircularProgress)`
    color: #fffc00 !important;
`;
