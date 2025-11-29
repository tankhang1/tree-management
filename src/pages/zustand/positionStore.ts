import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Position {
  id: string;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface PositionState {
  positions: Position[];
  isLoading: boolean;
  addPosition: (
    data: Omit<Position, "id" | "createdAt" | "updatedAt">
  ) => Promise<boolean>;
  updatePosition: (id: string, data: Partial<Position>) => Promise<boolean>;
  deletePosition: (id: string) => void;
}

const MOCK_DATA: Position[] = [
  {
    id: "POS001",
    code: "MKT-SEN",
    name: "Marketing Senior",
    description: "Phụ trách quảng bá và thương hiệu",
    createdAt: "2024-06-01",
    updatedAt: "2025-01-15",
  },
  {
    id: "POS002",
    code: "DEV-FE",
    name: "Frontend Developer",
    description: "Phát triển giao diện người dùng",
    createdAt: "2024-06-15",
    updatedAt: "2025-02-20",
  },

  // ——— Bộ phận Nông nghiệp ———
  {
    id: "POS003",
    code: "AGR-ENG",
    name: "Kỹ sư nông nghiệp",
    description: "Phụ trách kỹ thuật canh tác và hướng dẫn nông dân",
    createdAt: "2024-07-10",
    updatedAt: "2025-01-02",
  },
  {
    id: "POS004",
    code: "AGR-QC",
    name: "Giám sát vùng trồng",
    description: "Theo dõi vùng trồng, nhật ký cây trồng, kiểm soát chất lượng",
    createdAt: "2024-04-20",
    updatedAt: "2025-03-01",
  },

  // ——— Kho / Logistics ———
  {
    id: "POS005",
    code: "LOG-MAN",
    name: "Quản lý kho",
    description: "Quản lý xuất nhập kho và tồn kho",
    createdAt: "2024-05-10",
    updatedAt: "2025-02-12",
  },
  {
    id: "POS006",
    code: "LOG-OP",
    name: "Nhân viên kho",
    description: "Thực hiện nhập hàng, xuất hàng, kiểm đếm vật tư",
    createdAt: "2024-02-15",
    updatedAt: "2025-03-11",
  },

  // ——— Nhân sự / Hành chính ———
  {
    id: "POS007",
    code: "HR-REC",
    name: "Chuyên viên tuyển dụng",
    description: "Tuyển dụng và quản trị nhân sự",
    createdAt: "2024-01-22",
    updatedAt: "2025-03-05",
  },
  {
    id: "POS008",
    code: "HR-ADM",
    name: "Nhân viên hành chính",
    description: "Hỗ trợ giấy tờ, hồ sơ và hành chính tổng hợp",
    createdAt: "2024-03-18",
    updatedAt: "2025-02-27",
  },

  // ——— Sản xuất / Máy móc ———
  {
    id: "POS009",
    code: "MECH-OP",
    name: "Thợ vận hành máy",
    description: "Vận hành máy móc: máy cày, máy phun thuốc, máy bay",
    createdAt: "2024-06-05",
    updatedAt: "2025-01-10",
  },
  {
    id: "POS010",
    code: "MECH-MNT",
    name: "Thợ bảo trì",
    description: "Bảo dưỡng và sửa chữa thiết bị",
    createdAt: "2024-08-01",
    updatedAt: "2025-02-15",
  },

  // ——— Kế toán / Tài chính ———
  {
    id: "POS011",
    code: "FIN-ACC",
    name: "Kế toán viên",
    description: "Theo dõi chứng từ, hợp đồng, thu chi",
    createdAt: "2024-02-01",
    updatedAt: "2025-03-12",
  },
  {
    id: "POS012",
    code: "FIN-CONT",
    name: "Kiểm soát viên tài chính",
    description: "Kiểm soát kế hoạch tài chính và dòng tiền",
    createdAt: "2024-05-18",
    updatedAt: "2025-03-10",
  },

  // ——— Công nghệ thông tin ———
  {
    id: "POS013",
    code: "DEV-BE",
    name: "Backend Developer",
    description: "Phát triển API và tích hợp dữ liệu",
    createdAt: "2024-04-12",
    updatedAt: "2025-03-10",
  },
  {
    id: "POS014",
    code: "QA-ENG",
    name: "QA Engineer",
    description: "Kiểm thử chức năng, hiệu năng và tự động hóa",
    createdAt: "2024-03-12",
    updatedAt: "2025-03-12",
  },
];

export const usePositionStore = create<PositionState>()(
  persist(
    (set) => ({
      positions: MOCK_DATA,
      isLoading: false,

      addPosition: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800)); // Giả lập delay

        const newPos: Position = {
          ...data,
          id: `POS-${Date.now()}`,
          createdAt: new Date().toLocaleDateString("vi-VN"),
          updatedAt: new Date().toLocaleDateString("vi-VN"),
        };

        set((state) => ({
          positions: [newPos, ...state.positions],
          isLoading: false,
        }));
        return true;
      },

      updatePosition: async (id, data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));

        set((state) => ({
          positions: state.positions.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...data,
                  updatedAt: new Date().toLocaleDateString("vi-VN"),
                }
              : p
          ),
          isLoading: false,
        }));
        return true;
      },

      deletePosition: (id) => {
        set((state) => ({
          positions: state.positions.filter((p) => p.id !== id),
        }));
      },
    }),
    {
      name: "position-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
