import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Position {
  id: string;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface PositionState {
  positions: Position[];
  isLoading: boolean;
  addPosition: (
    data: Omit<Position, "id" | "createdAt" | "updatedAt">
  ) => Promise<boolean>;
  updatePosition: (id: string, data: Partial<Position>) => Promise<boolean>;
  deletePosition: (id: string) => void;
}

const MOCK_DATA: Position[] = [
  {
    id: "POS001",
    code: "MKT-SEN",
    name: "Marketing Senior",
    description: "Phụ trách quảng bá và thương hiệu",
    createdAt: "2024-06-01",
    updatedAt: "2025-01-15",
  },
  {
    id: "POS002",
    code: "DEV-FE",
    name: "Frontend Developer",
    description: "Phát triển giao diện người dùng",
    createdAt: "2024-06-15",
    updatedAt: "2025-02-20",
  },
];

export const usePositionStore = create<PositionState>()(
  persist(
    (set) => ({
      positions: MOCK_DATA,
      isLoading: false,

      addPosition: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800)); // Giả lập delay

        const newPos: Position = {
          ...data,
          id: `POS-${Date.now()}`,
          createdAt: new Date().toLocaleDateString("vi-VN"),
          updatedAt: new Date().toLocaleDateString("vi-VN"),
        };

        set((state) => ({
          positions: [newPos, ...state.positions],
          isLoading: false,
        }));
        return true;
      },

      updatePosition: async (id, data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));

        set((state) => ({
          positions: state.positions.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...data,
                  updatedAt: new Date().toLocaleDateString("vi-VN"),
                }
              : p
          ),
          isLoading: false,
        }));
        return true;
      },

      deletePosition: (id) => {
        set((state) => ({
          positions: state.positions.filter((p) => p.id !== id),
        }));
      },
    }),
    {
      name: "position-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
