// store/useStore.ts
import {create} from 'zustand';

interface SharedState {
  image: string | File | null | Blob;
  setImage: (image: string | File | Blob) => void; 
  isAdmin: boolean; 
  setAdmin: (isAdmin: boolean) => void; 
  reset: () => void; 
}

export const useStore = create<SharedState>((set) => ({
  image: null,
  setImage: (image) => set({ image }), 
  isAdmin: false,
  setAdmin: (isAdmin) => set({ isAdmin }), 
  reset: () => set({ image: null, isAdmin: false }),
}));

export const useStoreMember = create<SharedState>((set) => ({
  image: null,
  setImage: (image) => set({ image }),
  isAdmin: false,
  setAdmin: (isAdmin) => set({ isAdmin }), 
  reset: () => set({ image: null, isAdmin: false }),
}));