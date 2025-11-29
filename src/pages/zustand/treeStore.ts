import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Định nghĩa cấu trúc dữ liệu cây trồng
export interface GrowthCycle {
  id: string;
  name: string; // Tên chu kỳ (Ngắn hạn/Dài hạn...)
  stages: string[]; // Các giai đoạn
  estimatedTime: number; // Thời gian (ngày)
}

export interface Tree {
  id: string;
  name: string;
  group: string; // Nhóm cây (Cây ăn trái...)
  type: string; // Loại cây (Sầu riêng...)
  variety: string; // Giống (Ri6...)
  note: string;
  imgUrl: string; // Base64 hoặc URL ảnh

  // Thông tin hạt giống (được chọn từ bước 2)
  seedCode?: string;
  seedName?: string;

  // Thu hoạch & Sinh trưởng
  harvestMethod: string;
  growthCycles: GrowthCycle[];

  // Tài liệu (Lưu tên file hoặc nội dung HTML)
  techDocType: string;
  techDocContent: string;
  standardDocType: string;
  standardDocContent: string;
  pestDocType: string;
  pestDocContent: string;
}

interface TreeState {
  trees: Tree[];
  isLoading: boolean;

  // Actions
  addTree: (data: Tree) => Promise<boolean>;
  updateTree: (id: string, data: Partial<Tree>) => Promise<boolean>;
  deleteTree: (id: string) => void;
  getTreeById: (id: string) => Tree | undefined;
}

// Dữ liệu mẫu
const MOCK_DATA: Tree[] = [
  {
    id: "TREE001",
    name: "Sầu riêng Ri6",
    group: "Cây ăn trái",
    type: "Sầu riêng",
    variety: "Ri6",
    note: "Cây đặc sản, giá trị kinh tế cao.",
    imgUrl:
      "https://happyagri.com.vn/storage/d1/um/d1um6h2dksblr96z47z69cj2cnbg_sau-rieng-ri6-(2).webp",
    seedCode: "SEED-SR-RI6",
    harvestMethod: "Thu hoạch bằng tay",
    growthCycles: [
      {
        id: "gc1",
        name: "Chu kỳ kiến thiết",
        stages: ["Gieo hạt", "Cây con"],
        estimatedTime: 1000,
      },
    ],
    techDocType: "editor",
    techDocContent: "<p>Kỹ thuật trồng sầu riêng...</p>",
    standardDocType: "file",
    standardDocContent: "tieu-chuan-vietgap.pdf",
    pestDocType: "editor",
    pestDocContent: "<p>Phòng trừ rệp sáp...</p>",
  },
];

export const useTreeStore = create<TreeState>()(
  persist(
    (set, get) => ({
      trees: MOCK_DATA,
      isLoading: false,

      getTreeById: (id) => get().trees.find((t) => t.id === id),

      addTree: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 1000)); // Giả lập delay

        set((state) => ({
          trees: [data, ...state.trees],
          isLoading: false,
        }));
        return true;
      },

      updateTree: async (id, data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));

        set((state) => ({
          trees: state.trees.map((t) => (t.id === id ? { ...t, ...data } : t)),
          isLoading: false,
        }));
        return true;
      },

      deleteTree: (id) => {
        set((state) => ({
          trees: state.trees.filter((t) => t.id !== id),
        }));
      },
    }),
    {
      name: "tree-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
