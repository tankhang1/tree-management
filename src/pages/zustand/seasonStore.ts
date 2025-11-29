import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { CropOption, SeedOption } from "../AreaManagementPage/Row/Add";
import type { SeedDetail } from "../AreaManagementPage/Region/Add/components/SeedDetailCards";

export type CycleStage = {
  cycleId: string;
  stageIds: string[];
};

export interface Season {
  id: string;
  name: string;
  estimatedDuration: number;
  cropId: string;
  selectedCrop?: CropOption;
  selectedSeed?: SeedOption;
  selectedSeedDetails: SeedDetail[];
  growthCycles: CycleStage[];
  createdAt: number;
}

interface SeasonStore {
  seasons: Season[];
  addSeason: (season: Omit<Season, "id" | "createdAt">) => void;
  getSeasonById: (id: string) => Season | undefined;
  updateSeason: (
    id: string,
    updatedFields: Partial<Omit<Season, "id" | "createdAt">>
  ) => void;
  deleteSeason: (id: string) => void;
}

export const useSeasonStore = create<SeasonStore>()(
  devtools(
    (set, get) => ({
      seasons: [],

      addSeason: (seasonData) => {
        const newSeason: Season = {
          ...seasonData,
          id: Date.now().toString(),
          createdAt: Date.now(),
        };

        set((state) => ({
          seasons: [...state.seasons, newSeason],
        }));
      },

      getSeasonById: (id) => get().seasons.find((s) => s.id === id),

      updateSeason: (id, updatedFields) =>
        set((state) => ({
          seasons: state.seasons.map((season) =>
            season.id === id ? { ...season, ...updatedFields } : season
          ),
        })),

      deleteSeason: (id) =>
        set((state) => ({
          seasons: state.seasons.filter((s) => s.id !== id),
        })),
    }),
    { name: "season-management-storage" }
  )
);
