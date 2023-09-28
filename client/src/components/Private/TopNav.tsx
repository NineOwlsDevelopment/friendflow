import React from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';

import { AiOutlineSearch } from 'react-icons/ai';
import { PiGearSixBold } from 'react-icons/pi';
import { FiRefreshCcw } from 'react-icons/fi';

import axios from 'axios';

import { useUserSearchStore } from '../../store';

export default function TopNav() {
    const navigate = useNavigate();
    const userSearch = useUserSearchStore();
    const [search, setSearch] = React.useState('');

    const handleSearch = async (e: any) => {
        const result = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/search/${search || null}`, {
            withCredentials: true,
        });

        userSearch.setUsers(result.data);

        setSearch('');
    };

    const handleClear = async () => {
        setSearch('');

        const result = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/search/null`, {
            withCredentials: true,
        });

        userSearch.setUsers(result.data);
    };

    return (
        <Nav>
            <NavContainer>
                <NavRight>
                    <SearchDiv>
                        <AiOutlineSearch />
                        <SearchInput
                            value={search}
                            onChange={(e: any) => setSearch(e.target.value)}
                            onKeyPress={(e: any) => {
                                if (e.key === 'Enter') {
                                    handleSearch(e);
                                }
                            }}
                            type="text"
                            placeholder="Search by username"
                        />
                    </SearchDiv>

                    <SettingsDiv>
                        <FiRefreshCcw
                            onClick={() => {
                                handleClear();
                            }}
                        />
                    </SettingsDiv>
                </NavRight>
            </NavContainer>
        </Nav>
    );
}

const Nav = styled.div`
    display: none;
    display: flex;

    background-color: #18171e;
    color: #e3e3e3;
    /* border-bottom: 1px solid #e6e6e6; */
    justify-content: space-between;
    align-items: center;
    height: 10vh;
    position: sticky;
    width: 100%;
    top: 1;
`;

const NavContainer = styled.div`
    display: flex;
    width: 100%;
    padding: 0 20px;
`;

const NavRight = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    flex: 80%;

    @media (max-width: 768px) {
        padding: 0;
    }
`;

const SearchInput = styled.input`
    display: flex;
    height: 100%;
    width: 100%;
    border: none;
    padding-left: 10px;
    background-color: transparent;
    font-size: large;
    color: #e3e3e3;

    &:focus {
        border: none !important;
    }

    &:focus-visible {
        outline: none;
    }
`;

const SearchDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 40px;
    border-radius: 20px;
    border: 1px solid #d1b48c;
    padding: 0 10px;
    outline: none;
    font-size: 1rem;
    transition: all 0.2s ease-in-out;

    @media (max-width: 768px) {
        width: 100%;
    }

    &::placeholder {
        color: #e3e3e3;
    }

    svg {
        font-size: 1.5rem;
        color: #d1b48c;
    }

    /* add color on focus */
    &:focus-within {
        border: 1px solid #3b3b3b;
    }
`;

const SettingsDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
        color: #d1b48c;
        font-size: 1.3rem;
        cursor: pointer;
    }
`;
