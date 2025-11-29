import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface SubArea {
  id: string;
  name?: string; // Thêm tên cho khu phụ nếu cần
  latitude: number;
  longitude: number;
  area: number;
  note?: string;
}

export interface Area {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  area: number;
  note?: string;
  subAreas: SubArea[];
}

interface StockAreaState {
  areas: Area[];
  isLoading: boolean;
  addArea: (data: Area) => Promise<boolean>;
  updateArea: (id: string, data: Partial<Area>) => Promise<boolean>;
  deleteArea: (id: string) => void;
  getAreaById: (id: string) => Area | undefined;
}

// Dữ liệu mẫu
const MOCK_DATA: Area[] = [
  {
    id: "KV001",
    name: "Khu vực A",
    latitude: 10.762622,
    longitude: 106.660172,
    area: 1200,
    note: "Khu vực gần hồ nước",
    subAreas: [
      {
        id: "KV001-1",
        latitude: 10.7627,
        longitude: 106.6601,
        area: 400,
        note: "Phân khu phía đông",
      },
      {
        id: "KV001-2",
        latitude: 10.7629,
        longitude: 106.6602,
        area: 800,
        note: "Phân khu phía tây",
      },
    ],
  },
  {
    id: "KV002",
    name: "Khu vực B",
    latitude: 10.776889,
    longitude: 106.700806,
    area: 900,
    note: "Không phân chia",
    subAreas: [],
  },
];

export const useStockAreaStore = create<StockAreaState>()(
  persist(
    (set, get) => ({
      areas: MOCK_DATA,
      isLoading: false,

      getAreaById: (id) => get().areas.find((a) => a.id === id),

      addArea: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 500));
        set((state) => ({
          areas: [...state.areas, data],
          isLoading: false,
        }));
        return true;
      },

      updateArea: async (id, data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 500));
        set((state) => ({
          areas: state.areas.map((a) => (a.id === id ? { ...a, ...data } : a)),
          isLoading: false,
        }));
        return true;
      },

      deleteArea: (id) => {
        set((state) => ({
          areas: state.areas.filter((a) => a.id !== id),
        }));
      },
    }),
    {
      name: "stock-area-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
