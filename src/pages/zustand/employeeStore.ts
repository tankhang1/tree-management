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
    avatarUrl: "",
    departments: ["Phòng Nông Nghiệp"],
    teams: ["GR001"],
    banks: [],
    role: "Kỹ sư canh tác",
    level: "Trưởng nhóm",
    status: "active",
    manager: "Lê Thị B",
    birthDate: "1990-05-10",
    createdAt: new Date().toISOString(),
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
    avatarUrl: "",
    departments: ["Phòng Kỹ Thuật"],
    teams: ["GR002"],
    banks: [],
    role: "Giám sát hiện trường",
    level: "Nhân viên",
    status: "probation",
    manager: "Nguyễn Văn A",
    birthDate: "1995-11-20",
    createdAt: new Date().toISOString(),
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
