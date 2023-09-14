import React from 'react';
import styled from 'styled-components';

export default function Footer() {
    return (
        <>
            <Container>Footer</Container>
        </>
    );
}

const Container = styled.div`
    bottom: 0;
    display: flex;
    flex-direction: column;
    height: 200px;
    background-color: #fffc00;
`;
