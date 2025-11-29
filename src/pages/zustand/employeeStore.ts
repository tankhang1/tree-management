import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface BankInfo {
  bank: string;
  accountHolder: string;
  accountNumber: string;
  branch: string;
  note: string;
}

export interface Employee {
  id: string;
  username: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  address: string;
  taxCode: string;
  avatarUrl: string; // Base64

  departments: string[]; // Phòng ban trực thuộc
  teams: string[]; // ID của các nhóm tham gia

  banks: BankInfo[];

  // Các trường bổ sung cho hiển thị danh sách
  role: string;
  level: string;
  status: string;
  manager?: string;
  birthDate?: string; // ISO Date string

  createdAt: string;
}

interface EmployeeState {
  employees: Employee[];
  isLoading: boolean;
  addEmployee: (data: Omit<Employee, "id" | "createdAt">) => Promise<boolean>;
  deleteEmployee: (id: string) => void;
}

// Dữ liệu mẫu ban đầu
const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "EMP001",
    username: "nguyenvana",
    fullName: "Nguyễn Văn A",
    phone: "0912345678",
    province: "TP.HCM",
    district: "Quận 1",
    address: "123 Lê Lợi",
    taxCode: "123456789",
    avatarUrl:
      "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png",
    departments: ["Phòng Kỹ thuật"],
    teams: ["GR001"],
    banks: [
      {
        bank: "Vietcombank",
        accountHolder: "Nguyen Van A",
        accountNumber: "007100123456",
        branch: "CN Sài Gòn",
        note: "",
      },
    ],
    role: "Kỹ sư canh tác",
    level: "Trưởng nhóm",
    status: "active",
    manager: "Lê Thị B",
    birthDate: "1990-05-10",
    createdAt: "2024-10-01T12:00:00.000Z",
  },

  {
    id: "EMP002",
    username: "phamthib",
    fullName: "Phạm Thị B",
    phone: "0938123456",
    province: "Hà Nội",
    district: "Cầu Giấy",
    address: "456 Xuân Thủy",
    taxCode: "987654321",
    avatarUrl:
      "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png",
    departments: ["Phòng Nghiên cứu"],
    teams: ["GR002"],
    banks: [],
    role: "Giám sát hiện trường",
    level: "Nhân viên",
    status: "probation",
    manager: "Nguyễn Văn A",
    birthDate: "1995-11-20",
    createdAt: "2024-09-05T09:30:00.000Z",
  },

  {
    id: "EMP003",
    username: "tranminhc",
    fullName: "Trần Minh C",
    phone: "0902456789",
    province: "Đồng Nai",
    district: "Long Thành",
    address: "Ấp 3, Long Thành",
    taxCode: "5566778899",
    avatarUrl:
      "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png",
    departments: ["Phòng Vật tư"],
    teams: ["GR003"],
    banks: [
      {
        bank: "Agribank",
        accountHolder: "Tran Minh C",
        accountNumber: "160020556677",
        branch: "CN Long Thành",
        note: "",
      },
    ],
    role: "Nhân viên kho",
    level: "Nhân viên",
    status: "active",
    manager: "Nguyễn Văn A",
    birthDate: "1988-03-12",
    createdAt: "2024-11-10T14:00:00.000Z",
  },

  {
    id: "EMP004",
    username: "ledthao",
    fullName: "Lê Duy Thảo",
    phone: "0933445566",
    province: "An Giang",
    district: "Chợ Mới",
    address: "Ấp Long Kiến",
    taxCode: "",
    avatarUrl:
      "https://cdn.iconscout.com/icon/free/png-256/free-avatar-icon-svg-download-png-456322.png",
    departments: ["Phòng Kho vận"],
    teams: ["GR004"],
    banks: [],
    role: "Tài xế vận chuyển",
    level: "Nhân viên",
    status: "active",
    manager: "Trần Minh C",
    birthDate: "1992-08-08",
    createdAt: "2024-08-25T10:20:00.000Z",
  },

  {
    id: "EMP005",
    username: "hoangmy",
    fullName: "Hoàng Mỹ",
    phone: "0977223344",
    province: "Cần Thơ",
    district: "Ninh Kiều",
    address: "Đường 30/4",
    taxCode: "9988776655",
    avatarUrl:
      "https://cdn.iconscout.com/icon/free/png-256/free-avatar-icon-svg-download-png-456322.png",
    departments: ["Phòng Nhân sự"],
    teams: [],
    banks: [],
    role: "Chuyên viên nhân sự",
    level: "Chuyên viên",
    status: "active",
    manager: "Nguyễn Văn A",
    birthDate: "1996-09-18",
    createdAt: "2024-10-18T08:50:00.000Z",
  },

  {
    id: "EMP006",
    username: "vuphuong",
    fullName: "Vũ Quốc Phương",
    phone: "0911223344",
    province: "Long An",
    district: "Tân An",
    address: "Quốc lộ 1A",
    taxCode: "",
    avatarUrl:
      "https://img.freepik.com/vector-mien-phi/hinh-minh-hoa-chang-trai-tre-mim-cuoi_1308-173524.jpg?semt=ais_hybrid&w=740&q=80",
    departments: ["Phòng Kỹ thuật"],
    teams: ["GR001"],
    banks: [
      {
        bank: "BIDV",
        accountHolder: "Vu Quoc Phuong",
        accountNumber: "123456789012",
        branch: "CN Long An",
        note: "",
      },
    ],
    role: "Kỹ thuật viên",
    level: "Nhân viên",
    status: "active",
    manager: "Nguyễn Văn A",
    birthDate: "1991-01-11",
    createdAt: "2024-12-02T13:00:00.000Z",
  },

  {
    id: "EMP007",
    username: "dangquynh",
    fullName: "Đặng Quỳnh",
    phone: "0988112233",
    province: "Bình Dương",
    district: "Thuận An",
    address: "Hòa Lợi",
    taxCode: "",
    avatarUrl:
      "https://img.freepik.com/vector-mien-phi/hinh-minh-hoa-chang-trai-tre-mim-cuoi_1308-173524.jpg?semt=ais_hybrid&w=740&q=80",
    departments: ["Phòng QC"],
    teams: [],
    banks: [],
    role: "Nhân viên kiểm định",
    level: "Nhân viên",
    status: "active",
    manager: "Hoàng Mỹ",
    birthDate: "1997-04-14",
    createdAt: "2024-11-25T15:20:00.000Z",
  },

  {
    id: "EMP008",
    username: "ngocanh",
    fullName: "Ngọc Anh",
    phone: "0905667788",
    province: "Tiền Giang",
    district: "Châu Thành",
    address: "QL1A",
    taxCode: "",
    avatarUrl:
      "https://img.freepik.com/vector-mien-phi/hinh-minh-hoa-chang-trai-tre-mim-cuoi_1308-173524.jpg?semt=ais_hybrid&w=740&q=80",
    departments: ["Phòng Kinh doanh"],
    teams: ["GR005"],
    banks: [],
    role: "NV kinh doanh",
    level: "Chuyên viên",
    status: "active",
    manager: "Nguyễn Văn A",
    birthDate: "1994-06-19",
    createdAt: "2024-07-22T11:25:00.000Z",
  },

  {
    id: "EMP009",
    username: "minhtuan",
    fullName: "Phạm Minh Tuấn",
    phone: "0913114455",
    province: "Đắk Lắk",
    district: "Buôn Ma Thuột",
    address: "Tân Lợi",
    taxCode: "",
    avatarUrl:
      "https://img.freepik.com/vector-mien-phi/hinh-minh-hoa-chang-trai-tre-mim-cuoi_1308-173524.jpg?semt=ais_hybrid&w=740&q=80",
    departments: ["Phòng Nông nghiệp"],
    teams: ["GR006"],
    banks: [],
    role: "Kỹ sư nông nghiệp",
    level: "Chuyên viên",
    status: "inactive",
    manager: "Nguyễn Văn A",
    birthDate: "1987-12-10",
    createdAt: "2024-06-15T09:10:00.000Z",
  },

  {
    id: "EMP010",
    username: "hoangyen",
    fullName: "Hoàng Yến",
    phone: "0988001122",
    province: "Bến Tre",
    district: "Chợ Lách",
    address: "Vĩnh Bình",
    taxCode: "",
    avatarUrl:
      "https://img.freepik.com/vector-mien-phi/hinh-minh-hoa-chang-trai-tre-mim-cuoi_1308-173524.jpg?semt=ais_hybrid&w=740&q=80",
    departments: ["Phòng CNTT"],
    teams: ["GR007"],
    banks: [
      {
        bank: "Techcombank",
        accountHolder: "Hoang Yen",
        accountNumber: "19012345678901",
        branch: "CN Bến Tre",
        note: "",
      },
    ],
    role: "Frontend Developer",
    level: "Senior",
    status: "active",
    manager: "Lê Thị B",
    birthDate: "1998-02-14",
    createdAt: "2025-01-12T13:40:00.000Z",
  },
];

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set) => ({
      employees: MOCK_EMPLOYEES,
      isLoading: false,

      addEmployee: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 1000));
        const newEmp: Employee = {
          ...data,
          id: `EMP-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          employees: [newEmp, ...state.employees],
          isLoading: false,
        }));
        return true;
      },

      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter((e) => e.id !== id),
        }));
      },
    }),
    {
      name: "employee-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
