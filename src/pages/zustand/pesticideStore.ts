import type { FileWithPath } from "@mantine/dropzone";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface PesticideSupplier {
  supplierId: string;
  supplierName: string;
  quantity: number;
  unit: string;
  spec: string;
}

export interface Pesticide {
  id: string;
  name: string;
  typeIds: string[]; // Danh sách mã loại thuốc
  ingredients: string;
  usage: string;
  note: string;
  image: string; // Base64
  hashtags: string[];

  // Tài liệu
  fileType: string; // '0': PDF, '1': Editor
  technicalDoc: FileWithPath | string; // Nội dung hoặc Base64 PDF

  // Nhà cung cấp
  suppliers: PesticideSupplier[];

  createdAt: string;
}

interface PesticideState {
  pesticides: Pesticide[];
  isLoading: boolean;
  addPesticide: (data: Omit<Pesticide, "createdAt">) => Promise<boolean>;
  deletePesticide: (id: string) => void;
  getPesticideById: (id: string) => Pesticide | undefined;
}

const MOCK_DATA: Pesticide[] = [
  {
    id: "TH001",
    name: "Thuốc trừ sâu sinh học Bio-X",
    typeIds: ["TYPE01"],
    ingredients: "Azadirachtin 0.15%",
    usage: "Phòng và trị sâu cuốn lá, sâu xanh, sâu đục thân",
    note: "Sử dụng vào sáng sớm hoặc chiều mát",
    image:
      "https://product.hstatic.net/200000722083/product/hinh_thuoc___41__fefe01ef5e524613a722da13c8250a50_1024x1024.png",
    hashtags: ["Sinh học", "An toàn"],
    fileType: "1",
    technicalDoc: "<p>Hướng dẫn chi tiết sử dụng Bio-X...</p>",
    suppliers: [
      {
        supplierId: "SUP001",
        supplierName: "Công ty Vật tư Nông nghiệp Bình Điền",
        quantity: 1200,
        unit: "Chai",
        spec: "Chai 500ml",
      },
    ],
    createdAt: new Date().toISOString(),
  },

  {
    id: "TH002",
    name: "Regent 800WG",
    typeIds: ["TYPE02"],
    ingredients: "Fipronil 800g/kg",
    usage: "Đặc trị rầy nâu, tuyến trùng",
    note: "Không phun khi trời sắp mưa",
    image:
      "https://shopthuocdietcontrung.com/wp-content/uploads/2023/12/regent-800wg.jpg",
    hashtags: ["Rầy nâu", "Tuyến trùng"],
    fileType: "0",
    technicalDoc: "", // PDF Base64 (để trống vì file nặng)
    suppliers: [
      {
        supplierId: "SUP002",
        supplierName: "Công ty BVTV An Sinh",
        quantity: 600,
        unit: "Gói",
        spec: "Gói 8g",
      },
    ],
    createdAt: new Date().toISOString(),
  },

  {
    id: "TH003",
    name: "Tilt Super 300EC",
    typeIds: ["TYPE03"],
    ingredients: "Propiconazole 150g/L + Fenpropidin 150g/L",
    usage: "Đặc trị bệnh đạo ôn, lem lép hạt",
    note: "Không pha chung với thuốc có tính kiềm mạnh",
    image:
      "https://www.syngenta.com.vn/sites/g/files/kgtney1261/files/styles/syngenta_large_4_3/public/media/image/2024/04/23/tilt-02.png?itok=JYANFYrK",
    hashtags: ["Đạo ôn", "Lem lép hạt"],
    fileType: "1",
    technicalDoc: "<p>Liều lượng: 15–20ml/bình 25L</p>",
    suppliers: [],
    createdAt: new Date().toISOString(),
  },

  {
    id: "TH004",
    name: "Gramoxone 20SL",
    typeIds: ["TYPE04"],
    ingredients: "Paraquat 200g/L",
    usage: "Diệt cỏ nhanh, mạnh",
    note: "Nguy hiểm – tuân thủ PPE đầy đủ",
    image:
      "https://img.lazcdn.com/g/p/3f687c49b645eaffa7073f1bb2ba2910.jpg_960x960q80.jpg_.webp",
    hashtags: ["Diệt cỏ", "Tác dụng nhanh"],
    fileType: "0",
    technicalDoc: "",
    suppliers: [
      {
        supplierId: "SUP003",
        supplierName: "Công ty Hoá chất Miền Nam",
        quantity: 300,
        unit: "Chai",
        spec: "Chai 1L",
      },
    ],
    createdAt: new Date().toISOString(),
  },

  {
    id: "TH005",
    name: "Confidor 100SL",
    typeIds: ["TYPE02"],
    ingredients: "Imidacloprid 100g/L",
    usage: "Trừ bọ trĩ, rệp sáp, rầy mềm",
    note: "Không sử dụng liên tục để tránh kháng thuốc",
    image:
      "https://shopnongnghiep.vn/wp-content/uploads/2020/07/23e6fd1f3f9f61b56aa40498909585a9.png.jpeg",
    hashtags: ["Rệp sáp", "Bọ trĩ"],
    fileType: "1",
    technicalDoc: "<p>Confidor 100SL – hướng dẫn chi tiết…</p>",
    suppliers: [],
    createdAt: new Date().toISOString(),
  },

  {
    id: "TH006",
    name: "Ridomil Gold 68WG",
    typeIds: ["TYPE03"],
    ingredients: "Metalaxyl-M 40% + Mancozeb 64%",
    usage: "Phòng trị sương mai, thối rễ, vàng lá",
    note: "Phun khi mới phát hiện bệnh",
    image:
      "https://www.syngenta.com.vn/sites/g/files/kgtney1261/files/styles/syngenta_large_4_3/public/media/image/2024/04/23/ridomilgold-2.png?itok=YZeV6s8j",
    hashtags: ["Sương mai", "Thối rễ"],
    fileType: "1",
    technicalDoc: "<p>Ridomil Gold – liều lượng & cách dùng…</p>",
    suppliers: [
      {
        supplierId: "SUP010",
        supplierName: "Công ty Nông Dược HAI",
        quantity: 950,
        unit: "Gói",
        spec: "Gói 25g",
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

export const usePesticideStore = create<PesticideState>()(
  persist(
    (set, get) => ({
      pesticides: MOCK_DATA,
      isLoading: false,

      getPesticideById: (id) => get().pesticides.find((p) => p.id === id),

      addPesticide: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 1000)); // Delay giả lập
        set((state) => ({
          pesticides: [
            { ...data, createdAt: new Date().toISOString() },
            ...state.pesticides,
          ],
          isLoading: false,
        }));
        return true;
      },

      deletePesticide: (id) => {
        set((state) => ({
          pesticides: state.pesticides.filter((p) => p.id !== id),
        }));
      },
    }),
    {
      name: "pesticide-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
