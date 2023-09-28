import { create } from 'zustand';

interface UserState {
    _id: string;
    avatar: string;
    username: string;
    price: number;
    displayName: string;
    followers: string[];
    following: string[];
    holders: string[];
    holding: string[];
    likes: string[];
    comments: string[];
    posts: string[];
    minimumKeys: number;
    minKeysLastUpdated: string;
    earnings: number;
    setUser: (userData: UserState) => void;
}

const useUserStore = create<UserState>((set) => ({
    _id: '',
    avatar: '',
    username: '',
    price: 0,
    displayName: '',
    followers: [],
    following: [],
    holders: [],
    holding: [],
    likes: [],
    comments: [],
    posts: [],
    minimumKeys: 1,
    minKeysLastUpdated: '',
    earnings: 0,
    setUser: (userData: UserState) => set(userData),
}));

export default useUserStore;
