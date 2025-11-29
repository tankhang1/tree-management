import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 1. Định nghĩa lại Type cho Bảo trì
export interface MaintenanceRecord {
  id: string;
  date: string;
  description: string;
  performedBy: string;
  status: "Hoàn thành" | "Đang xử lý" | "Chờ duyệt";
  cost: number;
  parts: string[];
}

// 2. Mở rộng Type Machine (Bao gồm cả thông tin cơ bản và chi tiết)
export interface Machine {
  id: string;
  name: string;
  type: string;
  status: "Đang vận hành" | "Đang bảo trì" | "Ngừng hoạt động";
  price: number;
  quantity: number;
  hashtags: string[];
  image: string;
  manualFile: string;
  inspectionFile: string;

  // Các trường chi tiết bổ sung
  brand?: string;
  model?: string;
  modelYear?: number;
  plate?: string;
  vin?: string;
  fuelType?: "Diesel" | "Xăng" | "Điện" | "Khác";
  fuelConsumption?: string;
  odoHours?: number;
  purchaseDate?: string;
  warrantyExpiry?: string;
  insurancePolicy?: string;
  insuranceExpiry?: string;
  ownerUnit?: string;
  location?: string;
  gpsTrackerId?: string;
  specs?: string; // HTML string

  // Danh sách bảo trì
  maintenanceRecords: MaintenanceRecord[];
}

interface MachineState {
  machines: Machine[];
  isLoading: boolean;
  addMachine: (data: Machine) => Promise<boolean>;
  updateMachine: (id: string, data: Partial<Machine>) => Promise<boolean>; // Thêm hàm update
  deleteMachine: (id: string) => void;
  getMachineById: (id: string) => Machine | undefined;
}

// Dữ liệu mẫu ban đầu (Cần có ít nhất 1 máy để test trang chi tiết)
const MOCK_DATA: Machine[] = [
  {
    id: "MC001",
    name: "Xe tải Hino 5 tấn",
    type: "Xe tải",
    status: "Đang vận hành",
    price: 780000000,
    quantity: 1,
    hashtags: ["Xe mới"],
    image:
      "https://bizweb.dktcdn.net/100/021/583/products/xe-tai-hino-5-tan-xzu.jpg?v=1550043249650",
    manualFile: "",
    inspectionFile: "",
    brand: "Hino",
    model: "FC9JLTA",
    modelYear: 2022,
    plate: "51D-123.45",
    vin: "HIN000123",
    fuelType: "Diesel",
    fuelConsumption: "12L/100km",
    odoHours: 3400,
    purchaseDate: "2022-01-01",
    ownerUnit: "Kho A",
    location: "Bãi xe 1",
    gpsTrackerId: "GPS-001",
    specs: "<ul><li>Tải trọng: 5 tấn</li><li>Động cơ: Diesel Euro 4</li></ul>",
    maintenanceRecords: [
      {
        id: "MT001",
        date: "2023-02-10",
        description: "Thay nhớt",
        performedBy: "Garage A",
        status: "Hoàn thành",
        cost: 1500000,
        parts: ["Nhớt"],
      },
    ],
  },
];

export const useMachineStore = create<MachineState>()(
  persist(
    (set, get) => ({
      machines: MOCK_DATA,
      isLoading: false,

      getMachineById: (id) => get().machines.find((m) => m.id === id),

      addMachine: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 500));
        set((state) => ({
          machines: [{ ...data, maintenanceRecords: [] }, ...state.machines], // Init mảng rỗng
          isLoading: false,
        }));
        return true;
      },

      // Hàm cập nhật mới
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
      name: "machine-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
