import { create } from "zustand";
import { encryptedStorage } from "./Contacts";
import { createJSONStorage, persist } from "zustand/middleware";


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