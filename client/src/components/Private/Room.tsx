import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { RiSendPlane2Fill } from 'react-icons/ri';
import { AiFillLock } from 'react-icons/ai';

import socketService from '../../utils/socketService';
import axios from 'axios';
import { useProfileStore, useUserStore } from '../../store';

import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import TradeModal from '../../components/Private/TradeModal';

interface Message {
    _id: string;
    author: { _id: string; username: string; displayName: string; avatar: string };
    room: string;
    body: string;
    createdAt: string;
}

interface Room {
    _id: string;
    owner: string;
    name: string;
    users: string[];
    messages: Message[];
    minimumKeys: number;
}

export default function Room() {
    const { id } = useParams<{ id: string }>();
    const socket = socketService.getSocket();

    const user = useUserStore();
    const profile = useProfileStore();

    const [message, setMessage] = React.useState('');
    const [isInitialLoad, setIsInitialLoad] = React.useState(true);
    const [pending, setPending] = React.useState(true);
    const [hasAccess, setHasAccess] = React.useState(false);
    const [room, setRoom] = React.useState<Room>({
        _id: '',
        owner: '',
        name: '',
        users: [],
        minimumKeys: 1,
        messages: [],
    });

    const handleMesssageChange = (e: any) => {
        setMessage(e.target.value);
    };

    const handleSubmit = async (e: any) => {
        try {
            e.preventDefault();

            if (message === '') return;

            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/message/${room._id}`,
                {
                    body: message,
                },
                {
                    withCredentials: true,
                }
            );

            if (response.status !== 200) return;

            socket.emit('chat_message', message);

            setMessage('');
        } catch (err) {
            console.log(err);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit(event as any);
        }
    };

    const getRoom = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/room/${profile._id || id}`, {
                withCredentials: true,
            });

            setRoom(response.data);

            setHasAccess(true);

            setTimeout(() => {
                setPending(false);
            }, 1000);
        } catch (err: any) {
            switch (err.response.status) {
                case 404:
                    console.log('room not found');
                    setHasAccess(false);
                    break;
                case 401:
                    setHasAccess(false);

                    setTimeout(() => {
                        setPending(false);
                    }, 1000);
                    break;
                default:
                    console.log(err);
                    setTimeout(() => {
                        setPending(false);
                    }, 1000);
                    break;
            }
        }
    };

    const handleDisplayDate = (date: string) => {
        const now = new Date().getTime();
        const tradeDate = new Date(date).getTime();
        const diff = now - tradeDate;

        const diffInMinutes = Math.floor(diff / 1000 / 60);
        const diffInHours = Math.floor(diff / 1000 / 60 / 60);
        const diffInDays = Math.floor(diff / 1000 / 60 / 60 / 24);

        if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            return `${diffInDays}d ago`;
        }
    };

    useEffect(() => {
        getRoom();
    }, [profile]);

    // join room
    useEffect(() => {
        if (!room._id) return;

        socket.connect();
        socket.emit('join_room', room._id);

        socket.on('new_message', (message: any) => {
            setRoom((prevRoom) => ({
                ...prevRoom,
                messages: [...prevRoom.messages, message],
            }));
        });

        return () => {
            socket.disconnect();
        };
    }, [room._id]);

    // scroll to bottom
    const containerRef = useRef<any>(null);
    const messagesEndRef = useRef<any>(null);

    const scrollToBottom = async () => {
        if (containerRef.current && isInitialLoad) {
            setIsInitialLoad(false);
            containerRef.current.style.opacity = 0;

            // wait 0.5 seconds
            await new Promise((resolve) => setTimeout(resolve, 500));

            // make container ref visible
            if (containerRef.current?.style) {
                containerRef.current.style.opacity = 1;
            }
        }

        if (messagesEndRef.current) {
            messagesEndRef?.current?.scrollIntoView({ behavior: 'auto' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [room.messages, hasAccess, pending]);

    return (
        <>
            {pending && (
                <PendingContainer>
                    <Stack spacing={2} direction="row">
                        <CustomSpinnner size={100} thickness={2.5} />
                    </Stack>
                </PendingContainer>
            )}

            {!hasAccess && !pending && (
                <NotAuthorizedWrapper>
                    <NotAuthorizedContainer>
                        <NotAuthorizedIcon />

                        <NotAuthorizedText>
                            <span>
                                You must hold at least <strong>{profile.minimumKeys}</strong> {profile.displayName} key
                                to access this chat.
                            </span>
                        </NotAuthorizedText>

                        <TradeModal label="Buy" />
                    </NotAuthorizedContainer>
                </NotAuthorizedWrapper>
            )}

            {hasAccess && !pending && (
                <Container>
                    <ChatArea ref={containerRef}>
                        {room?.messages?.map((message) => (
                            <ChatMessage key={message._id} author={message.author._id} user={user?._id}>
                                <ChatUserDiv>
                                    {message.author._id === user?._id && (
                                        <>
                                            <ChatMessageText author={message.author._id} user={user?._id}>
                                                {message.body}
                                            </ChatMessageText>

                                            <ChatMessageImage src={message.author.avatar} alt="" />
                                        </>
                                    )}

                                    {message.author._id !== user?._id && (
                                        <>
                                            <ChatMessageImage src={message.author.avatar} alt="" />

                                            <ChatMessageText author={message.author._id} user={user?._id}>
                                                {message.body}
                                            </ChatMessageText>
                                        </>
                                    )}
                                </ChatUserDiv>

                                <ChatMessageDate author={message.author._id} user={user?._id}>
                                    {handleDisplayDate(message.createdAt)}{' '}
                                </ChatMessageDate>
                            </ChatMessage>
                        ))}

                        <div ref={messagesEndRef} />
                    </ChatArea>

                    <ChatInputWrapper>
                        <ChatInput onSubmit={(e: any) => handleSubmit(e)}>
                            <ChatInputText
                                placeholder="Say hello..."
                                value={message}
                                onChange={(e: any) => handleMesssageChange(e)}
                                onKeyDown={handleKeyDown}
                            />

                            <SendButton type="submit">
                                <RiSendPlane2Fill />
                            </SendButton>
                        </ChatInput>
                    </ChatInputWrapper>
                </Container>
            )}
        </>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: fit-content;
    width: 100%;
    margin-top: 6vh; // account for feed/chat tab
    margin-bottom: 10vh; // account for chat input
`;

const ChatArea = styled.div`
    display: flex;
    flex-direction: column;

    gap: 30px;
    overflow: auto;
    padding: 10px 20px;

    /* hide scroll bar */
    &::-webkit-scrollbar {
        display: none;
    }

    /* hide scroll bar */
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const ChatInputWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    position: fixed;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #d1b48c;
    background-color: #18171e;
`;

const ChatInput = styled.form`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px;
    background-color: #18171e;
`;

const ChatInputText = styled.textarea`
    display: flex;
    padding: 10px;
    font-size: 1rem;
    font-weight: 400;
    background-color: #18171e;
    width: 100%;
    border: 1px solid #d1b48c;
    border-radius: 10px;
    resize: none;
    color: #e3e3e3;

    &:focus {
        outline: 2px solid #18171e;
    }
`;

const ChatUserDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
`;

const ChatMessageImage = styled.img`
    height: 25px;
    border-radius: 50%;
`;

const ChatMessage = styled.div<{ author: string; user: string }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: ${(props) => (props.author === props.user ? 'flex-end' : 'flex-start')};
    width: 100%;
    gap: 10px;
`;

const ChatMessageText = styled.p<{ author: string; user: string }>`
    display: flex;
    padding: 5px 20px;
    font-size: 1rem;
    font-weight: 500;
    background-color: ${(props) => (props.author === props.user ? '#d1b48c' : '#e3e3e3')};
    color: ${(props) => (props.author === props.user ? '#18171e' : '#5c5c5c')};
    /* text-align: ${(props) => (props.author === props.user ? 'right' : 'left')}; */
    letter-spacing: 0.5px;
    width: fit-content;
    max-width: 400px;
    border: ${(props) => (props.author === props.user ? 'none' : '1px solid #e3e3e3')};
    border-radius: 20px;
    margin: 0;
`;

const ChatMessageDate = styled.span<{ author: string; user: string }>`
    display: flex;
    width: 100%;
    justify-content: ${(props) => (props.author === props.user ? 'flex-end' : 'flex-start')};
    font-size: 0.7rem;
    font-weight: 400;
    color: #d1b48c;
    margin: 0;
`;

const SendButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border-radius: 50%;
    border: none;
    background-color: #d1b48c;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &:hover {
        background-color: #e3e3e3;
    }
`;

// Not authorized screen
const NotAuthorizedWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 85vh;
    width: 100%;
    overflow: hidden !important;
    justify-content: center;
    align-items: center;
`;

const NotAuthorizedContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 80%;
    height: 100%;
    padding: 20px;
    margin-top: 5vh; // account for feed/chat tab
    justify-content: center;
    align-items: center;
    gap: 20px;
`;

const NotAuthorizedIcon = styled(AiFillLock)`
    font-size: 2rem;
    color: #18171e;
    background-color: #d1b48c;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
`;

const NotAuthorizedText = styled.p`
    display: flex;
    text-align: center;
    font-size: 0.9rem;
    font-weight: 400;
    color: #e3e3e3;
    margin: 0 !important;
`;

const NotAuthorizedButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border-radius: 20px;
    border: none;
    background-color: #fffc00;
    border: 1px solid #fffc00;
    color: #000;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    min-width: 100px;

    &:hover {
        background-color: #fff;
        border: 1px solid #000;
    }
`;

const PendingContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 80vh;
    padding: 20px;
    margin-top: 5vh; // account for feed/chat tab
    justify-content: center;
    align-items: center;
    gap: 20px;
`;

const CustomSpinnner = styled(CircularProgress)`
    color: #e6e6e6 !important;
`;
