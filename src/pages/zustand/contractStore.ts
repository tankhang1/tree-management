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
    fileUrl: "",
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
    fileUrl: "",
    isAppendix: false,
  },
  {
    id: "HD003",
    code: "HD-2024-003",
    name: "Hợp đồng bao tiêu lúa vụ Đông Xuân",
    contractType: "Mua hàng",
    summary: "Bao tiêu lúa tươi từ HTX Lúa Sạch Đồng Tháp",
    items: [
      {
        name: "Lúa OM18",
        category: "Nông sản",
        quantity: 80000,
        unit: "Kg",
        spec: "Độ ẩm tối đa 14%",
      },
    ],
    items_vehicle: [],
    quantity: 80000,
    unit: "Kg",
    value: 960000000,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2024-11-01",
    endDate: "2025-03-31",
    partner: "HTX Lúa Sạch Đồng Tháp",
    fileUrl: "/files/contracts/HD-2024-003.pdf",
    isAppendix: false,
  },
  {
    id: "HD004",
    code: "HD-2024-004",
    name: "Hợp đồng cung cấp phân bón NPK",
    contractType: "Mua hàng",
    summary: "Mua phân bón phục vụ mùa vụ năm 2025",
    items: [
      {
        name: "Phân NPK 16-16-8",
        category: "Vật tư nông nghiệp",
        quantity: 200,
        unit: "Tấn",
        type: "Phân bón",
      },
      {
        name: "Phân Kali KCl",
        category: "Vật tư nông nghiệp",
        quantity: 50,
        unit: "Tấn",
        type: "Phân bón",
      },
    ],
    items_vehicle: [],
    quantity: 250,
    unit: "Tấn",
    value: 3100000000,
    currency: "VND",
    status: "Chờ duyệt",
    startDate: "2024-12-01",
    endDate: "2025-02-28",
    partner: "Công ty Phân bón Bình Điền",
    fileUrl: "",
    isAppendix: false,
  },
  {
    id: "HD005",
    code: "HD-2024-005",
    name: "Hợp đồng phun thuốc BVTV trọn gói",
    contractType: "Dịch vụ",
    summary: "Dịch vụ phun thuốc BVTV cho vùng trồng xoài",
    items: [
      {
        name: "Gói dịch vụ phun thuốc BVTV",
        category: "Dịch vụ",
        quantity: 120,
        unit: "Ha",
        type: "Dịch vụ đồng ruộng",
      },
    ],
    items_vehicle: [],
    quantity: 120,
    unit: "Ha",
    value: 540000000,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2024-09-15",
    endDate: "2025-09-14",
    partner: "Công ty Dịch vụ Nông nghiệp Xanh",
    fileUrl: "/files/contracts/HD-2024-005.pdf",
    isAppendix: false,
  },
  {
    id: "HD006",
    code: "HD-2024-006",
    name: "Hợp đồng thuê kho lạnh bảo quản trái cây",
    contractType: "Dịch vụ",
    summary: "Thuê kho lạnh cho trái cây xuất khẩu",
    items: [
      {
        name: "Dịch vụ thuê kho lạnh 500 pallet",
        category: "Dịch vụ kho bãi",
        quantity: 12,
        unit: "Tháng",
      },
    ],
    items_vehicle: [],
    quantity: 12,
    unit: "Tháng",
    value: 720000000,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2024-10-01",
    endDate: "2025-09-30",
    partner: "Công ty Kho lạnh Mekong",
    fileUrl: "",
    isAppendix: false,
  },
  {
    id: "PL-001",
    code: "PL-2024-001",
    name: "Phụ lục điều chỉnh giá thu mua sầu riêng",
    contractType: "Phụ lục",
    summary: "Điều chỉnh giá thu mua do biến động thị trường",
    items: [
      {
        name: "Điều chỉnh giá Sầu riêng Ri6",
        category: "Điều chỉnh giá",
        quantity: 1,
        unit: "Gói",
      },
    ],
    items_vehicle: [],
    quantity: 1,
    unit: "Gói",
    value: 0,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2024-08-15",
    endDate: "2024-12-31",
    partner: "Công ty Nông sản ABC",
    fileUrl: "/files/contracts/PL-2024-001.pdf",
    isAppendix: true,
  },
  {
    id: "HD007",
    code: "HD-2024-007",
    name: "Hợp đồng bán trái cây cho siêu thị WinMart",
    contractType: "Bán hàng",
    summary: "Cung cấp trái cây tươi cho hệ thống WinMart khu vực miền Nam",
    items: [
      {
        name: "Xoài cát chu loại 1",
        category: "Nông sản",
        quantity: 30000,
        unit: "Kg",
      },
      {
        name: "Thanh long ruột đỏ",
        category: "Nông sản",
        quantity: 20000,
        unit: "Kg",
      },
    ],
    items_vehicle: [],
    quantity: 50000,
    unit: "Kg",
    value: 1500000000,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2024-07-10",
    endDate: "2025-07-09",
    partner: "Công ty WinCommerce (WinMart)",
    fileUrl: "",
    isAppendix: false,
  },
  {
    id: "HD008",
    code: "HD-2024-008",
    name: "Hợp đồng thuê dịch vụ vận chuyển nội địa",
    contractType: "Dịch vụ",
    summary: "Vận chuyển nông sản từ vùng trồng đến kho trung tâm",
    items: [
      {
        name: "Dịch vụ vận chuyển container lạnh 40 feet",
        category: "Dịch vụ logistics",
        quantity: 60,
        unit: "Chuyến",
      },
    ],
    items_vehicle: [
      {
        name: "Xe tải lạnh 8 tấn",
        category: "Phương tiện",
        quantity: 3,
        unit: "Xe",
        type: "Xe tải lạnh",
      },
    ],
    quantity: 60,
    unit: "Chuyến",
    value: 480000000,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2024-06-01",
    endDate: "2025-05-31",
    partner: "Công ty Giao Hàng Nhanh Logistics",
    fileUrl: "",
    isAppendix: false,
  },
  {
    id: "HD009",
    code: "HD-2024-009",
    name: "Hợp đồng bảo trì máy móc nông nghiệp",
    contractType: "Dịch vụ",
    summary: "Bảo trì định kỳ máy cày, máy gặt và hệ thống bơm tưới",
    items: [
      {
        name: "Gói bảo trì máy cày",
        category: "Dịch vụ kỹ thuật",
        quantity: 6,
        unit: "Lần/năm",
      },
      {
        name: "Gói bảo trì máy gặt",
        category: "Dịch vụ kỹ thuật",
        quantity: 6,
        unit: "Lần/năm",
      },
    ],
    items_vehicle: [],
    quantity: 12,
    unit: "Lần",
    value: 360000000,
    currency: "VND",
    status: "Chờ duyệt",
    startDate: "2024-09-01",
    endDate: "2025-08-31",
    partner: "Công ty Kubota Việt Nam",
    fileUrl: "",
    isAppendix: false,
  },
  {
    id: "HD010",
    code: "HD-2023-010",
    name: "Hợp đồng thí điểm canh tác hữu cơ",
    contractType: "Hợp tác",
    summary: "Thí điểm mô hình canh tác hữu cơ trên 20ha",
    items: [
      {
        name: "Gói hỗ trợ kỹ thuật hữu cơ",
        category: "Dịch vụ kỹ thuật",
        quantity: 20,
        unit: "Ha",
      },
    ],
    items_vehicle: [],
    quantity: 20,
    unit: "Ha",
    value: 420000000,
    currency: "VND",
    status: "Đã kết thúc",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    partner: "Tổ chức Organic Vietnam",
    fileUrl: "/files/contracts/HD-2023-010.pdf",
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
