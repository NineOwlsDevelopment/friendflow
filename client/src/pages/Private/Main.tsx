import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import UserCard from '../../components/Private/UserCard';
import TopNav from '../../components/Private/TopNav';
import BottomNav from '../../components/Private/BottomNav';
import ActionNav from '../../components/Private/ActionNav';
import axios from 'axios';

import { useUserSearchStore } from '../../store';

export default function Main() {
    const userSearch = useUserSearchStore();

    const [topUsers, setTopUsers] = useState([]);

    const getUsers = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/top`, {
                withCredentials: true,
            });

            // setTopUsers(result.data);
            userSearch.setUsers(result.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <>
            <ActionNav />
            <TopNav />
            <Container>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '5px 20px',
                        fontSize: '12px',
                        fontWeight: 400,
                        color: '#d1b48c',
                    }}
                >
                    <span>Key</span>

                    <span>Price</span>
                </div>

                <UserCardContainer>
                    {userSearch.users.map((user: any) => (
                        <UserCard
                            key={user._id}
                            _id={user._id}
                            avatar={user.avatar}
                            username={user.username}
                            displayName={user.displayName}
                            followers={user.followers}
                            marketCap={user.marketCap}
                            volume={user.volume}
                            earnings={user.earnings}
                            price={user.price}
                            supply={user.supply}
                            claimed={user.claimed}
                        />
                    ))}
                </UserCardContainer>
            </Container>
            <BottomNav />
        </>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: fit-content;
    margin-bottom: 11vh;
`;

const UserCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;
