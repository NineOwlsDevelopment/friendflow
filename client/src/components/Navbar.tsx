import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ConnectWallet from './ConnectWallet';
import Logo from '../assets/images/logo.png';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';

interface disabledProps {
    disabled?: boolean;
}

export default function Navbar() {
    return (
        <Nav>
            <NavContainer>
                <NavLeft>
                    <Link to="/">
                        <NavLogo>
                            <img src={Logo} alt="Friiend Logo" />
                        </NavLogo>
                    </Link>
                </NavLeft>

                <NavCenter>
                    <NavLink disabled={false}>
                        <Link to="/">Home</Link>
                    </NavLink>
                </NavCenter>

                <NavRight>
                    <ConnectWallet />
                </NavRight>
            </NavContainer>
        </Nav>
    );
}

const Nav = styled.div`
    position: sticky;
    top: 0;
    display: flex;
    height: 8vh;
    background-color: #fffc00;
    padding: 0 20px;

    a {
        font-size: 1rem !important;
        text-decoration: none !important;
        padding: 0;
        margin: 0;
    }
`;

const NavContainer = styled.div`
    display: flex;
    width: 100%;
    padding: 10px;
`;

const NavLeft = styled.div`
    display: flex;
    flex: 20%;
    align-items: center;
`;

const NavLogo = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    img {
        width: 50px;
    }

    h1 {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0;
        padding: 0;
        color: #000;
    }
`;

const NavCenter = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 60%;
    gap: 20px;
`;

const NavRight = styled.div`
    display: flex;
    flex: 20%;
    justify-content: flex-end;
    align-items: center;
`;

const NavLink = styled.div<disabledProps>`
    display: flex;
    flex-direction: column;
    text-decoration: none;

    min-width: 75px;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    transition: 0.3s ease-in-out;
    padding: 0px 10px;
    font-weight: bolder;

    svg {
        font-size: 1.7rem;
    }

    &:hover {
        background-color: ${(props: any) => (props.disabled ? 'none' : '#79797939')};
        cursor: pointer;
    }
`;
