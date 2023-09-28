import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PublicRoutes() {
    const navigate = useNavigate();

    useEffect(() => {
        const isAuth = localStorage.getItem('isAuth');
        console.log(isAuth);

        if (isAuth === 'true') {
            navigate('/a/home');
        }
    }, []);

    return (
        <>
            <Navbar />

            <Container>
                <Outlet />
            </Container>

            <Footer />
        </>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    /* height: 92vh; */
`;
