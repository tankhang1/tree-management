import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Định nghĩa cấu trúc dữ liệu cây trồng
export interface GrowthCycle {
  id: string;
  name: string; // Tên chu kỳ (Ngắn hạn/Dài hạn...)
  stages: string[]; // Các giai đoạn
  estimatedTime: number; // Thời gian (ngày)
}

export interface Tree {
  id: string;
  name: string;
  group: string; // Nhóm cây (Cây ăn trái...)
  type: string; // Loại cây (Sầu riêng...)
  variety: string; // Giống (Ri6...)
  note: string;
  imgUrl: string; // Base64 hoặc URL ảnh

  // Thông tin hạt giống (được chọn từ bước 2)
  seedCode?: string;
  seedName?: string;

  // Thu hoạch & Sinh trưởng
  harvestMethod: string;
  growthCycles: GrowthCycle[];

  // Tài liệu (Lưu tên file hoặc nội dung HTML)
  techDocType: string;
  techDocContent: string;
  standardDocType: string;
  standardDocContent: string;
  pestDocType: string;
  pestDocContent: string;
}

interface TreeState {
  trees: Tree[];
  isLoading: boolean;

  // Actions
  addTree: (data: Tree) => Promise<boolean>;
  updateTree: (id: string, data: Partial<Tree>) => Promise<boolean>;
  deleteTree: (id: string) => void;
  getTreeById: (id: string) => Tree | undefined;
}

