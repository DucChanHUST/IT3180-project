import create from "zustand";
import { persist } from "zustand/middleware";
import { StoreConstant } from "../const";

let appStore = set => ({
  dopen: true,
  updateOpen: dopen => set(state => ({ dopen: dopen })),
});

appStore = persist(appStore, { name: StoreConstant.SIDE_BAR_STORE });

export const useAppStore = create(appStore);
