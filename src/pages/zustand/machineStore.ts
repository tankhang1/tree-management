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

const MOCK_DATA: Machine[] = [
  {
    id: "MC001",
    name: "Xe tải Hino 5 tấn",
    type: "Xe tải",
    status: "Đang vận hành",
    price: 780000000,
    quantity: 1,
    hashtags: ["Xe mới", "Vận chuyển"],
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
    warrantyExpiry: "2025-01-01",
    insurancePolicy: "PVI-TRUCK-001",
    insuranceExpiry: "2024-12-31",
    ownerUnit: "Kho A",
    location: "Bãi xe 1",
    gpsTrackerId: "GPS-001",
    specs:
      "<ul><li>Tải trọng: 5 tấn</li><li>Động cơ: Diesel Euro 4</li><li>Thùng mui bạt</li></ul>",
    maintenanceRecords: [
      {
        id: "MT001",
        date: "2023-02-10",
        description: "Thay nhớt động cơ",
        performedBy: "Garage A",
        status: "Hoàn thành",
        cost: 1500000,
        parts: ["Nhớt", "Lọc nhớt"],
      },
      {
        id: "MT002",
        date: "2024-03-05",
        description: "Bảo dưỡng định kỳ 20.000km",
        performedBy: "Garage A",
        status: "Hoàn thành",
        cost: 3200000,
        parts: ["Nhớt", "Lọc gió", "Lọc nhiên liệu"],
      },
    ],
  },
  {
    id: "MC002",
    name: "Máy cày Kubota 35HP",
    type: "Máy cày",
    status: "Đang bảo trì",
    price: 350000000,
    quantity: 2,
    hashtags: ["Máy cày", "Đầu tư 2023"],
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhfoh0oDub7AiDZVuEICe1s9saotpjx4CFJw&s",
    manualFile: "",
    inspectionFile: "",
    brand: "Kubota",
    model: "L3408",
    modelYear: 2021,
    plate: "61A-567.89",
    vin: "KBTL3408-0001",
    fuelType: "Diesel",
    fuelConsumption: "5L/giờ",
    odoHours: 1200,
    purchaseDate: "2021-09-15",
    warrantyExpiry: "2024-09-15",
    insurancePolicy: "",
    insuranceExpiry: "",
    ownerUnit: "Tổ cơ giới 1",
    location: "Nhà kho cơ giới",
    gpsTrackerId: "GPS-TRAC-01",
    specs:
      "<ul><li>Công suất: 35HP</li><li>Dẫn động: 4WD</li><li>Phù hợp canh tác lúa và màu</li></ul>",
    maintenanceRecords: [
      {
        id: "MT003",
        date: "2024-01-20",
        description: "Thay lọc nhớt, lọc gió",
        performedBy: "Xưởng cơ khí nội bộ",
        status: "Hoàn thành",
        cost: 900000,
        parts: ["Lọc nhớt", "Lọc gió"],
      },
      {
        id: "MT004",
        date: "2025-02-05",
        description: "Kiểm tra hệ thống thủy lực",
        performedBy: "Xưởng cơ khí nội bộ",
        status: "Đang xử lý",
        cost: 0,
        parts: [],
      },
    ],
  },
  {
    id: "MC003",
    name: "Máy phun thuốc tự hành DJI Agras T30",
    type: "Máy bay nông nghiệp",
    status: "Đang vận hành",
    price: 650000000,
    quantity: 1,
    hashtags: ["Drone", "Phun thuốc", "Công nghệ cao"],
    image:
      "https://sundrone.vn/storage/g0/fc/g0fcmdm26xekj0btphxh7cekmbaf_ung-dung-dji-agras-t50-1.webp",
    manualFile: "",
    inspectionFile: "",
    brand: "DJI",
    model: "Agras T30",
    modelYear: 2023,
    plate: "",
    vin: "DJI-T30-0001",
    fuelType: "Điện",
    fuelConsumption: "2 bộ pin/giờ",
    odoHours: 300,
    purchaseDate: "2023-06-01",
    warrantyExpiry: "2025-06-01",
    insurancePolicy: "PJICO-DRONE-01",
    insuranceExpiry: "2024-12-31",
    ownerUnit: "Tổ BVTV",
    location: "Kho thiết bị bay",
    gpsTrackerId: "DRONE-T30-01",
    specs:
      "<ul><li>Dung tích bình: 30L</li><li>Bề rộng phun: 9m</li><li>Tự động bay theo bản đồ</li></ul>",
    maintenanceRecords: [
      {
        id: "MT005",
        date: "2024-05-12",
        description: "Hiệu chỉnh cảm biến và cánh quạt",
        performedBy: "Trung tâm DJI Service",
        status: "Hoàn thành",
        cost: 4500000,
        parts: ["Cánh quạt", "Mỡ bôi trơn"],
      },
    ],
  },
  {
    id: "MC004",
    name: "Máy gặt đập liên hợp Yanmar",
    type: "Máy gặt",
    status: "Ngừng hoạt động",
    price: 950000000,
    quantity: 1,
    hashtags: ["Máy gặt", "Cần nâng cấp"],
    image:
      "https://lh5.googleusercontent.com/proxy/ZKRQIJqjfBAqHtW4rXRTqUR1YNslCS6k-U8gYwoFttRtJp8-BpT4GwNIJCHL3kKRg2SpKx7UeMh_RpVSMrPz5BhjslsR3yi6ogRG9dC_AJlDNCpm5gbAIi4FfsY0MVA",
    manualFile: "",
    inspectionFile: "",
    brand: "Yanmar",
    model: "AW82V",
    modelYear: 2019,
    plate: "63A-888.88",
    vin: "YNM-AW82-0003",
    fuelType: "Diesel",
    fuelConsumption: "9L/giờ",
    odoHours: 5200,
    purchaseDate: "2019-07-10",
    warrantyExpiry: "2022-07-10",
    insurancePolicy: "BIC-MCH-02",
    insuranceExpiry: "2023-07-10",
    ownerUnit: "Đội thu hoạch",
    location: "Kho B - Khu máy cũ",
    gpsTrackerId: "GPS-HARV-01",
    specs:
      "<ul><li>Năng suất: 0.3–0.5 ha/giờ</li><li>Phù hợp ruộng lúa đồng bằng</li></ul>",
    maintenanceRecords: [
      {
        id: "MT006",
        date: "2023-09-05",
        description: "Thay xích tải, kiểm tra dao cắt",
        performedBy: "Garage cơ khí B",
        status: "Hoàn thành",
        cost: 12000000,
        parts: ["Xích tải", "Dao cắt"],
      },
      {
        id: "MT007",
        date: "2024-11-01",
        description: "Đề xuất đại tu toàn bộ",
        performedBy: "Phòng Kỹ thuật",
        status: "Chờ duyệt",
        cost: 0,
        parts: [],
      },
    ],
  },
  {
    id: "MC005",
    name: "Xe nâng Toyota 3 tấn",
    type: "Xe nâng",
    status: "Đang vận hành",
    price: 420000000,
    quantity: 2,
    hashtags: ["Kho lạnh", "Bốc xếp"],
    image:
      "https://xenangnhapkhau.com/wp-content/uploads/2021/07/Xe-nang-Toyota-3-tan-FD30-2.jpg",
    manualFile: "",
    inspectionFile: "",
    brand: "Toyota",
    model: "8FD30",
    modelYear: 2020,
    plate: "51XN-456.78",
    vin: "TYT-8FD30-002",
    fuelType: "Diesel",
    fuelConsumption: "4L/giờ",
    odoHours: 2100,
    purchaseDate: "2020-03-20",
    warrantyExpiry: "2023-03-20",
    insurancePolicy: "PTI-FORK-01",
    insuranceExpiry: "2024-03-20",
    ownerUnit: "Kho thành phẩm",
    location: "Kho lạnh K1",
    gpsTrackerId: "GPS-FORK-02",
    specs:
      "<ul><li>Tải trọng nâng: 3 tấn</li><li>Chiều cao nâng: 3m</li><li>Thích hợp kho lạnh</li></ul>",
    maintenanceRecords: [
      {
        id: "MT008",
        date: "2024-02-18",
        description: "Thay vỏ bánh trước, kiểm tra thắng",
        performedBy: "Garage C",
        status: "Hoàn thành",
        cost: 6500000,
        parts: ["Vỏ trước trái", "Vỏ trước phải", "Dầu thắng"],
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
