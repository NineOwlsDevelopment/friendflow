import React, { useEffect } from 'react';
import styled from 'styled-components';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useNavigate } from 'react-router-dom';
import { IoChevronBackOutline } from 'react-icons/io5';
import { useUserStore, useWalletStore } from '../../store';
import { CiMenuKebab } from 'react-icons/ci';
import { BiCopy } from 'react-icons/bi';
import { TbCurrencySolana } from 'react-icons/tb';
import { BsDownload, BsUpload } from 'react-icons/bs';
import axios from 'axios';
import { toast } from 'react-toastify';

import DepositModal from '../../components/Private/DepositModal';
import WithdrawModal from '../../components/Private/WithdrawModal';
import ExportModal from '../../components/Private/ExportModal';
import Profile from './Profile';

export default function Account() {
    const navigate = useNavigate();
    const user = useUserStore();
    const wallet = useWalletStore();
    const [minKeys, setMinKeys] = React.useState<number>(user.minimumKeys || 1);
    const [saveDisabled, setSaveDisabled] = React.useState<boolean>(true);
    const [portfolioValue, setPortfolioValue] = React.useState<number>(0);

    useEffect(() => {
        if (!user) return;

        const lastUpdated = new Date(user.minKeysLastUpdated);
        const now = new Date();

        const diff = Math.abs(now.getTime() - lastUpdated.getTime()) / 36e5;

        if (diff >= 24 && minKeys !== user.minimumKeys && minKeys >= 0) {
            setSaveDisabled(false);
        } else {
            setSaveDisabled(true);
        }
    }, [user, minKeys]);

    const getPortfolioValue = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/friends`, {
                withCredentials: true,
            });

            setPortfolioValue(result.data.totalValue);
        } catch (err) {
            console.log(err);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/auth/logout`,
                {},
                { withCredentials: true }
            );

            if (response.status === 200) {
                console.log('Logged out successfully');
                localStorage.clear();
                navigate('/');
            }
        } catch (err) {
            console.log(err);
            toast.error('Error logging out');
        }
    };

    const handleUpdateMinKeys = async () => {
        try {
            if (!minKeys || minKeys <= 0) {
                toast.error('Minimum keys must be greater than 0.');
                return;
            }

            const response = await axios.put(
                `${process.env.REACT_APP_SERVER_URL}/user/`,
                { minimumKeys: minKeys },
                { withCredentials: true }
            );

            if (response.status === 200) {
                toast.success('Minimum keys updated!');
                setSaveDisabled(true);
            }
        } catch (err: any) {
            console.log(err);
            toast.error(err.response.data || 'Error updating minimum keys.');
        }
    };

    const getWallet = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/wallet`, {
                withCredentials: true,
            });

            wallet.setWallet(response.data);
            localStorage.setItem('wallet', JSON.stringify(response.data));
        } catch (err) {
            console.log(err);
        }
    };

    const getUser = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user`, {
                withCredentials: true,
            });

            user.setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
        } catch (err) {
            console.log(err);
        }
    };

    const formatNumber = (value: any) => {
        return value >= 1000 ? `${(value / 1000).toFixed(2)}k` : value.toFixed(2);
    };

    useEffect(() => {
        getWallet();
        getUser();
        getPortfolioValue();
    }, []);

    return (
        <>
            <ProfileNav>
                <ProfileNavTop>
                    <BackArrow
                        onClick={() => {
                            navigate('/a/home');
                        }}
                    >
                        <IoChevronBackOutline />
                    </BackArrow>

                    <div>
                        <h3>Account</h3>
                    </div>

                    <Kebab>
                        <CiMenuKebab />
                    </Kebab>
                </ProfileNavTop>

                <ProfileNavCenter>
                    <ProfileNavCenterLeft>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                gap: '10px',
                            }}
                        >
                            <img
                                style={{
                                    height: '35px',
                                    borderRadius: '50%',
                                }}
                                src={user.avatar}
                                alt=""
                            />

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                    gap: '0px',
                                }}
                            >
                                <span
                                    style={{
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    {user.displayName}
                                </span>

                                <div
                                    style={{
                                        fontSize: '0.7rem',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {wallet.address.substring(0, 4) +
                                        '...' +
                                        wallet.address.substring(wallet.address.length - 4, wallet.address.length)}{' '}
                                    <BiCopy />
                                </div>
                            </div>
                        </div>
                    </ProfileNavCenterLeft>

                    <ProfileNavCenterRight>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                                gap: '0px',
                                fontSize: '0.8rem',
                            }}
                        >
                            <span>{(wallet.balance / LAMPORTS_PER_SOL).toFixed(3)} SOL</span>

                            <span
                                style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 400,
                                    backgroundColor: '#d1b48c',
                                    padding: '2px 5px',
                                    borderRadius: '5px',
                                    color: '#000',
                                }}
                            >
                                Wallet Balance
                            </span>
                        </div>
                    </ProfileNavCenterRight>
                </ProfileNavCenter>

                <ProfileNavBottom>
                    <ProfileNavBottomLeft>
                        <ProfileNavBottomLeftDetails>
                            <div>
                                <span
                                    style={{
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {user.holders.length}{' '}
                                </span>
                                Holders
                            </div>

                            <div>
                                <span
                                    style={{
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {user.holding.length}{' '}
                                </span>{' '}
                                Holding
                            </div>
                        </ProfileNavBottomLeftDetails>
                    </ProfileNavBottomLeft>
                </ProfileNavBottom>
            </ProfileNav>

            <PortfolioSection>
                <PortfolioSectionLeft>
                    <PortfolioSectionInner>
                        <PortfolioSectionInnerTop>
                            <h4>Portfolio Value</h4>
                        </PortfolioSectionInnerTop>

                        <PortfolioSectionInnerBottom>
                            <span>
                                <TbCurrencySolana />
                                {formatNumber(portfolioValue / LAMPORTS_PER_SOL)} SOL
                            </span>
                        </PortfolioSectionInnerBottom>
                    </PortfolioSectionInner>
                </PortfolioSectionLeft>

                <PortfolioSectionRight>
                    <PortfolioSectionInner>
                        <PortfolioSectionInnerTop>
                            <h4>Trading Fees Earned</h4>
                        </PortfolioSectionInnerTop>

                        <PortfolioSectionInnerBottom>
                            <span>
                                <TbCurrencySolana />
                                {formatNumber(user.earnings / LAMPORTS_PER_SOL)} SOL
                            </span>
                        </PortfolioSectionInnerBottom>
                    </PortfolioSectionInner>
                </PortfolioSectionRight>
            </PortfolioSection>

            <ExchangeSection>
                <ExchangeSectionLeft>
                    <ExchangeSectionInner>
                        <DepositModal />
                        <span>Deposit</span>
                    </ExchangeSectionInner>
                </ExchangeSectionLeft>

                <ExchangeSectionRight>
                    <ExchangeSectionInner>
                        <WithdrawModal />
                        <span>Withdraw</span>
                    </ExchangeSectionInner>
                </ExchangeSectionRight>
            </ExchangeSection>

            <KeysSection>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '10px',
                        flex: 1,
                    }}
                >
                    <h3
                        style={{
                            margin: 0,
                            padding: 0,
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            color: '#e3e3e3',
                        }}
                    >
                        Set Minimum Keys
                    </h3>

                    <span
                        style={{
                            fontSize: '0.7rem',
                            textAlign: 'center',
                            fontWeight: 400,
                            color: '#e3e3e3',
                        }}
                    >
                        Set the minimum number of keys a user most hold to unlock access to your profile. You may only
                        update this amount <strong>once every 24 hours.</strong>
                    </span>
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        gap: '10px',
                        width: '100%',
                    }}
                >
                    <input
                        value={minKeys}
                        onChange={(e) => {
                            setMinKeys(parseFloat(e.target.value));
                        }}
                        type="number"
                        style={{
                            textAlign: 'center',
                            height: '30px',
                            width: '100px',
                            borderRadius: '5px',
                            border: '1px solid #d1b48c',
                            backgroundColor: '#18171e',
                            color: '#d1b48c',
                            padding: '0 10px',
                            fontSize: '1rem',
                            fontWeight: 500,
                        }}
                    />

                    <SaveButton disabled={saveDisabled} onClick={handleUpdateMinKeys}>
                        <span>Save</span>
                    </SaveButton>
                </div>
            </KeysSection>

            <ExportSection>
                <ExportSectionInner>
                    {/* <ExportButton>
                        <span>Export Wallet</span>
                    </ExportButton> */}

                    <ExportModal />

                    <LogoutButton
                        onClick={() => {
                            handleLogout();
                        }}
                    >
                        <span>Logout</span>
                    </LogoutButton>
                </ExportSectionInner>
            </ExportSection>
        </>
    );
}

