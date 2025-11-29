import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type SpecRow = { k: string; v: string };
export type Attachment = { name: string; href: string };

export interface TechnicalDoc {
  id: string;
  templateCode: string;
  cropName: string;
  variety: string;
  imageUrl: string;
  seasonality: string[];
  difficultyPct: number;
  tags: string[];
  quickChecklist: string[];
  specTable: SpecRow[];
  cultivationTechniques: string;
  standards: string;
  pestSolutions: string;
  author: string;
  attachments: Attachment[];
  lastUpdated: string;
}

interface TreeTechnicalDocState {
  docs: TechnicalDoc[];
  isLoading: boolean;

  addDoc: (doc: Omit<TechnicalDoc, "id" | "lastUpdated">) => Promise<boolean>;
  updateDoc: (id: string, doc: Partial<TechnicalDoc>) => Promise<boolean>;
  deleteDoc: (id: string) => void;
  getDocById: (id: string) => TechnicalDoc | undefined;
}

// Dữ liệu mẫu
const MOCK_DATA: TechnicalDoc[] = [
  {
    id: "DOC-001",
    templateCode: "TMP-01",
    cropName: "Sầu riêng",
    variety: "Ri6",
    imageUrl: "https://img.freepik.com/free-vector/tree_1308-36471.jpg",
    seasonality: ["Mùa mưa", "Mùa nắng sớm"],
    difficultyPct: 35,
    tags: ["VietGAP", "Hữu cơ"],
    quickChecklist: ["Làm đất", "Bón lót"],
    specTable: [{ k: "Mật độ", v: "6x6m" }],
    cultivationTechniques: "<p>Trồng theo mô hình VietGAP...</p>",
    standards: "<p>Tiêu chuẩn VietGAP...</p>",
    pestSolutions: "<p>Phòng trừ rầy nâu...</p>",
    author: "AgriLab Team",
    attachments: [{ name: "Quy trình.pdf", href: "#" }],
    lastUpdated: new Date().toISOString(),
  },
];

// --- ĐỔI TÊN HOOK TẠI ĐÂY ---
export const useTreeTechnicalDocStore = create<TreeTechnicalDocState>()(
  persist(
    (set, get) => ({
      docs: MOCK_DATA,
      isLoading: false,

      getDocById: (id) => get().docs.find((d) => d.id === id),

      addDoc: async (docData) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));

        const newDoc: TechnicalDoc = {
          ...docData,
          id: `DOC-${Date.now()}`,
          lastUpdated: new Date().toISOString(),
        };

        set((state) => ({
          docs: [newDoc, ...state.docs],
          isLoading: false,
        }));
        return true;
      },

      updateDoc: async (id, docData) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));

        set((state) => ({
          docs: state.docs.map((d) =>
            d.id === id
              ? { ...d, ...docData, lastUpdated: new Date().toISOString() }
              : d
          ),
          isLoading: false,
        }));
        return true;
      },

      deleteDoc: (id) => {
        set((state) => ({
          docs: state.docs.filter((d) => d.id !== id),
        }));
      },
    }),
    {
      name: "tree-technical-doc-storage", // Key mới trong LocalStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
