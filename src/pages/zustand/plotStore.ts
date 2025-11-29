// stores/plot-store.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { LatLngPoint } from "./regionStore";

export type PlotInfo = {
  code: string;
  name: string;
  regionId: string; // FK -> RegionEntity.id
  areaCode: string; // FK -> AreaInfo.code
  areaName: string; // display
  regionName: string; // display
  area: string; // diện tích m² (string cho đồng bộ với RegionInfo.area)
  contour: string; // mô tả đường bình độ
  elevation: number; // cao độ (m)
  gps: string; // chuỗi "lat,lng lat,lng ..."
};

export type RowInfo = {
  code: string;
  name: string;
  crop: string; // cây trồng
  seed: string; // giống/hạt giống
  treeCount: number; // số cây
  gps: string; // có thể là line hoặc dải điểm
};

export type PlotEntity = {
  id: string;
  plot: PlotInfo;
  rows: RowInfo[];
  coords: LatLngPoint[]; // polygon của lô, giống region.coords
};

type PlotState = {
  plots: PlotEntity[];
  addPlot: (plot: PlotEntity) => void;
  updatePlot: (id: string, patch: Partial<PlotEntity>) => void;
  removePlot: (id: string) => void;
};
// dummy-plots.ts

const dummyPlots: PlotEntity[] = [
  {
    id: "PLOT-001",
    plot: {
      code: "LO-AG-A1",
      name: "Lô A1",
      regionId: "REG-AG-01",
      regionName: "Vùng Trồng Đậu Nành An Giang",
      areaCode: "KV-AG01",
      areaName: "Khu vực AG01",
      area: "1500",
      contour: "Địa hình dốc nhẹ 48m → 56m",
      elevation: 52,
      gps: "10.3862,105.4351 10.3868,105.4362 10.3857,105.4367 10.3853,105.4356",
    },
    coords: [
      { lat: 10.3862, lng: 105.4351 },
      { lat: 10.3868, lng: 105.4362 },
      { lat: 10.3857, lng: 105.4367 },
      { lat: 10.3853, lng: 105.4356 },
    ],
    rows: [
      {
        code: "ROW-001-A",
        name: "Hàng A",
        crop: "Đậu nành",
        seed: "DT26",
        treeCount: 120,
        gps: "10.3863,105.4354 10.3866,105.4359",
      },
      {
        code: "ROW-001-B",
        name: "Hàng B",
        crop: "Đậu nành",
        seed: "DT26",
        treeCount: 115,
        gps: "10.3864,105.4355 10.3867,105.4360",
      },
    ],
  },

  {
    id: "PLOT-002",
    plot: {
      code: "LO-TG-B1",
      name: "Lô B1",
      regionId: "REG-TG-01",
      regionName: "Vùng Bắp Tiền Giang",
      areaCode: "KV-TG01",
      areaName: "Khu vực TG01",
      area: "2000",
      contour: "Địa hình bằng phẳng 50m",
      elevation: 50,
      gps: "10.3521,106.3562 10.3529,106.3569 10.3520,106.3576 10.3514,106.3568",
    },
    coords: [
      { lat: 10.3521, lng: 106.3562 },
      { lat: 10.3529, lng: 106.3569 },
      { lat: 10.352, lng: 106.3576 },
      { lat: 10.3514, lng: 106.3568 },
    ],
    rows: [
      {
        code: "ROW-002-A",
        name: "Hàng A",
        crop: "Bắp",
        seed: "LVN10",
        treeCount: 95,
        gps: "10.3522,106.3565 10.3527,106.3567",
      },
      {
        code: "ROW-002-B",
        name: "Hàng B",
        crop: "Bắp",
        seed: "LVN10",
        treeCount: 100,
        gps: "10.3523,106.3567 10.3528,106.3568",
      },
      {
        code: "ROW-002-C",
        name: "Hàng C",
        crop: "Bắp",
        seed: "LVN10",
        treeCount: 90,
        gps: "10.3524,106.3569 10.3529,106.3570",
      },
    ],
  },

  {
    id: "PLOT-003",
    plot: {
      code: "LO-CT-C1",
      name: "Lô C1",
      regionId: "REG-CT-01",
      regionName: "Vùng Xen Canh Cần Thơ",
      areaCode: "KV-CT01",
      areaName: "Khu vực CT01",
      area: "1800",
      contour: "Địa hình ven kênh 45m",
      elevation: 45,
      gps: "10.0105,105.7498 10.0112,105.7506 10.0103,105.7513 10.0097,105.7505",
    },
    coords: [
      { lat: 10.0105, lng: 105.7498 },
      { lat: 10.0112, lng: 105.7506 },
      { lat: 10.0103, lng: 105.7513 },
      { lat: 10.0097, lng: 105.7505 },
    ],
    rows: [
      {
        code: "ROW-003-A",
        name: "Hàng A",
        crop: "Bưởi da xanh",
        seed: "Bưởi DS1",
        treeCount: 40,
        gps: "10.0107,105.7500 10.0110,105.7504",
      },
      {
        code: "ROW-003-B",
        name: "Hàng B",
        crop: "Bưởi da xanh",
        seed: "Bưởi DS1",
        treeCount: 38,
        gps: "10.0108,105.7502 10.0111,105.7505",
      },
    ],
  },
];

export const usePlotStore = create<PlotState>()(
  persist(
    (set) => ({
      plots: dummyPlots,
      addPlot: (plot) =>
        set((state) => ({
          plots: [...state.plots, plot],
        })),
      updatePlot: (id, patch) =>
        set((state) => ({
          plots: state.plots.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      removePlot: (id) =>
        set((state) => ({
          plots: state.plots.filter((p) => p.id !== id),
        })),
    }),
    {
      name: "plot-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