const MOCK_DATA: Tree[] = [
  {
    id: "TREE001",
    name: "Sầu riêng Ri6",
    group: "Cây ăn trái",
    type: "Sầu riêng",
    variety: "Ri6",
    note: "Cây đặc sản, giá trị kinh tế cao.",
    imgUrl:
      "https://happyagri.com.vn/storage/d1/um/d1um6h2dksblr96z47z69cj2cnbg_sau-rieng-ri6-(2).webp",
    seedCode: "SEED-SR-RI6",
    seedName: "Giống sầu riêng Ri6 chuẩn",
    harvestMethod: "Thu hoạch bằng tay",
    growthCycles: [
      {
        id: "gc1",
        name: "Chu kỳ kiến thiết",
        stages: ["Gieo hạt", "Cây con", "Kiến thiết cơ bản"],
        estimatedTime: 1000,
      },
      {
        id: "gc2",
        name: "Chu kỳ kinh doanh",
        stages: ["Xử lý ra hoa", "Đậu trái", "Nuôi trái", "Thu hoạch"],
        estimatedTime: 365,
      },
    ],
    techDocType: "editor",
    techDocContent: "<p>Kỹ thuật trồng sầu riêng Ri6 trên đất đỏ bazan...</p>",
    standardDocType: "file",
    standardDocContent: "vietgap-saurieng-ri6.pdf",
    pestDocType: "editor",
    pestDocContent: "<p>Phòng trừ rệp sáp, xì mủ thân, thối trái...</p>",
  },
  {
    id: "TREE002",
    name: "Sầu riêng Dona",
    group: "Cây ăn trái",
    type: "Sầu riêng",
    variety: "Dona",
    note: "Thích hợp vùng Đông Nam Bộ, trái chín sớm.",
    imgUrl:
      "https://traicaytonyteo.com/uploads/source/sau-rieng-dona-thai-2.jpg",
    seedCode: "SEED-SR-DONA",
    seedName: "Giống sầu riêng Dona F1",
    harvestMethod: "Thu hái từng trái, dùng kéo cắt cuống",
    growthCycles: [
      {
        id: "gc1",
        name: "Giai đoạn sinh trưởng",
        stages: ["Ra đọt", "Ra hoa", "Đậu trái"],
        estimatedTime: 280,
      },
      {
        id: "gc2",
        name: "Giai đoạn nuôi trái",
        stages: ["Nuôi trái non", "Nuôi trái già", "Chuẩn bị thu hoạch"],
        estimatedTime: 120,
      },
    ],
    techDocType: "editor",
    techDocContent: "<p>Quy trình chăm sóc sầu riêng Dona theo VietGAP...</p>",
    standardDocType: "file",
    standardDocContent: "tieu-chuan-saurieng-dona.pdf",
    pestDocType: "editor",
    pestDocContent:
      "<p>Quản lý bệnh thán thư, thối trái và xì mủ trên sầu riêng Dona...</p>",
  },
  {
    id: "TREE003",
    name: "Xoài Cát Chu",
    group: "Cây ăn trái",
    type: "Xoài",
    variety: "Cát Chu",
    note: "Giống xoài đặc sản Đồng Tháp, phù hợp xuất khẩu.",
    imgUrl:
      "https://shop.annam-gourmet.com/pub/media/catalog/product/cache/ee0af4cad0f3673c5271df64bd520339/i/t/item_F168952_8570.png",
    seedCode: "SEED-XOAI-CC",
    seedName: "Xoài Cát Chu ghép",
    harvestMethod: "Thu hoạch bằng kéo, tránh dập trái",
    growthCycles: [
      {
        id: "gc1",
        name: "Chu kỳ sinh trưởng",
        stages: ["Ra đọt non", "Ra hoa", "Đậu trái"],
        estimatedTime: 210,
      },
      {
        id: "gc2",
        name: "Chu kỳ cho trái",
        stages: ["Nuôi trái", "Hoàn thiện chất lượng", "Thu hoạch"],
        estimatedTime: 90,
      },
    ],
    techDocType: "editor",
    techDocContent:
      "<p>Kỹ thuật xử lý ra hoa nghịch vụ cho xoài Cát Chu...</p>",
    standardDocType: "file",
    standardDocContent: "globalgap-xoai-cat-chu.pdf",
    pestDocType: "editor",
    pestDocContent:
      "<p>Quản lý ruồi đục trái, bệnh thán thư trên xoài Cát Chu...</p>",
  },
  {
    id: "TREE004",
    name: "Thanh long ruột đỏ",
    group: "Cây ăn trái",
    type: "Thanh long",
    variety: "Ruột đỏ",
    note: "Trái màu đỏ, dễ tiêu thụ trong nước và xuất khẩu.",
    imgUrl:
      "https://bizweb.dktcdn.net/100/390/808/products/thanh-long-600x600.jpg?v=1600505776873",
    seedCode: "SEED-TL-RD",
    seedName: "Giống thanh long ruột đỏ",
    harvestMethod: "Thu hái bằng tay, dùng kéo cắt cuống",
    growthCycles: [
      {
        id: "gc1",
        name: "Chu kỳ sinh trưởng",
        stages: ["Giâm hom", "Ra rễ", "Leo trụ"],
        estimatedTime: 365,
      },
      {
        id: "gc2",
        name: "Chu kỳ cho trái",
        stages: ["Ra nụ", "Nở hoa", "Đậu trái", "Thu hoạch"],
        estimatedTime: 120,
      },
    ],
    techDocType: "editor",
    techDocContent:
      "<p>Quy trình trồng và chăm sóc thanh long ruột đỏ theo VietGAP...</p>",
    standardDocType: "file",
    standardDocContent: "tieu-chuan-thanh-long-ruot-do.pdf",
    pestDocType: "editor",
    pestDocContent:
      "<p>Quản lý bệnh đốm nâu, thối cành và côn trùng hại trên thanh long...</p>",
  },
  {
    id: "TREE005",
    name: "Cà phê Robusta",
    group: "Cây công nghiệp",
    type: "Cà phê",
    variety: "Robusta",
    note: "Thích hợp vùng Tây Nguyên, năng suất cao.",
    imgUrl: "https://lepathcoffee.com/wp-content/uploads/3-e1625817488732.jpg",
    seedCode: "SEED-CAFE-RB",
    seedName: "Giống cà phê vối Robusta",
    harvestMethod: "Hái chọn quả chín, phơi hoặc sấy",
    growthCycles: [
      {
        id: "gc1",
        name: "Giai đoạn kiến thiết vườn",
        stages: ["Ươm giống", "Trồng mới", "Chăm sóc kiến thiết"],
        estimatedTime: 730,
      },
      {
        id: "gc2",
        name: "Giai đoạn kinh doanh",
        stages: ["Ra hoa", "Kết trái", "Chín và thu hoạch"],
        estimatedTime: 365,
      },
    ],
    techDocType: "editor",
    techDocContent:
      "<p>Quy trình canh tác cà phê Robusta bền vững, tiết kiệm nước...</p>",
    standardDocType: "file",
    standardDocContent: "4c-standards-robusta.pdf",
    pestDocType: "editor",
    pestDocContent:
      "<p>Quản lý mọt đục quả, rệp sáp rễ và tuyến trùng trên cà phê...</p>",
  },
  {
    id: "TREE006",
    name: "Lúa OM5451",
    group: "Cây lương thực",
    type: "Lúa",
    variety: "OM5451",
    note: "Giống lúa phổ biến ĐBSCL, thời gian sinh trưởng trung ngày.",
    imgUrl:
      "https://saigonvietnam.vn/wp-content/uploads/2019/05/giong-lua-om5451-1.jpg",
    seedCode: "SEED-LUA-OM5451",
    seedName: "Giống lúa OM5451 cấp xác nhận",
    harvestMethod: "Gặt máy hoặc thủ công",
    growthCycles: [
      {
        id: "gc1",
        name: "Chu kỳ sinh trưởng lúa",
        stages: ["Gieo sạ", "Đẻ nhánh", "Làm đòng", "Trổ", "Chín"],
        estimatedTime: 100,
      },
    ],
    techDocType: "editor",
    techDocContent:
      "<p>Quy trình kỹ thuật canh tác lúa OM5451 cho vùng lúa 3 vụ...</p>",
    standardDocType: "file",
    standardDocContent: "tieu-chuan-giong-lua-om5451.pdf",
    pestDocType: "editor",
    pestDocContent: "<p>Quản lý rầy nâu, đạo ôn, bạc lá trên lúa OM5451...</p>",
  },
];

export const useTreeStore = create<TreeState>()(
  persist(
    (set, get) => ({
      trees: MOCK_DATA,
      isLoading: false,

      getTreeById: (id) => get().trees.find((t) => t.id === id),

      addTree: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 1000)); // Giả lập delay

        set((state) => ({
          trees: [data, ...state.trees],
          isLoading: false,
        }));
        return true;
      },

      updateTree: async (id, data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));

        set((state) => ({
          trees: state.trees.map((t) => (t.id === id ? { ...t, ...data } : t)),
          isLoading: false,
        }));
        return true;
      },

      deleteTree: (id) => {
        set((state) => ({
          trees: state.trees.filter((t) => t.id !== id),
        }));
      },
    }),
    {
      name: "tree-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
