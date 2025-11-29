import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface StockItem {
  group: string; // Phân bón, BVTV...
  name: string;
  quantity: number;
  unit: string;
  packing: string;
  image?: string;
}

export interface StockTicket {
  id: string;
  receiptNumber: string; // Số phiếu
  invoiceNumber?: string;
  type: "nhập" | "xuất" | "hủy";
  createdDate: string;

  // Vị trí
  areaId?: string;
  subAreaId?: string;
  warehouseName: string;

  // Nhân sự
  handlerName: string;
  checkerName: string;

  // Chi tiết
  contractId?: string;
  partnerId?: string; // Nếu là mua bán
  items: StockItem[];
  note?: string;

  createdAt: string;
}

interface StockIOState {
  tickets: StockTicket[];
  isLoading: boolean;
  addTicket: (data: Omit<StockTicket, "id" | "createdAt">) => Promise<boolean>;
  deleteTicket: (id: string) => void;
}

export const useStockIOStore = create<StockIOState>()(
  persist(
    (set) => ({
      tickets: [],
      isLoading: false,

      addTicket: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 1000)); // Fake delay

        const newTicket: StockTicket = {
          ...data,
          id: `TK-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          tickets: [newTicket, ...state.tickets],
          isLoading: false,
        }));
        return true;
      },

      deleteTicket: (id) => {
        set((state) => ({
          tickets: state.tickets.filter((t) => t.id !== id),
        }));
      },
    }),
    {
      name: "stock-io-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
