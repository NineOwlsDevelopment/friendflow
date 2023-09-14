import React from 'react';
import styled from 'styled-components';
import { useUserStore } from '../store';
import { useWallet } from '@solana/wallet-adapter-react';
import Person2Icon from '@mui/icons-material/Person2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';

export default function AccountDropDown() {
    const { username, solanaAddress, balance, setUser } = useUserStore();
    const { wallet, publicKey, connected, signMessage, disconnect, connect } = useWallet();
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            {connected && solanaAddress && (
                <DropDownContainer>
                    <AccountButton onClick={handleClick}>
                        {solanaAddress.slice(0, 4) +
                            '...' +
                            solanaAddress.slice(solanaAddress.length - 4, solanaAddress.length)}

                        <ExpandMoreIcon />
                    </AccountButton>

                    <DropDown
                        style={{
                            display: open ? 'block' : 'none',
                        }}
                    >
                        <DropDownItem>
                            <Person2Icon />
                            <span>Profile</span>
                        </DropDownItem>

                        <DropDownItem>
                            <ManageAccountsIcon />
                            <span>Settings</span>
                        </DropDownItem>

                        <DropDownItem>
                            <LogoutIcon />
                            <span onClick={disconnect}>Logout</span>
                        </DropDownItem>
                    </DropDown>
                </DropDownContainer>
            )}
        </>
    );
}

const DropDownContainer = styled.div`
    position: relative;
`;

const AccountButton = styled.button`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #000;
    gap: 10px;
    min-width: 200px;
    color: #fff;
    border-radius: 25px;
    padding: 7px 10px;
    border: none;
    font-size: 0.9rem;
    font-weight: bold;
    border: 1px solid #000;
    transition: all 0.3s ease-in-out;
    cursor: pointer;

    /* &:hover {
        background-color: #fff;
        color: #000;
        border: 1px solid #000;
        cursor: pointer;
    } */
`;

const DropDown = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    margin-top: 10px;
    width: 180px;
    background-color: #fff;
    border: 1px solid #000;
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
`;

const DropDownItem = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    padding: 10px;
    border-radius: 5px;
    transition: all 0.3s ease-in-out;

    &:hover {
        background-color: #f0f0f0;
        cursor: pointer;
    }
`;
