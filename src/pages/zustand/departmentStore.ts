import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface DepartmentState {
  departments: Department[];
  isLoading: boolean;
  addDepartment: (
    data: Omit<Department, "id" | "createdAt" | "updatedAt">
  ) => Promise<boolean>;
  updateDepartment: (id: string, data: Partial<Department>) => Promise<boolean>;
  deleteDepartment: (id: string) => void;
}

const MOCK_DATA: Department[] = [
  {
    id: "D001",
    code: "PB-KT",
    name: "Phòng Kỹ thuật",
    description: "Phụ trách kỹ thuật canh tác và máy móc",
    createdAt: "2024-06-01",
    updatedAt: "2025-01-15",
  },
  {
    id: "D002",
    code: "PB-NC",
    name: "Phòng Nghiên cứu",
    description: "Nghiên cứu giống cây trồng và phân tích đất",
    createdAt: "2024-06-10",
    updatedAt: "2025-03-10",
  },
  {
    id: "D003",
    code: "PB-VT",
    name: "Phòng Vật tư",
    description: "Quản lý phân bón, thuốc BVTV và vật tư nông nghiệp",
    createdAt: "2024-07-05",
    updatedAt: "2025-02-20",
  },
  {
    id: "D004",
    code: "PB-KD",
    name: "Phòng Kinh doanh",
    description: "Quản lý hợp đồng mua bán, khách hàng và đối tác",
    createdAt: "2024-08-01",
    updatedAt: "2025-01-02",
  },
  {
    id: "D005",
    code: "PB-TC",
    name: "Phòng Tài chính",
    description: "Quản lý dòng tiền, chi phí và quyết toán",
    createdAt: "2024-08-10",
    updatedAt: "2024-12-22",
  },
  {
    id: "D006",
    code: "PB-NS",
    name: "Phòng Nhân sự",
    description: "Quản lý nhân viên, chấm công và phân bổ lao động",
    createdAt: "2024-09-05",
    updatedAt: "2025-02-18",
  },
  {
    id: "D007",
    code: "PB-HTX",
    name: "Ban Hợp tác xã",
    description: "Điều phối sản xuất giữa doanh nghiệp và các HTX",
    createdAt: "2024-10-01",
    updatedAt: "2025-02-25",
  },
  {
    id: "D008",
    code: "PB-KHO",
    name: "Phòng Kho vận",
    description: "Quản lý kho lạnh, kho khô, vận chuyển nội bộ",
    createdAt: "2024-10-15",
    updatedAt: "2025-01-28",
  },
  {
    id: "D009",
    code: "PB-QC",
    name: "Phòng Kiểm soát chất lượng",
    description: "Quản lý tiêu chuẩn VietGAP – GlobalG.A.P – hữu cơ",
    createdAt: "2024-11-01",
    updatedAt: "2025-01-05",
  },
  {
    id: "D010",
    code: "PB-IT",
    name: "Phòng CNTT",
    description: "Quản lý hệ thống phần mềm, IoT, máy chủ và hỗ trợ kỹ thuật",
    createdAt: "2024-11-18",
    updatedAt: "2025-03-01",
  },
];

export const useDepartmentStore = create<DepartmentState>()(
  persist(
    (set) => ({
      departments: MOCK_DATA,
      isLoading: false,

      addDepartment: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));
        const newDept: Department = {
          ...data,
          id: `DEP-${Date.now()}`,
          createdAt: new Date().toLocaleDateString("vi-VN"),
          updatedAt: new Date().toLocaleDateString("vi-VN"),
        };
        set((state) => ({
          departments: [newDept, ...state.departments],
          isLoading: false,
        }));
        return true;
      },

      updateDepartment: async (id, data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));
        set((state) => ({
          departments: state.departments.map((d) =>
            d.id === id
              ? {
                  ...d,
                  ...data,
                  updatedAt: new Date().toLocaleDateString("vi-VN"),
                }
              : d
          ),
          isLoading: false,
        }));
        return true;
      },

      deleteDepartment: (id) => {
        set((state) => ({
          departments: state.departments.filter((d) => d.id !== id),
        }));
      },
    }),
    {
      name: "department-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
