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
