import { create } from 'zustand';
import { UserProfile } from '../types';
import { getProfile, saveProfile, isOnboarded } from '../services/ProfileService';

interface ProfileState {
  profile: UserProfile | null;
  onboarded: boolean;
  loading: boolean;
  fetchProfile: (uid: string) => Promise<void>;
  updateProfile: (uid: string, data: Partial<UserProfile>) => Promise<void>;
  setProfile: (profile: UserProfile | null) => void;
  setOnboarded: (onboarded: boolean) => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  onboarded: false,
  loading: false,

  fetchProfile: async (uid: string) => {
    set({ loading: true });
    try {
      const profile = await getProfile(uid);
      const done = await isOnboarded(uid);
      set({ profile, onboarded: done, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  updateProfile: async (uid: string, data: Partial<UserProfile>) => {
    set({ loading: true });
    try {
      const updatedProfile = await saveProfile(uid, data);
      set({ profile: updatedProfile, onboarded: updatedProfile.onboarded, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  setProfile: (profile) => set({ profile }),
  setOnboarded: (onboarded) => set({ onboarded }),
}));
