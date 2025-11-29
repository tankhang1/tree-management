import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface PesticideType {
  id: string;
  name: string;
}

interface PesticideTypeState {
  types: PesticideType[];
  isLoading: boolean;

  addType: (data: PesticideType) => Promise<boolean>;
  updateType: (id: string, data: Partial<PesticideType>) => Promise<boolean>;
  deleteType: (id: string) => void;
  getTypeById: (id: string) => PesticideType | undefined;
}

const MOCK_DATA: PesticideType[] = [
  { id: "TYPE01", name: "Thuốc trừ sâu" },
  { id: "TYPE02", name: "Thuốc trừ bệnh" },
  { id: "TYPE03", name: "Phân bón lá" },
  { id: "TYPE04", name: "Thuốc trừ cỏ" },
  { id: "TYPE05", name: "Chế phẩm sinh học" },
  { id: "TYPE06", name: "Thuốc trừ nấm" },
  { id: "TYPE07", name: "Thuốc trừ tuyến trùng" },
  { id: "TYPE08", name: "Thuốc trừ rệp – bọ trĩ" },
  { id: "TYPE09", name: "Thuốc diệt ốc" },
  { id: "TYPE10", name: "Thuốc kích thích sinh trưởng" },
  { id: "TYPE11", name: "Phân vi lượng" },
  { id: "TYPE12", name: "Phân trung lượng (Ca – Mg – S)" },
  { id: "TYPE13", name: "Phân hữu cơ – vi sinh" },
  { id: "TYPE14", name: "Dung dịch dinh dưỡng thủy canh" },
  { id: "TYPE15", name: "Thuốc bảo quản sau thu hoạch" },
  { id: "TYPE16", name: "Chế phẩm cải tạo đất" },
  { id: "TYPE17", name: "Thuốc xua đuổi côn trùng" },
  { id: "TYPE18", name: "Chế phẩm kiểm soát cỏ dại" },
];

export const usePesticideTypeStore = create<PesticideTypeState>()(
  persist(
    (set, get) => ({
      types: MOCK_DATA,
      isLoading: false,

      getTypeById: (id) => get().types.find((t) => t.id === id),

      addType: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 500));

        // Tự sinh ID nếu không nhập
        if (!data.id) {
          data.id = `PT-${Math.floor(Math.random() * 10000)}`;
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
      name: "pesticide-type-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
