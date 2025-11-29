import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ContractItem {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  spec?: string;
  img?: string;
  type?: string; // Phân/Thuốc/Máy móc...
}

export interface Contract {
  id: string;
  name: string;
  contractType: string; // Mua/Bán/Dịch vụ...
  summary: string;
  items: ContractItem[];
  items_vehicle: ContractItem[];
  quantity: number; // Tổng số lượng (để hiển thị ở bảng)
  unit: string;
  value: number;
  currency: string;
  status: "Đang hiệu lực" | "Đã kết thúc" | "Chờ duyệt";
  startDate: string;
  endDate: string;
  partner: string;
  fileUrl?: string;
  isAppendix: boolean;
  code: string;
}

interface ContractState {
  contracts: Contract[];
  isLoading: boolean;

  addContract: (contract: Omit<Contract, "id">) => Promise<boolean>;
  updateContract: (id: string, contract: Partial<Contract>) => Promise<boolean>;
  deleteContract: (id: string) => void;
  getContractById: (id: string) => Contract | undefined;
}

// Dữ liệu mẫu
const MOCK_DATA: Contract[] = [
  {
    id: "HD001",
    code: "HD-2024-001",
    name: "Hợp đồng thu mua sầu riêng 2024",
    contractType: "Mua hàng",
    summary: "Thu mua sản phẩm sầu riêng từ vùng trồng A",
    items: [
      {
        name: "Sầu riêng Ri6",
        category: "Nông sản",
        quantity: 5000,
        unit: "Kg",
      },
    ],
    items_vehicle: [],
    quantity: 5000,
    unit: "Kg",
    value: 250000000,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2024-07-01",
    endDate: "2024-12-31",
    partner: "Công ty Nông sản ABC",
    isAppendix: false,
  },
  {
    id: "HD002",
    code: "HD-2024-002",
    name: "Hợp đồng mua máy móc đợt 1",
    contractType: "Mua hàng",
    summary: "Mua thiết bị phục vụ sản xuất",
    items: [],
    items_vehicle: [
      { name: "Máy cày Kubota", category: "Máy móc", quantity: 2, unit: "Cái" },
    ],
    quantity: 2,
    unit: "Cái",
    value: 120000000,
    currency: "VND",
    status: "Chờ duyệt",
    startDate: "2024-08-01",
    endDate: "2024-09-30",
    partner: "Công ty Thiết bị Nông nghiệp DEF",
    isAppendix: false,
  },
];

export const useContractStore = create<ContractState>()(
  persist(
    (set, get) => ({
      contracts: MOCK_DATA,
      isLoading: false,

      getContractById: (id) => get().contracts.find((c) => c.id === id),

      addContract: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 1000)); // Giả lập delay

        const newContract: Contract = {
          ...data,
          id: `HD-${Date.now()}`, // Tự sinh ID
        };

        set((state) => ({
          contracts: [newContract, ...state.contracts],
          isLoading: false,
        }));
        return true;
      },

      updateContract: async (id, data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));

        set((state) => ({
          contracts: state.contracts.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
          isLoading: false,
        }));
        return true;
      },

      deleteContract: (id) => {
        set((state) => ({
          contracts: state.contracts.filter((c) => c.id !== id),
        }));
      },
    }),
    {
      name: "contract-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
