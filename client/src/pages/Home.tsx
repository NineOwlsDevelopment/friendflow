import React from 'react';
import styled from 'styled-components';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useUserStore } from '../store';
import socketService from '../utils/socketService';
import qrImage from '../assets/images/qr.png';

export default function Home() {
    return (
        <Container>
            <HeroBanner>
                <BannerLeft>
                    <BannerSection>
                        <h1>FRiEND FLOW</h1>
                    </BannerSection>

                    <BannerSection>
                        <p>
                            Empower your creative journey on your own terms with <span>FRiEND FLOW</span>. We put the
                            value in your audience's hands, letting them determine your worth.
                        </p>
                    </BannerSection>

                    <BannerSection>
                        <div>
                            <button>Join The Waitlist</button>
                        </div>
                    </BannerSection>
                </BannerLeft>

                <BannerRight>
                    <div>
                        <img src={qrImage} alt="" />

                        <span>
                            <CameraAltIcon /> Scan To Use With Phantom Wallet
                        </span>
                    </div>
                </BannerRight>
            </HeroBanner>

            <div style={{ height: '100vh', backgroundColor: 'aliceblue' }}>Test</div>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
`;

const HeroBanner = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 60vh;
    background-color: #fffc00;
    padding: 20px;
    gap: 20px;

    @media (max-width: 768px) {
        flex-direction: column;
        height: fit-content;
    }
`;

const BannerLeft = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* background-color: aliceblue; */
    height: 100%;
    flex: 50%;
    text-align: center;
    gap: 30px;

    button {
        background-color: #000;
        color: #fff;
        border: 1px solid #000;
        border-radius: 25px;
        padding: 10px 20px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        margin: 0 10px;

        &:hover {
            background-color: #fff;
            color: #000;
            cursor: pointer;
        }
    }

    @media (max-width: 768px) {
        padding: 50px;
        flex: 100%;
        height: fit-content;
    }
`;

const BannerSection = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: fit-content;

    h1 {
        font-size: 3.5rem;
        font-weight: bolder;
        margin: 0;
        padding: 0;
        color: #000;

        -webkit-text-stroke-width: 1px; /* Adjust the width as needed */
        -webkit-text-stroke-color: black;
        -webkit-text-fill-color: #fff; /* Ensures the text color is transparent */
    }

    p {
        font-size: 1.3rem;
        margin: 0;
        padding: 0px 30px;
        color: #000;
    }

    span {
        font-weight: bolder;
        font-size: larger;
        color: #000;
    }
`;

const BannerRight = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 50%;

    img {
        width: 300px;

        @media (max-width: 768px) {
            width: 200px;
        }
    }

    div {
        background-color: #fff;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 30px;
        border-radius: 15px;
        font-weight: bold;
    }

    span {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
    }
`;
