import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoChevronBackOutline } from 'react-icons/io5';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import { AiFillLock } from 'react-icons/ai';

import TradeModal from '../../components/Private/TradeModal';

import { useProfileStore, useUserStore } from '../../store';

import Room from '../../components/Private/Room';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function Profile() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const profile = useProfileStore();
    const user = useUserStore();
    const [tabValue, setTabValue] = useState(1);
    const [pending, setPending] = useState(true);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleDisplayName = (displayName: string) => {
        if (displayName.length >= 10) {
            return displayName.slice(0, 10) + '...';
        }

        return displayName;
    };

    const getUser = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${id}`, {
                withCredentials: true,
            });

            const keysOwned = res.data.holders.filter(
                (holder: any) => holder.user.toString() === user._id.toString()
            )[0]?.quantity;

            if (keysOwned) {
                profile.setKeysOwned(keysOwned);
            } else {
                profile.setKeysOwned(0.0);
            }

            profile.setProfile(res.data);

            setTimeout(() => {
                setPending(false);
            }, 500);
        } catch (err) {
            console.log(err);

            setTimeout(() => {
                setPending(false);
            }, 500);
        }
    };

    useEffect(() => {
        getUser();
    }, [profile._id]);

    return (
        <>
            <Container>
                <ProfileNav>
                    <ProfileNavTop>
                        <ProfileNavTopLeft>
                            <BackArrow
                                onClick={() => {
                                    navigate('/a/home');
                                }}
                            >
                                <IoChevronBackOutline />
                            </BackArrow>
                            <div>
                                <img src={pending ? '' : profile.avatar} alt="" />
                            </div>

                            <ProfileNavTopLeftDetails>
                                <span
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        fontWeight: 600,
                                        fontSize: '0.8rem',
                                        color: '#d1b48c',
                                    }}
                                >
                                    {handleDisplayName(pending ? '' : profile.displayName)}

                                    {pending
                                        ? ''
                                        : profile.claimed && (
                                              <RiVerifiedBadgeFill
                                                  style={{
                                                      color: '#0096e5',
                                                      fontSize: '1rem',
                                                      marginLeft: '5px',
                                                  }}
                                              />
                                          )}
                                </span>
                                <span>{pending ? '' : `@${profile.username}`}</span>
                            </ProfileNavTopLeftDetails>
                        </ProfileNavTopLeft>

                        <ProfileNavTopRight>
                            <div>
                                <span
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: '0.7rem',
                                        color: '#d1b48c',
                                    }}
                                >
                                    {pending
                                        ? '-'
                                        : profile.price / LAMPORTS_PER_SOL >= 1000
                                        ? Number(profile.price / LAMPORTS_PER_SOL / 1000).toFixed(2) + 'k'
                                        : Number(profile.price / LAMPORTS_PER_SOL).toFixed(3)}{' '}
                                    SOL
                                </span>

                                <span
                                    style={{
                                        fontSize: '0.7rem',
                                    }}
                                >
                                    Key price
                                </span>
                            </div>

                            <div>
                                <TradeModal label={'Trade'} />
                            </div>
                        </ProfileNavTopRight>
                    </ProfileNavTop>

                    <ProfileNavBottom>
                        <ProfileNavBottomLeft>
                            <ProfileNavBottomLeftDetails>
                                <div>
                                    <span
                                        style={{
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {
                                            pending
                                                ? '-'
                                                : profile?.followers >= 1000000
                                                ? Number(profile.followers / 1000000).toFixed(1) + 'm' // Check if number is greater than or equal to 1 million
                                                : profile?.followers >= 1000
                                                ? Number(profile.followers / 1000).toFixed(1) + 'k' // Check if number is greater than or equal to 1 thousand
                                                : Number(profile.followers).toFixed(0) // Default formatting for smaller numbers
                                        }
                                    </span>{' '}
                                    Followers
                                </div>

                                <div>
                                    <span
                                        style={{
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {pending ? '-' : profile.holders.length}{' '}
                                    </span>
                                    Holders
                                </div>

                                <div>
                                    <span
                                        style={{
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {pending ? '-' : profile.holding.length}{' '}
                                    </span>{' '}
                                    Holding
                                </div>

                                <div>
                                    <span
                                        style={{
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {pending ? '-' : profile.minimumKeys}{' '}
                                    </span>{' '}
                                    {profile.minimumKeys === 1 ? 'Key' : 'Keys'} Req.
                                </div>
                            </ProfileNavBottomLeftDetails>
                        </ProfileNavBottomLeft>
                    </ProfileNavBottom>
                </ProfileNav>

                <StyledTabs value={tabValue} onChange={handleChange} aria-label="wrapped label tabs example">
                    <StyledTab disableRipple value={0} label="Feed" />
                    <StyledTab disableRipple value={1} label="Chat" />
                </StyledTabs>

                {tabValue === 0 ? (
                    <>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '80vh',
                                gap: '10px',
                                padding: '10px',
                                color: '#e3e3e3',
                                marginTop: '5vh',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '20px',
                                }}
                            >
                                <span
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '10px',
                                        backgroundColor: '#d1b48c',
                                        padding: '10px',
                                        borderRadius: '50%',
                                    }}
                                >
                                    <AiFillLock style={{ color: '#18171e', fontSize: '2rem' }} />
                                </span>
                            </div>

                            <span>Feed is Coming Soon.</span>
                        </div>
                    </>
                ) : (
                    <>
                        <Room />
                    </>
                )}
            </Container>
        </>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 !important;
    padding: 0 !important;
`;

