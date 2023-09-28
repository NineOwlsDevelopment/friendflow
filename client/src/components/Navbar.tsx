import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ConnectWallet from './ConnectWallet';
import Logo from '../assets/images/logo.png';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import MenuIcon from '@mui/icons-material/Menu';
import { BiHomeAlt2, BiMapAlt, BiFingerprint } from 'react-icons/bi';
import { CgWebsite } from 'react-icons/cg';
import ConnectTwitter from './ConnectTwitter';

interface disabledProps {
    disabled?: boolean;
}

export default function Navbar() {
    // detect if user is on mobile
    const [isMobile, setIsMobile] = React.useState(true);
    const [showNavLinks, setShowNavLinks] = React.useState(false); // State to control the visibility of navigation links

    React.useEffect(() => {
        const updateIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', updateIsMobile);

        updateIsMobile();

        return () => {
            window.removeEventListener('resize', updateIsMobile);
        };
    }, []);

    // Function to toggle the visibility of navigation links
    const toggleNavLinks = () => {
        setShowNavLinks(!showNavLinks);
    };

    return (
        <Nav>
            {isMobile && ( // Conditionally render the hamburger menu icon on mobile
                <HamburgerIcon onClick={toggleNavLinks}>
                    <MenuIcon />
                </HamburgerIcon>
            )}

            <NavContainer
                style={{
                    display: isMobile && !showNavLinks ? 'none' : 'flex',
                }}
            >
                <NavLeft>
                    <a href="/#home">
                        <NavLogo>
                            <img src={Logo} alt="Friiend Logo" />
                        </NavLogo>
                    </a>
                </NavLeft>

                <NavCenter>
                    <a href="/#home">
                        <NavLink disabled={false}>
                            <BiHomeAlt2 />
                            Home
                        </NavLink>
                    </a>

                    <a href="/#about">
                        <NavLink disabled={false}>
                            <BiFingerprint />
                            About
                        </NavLink>
                    </a>

                    {/* <a href="#platform">
                        <NavLink disabled={false}>
                            <CgWebsite />
                            Platform
                        </NavLink>
                    </a>

                    <a href="#roadmap">
                        <NavLink disabled={false}>
                            <BiMapAlt />
                            Roadmap
                        </NavLink>
                    </a> */}
                </NavCenter>

                <NavRight>
                    {/* <ConnectWallet /> */}
                    <ConnectTwitter />
                </NavRight>
            </NavContainer>
        </Nav>
    );
}

const Nav = styled.div`
    position: sticky;
    top: 0;
    display: flex;
    height: 10vh;
    background-color: #fffc00;
    padding: 0 20px;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    color: #18171e;

    a {
        font-size: 1rem !important;
        text-decoration: none !important;
        padding: 0;
        margin: 0;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        padding: 20px;
        height: fit-content;
        justify-content: flex-start;
        align-items: flex-start;
    }
`;

const HamburgerIcon = styled.div`
    display: none;

    svg {
        font-size: 2rem;
    }

    @media (max-width: 768px) {
        display: flex;
        top: 20px;
        right: 20px;
        cursor: pointer;
    }
`;

const NavContainer = styled.div`
    display: flex;
    width: 100%;
    /* padding: 10px; */

    @media (max-width: 768px) {
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 0;
        gap: 30px;
    }
`;

const NavLeft = styled.div`
    display: flex;
    flex: 33%;
    align-items: center;
    justify-content: flex-start;
    /* background-color: antiquewhite; */

    @media (max-width: 768px) {
        margin-top: 10px;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 0;
        width: 100%;
    }
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
    flex: 34%;
    gap: 10px;
    /* background-color: aqua; */

    @media (max-width: 768px) {
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 0;
        width: 100%;
    }
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
    font-weight: 500;

    svg {
        font-size: 1.5rem;
    }

    &:hover {
        background-color: ${(props: any) => (props.disabled ? 'none' : '#94949439')};
        cursor: pointer;
    }

    @media (max-width: 768px) {
        flex-direction: row;
        gap: 50px;
        width: 100%;
        padding: 10px 0;
        justify-content: flex-start;
        align-items: flex-start;
    }
`;

const NavRight = styled.div`
    display: flex;
    flex: 33%;
    justify-content: flex-end;
    align-items: center;
    /* background-color: beige; */

    @media (max-width: 768px) {
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
        padding: 0;
        width: 100%;
        gap: 30px;
    }
`;
