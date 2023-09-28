import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { BiHomeAlt2, BiMapAlt, BiFingerprint, BiSearchAlt } from 'react-icons/bi';
import { GrGroup } from 'react-icons/gr';
import { FaUserFriends } from 'react-icons/fa';
import { LiaUserFriendsSolid } from 'react-icons/lia';
import { useUserStore, useProfileStore } from '../../store';
import axios from 'axios';

import { IoSwapVerticalOutline } from 'react-icons/io5';
import { BsChatDots } from 'react-icons/bs';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { set } from 'lodash';

export default function BottomNav() {
    const user = useUserStore();
    const profile = useProfileStore();
    const navigate = useNavigate();
    const [active, setActive] = React.useState<any>('home');

    const handleNavClick = async (nav: string) => {
        if (nav === 'chat') {
            const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${user._id}`, {
                withCredentials: true,
            });

            profile.setProfile(res.data);

            navigate(`/a/user/${user._id}`);
            return;
        }

        navigate(`/a/${nav}`);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        setActive(window.location.pathname.split('/')[2]);
    }, []);

    return (
        <Nav>
            <NavContainer>
                <NavItem
                    style={{
                        color: active === 'home' ? '#d1b48c' : '#8e8e8e',
                    }}
                    onClick={() => {
                        handleNavClick('home');
                    }}
                >
                    <BiHomeAlt2 />
                    <span>Home</span>
                </NavItem>

                <NavItem
                    style={{
                        color: active === 'friends' ? '#d1b48c' : '#8e8e8e',
                    }}
                    onClick={() => {
                        handleNavClick('friends');
                    }}
                >
                    <LiaUserFriendsSolid />
                    <span>Friends</span>
                </NavItem>

                <NavItem
                    style={{
                        color: active === 'activity' ? '#d1b48c' : '#8e8e8e',
                    }}
                    onClick={() => {
                        handleNavClick('activity');
                    }}
                >
                    <HiOutlineViewGrid />
                    <span>Activity</span>
                </NavItem>

                <NavItem
                    style={{
                        color: active === 'chat' ? '#d1b48c' : '#8e8e8e',
                    }}
                    onClick={() => {
                        handleNavClick('chat');
                    }}
                >
                    <BsChatDots />
                    <span>Chat</span>
                </NavItem>
            </NavContainer>
        </Nav>
    );
}

const Nav = styled.div`
    display: flex;
    background-color: #18171e;
    justify-content: space-between;
    align-items: center;
    height: 10vh;
    position: fixed;
    width: 100%;
    bottom: 0;
    border-top: 1px solid #d1b48c;
    /* box-shadow: 0px -2px 2px 0px rgba(148, 148, 148, 0.55); */
`;

const NavContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding: 10px;
    width: 100%;
`;

const NavItem = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    padding: 10px;
    height: 100%;
    cursor: pointer;
    flex: 1;
    font-weight: 500;
    font-size: 0.8rem;

    svg {
        font-size: 1.5rem;
    }
`;
