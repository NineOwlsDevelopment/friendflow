import { create } from 'zustand';

interface UserState {
    username: string;
    solanaAddress: string;
    balance: number;
    bio: string;
    followers: string[];
    following: string[];
    likes: string[];
    comments: string[];
    posts: string[];
    setUser: (userData: UserState) => void;
}

const useUserStore = create<UserState>((set) => ({
    username: '',
    solanaAddress: '',
    balance: 0,
    bio: '',
    followers: [],
    following: [],
    likes: [],
    comments: [],
    posts: [],
    setUser: (userData: UserState) => set(userData),
}));

export default useUserStore;
