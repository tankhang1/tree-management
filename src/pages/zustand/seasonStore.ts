// zustand/seasonStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CycleStage = {
  cycleId: string;
  stageIds: string[];
};

export type Season = {
  id: string;
  name: string;
  estimatedDuration: number;
  cropCode: string;
  seedCode: string;
  seedDetailIds: string[];
  growthCycles: CycleStage[];
  createdAt: string;
  updatedAt: string;
};

type SeasonState = {
  seasons: Season[];
  addSeason: (
    payload: Omit<Season, "id" | "createdAt" | "updatedAt">
  ) => string;
  updateSeason: (id: string, patch: Partial<Season>) => void;
  removeSeason: (id: string) => void;
  getSeasonById: (id: string) => Season | undefined;
  resetSeasonStore: () => void;
};

const dummySeasons: Season[] = [
  {
    id: "SEASON-2025-DX-01",
    name: "Mùa vụ Đông Xuân 2025 - Đậu nành An Giang",
    estimatedDuration: 120,
    cropCode: "CROP-SR-RI6",
    seedCode: "SEED-SR-RI6-01",
    seedDetailIds: ["SEED-DETAIL-RI6-A", "SEED-DETAIL-RI6-B"],
    growthCycles: [
      {
        cycleId: "cycle1",
        stageIds: ["stage1", "stage2", "stage3"],
      },
      {
        cycleId: "cycle2",
        stageIds: ["stage4", "stage5", "stage6"],
      },
    ],
    createdAt: "2025-01-05T08:00:00.000Z",
    updatedAt: "2025-01-05T08:00:00.000Z",
  },
  {
    id: "SEASON-2025-HT-02",
    name: "Mùa vụ Hè Thu 2025 - Bắp Tiền Giang",
    estimatedDuration: 100,
    cropCode: "CROP-CORN-TG",
    seedCode: "SEED-CORN-TG-01",
    seedDetailIds: ["SEED-DETAIL-CORN-A"],
    growthCycles: [
      {
        cycleId: "cycle1",
        stageIds: ["stage1", "stage2"],
      },
      {
        cycleId: "cycle3",
        stageIds: ["stage5", "stage6"],
      },
    ],
    createdAt: "2025-02-10T09:30:00.000Z",
    updatedAt: "2025-02-10T09:30:00.000Z",
  },
  {
    id: "SEASON-2025-MUA-CAFE-GL-01",
    name: "Mùa vụ Cà phê 2025 - Gia Lai",
    estimatedDuration: 180,
    cropCode: "CROP-COFFEE-GL",
    seedCode: "SEED-COFFEE-GL-01",
    seedDetailIds: [],
    growthCycles: [
      {
        cycleId: "cycle2",
        stageIds: ["stage3", "stage4", "stage5"],
      },
    ],
    createdAt: "2025-03-01T06:15:00.000Z",
    updatedAt: "2025-03-01T06:15:00.000Z",
  },
];

export const useSeasonStore = create<SeasonState>()(
  persist(
    (set, get) => ({
      seasons: dummySeasons,

      addSeason: (payload) => {
        const id = `SEASON-${Date.now()}`;
        const now = new Date().toISOString();

        const season: Season = {
          id,
          createdAt: now,
          updatedAt: now,
          ...payload,
        };

        set((state) => ({
          seasons: [season, ...state.seasons],
        }));

        return id;
      },

      updateSeason: (id, patch) => {
        const now = new Date().toISOString();
        set((state) => ({
          seasons: state.seasons.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...patch,
                  updatedAt: patch.updatedAt ?? now,
                }
              : item
          ),
        }));
      },

      removeSeason: (id) => {
        set((state) => ({
          seasons: state.seasons.filter((item) => item.id !== id),
        }));
      },

      getSeasonById: (id) => {
        return get().seasons.find((item) => item.id === id);
      },

      resetSeasonStore: () => {
        set({ seasons: [] });
      },
    }),
    {
      name: "season-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
