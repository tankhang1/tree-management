import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface MachineCategory {
  id: string;
  name: string;
}

interface MachineCategoryState {
  machines: MachineCategory[];
  isLoading: boolean;

  addMachine: (data: MachineCategory) => Promise<boolean>;
  updateMachine: (
    id: string,
    data: Partial<MachineCategory>
  ) => Promise<boolean>;
  deleteMachine: (id: string) => void;
  getMachineById: (id: string) => MachineCategory | undefined;
}
const MOCK_DATA: MachineCategory[] = [
  { id: "MCH01", name: "Máy cày" },
  { id: "MCH02", name: "Máy phun thuốc" },
  { id: "MCH03", name: "Máy gặt lúa" },
  { id: "MCH04", name: "Máy bay nông nghiệp (Drone)" },
  { id: "MCH05", name: "Máy xới đất" },
  { id: "MCH06", name: "Máy bơm nước" },
  { id: "MCH07", name: "Máy làm cỏ" },
  { id: "MCH08", name: "Máy gieo hạt" },
  { id: "MCH09", name: "Máy thu hoạch trái cây" },
  { id: "MCH10", name: "Máy cắt cỏ" },
  { id: "MCH11", name: "Máy băm nghiền phụ phẩm" },
  { id: "MCH12", name: "Máy đóng gói nông sản" },
];

export const useMachineCategoryStore = create<MachineCategoryState>()(
  persist(
    (set, get) => ({
      machines: MOCK_DATA,
      isLoading: false,

      getMachineById: (id) => get().machines.find((m) => m.id === id),

      addMachine: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 500));

        // Kiểm tra trùng ID
        if (get().machines.some((m) => m.id === data.id)) {
          set({ isLoading: false });
          return false;
        }

        set((state) => ({
          machines: [data, ...state.machines],
          isLoading: false,
        }));
        return true;
      },

      updateMachine: async (id, data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 500));

        set((state) => ({
          machines: state.machines.map((m) =>
            m.id === id ? { ...m, ...data } : m
          ),
          isLoading: false,
        }));
        return true;
      },

      deleteMachine: (id) => {
        set((state) => ({
          machines: state.machines.filter((m) => m.id !== id),
        }));
      },
    }),
    {
      name: "machine-category-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
