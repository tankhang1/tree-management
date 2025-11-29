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

const MOCK_DATA: FertilizerType[] = [
  {
    id: "FT001",
    name: "Phân NPK tổng hợp",
    nutrientContent: "NPK 16-16-8",
    unit: "kg",
    description: "Dùng cho cây ăn trái, rau màu và cây công nghiệp.",
  },
  {
    id: "FT002",
    name: "Phân hữu cơ vi sinh",
    nutrientContent: "30% hữu cơ + vi sinh vật có lợi",
    unit: "bao",
    description: "Cải tạo đất, tăng hệ vi sinh tự nhiên.",
  },
  {
    id: "FT003",
    name: "Phân NPK cao cấp",
    nutrientContent: "NPK 20-20-15 + TE",
    unit: "kg",
    description: "Tăng trưởng mạnh, phù hợp cho giai đoạn nuôi trái.",
  },
  {
    id: "FT004",
    name: "Ure hạt trắng",
    nutrientContent: "46% N",
    unit: "kg",
    description: "Cung cấp đạm cho cây phát triển thân lá.",
  },
  {
    id: "FT005",
    name: "DAP Lào Cai",
    nutrientContent: "18-46",
    unit: "kg",
    description: "Giúp phát triển rễ, dùng cho lúa và cây công nghiệp.",
  },
  {
    id: "FT006",
    name: "Kali đỏ KCL",
    nutrientContent: "K₂O 60%",
    unit: "kg",
    description: "Giúp tăng độ ngọt, chắc trái, màu đẹp.",
  },
  {
    id: "FT007",
    name: "Phân lân nung chảy",
    nutrientContent: "P₂O₅ 15%",
    unit: "kg",
    description: "Bổ sung lân, cải thiện độ pH, dùng tốt cho cây ăn trái.",
  },
  {
    id: "FT008",
    name: "Phân bón lá vi lượng",
    nutrientContent: "Zn + Bo + Mg + TE",
    unit: "chai",
    description: "Kích thích ra hoa, đậu trái tốt.",
  },
  {
    id: "FT009",
    name: "Phân hữu cơ khoáng",
    nutrientContent: "4-3-3 + hữu cơ 50%",
    unit: "bao",
    description: "Cung cấp dinh dưỡng chậm, bền, tăng chất lượng đất.",
  },
  {
    id: "FT010",
    name: "Phân cải tạo đất",
    nutrientContent: "Humic + Fulvic + Ca",
    unit: "kg",
    description: "Cải thiện cấu trúc đất, tăng khả năng giữ nước.",
  },
  {
    id: "FT011",
    name: "Phân vi sinh cố định đạm",
    nutrientContent: "Vi sinh Rhizobium",
    unit: "kg",
    description: "Hỗ trợ cây họ đậu cố định đạm tự nhiên.",
  },
  {
    id: "FT012",
    name: "Phân trung lượng Ca-Mg-S",
    nutrientContent: "Ca 20% + Mg 10% + S 12%",
    unit: "kg",
    description:
      "Ngăn ngừa nứt trái, tăng cứng cây và khả năng hấp thu dinh dưỡng.",
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
