import { create } from "zustand";
import { BACKEND_URL } from "@env";
import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import EncryptedStorage from 'react-native-encrypted-storage';


export type StoredContact = {
  id: string,
  name: string,
  incoming_key: string,
  outgoing_key: string,

  outgoing_index: number,
}

// use the outgoing index to index the key and create new messages,
// use the incoming key by getting the index range from the backend


interface ContactsStoreType {
  contacts: StoredContact[],
  getContact: (contactId: string) => StoredContact | undefined,
  addContact: (new_contact: StoredContact) => void,
  removeContact: (contactId: string) => void,
  tempContact: any,
  setTempContact: (new_value: any) => void,
  resetTempContact: () => void,
}

export const encryptedStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await EncryptedStorage.getItem(name)
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await EncryptedStorage.setItem(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    await EncryptedStorage.removeItem(name)
  },
}


const useContactsStore = create(
  persist<ContactsStoreType>(
    (set, get) => ({
      contacts: [],
      getContact: (contactId: string) => get().contacts.find((contact) => contact.id == contactId),
      addContact: (new_contact: StoredContact) => set({ contacts: [...get().contacts, new_contact] }),
      removeContact: (contactId: string) => set({ contacts: get().contacts.filter((contact) => contact.id != contactId) }),
      tempContact: { outgoingIndex: 0 },
      setTempContact: (new_value: any) => set({ tempContact: {...get().tempContact, ...new_value} }),
      resetTempContact: () => set({ tempContact: { outgoingIndex: 0 } }),
    }),
    {
      name: "Contact_keys",
      storage: createJSONStorage(() => encryptedStorage),
    },
  ),
);

export default useContactsStore;