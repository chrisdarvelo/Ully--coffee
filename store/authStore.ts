import { create } from 'zustand';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/FirebaseConfig';

interface AuthState {
  user: User | null;
  initializing: boolean;
  setUser: (user: User | null) => void;
  setInitializing: (initializing: boolean) => void;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initializing: true,
  setUser: (user) => set({ user }),
  setInitializing: (initializing) => set({ initializing }),
  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({ user, initializing: false });
    });
    return unsubscribe;
  },
}));
