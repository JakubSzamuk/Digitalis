import { create } from "zustand";
import { BACKEND_URL } from "@env";
import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import EncryptedStorage from 'react-native-encrypted-storage';


interface ContactsStoreType {
  contacts: number,
  setContacts: () => void
}

const encryptedStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await EncryptedStorage.getItem(name)
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await encryptedStorage.setItem(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    await EncryptedStorage.removeItem(name)
  },
}


const useContactsStore = create(
  persist<ContactsStoreType>(
    (set, get) => ({
      contacts: 0,
      setContacts: () => set({ contacts: get().contacts + 1 })
    }),
    {
      name: "Contact-keys",
      storage: createJSONStorage(() => encryptedStorage),
    },
  ),
);

export default useContactsStore;