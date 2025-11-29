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

// Dữ liệu mẫu
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
