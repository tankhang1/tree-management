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
const MOCK_DATA: Supply[] = [
  {
    id: "SUP002",
    code: "VT-TƯỚI-001",
    name: "Ống tưới nhỏ giọt 16mm",
    type: "irrigation",
    note: "Ống PE tiêu chuẩn Israel",
    image:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/369/736/products/ong-nhua-ldp-200-kieu-farm-01.jpg?v=1670576192847",
    hashtags: ["Tưới nhỏ giọt", "Ống PE"],
    suppliers: [
      {
        supplierId: "COMP-010",
        supplierName: "FPT Industrial Supply",
        quantity: 1500,
        unit: "m",
        spec: "Cuộn 200m",
      },
    ],
    createdAt: new Date().toISOString(),
  },

  {
    id: "SUP003",
    code: "VT-NHÃN-001",
    name: "Nhãn trái cây chống nước",
    type: "packaging",
    note: "Nhãn in QR truy xuất nguồn gốc",
    image:
      "https://image.made-in-china.com/202f0j00rQFbTAEMVzut/Customized-Waterproof-Vinyl-Label-Sticker-Plastic-Bottle-Packaging-Self-Adhesive-Label-for-Juice-Beverage-Water-Drink-Sticker-Label-Food-Label.webp",
    hashtags: ["Bao bì", "QR Code", "Truy xuất"],
    suppliers: [
      {
        supplierId: "COMP-001",
        supplierName: "VietFood",
        quantity: 5000,
        unit: "cái",
        spec: "Chống nước, bám dính cao",
      },
    ],
    createdAt: new Date().toISOString(),
  },

  {
    id: "SUP004",
    code: "VT-MÀNG-001",
    name: "Màng phủ nông nghiệp đen–bạc",
    type: "material",
    note: "Dùng phủ luống giữ ẩm – chống cỏ",
    image:
      "https://tropi.vn/wp-content/uploads/2018/01/M%C3%A0ng-ph%E1%BB%A7-n%C3%B4ng-nghi%E1%BB%87p-t%E1%BB%B1-h%E1%BB%A7y-sinh-h%E1%BB%8Dc-25-micron-b%E1%BA%A1c-%C4%91en-2.jpg",
    hashtags: ["Màng phủ", "Giữ ẩm", "Chống cỏ"],
    suppliers: [
      {
        supplierId: "COMP-002",
        supplierName: "HTX Củ Chi",
        quantity: 850,
        unit: "m2",
        spec: "0.12mm",
      },
    ],
    createdAt: new Date().toISOString(),
  },

  {
    id: "SUP005",
    code: "VT-DÂY-001",
    name: "Dây buộc cây PE siêu bền",
    type: "material",
    note: "Chống nắng tốt, mềm không gây xước thân",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-wx3HWA8zYAC3nfR_PMYZ1xq-QtWDNnxTZQ&s",
    hashtags: ["Dây buộc", "Vật tư trồng trọt"],
    suppliers: [
      {
        supplierId: "COMP-007",
        supplierName: "Trại Heo Tuấn Mập",
        quantity: 1200,
        unit: "cuộn",
        spec: "200m/cuộn",
      },
    ],
    createdAt: new Date().toISOString(),
  },

  {
    id: "SUP006",
    code: "VT-BAO-001",
    name: "Bao đựng phân 50kg",
    type: "packaging",
    note: "Bao PP dệt in Logo",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7BpiujfvA8-ItlRCyg9Ngirauj6qCX4sLpg&s",
    hashtags: ["Bao PP", "Bao bì"],
    suppliers: [
      {
        supplierId: "COMP-008",
        supplierName: "WinMart Supplier",
        quantity: 3000,
        unit: "bao",
        spec: "50kg",
      },
    ],
    createdAt: new Date().toISOString(),
  },
];
export const useSupplyStore = create<SupplyState>()(
  persist(
    (set) => ({
      supplies: MOCK_DATA,
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
