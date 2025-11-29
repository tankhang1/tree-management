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
const MOCK_SEASONS: Season[] = [
  {
    id: "SEASON-2025-DRAGONFRUIT",
    name: "Vụ thanh long Đông Xuân 2025",
    estimatedDuration: 150,
    cropId: "CROP-DRAGONFRUIT",
    selectedCrop: undefined,
    selectedSeed: undefined,
    selectedSeedDetails: [],
    growthCycles: [
      {
        cycleId: "CYCLE-DRAGONFRUIT-BASE",
        stageIds: ["STAGE-LAM-CANH", "STAGE-XU-LY-RA-HOA", "STAGE-THU-HOACH"],
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
  },
  {
    id: "SEASON-2025-RICE-SUMMER",
    name: "Vụ lúa Hè Thu 2025",
    estimatedDuration: 105,
    cropId: "CROP-RICE",
    selectedCrop: undefined,
    selectedSeed: undefined,
    selectedSeedDetails: [],
    growthCycles: [
      {
        cycleId: "CYCLE-RICE-3GIAI-DOAN",
        stageIds: ["STAGE-MA", "STAGE-DEM-NHÁNH", "STAGE-CHIN"],
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
  },
  {
    id: "SEASON-2025-COFFEE",
    name: "Chu kỳ cà phê 2025–2027",
    estimatedDuration: 730,
    cropId: "CROP-COFFEE",
    selectedCrop: undefined,
    selectedSeed: undefined,
    selectedSeedDetails: [],
    growthCycles: [
      {
        cycleId: "CYCLE-COFFEE-LAU-NAM",
        stageIds: [
          "STAGE-CHAM-SOC-SAU-THU-HOACH",
          "STAGE-NUOC-TUOI-MUA-KHO",
          "STAGE-RA-HOA-DO-TRAI",
        ],
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
];
export const useSeasonStore = create<SeasonStore>()(
  devtools(
    (set, get) => ({
      seasons: MOCK_SEASONS,

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
