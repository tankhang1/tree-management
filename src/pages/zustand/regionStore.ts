// stores/region-store.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type LatLngPoint = { lat: number; lng: number };

export type RegionInfo = {
  codeSystem: string;
  codeGov: string;
  name: string;
  companyIds: string[];
  area: string;
  soilType: string;
  terrain: string[];
  gps: string;
  note: string;
  province: string;
  address: string;
  ward: string;
};

export type AreaInfo = {
  code: string;
  name: string;
  regionRef: string;
  orgUnit: string;
  area: string;
  soilType: string;
  terrain: string[];
  mainCrop: string;
  gps: string;
};

export type RegionEntity = {
  id: string;
  region: RegionInfo;
  areas: AreaInfo[];
  coords: LatLngPoint[];
};

type RegionState = {
  regions: RegionEntity[];
  addRegion: (region: RegionEntity) => void;
  updateRegion: (id: string, patch: Partial<RegionEntity>) => void;
  removeRegion: (id: string) => void;
};

export const useRegionStore = create<RegionState>()(
  persist(
    (set) => ({
      regions: [],
      addRegion: (region) =>
        set((state) => ({ regions: [...state.regions, region] })),
      updateRegion: (id, patch) =>
        set((state) => ({
          regions: state.regions.map((r) =>
            r.id === id ? { ...r, ...patch } : r
          ),
        })),
      removeRegion: (id) =>
        set((state) => ({
          regions: state.regions.filter((r) => r.id !== id),
        })),
    }),
    { name: "region-store", storage: createJSONStorage(() => localStorage) }
  )
);
