import { create } from 'zustand';

interface ProfileState {
    _id: string;
    avatar: string;
    username: string;
    displayName: string;
    price: number;
    holders: string[];
    holding: string[];
    followers: number;
    following: number;
    likes: string[];
    comments: string[];
    posts: string[];
    room: string;
    minimumKeys: number;
    claimed: boolean;
    keysOwned?: number;
    setProfile: (userData: ProfileState) => void;
    setKeysOwned: (keysOwned: number) => void;
}

const useProfileStore = create<ProfileState>((set) => ({
    _id: '',
    avatar: '',
    username: '',
    displayName: '',
    price: 0,
    holders: [],
    holding: [],
    followers: 0,
    following: 0,
    likes: [],
    comments: [],
    posts: [],
    room: '',
    minimumKeys: 1,
    claimed: true,
    keysOwned: 0,
    setProfile: (userData: ProfileState) => set(userData),
    setKeysOwned: (keysOwned: number) => set({ keysOwned }),
}));

export default useProfileStore;
