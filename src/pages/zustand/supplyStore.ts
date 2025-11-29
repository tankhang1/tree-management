import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface SupplySupplier {
  supplierId: string;
  supplierName: string;
  quantity: number;
  unit: string;
  spec: string;
}

export interface Supply {
  id: string;
  code: string;
  name: string;
  type: string;
  note: string;
  image: string; // Base64 string
  hashtags: string[];
  suppliers: SupplySupplier[];
  createdAt: string;
}

interface SupplyState {
  supplies: Supply[];
  isLoading: boolean;
  addSupply: (data: Omit<Supply, "createdAt">) => Promise<boolean>;
  updateSupply: (id: string, data: Partial<Supply>) => Promise<boolean>; // Đã thêm hàm này
  deleteSupply: (id: string) => void;
}

export const useSupplyStore = create<SupplyState>()(
  persist(
    (set) => ({
      supplies: [],
      isLoading: false,

      addSupply: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 1000)); // Giả lập delay
        set((state) => ({
          supplies: [
            { ...data, createdAt: new Date().toISOString() },
            ...state.supplies,
          ],
          isLoading: false,
        }));
        return true;
      },

      // Logic cập nhật vật tư
      updateSupply: async (id, data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800)); // Giả lập delay
        set((state) => ({
          supplies: state.supplies.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
          isLoading: false,
        }));
        return true;
      },

      deleteSupply: (id) => {
        set((state) => ({
          supplies: state.supplies.filter((s) => s.id !== id),
        }));
      },
    }),
    {
      name: "supply-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
