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
const MOCK_DELIVERIES: DeliveryNote[] = [
  {
    id: "DLV-001",
    code: "NK-2025-001",
    type: "Import",
    partnerId: "COMP-004",
    partnerName: "Công ty Phân bón Bình Điền",

    areaId: "KV-001",
    areaName: "Khu vực A",
    warehouseName: "Kho vật tư A1",
    warehouseType: "Kho khô",

    items: [
      {
        group: "Phân bón",
        name: "NPK 16-16-8",
        quantity: 50,
        unit: "Bao",
        packing: "50kg/bao",
      },
      {
        group: "Phân bón",
        name: "Ure Phú Mỹ",
        quantity: 30,
        unit: "Bao",
        packing: "50kg/bao",
      },
    ],
    createdAt: "2025-01-10T09:00:00.000Z",
  },
  {
    id: "DLV-002",
    code: "NK-2025-002",
    type: "Import",
    partnerId: "COMP-004",
    partnerName: "Công ty Phân bón Bình Điền",

    areaId: "KV-002",
    areaName: "Khu vực B",
    warehouseName: "Kho vật tư B1",
    warehouseType: "Kho khô",

    items: [
      {
        group: "Phân bón",
        name: "DAP 18-46-0",
        quantity: 20,
        unit: "Bao",
        packing: "25kg/bao",
      },
    ],
    createdAt: "2025-01-12T08:15:00.000Z",
  },
  {
    id: "DLV-003",
    code: "XK-2025-003",
    type: "Export",
    partnerId: "COMP-002",
    partnerName: "HTX Rau Sạch Củ Chi",

    areaId: "KV-001",
    areaName: "Khu vực A",
    warehouseName: "Kho lạnh A1",
    warehouseType: "Kho lạnh",

    items: [
      {
        group: "Nông sản",
        name: "Xà lách lolo xanh",
        quantity: 800,
        unit: "Thùng",
        packing: "5kg/thùng",
      },
      {
        group: "Nông sản",
        name: "Cải bó xôi",
        quantity: 500,
        unit: "Thùng",
        packing: "4kg/thùng",
      },
    ],
    createdAt: "2025-01-15T14:00:00.000Z",
  },
  {
    id: "DLV-004",
    code: "NK-2025-004",
    type: "Import",
    partnerId: "COMP-010",
    partnerName: "FPT IS",

    areaId: "KV-003",
    areaName: "Khu vực C",
    warehouseName: "Kho máy C1",
    warehouseType: "Kho khô",

    items: [
      {
        group: "Máy móc",
        name: "Bộ cảm biến độ ẩm đất IoT",
        quantity: 10,
        unit: "Bộ",
        packing: "Hộp",
      },
      {
        group: "Máy móc",
        name: "Module gateway LoRa",
        quantity: 3,
        unit: "Cái",
        packing: "Hộp",
      },
    ],
    createdAt: "2025-01-18T10:30:00.000Z",
  },
  {
    id: "DLV-005",
    code: "XK-2025-005",
    type: "Export",
    partnerId: "COMP-008",
    partnerName: "WinMart",

    areaId: "KV-004",
    areaName: "Khu vực D",
    warehouseName: "Kho lạnh D1",
    warehouseType: "Kho lạnh",

    items: [
      {
        group: "Nông sản",
        name: "Xoài Cát Chu loại 1",
        quantity: 2000,
        unit: "Kg",
        packing: "10kg/thùng",
      },
    ],
    createdAt: "2025-01-22T07:45:00.000Z",
  },
  {
    id: "DLV-006",
    code: "NK-2025-006",
    type: "Import",
    partnerId: "COMP-006",
    partnerName: "Techcombank",

    areaId: "KV-003",
    areaName: "Khu vực C",
    warehouseName: "Kho vật tư C2",
    warehouseType: "Kho khô",

    items: [
      {
        group: "Vật tư",
        name: "Bao bì PP 25kg",
        quantity: 200,
        unit: "Cái",
        packing: "Túi",
      },
    ],
    createdAt: "2025-01-25T12:00:00.000Z",
  },
  {
    id: "DLV-007",
    code: "NK-2025-007",
    type: "Import",
    partnerId: "COMP-009",
    partnerName: "HTX Xoài Mỹ Xương",

    areaId: "KV-002",
    areaName: "Khu vực B",
    warehouseName: "Kho lạnh B2",
    warehouseType: "Kho lạnh",

    items: [
      {
        group: "Nông sản",
        name: "Xoài giống cát chu",
        quantity: 500,
        unit: "Kg",
        packing: "Thùng 10kg",
      },
    ],
    createdAt: "2025-01-28T09:20:00.000Z",
  },
  {
    id: "DLV-008",
    code: "NK-2025-008",
    type: "Import",
    partnerId: "COMP-003",
    partnerName: "Vườn Lan Ba Hùng",

    areaId: "KV-005",
    areaName: "Khu vực E",
    warehouseName: "Kho giống E1",
    warehouseType: "Kho mát",

    items: [
      {
        group: "Giống cây",
        name: "Hoa lan hồ điệp giống",
        quantity: 300,
        unit: "Chậu",
        packing: "Chậu nhựa",
      },
    ],
    createdAt: "2025-02-01T11:45:00.000Z",
  },
  {
    id: "DLV-009",
    code: "XK-2025-009",
    type: "Export",
    partnerId: "COMP-001",
    partnerName: "Công ty Cổ phần Nông Sản Việt",

    areaId: "KV-003",
    areaName: "Khu vực C",
    warehouseName: "Kho đông lạnh C1",
    warehouseType: "Kho lạnh",

    items: [
      {
        group: "Nông sản",
        name: "Sầu riêng Ri6 cấp đông",
        quantity: 1200,
        unit: "Kg",
        packing: "Túi 2kg",
      },
    ],
    createdAt: "2025-02-05T13:00:00.000Z",
  },
  {
    id: "DLV-010",
    code: "NK-2025-010",
    type: "Import",
    partnerId: "COMP-005",
    partnerName: "GHN Logistics",

    areaId: "KV-004",
    areaName: "Khu vực D",
    warehouseName: "Kho vật tư D2",
    warehouseType: "Kho khô",

    items: [
      {
        group: "Vật tư đóng gói",
        name: "Thùng carton 40x60",
        quantity: 500,
        unit: "Cái",
        packing: "Bundle 20 cái",
      },
    ],
    createdAt: "2025-02-10T08:25:00.000Z",
  },
];

export const useDeliveryStore = create<DeliveryState>()(
  persist(
    (set) => ({
      deliveries: MOCK_DELIVERIES,
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
