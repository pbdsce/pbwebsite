// store/useStore.ts
import {create} from 'zustand';

interface SharedState {
  image: string | File | null| Blob; // Store image as base64 string or Blob URL
  setImage: (image: string | File|Blob) => void; // Function to update the image
}

export const useStore = create<SharedState>((set) => ({
  image: null,
  setImage: (image) => set({ image }), // Set the image in state
}));

export const useStoreMember = create<SharedState>((set) => ({
  image: null,
  setImage: (image) => set({ image }), // Set the image in state
}));