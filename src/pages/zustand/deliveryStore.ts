import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface DeliveryItem {
  group: string; // Phân bón, BVTV, Máy móc...
  name: string;
  quantity: number;
  unit: string;
  packing: string;
}

export interface DeliveryNote {
  id: string;
  code: string;
  type: "Import" | "Export"; // Nhập kho / Xuất kho (Mặc định là Nhập cho trang này)

  // Thông tin đối tác
  partnerId: string;
  partnerName: string;

  // Thông tin vị trí
  areaId: string;
  areaName: string;
  subAreaId?: string;
  subAreaName?: string;
  warehouseName: string;
  warehouseType: string; // Kho lạnh, kho khô...

  // Hàng hóa
  items: DeliveryItem[];

  createdAt: string;
}

interface DeliveryState {
  deliveries: DeliveryNote[];
  isLoading: boolean;
  addDelivery: (
    data: Omit<DeliveryNote, "id" | "createdAt">
  ) => Promise<boolean>;
  deleteDelivery: (id: string) => void;
}

export const useDeliveryStore = create<DeliveryState>()(
  persist(
    (set) => ({
      deliveries: [],
      isLoading: false,

      addDelivery: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 1000)); // Fake delay

        const newNote: DeliveryNote = {
          ...data,
          id: `DLV-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          deliveries: [newNote, ...state.deliveries],
          isLoading: false,
        }));
        return true;
      },
      deleteDelivery: (id: string) => {
        set((state) => ({
          deliveries: state.deliveries.filter((d) => d.id !== id),
        }));
      },
    }),
    {
      name: "delivery-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
