// NOTE: REWRITE THIS IN PYTHON AND MOVE SIGN IN API TO PYTHON

import { create } from "zustand";
import { persist } from "zustand/middleware";

type PrivKeyState = {
  privKey: string;
  updatePrivKey: (privKey: string) => void;
};

export const usePrivKeyStore = create<PrivKeyState>()(
  persist(
    (set) => ({
      privKey: "",
      updatePrivKey: (privKey) => set(() => ({ privKey })),
    }),
    {
      name: "temp-store",
    },
  ),
);