const BackArrow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    height: 100%;
    padding: 10px;
    color: #d1b48c;
`;

const ProfileNav = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    min-height: 13vh;
    top: 0;
    position: fixed;
    width: 100%;
    position: -webkit-sticky; /* Safari */
    border-bottom: 1px solid #d1b48c;
    color: #e3e3e3;
    background-color: #18171e;
    z-index: 100;
    margin: 0;

    h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
    }
`;

const ProfileNavTop = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: space-between;
    width: 100%;
    flex: 70%;
`;

const ProfileNavTopLeft = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    flex: 50%;

    img {
        height: 35px;
        border-radius: 50%;
    }
`;

const ProfileNavTopLeftDetails = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    span {
        margin: 0;
        font-size: 0.7rem;
    }
`;

const ProfileNavTopRight = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    flex: 50%;
    gap: 10px;
    padding-right: 10px;
    color: #e3e3e3;

    div {
        display: flex;
        font-size: small;
        flex-direction: column;
    }
`;

const ProfileNavBottom = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-weight: 500;
    height: fit-content;
    padding: 0px 0 !important;
    padding-bottom: 5px !important;
    color: #a3a3a3;
`;

const ProfileNavBottomLeft = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    flex: 60%;
    font-size: smaller;
    width: 100%;
`;

const ProfileNavBottomLeftDetails = styled.div`
    display: flex;
    flex-direction: row;
    /* justify-content: space-between; */
    align-items: center;
    gap: 20px;
    font-size: smaller;
    margin-left: 50px;
`;

const ProfileNavBottomRight = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    flex: 40%;
    gap: 0;
    font-size: smaller;
`;

const StyledTabs = styled(Tabs)`
    display: flex;
    position: fixed !important;
    background-color: #18171e;
    height: 6vh;
    margin-top: 13vh;
    margin-bottom: 10vh !important;
    top: 0 !important;
    width: 100% !important;
    /* margin: 0 !important; */
    padding: 0 !important;
    justify-content: flex-end !important;
    align-items: flex-end !important;

    .MuiTabs-indicator {
        background-color: #d1b48c;
    }

    .Mui-selected {
        color: #d1b48c !important;
        font-weight: bold;
    }

    .MuiTab-root {
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: none;
        color: #e3e3e3;
        padding: 0;
        margin: 0;
    }
`;

const StyledTab = styled(Tab)`
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 100% !important;
    width: 50% !important;
`;

const BuyButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fffc00;
    font-size: 0.7rem;
    border: none;
    border-radius: 20px;
    padding: 10px 15px;
    font-weight: 600;
    cursor: pointer;
    color: #000;
    width: 75px;
`;
