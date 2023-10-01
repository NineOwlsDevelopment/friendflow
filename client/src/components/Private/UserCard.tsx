import React from 'react';
import styled from 'styled-components';
import Logo from '../../assets/images/logo.png';
import { TbCurrencySolana } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { AiOutlineWarning } from 'react-icons/ai';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import Tooltip from '@mui/material/Tooltip';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useCoinStore } from '../../store';
import { useProfileStore } from '../../store';
import axios from 'axios';

interface UserCardProps {
    _id: string;
    username: string;
    avatar: string;
    displayName: string;
    followers: number;
    earnings: number;
    marketCap: number;
    volume: number;
    price: number;
    supply: number;
    claimed: boolean;
}

export default function UserCard(user: UserCardProps) {
    const navigate = useNavigate();
    const coin = useCoinStore();
    const profile = useProfileStore();

    const handleDisplayName = (displayName: string) => {
        if (displayName.length > 12) {
            return displayName.slice(0, 12) + '...';
        } else {
            return displayName;
        }
    };

    const handleCardClick = async () => {
        try {
            navigate(`/a/user/${user._id}`);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Container
            onClick={() => {
                handleCardClick();
            }}
        >
            <CardLeft>
                <CardLeftImage>
                    <img src={user.avatar} alt="user profile image" />
                </CardLeftImage>

                <CardLeftDetails>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <h3>{handleDisplayName(user.displayName)}</h3>

                        {user.claimed && (
                            <Tooltip title="Claimed">
                                <span
                                    style={{
                                        color: '#0096e5',
                                        marginLeft: '5px',
                                        fontSize: '1rem',
                                    }}
                                >
                                    <RiVerifiedBadgeFill />
                                </span>
                            </Tooltip>
                        )}
                    </div>

                    <span>Vol | {(user.volume / LAMPORTS_PER_SOL).toFixed(3)} SOL</span>
                </CardLeftDetails>
            </CardLeft>

            <CardRight>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}
                ></div>

                <CardRightDiv>
                    <h3>{Number(user.price / LAMPORTS_PER_SOL).toFixed(3)} SOL</h3>
                    {/* <p>◎ {price >= 1000 ? (price / 1000).toFixed(2) + 'k' : price.toFixed(3)}</p> */}
                    <span>${Number(coin.price * (user.price / LAMPORTS_PER_SOL)).toFixed(2)}</span>
                </CardRightDiv>
            </CardRight>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    /* border: 1px solid #e6e6e6; */
    border-radius: 5px;
    height: 3rem;
    padding: 10px 20px;
    background-color: #18171e;
    color: #e3e3e3;
    cursor: pointer;
`;

const CardLeft = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: row;
    height: 100%;
    flex: 33%;
    gap: 20px;
`;

const CardLeftImage = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    height: 100%;

    img {
        height: 30px;
        border-radius: 50%;
    }
`;

const CardLeftDetails = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    height: 100%;

    h3 {
        font-size: 1rem;
        font-weight: 600;
        margin: 0;
    }

    span {
        color: #d1b48c;
        margin: 0;
        font-size: 0.8rem;
    }
`;

const CardRight = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    flex-direction: row;
    height: 100%;
    flex: 30%;
`;

const CardRightDiv = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: center;
    flex-direction: column;
    height: 100%;
    /* padding: 0px 20px; */
    min-width: 150px;

    h3 {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.8rem;
        font-weight: 600;
        margin: 0;
        color: #d1b48c;

        svg {
            margin-left: 5px;
            font-size: 1.5rem;
        }
    }

    p {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.4rem;
        font-weight: 600;
        margin: 0;
    }

    span {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.8rem;
        font-weight: 400;
    }

    @media (max-width: 810px) {
        min-width: fit-content;
    }
`;
