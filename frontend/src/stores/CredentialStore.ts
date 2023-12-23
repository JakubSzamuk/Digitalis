import { create } from "zustand";
import { encryptedStorage } from "./Contacts";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppKeyStore {
  app_key: string,
  setAppKey: (key: string) => void
}


const useAppKey = create(
  persist<AppKeyStore>(
    (set) => ({
      app_key: "",
      setAppKey: (key: string) => set({ app_key: key })
    }),
    {
      name: "App_key",
      storage: createJSONStorage(() => encryptedStorage),
    },
  ),
);

export default useAppKey;