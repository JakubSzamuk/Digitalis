import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { StateStorage, createJSONStorage, persist } from "zustand/middleware";


export const encryptedStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await SecureStore.getItem(name)
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItem(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name)
  },
}

type CredentialResponse = {
  app_key: string,
  user_id: string
}

interface AppKeyStore {
  isLockedOut: boolean,
  setLockedOut: () => void,
  app_key: string,
  user_id: string,
  setCredentialStore: (key: CredentialResponse) => void
}


const useAppKey = create(
  persist<AppKeyStore>(
    (set) => ({
      isLockedOut: false,
      setLockedOut: () => set({ isLockedOut: true }),
      app_key: "",
      user_id: "",
      setCredentialStore: (key: CredentialResponse) => set({ ...key }),
    }),
    {
      name: "credential_store",
      storage: createJSONStorage(() => encryptedStorage),
    },
  ),
);

export default useAppKey;