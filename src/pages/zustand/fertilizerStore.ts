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

const MOCK_DATA: Fertilizer[] = [
  {
    id: "FERT-001",
    code: "NPK-20-20-15",
    name: "Phân NPK Đầu Trâu 20-20-15",
    type: "npk",
    unit: "Kg",
    nutrientContent: "20-20-15",
    manufacturer: "Bình Điền",
    description:
      "Phân bón hỗn hợp Đầu Trâu cung cấp đầy đủ N-P-K cho đa dạng cây trồng.",
    image:
      "https://product.hstatic.net/200000681765/product/upload_9c2a297cf3d2429a9c26f7a05761425d_master.jpg",
    hashtags: ["NPK", "Đầu Trâu", "Tổng hợp"],
    suppliers: [
      {
        supplierId: "SUP-001",
        supplierName: "Công ty Phân bón Bình Điền",
        quantity: 2000,
        unit: "Kg",
        spec: "Bao 50kg",
      },
    ],
    createdAt: new Date().toISOString(),
  },

  {
    id: "FERT-002",
    code: "NPK-16-16-8",
    name: "NPK 16-16-8 Nhật",
    type: "npk",
    unit: "Kg",
    nutrientContent: "16-16-8",
    manufacturer: "Nippon Fert",
    description: "Phân hỗn hợp cân bằng cho các loại rau màu và cây ăn trái.",
    image:
      "https://product.hstatic.net/200000681765/product/upload_77840d5d84054ac28763ad89f24e4b4c_master.jpg",
    hashtags: ["NPK", "Nhật Bản", "Cao cấp"],
    suppliers: [
      {
        supplierId: "SUP-003",
        supplierName: "HTX Nông nghiệp Củ Chi",
        quantity: 500,
        unit: "Kg",
        spec: "Bao 25kg",
      },
    ],
    createdAt: new Date().toISOString(),
  },

  {
    id: "FERT-003",
    code: "HC-OMIX-01",
    name: "Phân Hữu Cơ OMIX",
    type: "organic",
    unit: "Kg",
    nutrientContent: "30% chất hữu cơ",
    manufacturer: "OMIX",
    description: "Phân hữu cơ vi sinh tăng cường độ phì nhiêu đất.",
    image:
      "https://phanbonbiolongan.com/wp-content/uploads/2018/05/huucovisinh2.jpg",
    hashtags: ["Hữu cơ", "Vi sinh", "OMIX"],
    suppliers: [
      {
        supplierId: "SUP-004",
        supplierName: "HTX Rau Sạch Đà Lạt",
        quantity: 1200,
        unit: "Kg",
        spec: "Bao 20kg",
      },
    ],
    createdAt: new Date().toISOString(),
  },

  {
    id: "FERT-004",
    code: "TE-MG-CAL",
    name: "Phân Trung – Vi Lượng TE Mix",
    type: "micro-nutrient",
    unit: "Gram",
    nutrientContent: "Mg + Ca + Zn + Bo",
    manufacturer: "AgriTech",
    description: "Cung cấp vi lượng giúp cây phục hồi và phát triển mạnh.",
    image:
      "https://product.hstatic.net/200000708159/product/beta_micro_mix__1__093bce2a2b3c40ad8665e0449b005df9_grande.png",
    hashtags: ["Vi lượng", "Trung lượng"],
    suppliers: [],
    createdAt: new Date().toISOString(),
  },

  {
    id: "FERT-005",
    code: "URE-PRILL",
    name: "Ure Hạt Trắng",
    type: "nitrogen",
    unit: "Kg",
    nutrientContent: "46% N",
    manufacturer: "PVFCCo",
    description: "Phân đạm ure hạt tròn tiêu chuẩn.",
    image:
      "https://lh3.googleusercontent.com/proxy/j7Kzi408mGf1zq8z627yr-uAmdruq6Jv9NGt64aoo8nwQQZ7xET_kHrg-x3IvG8MYZ8QD8XZcSPcKjAlBCt9zNfJ_yLLmf-Mf9e_IoV2Gm9zIT1o9G9rDG61yE8DoxajBYzgVUwGhFZTkw",
    hashtags: ["Đạm", "Ure"],
    suppliers: [
      {
        supplierId: "SUP-002",
        supplierName: "Công ty Phân bón Phú Mỹ",
        quantity: 3000,
        unit: "Kg",
        spec: "Bao 50kg",
      },
    ],
    createdAt: new Date().toISOString(),
  },

  {
    id: "FERT-006",
    code: "DAP-18-46",
    name: "DAP 18-46",
    type: "dap",
    unit: "Kg",
    nutrientContent: "18-46",
    manufacturer: "DAP - Lào Cai",
    description: "Phân DAP cho cây công nghiệp và lúa.",
    image:
      "https://biozone.vn/upload/products/phan-bon-dap-1846-han-quoc-293631007339.jpg",
    hashtags: ["DAP", "Phospho"],
    suppliers: [],
    createdAt: new Date().toISOString(),
  },

  {
    id: "FERT-007",
    code: "KCL-60",
    name: "Kali đỏ KCL 60%",
    type: "potassium",
    unit: "Kg",
    nutrientContent: "60% K₂O",
    manufacturer: "Israel Fert",
    description: "Kali dạng hạt đỏ giúp trái lớn, ngọt và chắc ruột.",
    image: "https://via.placeholder.com/150",
    hashtags: ["Kali", "KCL"],
    suppliers: [],
    createdAt: new Date().toISOString(),
  },

  {
    id: "FERT-008",
    code: "BIO-SOIL",
    name: "Phân Vi Sinh BioSoil",
    type: "bio",
    unit: "Kg",
    nutrientContent: "Vi sinh vật có lợi + 40% hữu cơ",
    manufacturer: "BioLand",
    description: "Cải tạo đất, phục hồi vi sinh vật tự nhiên.",
    image: "https://via.placeholder.com/150",
    hashtags: ["Vi sinh", "Bio"],
    suppliers: [],
    createdAt: new Date().toISOString(),
  },

  {
    id: "FERT-009",
    code: "PHOS-10",
    name: "Lân nung chảy nung chảy Văn Điển",
    type: "phosphate",
    unit: "Kg",
    nutrientContent: "15% P₂O₅",
    manufacturer: "Văn Điển",
    description: "Phân lân truyền thống dùng tốt cho cây ăn trái.",
    image: "https://via.placeholder.com/150",
    hashtags: ["Lân", "Văn Điển"],
    suppliers: [],
    createdAt: new Date().toISOString(),
  },

  {
    id: "FERT-010",
    code: "ORG-PRO",
    name: "Hữu cơ Pro-Bio 4-3-3",
    type: "organic",
    unit: "Kg",
    nutrientContent: "4-3-3",
    manufacturer: "GreenFarm",
    description: "Phân hữu cơ cao cấp tăng chất lượng đất lâu dài.",
    image: "https://via.placeholder.com/150",
    hashtags: ["Hữu cơ", "Bio", "Pro"],
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
