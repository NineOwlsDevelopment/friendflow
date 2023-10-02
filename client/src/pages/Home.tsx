import React from 'react';
import styled from 'styled-components';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useUserStore } from '../store';
import socketService from '../utils/socketService';
import qrImage from '../assets/images/qr.png';
import ImageA from '../assets/images/influencerA.png';
import ImageB from '../assets/images/influencerB.png';
import ImageC from '../assets/images/influencerC.png';
import ImageD from '../assets/images/influencerD.png';
import { FiShare } from 'react-icons/fi';
import { AiFillPlusSquare } from 'react-icons/ai';
import ConnectTwitter from '../components/ConnectTwitter';

export default function Home() {
    return (
        <Container>
            <HeroBanner id="home">
                <BannerLeft>
                    <BannerSection>
                        <h1>FRiEND FLOW</h1>
                    </BannerSection>

                    <BannerSection>
                        <p>
                            <span>FRiEND FLOW</span> is a Web3 Social Fi platform that enables creators to receive
                            ongoing support from their followers via access keys.
                        </p>
                    </BannerSection>

                    <BannerSection>
                        <div>
                            <ConnectTwitter />
                        </div>
                    </BannerSection>
                </BannerLeft>

                <BannerRight>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            maxWidth: '300px',
                        }}
                    >
                        <img
                            src={qrImage}
                            alt=""
                            style={{
                                marginBottom: '20px',
                            }}
                        />

                        <span>
                            <CameraAltIcon /> Scan To install on mobile.
                        </span>

                        <div
                            style={{
                                flexDirection: 'row',
                                alignItems: 'space-between',
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}
                        >
                            <span>Step 1:</span>

                            <span>
                                <FiShare />
                                <span>Click Share icon</span>
                            </span>
                        </div>

                        <div
                            style={{
                                flexDirection: 'row',
                                alignItems: 'space-between',
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}
                        >
                            <span>Step 2:</span>

                            <span>
                                <span
                                    style={{
                                        backgroundColor: '#3a3a3a',
                                        padding: '0px 10px',
                                        borderRadius: '5px',
                                    }}
                                >
                                    Add to Homescreen
                                </span>
                            </span>
                        </div>
                    </div>
                </BannerRight>
            </HeroBanner>

            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 325 100">
                <defs>
                    <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="ssspill-grad">
                        <stop stop-color="rgb(255, 252, 0)" stop-opacity="1" offset="45%"></stop>
                        <stop stop-color="rgb(255, 252, 0)" stop-opacity="1" offset="100%"></stop>
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="#18171e"></rect>
                <g fill="url(#ssspill-grad)">
                    <rect width="100%" height="40" fill="rgb(255, 252, 0)"></rect>

                    <rect x="0" width="7.69%" height="69.41768370754039" rx="15"></rect>
                    <rect x="50" width="7.69%" height="73.0126681313619" rx="15"></rect>
                    <rect x="100" width="7.69%" height="82.51813150384761" rx="15"></rect>
                    <rect x="150" width="7.69%" height="63.172965691799405" rx="15"></rect>
                    <rect x="200" width="7.69%" height="97.92027448188398" rx="15"></rect>
                    <rect x="250" width="7.69%" height="65.5804305879604" rx="15"></rect>
                    <rect x="300" width="7.69%" height="84.88602647084583" rx="15"></rect>
                </g>
                <g fill="#18171e">
                    <rect x="25" y="22.072851960603135" width="7.69%" height="60" rx="15"></rect>
                    <rect x="75" y="11.934671621796536" width="7.69%" height="60" rx="15"></rect>
                    <rect x="125" y="21.598732239770534" width="7.69%" height="60" rx="15"></rect>
                    <rect x="175" y="25.30613588710104" width="7.69%" height="60" rx="15"></rect>
                    <rect x="225" y="19.882617303126402" width="7.69%" height="60" rx="15"></rect>
                    <rect x="275" y="5.346912491255492" width="7.69%" height="60" rx="15"></rect>
                </g>
            </svg>

            {/* About Section */}
            <AboutSection id="about">
                {/* <AboutTitle>ABOUT FRiEND FLOW</AboutTitle> */}

                <AboutContent>
                    <AboutContentLeft>
                        <img src={ImageC} alt="" />
                    </AboutContentLeft>

                    <AboutContentRight>
                        <h1>About Friend Flow</h1>

                        <p>
                            <span>FRiEND FLOW</span> is a web3 social media platform that allows users to tokenize their
                            social networks. Users can buy and sell <span>Access Keys</span> that are linked to a
                            creator. These keys represent a creator's influence and can be traded for access to private
                            chatrooms, group voice, and group video calls, along with many other perks.
                        </p>

                        <p>
                            Friend Flow is built on top of the Solana Network, Solana is a high throughput layer 1
                            blockchain. The app is currently invite-only, so users need an access code to register.
                            Users can obtain access codes from friends or by looking for users sharing codes on social
                            media
                        </p>
                    </AboutContentRight>
                </AboutContent>
            </AboutSection>

            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 325 100">
                <defs>
                    <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="ssspill-grad">
                        <stop stop-color="#18171e" stop-opacity="1" offset="100%"></stop>
                        <stop stop-color="#18171e" stop-opacity="1" offset="100%"></stop>
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="#fffc00"></rect>
                <g fill="#fffc00">
                    <rect width="100%" height="40" fill="#18171e"></rect>

                    <rect x="0" y="22.072851960603135" width="7.69%" height="69.41768370754039" rx="15"></rect>
                    <rect x="50" width="7.69%" height="73.0126681313619" rx="15"></rect>
                    <rect x="100" y="21.598732239770534" width="7.69%" height="82.51813150384761" rx="15"></rect>
                    <rect x="150" y="19.882617303126402" width="7.69%" height="63.172965691799405" rx="15"></rect>
                    <rect x="200" y="5.346912491255492" width="7.69%" height="97.92027448188398" rx="15"></rect>
                    <rect x="250" width="7.69%" height="65.5804305879604" rx="15"></rect>
                    <rect x="300" y="25.30613588710104" width="7.69%" height="84.88602647084583" rx="15"></rect>
                </g>
                <g fill="#18171e">
                    <rect x="25" y="22.072851960603135" width="7.69%" height="60" rx="15"></rect>
                    <rect x="75" y="11.934671621796536" width="7.69%" height="60" rx="15"></rect>
                    <rect x="125" y="21.598732239770534" width="7.69%" height="60" rx="15"></rect>
                    <rect x="175" y="25.30613588710104" width="7.69%" height="60" rx="15"></rect>
                    <rect x="225" y="19.882617303126402" width="7.69%" height="60" rx="15"></rect>
                    <rect x="275" y="5.346912491255492" width="7.69%" height="60" rx="15"></rect>
                </g>
            </svg>

            {/* <PlatformSection id="platform">
                <PlatformTitle>It's All On Your Terms</PlatformTitle>

                <PlatformContent>
                    <PlatformContentLeft>
                        <h1>How it Works</h1>

                        <p>
                            The <span>FRiEND FLOW</span> platform is designed to be a one-stop-shop for all your
                            creative needs. Whether you are a musician, artist, or content creator, we have got you
                            covered. Our platform is designed to be intuitive and user-friendly, allowing you to focus
                            on what matters most: your creativity.
                        </p>
                        <p>
                            With <span>FRiEND FLOW</span>, you can create and distribute your content, all in one place.
                            We offer a wide range of features, including a marketplace, a social media platform, and a
                            content distribution platform. We also offer a variety of monetization options, allowing you
                            to earn money from your content. With <span>FRiEND FLOW</span>, you can finally take control
                            of your creative journey.
                        </p>
                    </PlatformContentLeft>

                    <PlatformContentRight>
                        <img src={ImageD} alt="" />
                    </PlatformContentRight>
                </PlatformContent>
            </PlatformSection> */}

            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 325 100">
                <defs>
                    <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="ssspill-grad">
                        <stop stop-color="rgb(255, 252, 0)" stop-opacity="1" offset="45%"></stop>
                        <stop stop-color="rgb(255, 252, 0)" stop-opacity="1" offset="100%"></stop>
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="#18171e"></rect>
                <g fill="url(#ssspill-grad)">
                    <rect width="100%" height="40" fill="rgb(255, 252, 0)"></rect>

                    <rect x="0" width="7.69%" height="69.41768370754039" rx="15"></rect>
                    <rect x="50" width="7.69%" height="73.0126681313619" rx="15"></rect>
                    <rect x="100" width="7.69%" height="82.51813150384761" rx="15"></rect>
                    <rect x="150" width="7.69%" height="63.172965691799405" rx="15"></rect>
                    <rect x="200" width="7.69%" height="97.92027448188398" rx="15"></rect>
                    <rect x="250" width="7.69%" height="65.5804305879604" rx="15"></rect>
                    <rect x="300" width="7.69%" height="84.88602647084583" rx="15"></rect>
                </g>
                <g fill="#18171e">
                    <rect x="25" y="22.072851960603135" width="7.69%" height="60" rx="15"></rect>
                    <rect x="75" y="11.934671621796536" width="7.69%" height="60" rx="15"></rect>
                    <rect x="125" y="21.598732239770534" width="7.69%" height="60" rx="15"></rect>
                    <rect x="175" y="25.30613588710104" width="7.69%" height="60" rx="15"></rect>
                    <rect x="225" y="19.882617303126402" width="7.69%" height="60" rx="15"></rect>
                    <rect x="275" y="5.346912491255492" width="7.69%" height="60" rx="15"></rect>
                </g>
            </svg>

            {/* Roadmap Section */}
            {/* <RoadmapSection id="roadmap">
                <RoadmapTitle>The Path Forward</RoadmapTitle>
                <MilestoneContainer>
                    <Milestone>
                        <MilestoneTitle>
                            <h1>Q4</h1>
                            <h1>2024</h1>
                        </MilestoneTitle>
                        <MilestoneDescription>Platform Launch</MilestoneDescription>
                    </Milestone>
                    <Milestone>
                        <MilestoneTitle>
                            <h1>Q1 </h1>
                            <h1>2024</h1>
                        </MilestoneTitle>
                        <MilestoneDescription>Expanded User Base</MilestoneDescription>
                    </Milestone>
                    <Milestone>
                        <MilestoneTitle>
                            <h1>Q2 </h1>
                            <h1>2024</h1>
                        </MilestoneTitle>
                        <MilestoneDescription>International Expansion</MilestoneDescription>
                    </Milestone>
                    <Milestone>
                        <MilestoneTitle>
                            <h1>Q3</h1>
                            <h1>2024</h1>
                        </MilestoneTitle>
                        <MilestoneDescription>Exciting Partnerships</MilestoneDescription>
                    </Milestone>
                </MilestoneContainer>
            </RoadmapSection> */}
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
    height: 90vh;
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
        border: 1px solid #000;

        color: #fff;
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
        /* padding: 50px; */
        width: 100%;
        height: fit-content;
    }
`;

const BannerSection = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: fit-content;

    h1 {
        font-size: 4.5rem;
        font-weight: bolder;
        margin: 0;
        padding: 0;
        color: #000;

        -webkit-text-stroke-width: 3px; /* Adjust the width as needed */
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
        background-color: #18171e;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        border-radius: 15px;
        font-weight: bold;
    }

    span {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
    }

    @media (max-width: 768px) {
        flex: 100%;
        height: fit-content;
    }
`;

// ABOUT SECTION
const AboutSection = styled.div`
    display: flex;
    flex-direction: column;
    /* background-color: #fff; */
    background-color: #18171e;
    padding: 80px 0;
    text-align: center;
    overflow-x: hidden !important;
    scroll-behavior: smooth;
`;

const AboutTitle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    font-size: 36px;
    color: #333;
    font-size: 40px;
    font-weight: bold;
    margin-bottom: 20px;
    font-size: 4.5rem;
    font-weight: bolder;
    color: #000;
    z-index: 1;
    background-color: #fff;

    -webkit-text-stroke-width: 3px;
    -webkit-text-stroke-color: #000;
    -webkit-text-fill-color: #fff;
`;

const AboutContent = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    p {
        font-size: 18px;
        color: #e3e3e3;
        line-height: 1.5;
        margin-bottom: 20px;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 20px;
    }
`;

const AboutContentLeft = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 20px;
    flex: 50%;

    img {
        width: 500px;
    }
`;

const AboutContentRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    flex: 50%;
    padding: 0px 20px;
    /* box-shadow: 0 4px 6px rgba(190, 190, 190, 0.1); */
    border-radius: 10px 0px 0px 10px;

    border: 1px solid #fffc00;
    h1 {
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: #000;
        -webkit-text-fill-color: #fff;
        font-size: 40px;
        padding: 15px 20px;
    }

    span {
        font-weight: bold;
        font-size: 20px;
    }

    p {
        font-size: 16px;
        max-width: 450px;
        text-align: left;
        padding: 15px 20px;
        border-radius: 10px;
        position: relative;
        margin: 10px 0;
    }

    @media (max-width: 768px) {
        font-size: 12px;
        align-items: center;
        text-align: center;
        width: fit-content;

        p {
            width: fit-content;
        }
    }
`;

// PLATFORM SECTION
const PlatformSection = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #fffc00;
    padding: 80px 0;
    text-align: center;
    min-height: 500px;
    overflow-x: hidden !important;
`;

const PlatformTitle = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 20px;
    font-size: 36px;
    color: #333;
    font-size: 40px;
    font-weight: bold;
    margin-bottom: 20px;
    width: 100%;
    font-size: 4.5rem;
    font-weight: bolder;
    color: #000;
    z-index: 1;

    -webkit-text-stroke-width: 3px;
    -webkit-text-stroke-color: #000;
    -webkit-text-fill-color: #fff;

    animation: slide2 8s linear infinite;

    @keyframes slide2 {
        0% {
            /* Start off screen to the right */
            transform: translate3d(-70%, 0, 0);
        }

        100% {
            /* Move off screen to the left */
            transform: translate3d(100%, 0, 0);
        }
    }

    @media (max-width: 768px) {
        justify-content: center;
    }
`;

const PlatformContent = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    p {
        font-size: 16px;
        color: #555;
        line-height: 1.5;
        margin-bottom: 20px;
    }

    img {
        width: 400px;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 20px;
    }
`;

const PlatformContentLeft = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    gap: 20px;
    flex: 50%;
    padding: 20px;
    border-radius: 0 10px 10px 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: #fff;

    h1 {
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: #000;
        -webkit-text-fill-color: #fff;
        font-size: 40px;
        padding: 15px 20px;
        max-width: 450px;
        width: 450px;
        text-align: left;
    }

    p {
        font-size: 16px;
        max-width: 450px;
        text-align: left;
        padding: 15px 20px;
        border-radius: 10px;
        /* background-color: #fffc00; */
        position: relative;
        margin: 10px 0;
        /* border: 1px solid #000; */
    }

    @media (max-width: 768px) {
        font-size: 12px;
        align-items: center;
        text-align: center;
        width: fit-content;

        p {
            width: fit-content;
        }

        h1 {
            width: fit-content;
        }
    }
`;

const PlatformContentRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 50%;
    padding: 20px;

    span {
        font-weight: bolder;
        font-size: 20px;
    }

    p {
        font-size: 20px;
        width: 450px;
        text-align: left;
    }

    img {
        width: 500px;
    }

    @media (max-width: 768px) {
        font-size: 12px;
        align-items: center;
        text-align: center;
        width: fit-content;

        p {
            width: fit-content;
        }
    }
`;

// ROADMAP SECTION
const RoadmapSection = styled.div`
    background-color: #fff;
    padding: 40px 0;
    text-align: center;
    overflow-x: hidden !important;
`;

const RoadmapTitle = styled.h2`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 20px;
    font-size: 36px;
    color: #333;
    font-size: 40px;
    font-weight: bold;
    margin-bottom: 20px;
    width: 100%;
    font-size: 4.5rem;
    font-weight: bolder;
    color: #000;
    z-index: 1;

    -webkit-text-stroke-width: 3px;
    -webkit-text-stroke-color: #000;
    -webkit-text-fill-color: #fff;

    animation: slide 8s linear infinite;

    @keyframes slide {
        0% {
            /* Start off screen to the right */
            transform: translate3d(100%, 0, 0);
        }

        100% {
            /* Move off screen to the left */
            transform: translate3d(-70%, 0, 0);
        }
    }

    @media (max-width: 768px) {
        justify-content: center;
    }
`;

const MilestoneContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 20px;
`;

const Milestone = styled.div`
    width: 200px;
    padding: 20px;
    background-color: #fff;
    border: 2px solid #fff;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const MilestoneTitle = styled.div`
    font-size: 20px;
    margin-bottom: 10px;

    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: #000;
    -webkit-text-fill-color: #fff;
`;

const MilestoneDescription = styled.p`
    font-size: 16px;
    color: #666;
`;
