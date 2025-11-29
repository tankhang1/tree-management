import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface FertilizerType {
  id: string;
  name: string;
  nutrientContent: string;
  unit: string; // Thêm trường này để đồng bộ với Form
  description: string;
}

interface FertilizerTypeState {
  types: FertilizerType[];
  isLoading: boolean;

  addType: (data: FertilizerType) => Promise<boolean>;
  updateType: (id: string, data: Partial<FertilizerType>) => Promise<boolean>;
  deleteType: (id: string) => void;
  getTypeById: (id: string) => FertilizerType | undefined;
}

// Dữ liệu mẫu
const MOCK_DATA: FertilizerType[] = [
  {
    id: "FT001",
    name: "Phân NPK tổng hợp",
    nutrientContent: "NPK 16-16-8",
    unit: "kg",
    description: "Phù hợp cho cây ăn trái và rau màu",
  },
  {
    id: "FT002",
    name: "Phân hữu cơ vi sinh",
    nutrientContent: "Chất hữu cơ 30%",
    unit: "bao",
    description: "Tăng độ tơi xốp cho đất",
  },
];

export const useFertilizerTypeStore = create<FertilizerTypeState>()(
  persist(
    (set, get) => ({
      types: MOCK_DATA,
      isLoading: false,

      getTypeById: (id) => get().types.find((t) => t.id === id),

      addType: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 500)); // Delay giả

        // Kiểm tra trùng ID (nếu nhập tay), ở đây ta sẽ tự sinh ID nếu chưa có
        if (!data.id) {
          data.id = `FT-${Math.floor(Math.random() * 10000)}`;
        }

        set((state) => ({
          types: [data, ...state.types],
          isLoading: false,
        }));
        return true;
      },

      updateType: async (id, data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 500));

        set((state) => ({
          types: state.types.map((t) => (t.id === id ? { ...t, ...data } : t)),
          isLoading: false,
        }));
        return true;
      },

      deleteType: (id) => {
        set((state) => ({
          types: state.types.filter((t) => t.id !== id),
        }));
      },
    }),
    {
      name: "fertilizer-type-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
