import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface FertilizerSupplier {
  supplierId: string;
  supplierName: string;
  quantity: number;
  unit: string;
  spec: string;
}

export interface Fertilizer {
  id: string;
  code: string;
  name: string;
  type: string;
  unit: string;
  nutrientContent: string; // Hàm lượng dinh dưỡng
  manufacturer: string;
  description: string;
  image: string; // Base64
  hashtags: string[];
  suppliers: FertilizerSupplier[];
  createdAt: string;
}

interface FertilizerState {
  fertilizers: Fertilizer[];
  isLoading: boolean;
  addFertilizer: (data: Omit<Fertilizer, "createdAt">) => Promise<boolean>;
  deleteFertilizer: (id: string) => void;
}

// Dữ liệu mẫu
const MOCK_DATA: Fertilizer[] = [
  {
    id: "FERT-001",
    code: "FERT-001",
    name: "Phân NPK Đầu Trâu",
    unit: "",
    type: "npk",
    nutrientContent: "20-20-15",
    manufacturer: "Bình Điền",
    description: "Phân bón hỗn hợp NPK",
    image: "",
    hashtags: [],
    suppliers: [],
    createdAt: new Date().toISOString(),
  },
];

export const useFertilizerStore = create<FertilizerState>()(
  persist(
    (set) => ({
      fertilizers: MOCK_DATA,
      isLoading: false,

      addFertilizer: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 1000));
        set((state) => ({
          fertilizers: [
            { ...data, createdAt: new Date().toISOString() },
            ...state.fertilizers,
          ],
          isLoading: false,
        }));
        return true;
      },

      deleteFertilizer: (id) => {
        set((state) => ({
          fertilizers: state.fertilizers.filter((f) => f.id !== id),
        }));
      },
    }),
    {
      name: "fertilizer-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
