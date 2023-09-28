import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUserStore, useWalletStore } from '../../store';
import socketService from '../../utils/socketService';

export default function PrivateRoutes() {
    const navigate = useNavigate();
    const user = useUserStore();
    const wallet = useWalletStore();

    useEffect(() => {
        const isAuth = localStorage.getItem('isAuth');

        if (isAuth !== 'true') {
            navigate('/');
        }

        const currentUser = localStorage.getItem('user')?.toString();
        const parsedUser = JSON.parse(currentUser || '{}');

        const currentWallet = localStorage.getItem('wallet')?.toString();
        const parsedWallet = JSON.parse(currentWallet || '{}');

        socketService.connect();

        user.setUser(parsedUser);
        wallet.setWallet(parsedWallet);
    }, []);

    return (
        <>
            <Outlet />
        </>
    );
}
