// zustand/areaSetupStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CultivationType = "region" | "area" | "plot";

export type CultivationUnitConfig = {
  id: string;
  name: string;
  farmingMethod: string | null;
  irrigationMethod: string | null;
  seedIds: string[];
};

export type CultivationSetup = {
  id: string;
  name: string;
  note: string;
  type: CultivationType;

  regionId: string;
  areaCodes: string[];
  plotCodes: string[];

  managerIds: string[];
  certificateIds: string[];

  details: Record<string, CultivationUnitConfig>;

  createdAt: string;
  updatedAt: string;
};

type AreaSetupState = {
  setups: CultivationSetup[];
  addSetup: (
    setup: Omit<CultivationSetup, "id" | "createdAt" | "updatedAt">
  ) => string;
  updateSetup: (id: string, patch: Partial<CultivationSetup>) => void;
  removeSetup: (id: string) => void;
  getSetupById: (id: string) => CultivationSetup | undefined;
  resetStore: () => void;
};
const dummySetups: CultivationSetup[] = [
  {
    id: "SETUP-AG-001",
    name: "Cấu hình đậu nành – toàn vùng An Giang",
    note: "Áp dụng chung cho toàn bộ vùng AG-DS01",
    type: "region",

    regionId: "REG-AG-01",
    areaCodes: [],
    plotCodes: [],

    managerIds: ["EMP-001", "EMP-007"],
    certificateIds: ["CERT-VG-001"],

    details: {
      "AG-DS01": {
        id: "AG-DS01",
        name: "Vùng Đậu Nành An Giang",
        farmingMethod: "Truyền thống",
        irrigationMethod: "Tưới nhỏ giọt",
        seedIds: ["SEED-DAU-01", "SEED-DAU-02"],
      },
    },

    createdAt: "2025-01-05T10:12:00Z",
    updatedAt: "2025-01-05T10:12:00Z",
  },

  {
    id: "SETUP-TG-AREA-01",
    name: "Cấu hình Bắp Tiền Giang theo từng khu",
    note: "Khu TG01 xen canh, TG02 truyền thống",
    type: "area",

    regionId: "REG-TG-01",
    areaCodes: ["KV-TG01", "KV-TG02"],
    plotCodes: [],

    managerIds: ["EMP-003"],
    certificateIds: ["CERT-GLOBALGAP-002"],

    details: {
      "KV-TG01": {
        id: "KV-TG01",
        name: "Khu vực TG01",
        farmingMethod: "Xen canh",
        irrigationMethod: "Tưới phun mưa",
        seedIds: ["SEED-BAP-01"],
      },
      "KV-TG02": {
        id: "KV-TG02",
        name: "Khu vực TG02",
        farmingMethod: "Truyền thống",
        irrigationMethod: "Tưới tràn",
        seedIds: ["SEED-BAP-02", "SEED-BAP-03"],
      },
    },

    createdAt: "2025-01-10T09:00:00Z",
    updatedAt: "2025-01-12T14:30:00Z",
  },

  {
    id: "SETUP-CT-PLOT-001",
    name: "Cấu hình lô trồng – Cần Thơ",
    note: "Thiết lập chi tiết cho từng lô",
    type: "plot",

    regionId: "REG-CT-01",
    areaCodes: ["KV-CT01", "KV-CT02"],
    plotCodes: ["PLOT-CT-001", "PLOT-CT-002", "PLOT-CT-003"],

    managerIds: ["EMP-010", "EMP-002"],
    certificateIds: ["CERT-VG-001", "CERT-ORGANIC-003"],

    details: {
      "PLOT-CT-001": {
        id: "PLOT-CT-001",
        name: "Lô CT01-1",
        farmingMethod: "Công nghệ cao",
        irrigationMethod: "Tưới nhỏ giọt",
        seedIds: ["SEED-BUOI-01"],
      },
      "PLOT-CT-002": {
        id: "PLOT-CT-002",
        name: "Lô CT01-2",
        farmingMethod: "Truyền thống",
        irrigationMethod: "Tưới tràn",
        seedIds: ["SEED-BAP-02"],
      },
      "PLOT-CT-003": {
        id: "PLOT-CT-003",
        name: "Lô CT02-1",
        farmingMethod: "Xen canh",
        irrigationMethod: "Tưới phun mưa",
        seedIds: ["SEED-BAP-01", "SEED-BAP-04"],
      },
    },

    createdAt: "2025-01-15T11:20:00Z",
    updatedAt: "2025-01-15T11:20:00Z",
  },

  {
    id: "SETUP-LA-REGION-01",
    name: "Thiết lập vùng Long An – mô hình cao",
    note: "Ứng dụng SmartFarm IoT",
    type: "region",

    regionId: "REG-LA-01",
    areaCodes: [],
    plotCodes: [],

    managerIds: ["EMP-005"],
    certificateIds: ["CERT-SMARTFARM-004"],

    details: {
      "LA-DS01": {
        id: "LA-DS01",
        name: "Vùng Long An",
        farmingMethod: "Công nghệ cao",
        irrigationMethod: "Tưới tự động",
        seedIds: ["SEED-BAP-05"],
      },
    },

    createdAt: "2025-02-01T08:00:00Z",
    updatedAt: "2025-02-01T08:00:00Z",
  },

  {
    id: "SETUP-GL-AREA-01",
    name: "Thiết lập cà phê Gia Lai",
    note: "Áp dụng cho 2 khu GL01 và GL02",
    type: "area",

    regionId: "REG-GL-01",
    areaCodes: ["KV-GL01", "KV-GL02"],
    plotCodes: [],

    managerIds: ["EMP-008"],
    certificateIds: ["CERT-COFFEE-005"],

    details: {
      "KV-GL01": {
        id: "KV-GL01",
        name: "Khu vực GL01",
        farmingMethod: "Truyền thống",
        irrigationMethod: "Tưới phun mưa",
        seedIds: ["SEED-COFFEE-01"],
      },
      "KV-GL02": {
        id: "KV-GL02",
        name: "Khu vực GL02",
        farmingMethod: "Công nghệ cao",
        irrigationMethod: "Tưới nhỏ giọt",
        seedIds: ["SEED-PEPPER-01"],
      },
    },

    createdAt: "2025-02-10T13:45:00Z",
    updatedAt: "2025-02-10T13:45:00Z",
  },

  {
    id: "SETUP-AG-PLOT-002",
    name: "Thiết lập lô đậu nành – vùng AG",
    note: "Đậu nành ngắn ngày",
    type: "plot",

    regionId: "REG-AG-01",
    areaCodes: ["KV-AG01"],
    plotCodes: ["PLOT-AG-001", "PLOT-AG-002"],

    managerIds: ["EMP-001"],
    certificateIds: ["CERT-VG-001"],

    details: {
      "PLOT-AG-001": {
        id: "PLOT-AG-001",
        name: "Lô AG-A1",
        farmingMethod: "Truyền thống",
        irrigationMethod: "Tưới tràn",
        seedIds: ["SEED-DAU-01"],
      },
      "PLOT-AG-002": {
        id: "PLOT-AG-002",
        name: "Lô AG-A2",
        farmingMethod: "Xen canh",
        irrigationMethod: "Tưới phun mưa",
        seedIds: ["SEED-DAU-03"],
      },
    },

    createdAt: "2025-02-15T09:10:00Z",
    updatedAt: "2025-02-15T09:10:00Z",
  },
];

export const useAreaSetupStore = create<AreaSetupState>()(
  persist(
    (set, get) => ({
      setups: dummySetups,

      addSetup: (payload) => {
        const id = `SETUP-${Date.now()}`;
        const now = new Date().toISOString();

        const setup: CultivationSetup = {
          id,
          createdAt: now,
          updatedAt: now,
          ...payload,
        };

        set((state) => ({
          setups: [setup, ...state.setups],
        }));

        return id;
      },

      updateSetup: (id, patch) => {
        const now = new Date().toISOString();
        set((state) => ({
          setups: state.setups.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...patch,
                  updatedAt: patch.updatedAt ?? now,
                }
              : item
          ),
        }));
      },

      removeSetup: (id) => {
        set((state) => ({
          setups: state.setups.filter((item) => item.id !== id),
        }));
      },

      getSetupById: (id) => {
        return get().setups.find((item) => item.id === id);
      },

      resetStore: () => {
        set({ setups: [] });
      },
    }),
    {
      name: "area-setup-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