const BackArrow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    color: #d1b48c;
`;

const Kebab = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-size: 1.3rem;
    color: #d1b48c;
`;

const ProfileNav = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    min-height: 15vh;
    height: fit-content;
    top: 0;
    position: sticky;
    border-bottom: 1px solid #d1b48c;
    padding: 0 10px;
    color: #d1b48c;
    background-color: #18171e;
    z-index: 100;

    h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
    }
`;

const ProfileNavTop = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    flex: 30%;

    h3 {
        margin: 0;
        padding: 0;
        font-weight: 600;
    }
`;

const ProfileNavCenter = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    flex: 40%;
    font-weight: 500;
    height: fit-content;
    padding: 0px 0 !important;
    padding-bottom: 5px !important;
`;

const ProfileNavCenterLeft = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    flex: 60%;
    font-size: smaller;
    width: 100%;
`;

const ProfileNavCenterRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0;
    flex: 40%;
    font-size: smaller;
    width: 100%;
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
    gap: 10px;
    font-size: small;
    margin-left: 10px;
`;

const PortfolioSection = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    min-height: 150px;
    height: fit-content;
    border-bottom: 1px solid #d1b48c;
`;

const KeysSection = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    /* width: 100%; */
    padding: 20px;
    min-height: 150px;
    height: 100%;
    border-bottom: 1px solid #d1b48c;
    /* background-color: #e6e6e6; */
