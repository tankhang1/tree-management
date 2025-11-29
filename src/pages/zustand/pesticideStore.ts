import type { FileWithPath } from "@mantine/dropzone";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface PesticideSupplier {
  supplierId: string;
  supplierName: string;
  quantity: number;
  unit: string;
  spec: string;
}

export interface Pesticide {
  id: string;
  name: string;
  typeIds: string[]; // Danh sách mã loại thuốc
  ingredients: string;
  usage: string;
  note: string;
  image: string; // Base64
  hashtags: string[];

  // Tài liệu
  fileType: string; // '0': PDF, '1': Editor
  technicalDoc: FileWithPath | string; // Nội dung hoặc Base64 PDF

  // Nhà cung cấp
  suppliers: PesticideSupplier[];

  createdAt: string;
}

interface PesticideState {
  pesticides: Pesticide[];
  isLoading: boolean;
  addPesticide: (data: Omit<Pesticide, "createdAt">) => Promise<boolean>;
  deletePesticide: (id: string) => void;
  getPesticideById: (id: string) => Pesticide | undefined;
}

// Dữ liệu mẫu
const MOCK_DATA: Pesticide[] = [
  {
    id: "TH001",
    name: "Thuốc trừ sâu sinh học Bio-X",
    typeIds: ["TYPE01"],
    ingredients: "Azadirachtin 0.15%",
    usage: "Phòng và trị sâu cuốn lá",
    note: "Sử dụng vào sáng sớm",
    image:
      "https://product.hstatic.net/200000722083/product/hinh_thuoc___41__fefe01ef5e524613a722da13c8250a50_1024x1024.png",
    hashtags: ["Sinh học"],
    fileType: "1",
    technicalDoc: "<p>Hướng dẫn chi tiết...</p>",
    suppliers: [],
    createdAt: new Date().toISOString(),
  },
];

export const usePesticideStore = create<PesticideState>()(
  persist(
    (set, get) => ({
      pesticides: MOCK_DATA,
      isLoading: false,

      getPesticideById: (id) => get().pesticides.find((p) => p.id === id),

      addPesticide: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 1000)); // Delay giả lập
        set((state) => ({
          pesticides: [
            { ...data, createdAt: new Date().toISOString() },
            ...state.pesticides,
          ],
          isLoading: false,
        }));
        return true;
      },

      deletePesticide: (id) => {
        set((state) => ({
          pesticides: state.pesticides.filter((p) => p.id !== id),
        }));
      },
    }),
    {
      name: "pesticide-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
