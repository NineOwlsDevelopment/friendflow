import { create } from 'zustand';

interface User {
    _id: string;
    avatar: string;
    username: string;
    displayName: string;
    price: number;
    volume: number;
    marketCap: number;
    earnings: number;
    followers: string[];
    following: string[];
    holders: string[];
    holding: string[];
    claimed: boolean;
}

interface UserSearchState {
    users: User[];
    setUsers: (users: any[]) => void;
}

const useUserSearchStore = create<UserSearchState>((set) => ({
    users: [],
    setUsers: (users: User[]) => set({ users }),
}));

export default useUserSearchStore;
