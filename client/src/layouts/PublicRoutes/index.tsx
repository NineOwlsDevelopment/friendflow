import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PublicRoutes() {
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
