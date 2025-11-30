// stores/region-store.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Certificate } from "./certificateStore";

export type LatLngPoint = { lat: number; lng: number };

export type RegionInfo = {
  codeSystem: string;
  codeGov: string;
  name: string;
  companyIds: string[];
  area: string;
  soilType: string;
  terrain: string[];
  gps: string;
  note: string;
  province: string;
  address: string;
  ward: string;
};

export type AreaInfo = {
  code: string;
  name: string;
  regionRef: string;
  orgUnit: string;
  area: string;
  soilType: string;
  terrain: string[];
  mainCrop: string;
  gps: string;
};

export type RegionEntity = {
  id: string;
  region: RegionInfo;
  areas: AreaInfo[];
  coords: LatLngPoint[];
};

type RegionState = {
  regions: RegionEntity[];
  addRegion: (region: RegionEntity) => void;
  updateRegion: (id: string, patch: Partial<RegionEntity>) => void;
  removeRegion: (id: string) => void;
};

const dummyRegions: RegionEntity[] = [
  {
    id: "REG-AG-01",
    region: {
      codeSystem: "AG-DS01",
      codeGov: "QG-AG-001",
      name: "Vùng Đậu Nành An Giang",
      companyIds: ["CPN-001"],
      area: "45000",
      soilType: "Đất phù sa",
      terrain: ["Bằng phẳng", "Ven sông"],
      gps: "10.3862,105.4351 10.3880,105.4364 10.3870,105.4380 10.3855,105.4360",
      note: "Khu vực trồng đậu nành lớn nhất miền Tây.",
      province: "An Giang",
      address: "Xã Vĩnh Thạnh Trung",
      ward: "Vĩnh Thạnh",
    },
    coords: [
      { lat: 10.3862, lng: 105.4351 },
      { lat: 10.388, lng: 105.4364 },
      { lat: 10.387, lng: 105.438 },
      { lat: 10.3855, lng: 105.436 },
    ],
    areas: [
      {
        code: "KV-AG01",
        name: "Khu vực A1",
        regionRef: "REG-AG-01",
        orgUnit: "HTX Vàm Nao",
        area: "15000",
        soilType: "Đất phù sa",
        terrain: ["Bằng phẳng"],
        mainCrop: "Đậu nành",
        gps: "10.3862,105.4351 10.3868,105.4362 10.3857,105.4367 10.3853,105.4356",
      },
      {
        code: "KV-AG02",
        name: "Khu vực A2",
        regionRef: "REG-AG-01",
        orgUnit: "Hộ ông Nguyễn Văn X",
        area: "12000",
        soilType: "Đất phù sa",
        terrain: ["Ven sông"],
        mainCrop: "Đậu nành",
        gps: "10.3870,105.4358 10.3879,105.4371 10.3868,105.4378 10.3860,105.4366",
      },
    ],
  },

  {
    id: "REG-TG-01",
    region: {
      codeSystem: "TG-DS01",
      codeGov: "QG-TG-001",
      name: "Vùng Bắp Tiền Giang",
      companyIds: ["CPN-002"],
      area: "38000",
      soilType: "Đất phù sa",
      terrain: ["Bằng phẳng"],
      gps: "10.3521,106.3562 10.3535,106.3578 10.3525,106.3585 10.3514,106.3570",
      note: "Vùng trồng bắp lớn, dễ cơ giới hóa.",
      province: "Tiền Giang",
      address: "Xã Trung An",
      ward: "Trung An",
    },
    coords: [
      { lat: 10.3521, lng: 106.3562 },
      { lat: 10.3535, lng: 106.3578 },
      { lat: 10.3525, lng: 106.3585 },
      { lat: 10.3514, lng: 106.357 },
    ],
    areas: [
      {
        code: "KV-TG01",
        name: "Khu vực TG01",
        regionRef: "REG-TG-01",
        orgUnit: "HTX Mỹ Tho",
        area: "12000",
        soilType: "Đất phù sa",
        terrain: ["Bằng phẳng"],
        mainCrop: "Bắp",
        gps: "10.3521,106.3562 10.3529,106.3569 10.3520,106.3576 10.3514,106.3568",
      },
      {
        code: "KV-TG02",
        name: "Khu vực TG02",
        regionRef: "REG-TG-01",
        orgUnit: "Hộ ông Trần Văn H",
        area: "10000",
        soilType: "Đất phù sa",
        terrain: ["Trũng nhẹ"],
        mainCrop: "Bắp",
        gps: "10.3531,106.3571 10.3538,106.3582 10.3529,106.3591 10.3520,106.3580",
      },
    ],
  },

  {
    id: "REG-CT-01",
    region: {
      codeSystem: "CT-DS01",
      codeGov: "QG-CT-001",
      name: "Vùng Xen Canh Cần Thơ",
      companyIds: ["CPN-003"],
      area: "42000",
      soilType: "Đất phù sa",
      terrain: ["Ven kênh"],
      gps: "10.0105,105.7498 10.0118,105.7509 10.0109,105.7517 10.0097,105.7505",
      note: "Vùng xen canh cây ăn trái + bắp.",
      province: "Cần Thơ",
      address: "Quận Cái Răng",
      ward: "Hưng Thạnh",
    },
    coords: [
      { lat: 10.0105, lng: 105.7498 },
      { lat: 10.0118, lng: 105.7509 },
      { lat: 10.0109, lng: 105.7517 },
      { lat: 10.0097, lng: 105.7505 },
    ],
    areas: [
      {
        code: "KV-CT01",
        name: "Khu vực CT01",
        regionRef: "REG-CT-01",
        orgUnit: "Doanh nghiệp VinaFruit",
        area: "18000",
        soilType: "Đất phù sa",
        terrain: ["Ven kênh"],
        mainCrop: "Bưởi da xanh",
        gps: "10.0105,105.7498 10.0112,105.7506 10.0103,105.7513 10.0097,105.7505",
      },
      {
        code: "KV-CT02",
        name: "Khu vực CT02",
        regionRef: "REG-CT-01",
        orgUnit: "Hộ bà Nguyễn Thị L",
        area: "14000",
        soilType: "Đất phù sa",
        terrain: ["Bằng phẳng"],
        mainCrop: "Bắp",
        gps: "10.0110,105.7501 10.0117,105.7510 10.0107,105.7516 10.0100,105.7507",
      },
    ],
  },

  {
    id: "REG-LA-01",
    region: {
      codeSystem: "LA-DS01",
      codeGov: "QG-LA-001",
      name: "Vùng Long An",
      companyIds: ["CPN-004"],
      area: "51000",
      soilType: "Đất thịt nhẹ",
      terrain: ["Bằng phẳng"],
      gps: "10.7918,106.4152 10.7925,106.4161 10.7917,106.4169 10.7910,106.4160",
      note: "Vùng trồng bắp + lúa.",
      province: "Long An",
      address: "Huyện Đức Hòa",
      ward: "Hiệp Hòa",
    },
    coords: [
      { lat: 10.7918, lng: 106.4152 },
      { lat: 10.7925, lng: 106.4161 },
      { lat: 10.7917, lng: 106.4169 },
      { lat: 10.791, lng: 106.416 },
    ],
    areas: [
      {
        code: "KV-LA01",
        name: "Khu vực LA01",
        regionRef: "REG-LA-01",
        orgUnit: "HTX Đức Hòa",
        area: "25000",
        soilType: "Đất thịt nhẹ",
        terrain: ["Bằng phẳng"],
        mainCrop: "Bắp",
        gps: "10.7918,106.4152 10.7925,106.4161 10.7917,106.4169 10.7910,106.4160",
      },
    ],
  },

  {
    id: "REG-GL-01",
    region: {
      codeSystem: "GL-DS01",
      codeGov: "QG-GL-001",
      name: "Vùng Tây Nguyên",
      companyIds: ["CPN-005"],
      area: "60000",
      soilType: "Đất đỏ bazan",
      terrain: ["Thoai thoải", "Đồi thấp"],
      gps: "13.9918,107.9792 13.9926,107.9801 13.9917,107.9809 13.9910,107.9800",
      note: "Vùng trồng cà phê + hồ tiêu.",
      province: "Gia Lai",
      address: "Huyện Ia Grai",
      ward: "Ia Krai",
    },
    coords: [
      { lat: 13.9918, lng: 107.9792 },
      { lat: 13.9926, lng: 107.9801 },
      { lat: 13.9917, lng: 107.9809 },
      { lat: 13.991, lng: 107.98 },
    ],
    areas: [
      {
        code: "KV-GL01",
        name: "Khu vực GL01",
        regionRef: "REG-GL-01",
        orgUnit: "Công ty GreenFarm",
        area: "32000",
        soilType: "Đất đỏ bazan",
        terrain: ["Thoai thoải"],
        mainCrop: "Cà phê",
        gps: "13.9918,107.9792 13.9926,107.9801 13.9917,107.9809 13.9910,107.9800",
      },
      {
        code: "KV-GL02",
        name: "Khu vực GL02",
        regionRef: "REG-GL-01",
        orgUnit: "Hộ ông Rmah H’Vin",
        area: "18000",
        soilType: "Đất đỏ bazan",
        terrain: ["Đồi nhẹ"],
        mainCrop: "Hồ tiêu",
        gps: "13.9920,107.9795 13.9928,107.9803 13.9919,107.9810 13.9912,107.9802",
      },
    ],
  },
];

export const useRegionStore = create<RegionState>()(
  persist(
    (set) => ({
      regions: dummyRegions,
      addRegion: (region) =>
        set((state) => ({ regions: [region, ...state.regions] })),
      updateRegion: (id, patch) =>
        set((state) => ({
          regions: state.regions.map((r) =>
            r.id === id ? { ...r, ...patch } : r
          ),
        })),
      removeRegion: (id) =>
        set((state) => ({
          regions: state.regions.filter((r) => r.id !== id),
        })),
    }),
    { name: "region-store", storage: createJSONStorage(() => localStorage) }
  )
);