`;

const PortfolioSectionLeft = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    min-height: 150px;
    flex: 50%;
    padding: 10px;
`;

const PortfolioSectionRight = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    min-height: 150px;
    flex: 50%;
    padding: 10px;
`;

const PortfolioSectionInner = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border: 1px solid #d1b48c;
    border-radius: 5px;
    width: 100%;
    height: 75px;
    padding: 10px;
    color: #d1b48c;
`;

const PortfolioSectionInnerTop = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
    width: 100%;

    h4 {
        margin: 0;
        font-size: 0.8rem;
        font-weight: 400;
        color: #e3e3e3;
    }
`;

const PortfolioSectionInnerBottom = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
    width: 100%;

    span {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 5px;
        font-size: 1rem;
        font-weight: 500;
    }
`;

const ExchangeSection = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    min-height: 150px;
    height: fit-content;
    background-color: #18171e;
    border-bottom: 1px solid #d1b48c;
    color: #d1b48c;
`;

const ExchangeSectionLeft = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    min-height: 150px;
    flex: 50%;
    padding: 10px;
`;

const ExchangeSectionRight = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    min-height: 150px;
    flex: 50%;
    padding: 10px;
`;

const ExchangeSectionInner = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 5px;
    width: 100%;
    height: 75px;
    padding: 10px;

    div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        font-size: 2rem;
        font-weight: 500;
        border-radius: 50%;
        padding: 20px;
        background-color: #d1b48c;
        border: 1px solid #d1b48c;

        svg {
            font-size: 1.5rem;
            color: #000;
        }

        &:hover {
            cursor: pointer;
            border: 1px solid #e6e6e6;
        }
    }
`;

const ExportSection = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    min-height: 150px;
    height: fit-content;
    background-color: #d1b48c;
    border-bottom: 1px solid #e6e6e6;
`;

const ExportSectionInner = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    border-radius: 5px;
    height: 75px;
    padding: 10px;
`;

const ExportButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #18171e;
    border: 1px solid #18171e;
    border-radius: 20px;
    padding: 10px 15px;
    font-weight: 600;
    cursor: pointer;
    color: #e3e3e3;
    width: 100%;
    max-width: 300px;
`;

const LogoutButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #d1b48c;
    border: 1px solid #18171e;
    border-radius: 25px;
    padding: 10px 15px;
    font-weight: 600;
    cursor: pointer;
    color: #18171e;
    height: 50px;
    width: 100%;

    max-width: 300px;
`;

const SaveButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #d1b48c;
    border: 1px solid #d1b48c;
    border-radius: 20px;
    padding: 10px 15px;
    font-weight: 600;
    cursor: pointer;
    color: #000;
    width: 150px;
    max-width: 300px;

    &:disabled {
        background-color: #e6e6e6;
        border: 1px solid #e6e6e6;
        cursor: not-allowed;
    }
`;
