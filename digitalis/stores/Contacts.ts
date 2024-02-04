import { create } from "zustand";
import { BACKEND_URL } from "@env";
import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import { encryptedStorage } from "./CredentialStore";


export type StoredContact = {
  id: string,
  name: string,
  incoming_key: number[],
  outgoing_key: number[],

  outgoing_index: number,
}


interface ContactsStoreType {
  contacts: StoredContact[],
  addToOutgoingIndex: (contactId: string, amount: number) => void,
  getContact: (contactId: string) => StoredContact | undefined,
  addContact: (new_contact: StoredContact) => void,
  removeContact: (contactId: string) => void,
  resetContacts: () => void,
  tempContact: any,
  setTempContact: (new_value: any) => void,
  resetTempContact: () => void,
}



const useContactsStore = create(
  persist<ContactsStoreType>(
    (set, get) => ({
      contacts: [],
      addToOutgoingIndex: (contactId: string, amount: number) => set({ contacts: get().contacts.map((contact) => {
        if (contact.id == contactId) {
          return {...contact, outgoing_index: contact.outgoing_index + amount}
        }
        return contact;
      }) }),
      resetContacts: () => set({ contacts: [] }),
      getContact: (contactId: string) => get().contacts.find((contact) => contact.id == contactId),
      addContact: (new_contact: StoredContact) => set({ contacts: [...get().contacts, new_contact] }),
      removeContact: (contactId: string) => set({ contacts: get().contacts.filter((contact) => contact.id != contactId) }),
      tempContact: { outgoing_index: 0 },
      setTempContact: (new_value: any) => set({ tempContact: {...get().tempContact, ...new_value} }),
      resetTempContact: () => set({ tempContact: { outgoing_index: 0 } }),
    }),
    {
      name: "Contact_keys",
      storage: createJSONStorage(() => encryptedStorage),
    },
  ),
);

export default useContactsStore;