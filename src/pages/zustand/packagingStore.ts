import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface PackagingSpecification {
  id: string;
  name: string;
  packagingType: string; // Hộp, Túi, Thùng...
  conversionQuantity: number; // Số lượng quy đổi (VD: 24 lon/thùng)
  baseUnit: string; // Đơn vị tính (Lon, Cái...)
}

interface PackagingState {
  packagings: PackagingSpecification[];
  isLoading: boolean;

  addPackaging: (data: PackagingSpecification) => Promise<boolean>;
  updatePackaging: (
    id: string,
    data: Partial<PackagingSpecification>
  ) => Promise<boolean>;
  deletePackaging: (id: string) => void;
  getPackagingById: (id: string) => PackagingSpecification | undefined;
}

const MOCK_DATA: PackagingSpecification[] = [
  {
    id: "PKG001",
    name: "Thùng 24 lon",
    packagingType: "Thùng",
    conversionQuantity: 24,
    baseUnit: "Lon",
  },
  {
    id: "PKG002",
    name: "Lốc 6 chai",
    packagingType: "Lốc",
    conversionQuantity: 6,
    baseUnit: "Chai",
  },
  {
    id: "PKG003",
    name: "Bao 50kg",
    packagingType: "Bao",
    conversionQuantity: 50,
    baseUnit: "Kg",
  },
  {
    id: "PKG004",
    name: "Bao 25kg",
    packagingType: "Bao",
    conversionQuantity: 25,
    baseUnit: "Kg",
  },
  {
    id: "PKG005",
    name: "Túi 1kg",
    packagingType: "Túi",
    conversionQuantity: 1,
    baseUnit: "Kg",
  },
  {
    id: "PKG006",
    name: "Thùng 12 chai 1L",
    packagingType: "Thùng",
    conversionQuantity: 12,
    baseUnit: "Chai 1L",
  },
  {
    id: "PKG007",
    name: "Thùng 20 gói",
    packagingType: "Thùng",
    conversionQuantity: 20,
    baseUnit: "Gói",
  },
  {
    id: "PKG008",
    name: "Kiện 10 bao 25kg",
    packagingType: "Kiện",
    conversionQuantity: 10,
    baseUnit: "Bao 25kg",
  },
];

export const usePackagingStore = create<PackagingState>()(
  persist(
    (set, get) => ({
      packagings: MOCK_DATA,
      isLoading: false,

      getPackagingById: (id) => get().packagings.find((p) => p.id === id),

      addPackaging: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 500)); // Giả lập delay

        // Kiểm tra trùng ID
        if (get().packagings.some((p) => p.id === data.id)) {
          set({ isLoading: false });
          return false;
        }

        set((state) => ({
          packagings: [data, ...state.packagings],
          isLoading: false,
        }));
        return true;
      },

      updatePackaging: async (id, data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 500));

        set((state) => ({
          packagings: state.packagings.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
          isLoading: false,
        }));
        return true;
      },

      deletePackaging: (id) => {
        set((state) => ({
          packagings: state.packagings.filter((p) => p.id !== id),
        }));
      },
    }),
    {
      name: "packaging-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
