import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface GrowthStage {
  id?: string; // Optional vì khi tạo mới chưa có ID
  name: string;
  duration: number;
  conditionNote?: string;
  documentType?: string; // file | editor
  documentContent?: string;
}

export interface GrowthCycle {
  id: string;
  name: string;
  duration: number;
  varietyId: string; // Giống cây
  varietyName?: string; // Tên giống (để hiển thị)
  stages: GrowthStage[];
  createdAt: string;
}

interface GrowthCycleState {
  cycles: GrowthCycle[];
  isLoading: boolean;
  addCycle: (data: Omit<GrowthCycle, "createdAt">) => Promise<boolean>;
  deleteCycle: (id: string) => void;
  duplicateCycle: (id: string) => void; // Thêm chức năng sao chép
}

// Dữ liệu mẫu
const MOCK_DATA: GrowthCycle[] = [
  {
    id: "GC001",
    name: "Chu kỳ sinh trưởng Đậu nành DT84",
    duration: 100,
    varietyId: "VRI-SOY-DT84",
    createdAt: new Date().toISOString(),
    stages: [
      {
        id: "STG001",
        name: "Nảy mầm",
        duration: 6,
        conditionNote: "Độ ẩm đất 70–80%, gieo mật độ 35–40 cây/m²",
      },
      {
        id: "STG002",
        name: "Sinh trưởng sinh dưỡng",
        duration: 32,
        conditionNote: "Giữ ẩm ổn định, làm cỏ sớm, bón NPK cân đối",
      },
      {
        id: "STG003",
        name: "Ra hoa",
        duration: 10,
        conditionNote: "Hạn chế khô hạn, theo dõi rụng hoa do thiếu ẩm",
      },
      {
        id: "STG004",
        name: "Tạo hạt – chín",
        duration: 52,
        conditionNote: "Theo dõi rỉ sắt, sâu cuốn lá; thu khi 85–90% lá vàng",
      },
    ],
  },
  {
    id: "GC002",
    name: "Chu kỳ sinh trưởng Đậu nành ĐX11",
    duration: 95,
    varietyId: "VRI-SOY-DX11",
    createdAt: new Date().toISOString(),
    stages: [
      { id: "STG005", name: "Nảy mầm", duration: 5 },
      { id: "STG006", name: "Sinh trưởng sinh dưỡng", duration: 30 },
      { id: "STG007", name: "Ra hoa", duration: 9 },
      { id: "STG008", name: "Tạo hạt – chín", duration: 51 },
    ],
  },
];

export const useGrowthCycleStore = create<GrowthCycleState>()(
  persist(
    (set, get) => ({
      cycles: MOCK_DATA,
      isLoading: false,

      addCycle: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));

        const newCycle: GrowthCycle = {
          ...data,
          id: `GC-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          cycles: [newCycle, ...state.cycles],
          isLoading: false,
        }));
        return true;
      },

      deleteCycle: (id) => {
        set((state) => ({
          cycles: state.cycles.filter((c) => c.id !== id),
        }));
      },

      duplicateCycle: (id) => {
        const original = get().cycles.find((c) => c.id === id);
        if (!original) return;

        const copy: GrowthCycle = {
          ...original,
          id: `GC-${Date.now()}`,
          name: `${original.name} (Sao chép)`,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          cycles: [copy, ...state.cycles],
        }));
      },
    }),
    {
      name: "growth-cycle-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
