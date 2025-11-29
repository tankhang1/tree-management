import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 1. Định nghĩa kiểu dữ liệu chuẩn (Gộp tất cả các trường cần thiết)
export interface Variety {
  id: string;
  name: string;
  treeName: string;
  imgUrl: string;
  description: string;

  // Các trường chi tiết (Optional vì Form thêm mới chưa có input cho các trường này)
  origin?: string;
  maturityDays?: number;
  yieldKgPerTree?: number;
  season?: string[];
  resistance?: string[];
  hashtags?: string[];
  notes?: string;
  isCertified?: boolean;
  certificationCode?: string;

  // Tài liệu
  docType: string; // 'file' | 'editor'
  docContent: string; // HTML content hoặc Tên file PDF

  // Mock data cho chi tiết
  batches?: { batch: string; mfg: string; exp: string; qty: number }[];
  related?: string[];
}

interface VarietyState {
  varieties: Variety[];
  isLoading: boolean;

  // Actions
  addVariety: (data: Variety) => Promise<boolean>;
  updateVariety: (id: string, data: Partial<Variety>) => Promise<boolean>;
  deleteVariety: (id: string) => void;
  getVarietyById: (id: string) => Variety | undefined;
}

// Helper: Dữ liệu mẫu ban đầu
const MOCK_DATA: Variety[] = [
  {
    id: "VAR001",
    name: "Sầu riêng Ri6",
    treeName: "Sầu riêng",
    imgUrl:
      "https://happyagri.com.vn/storage/d1/um/d1um6h2dksblr96z47z69cj2cnbg_sau-rieng-ri6-(2).webp",
    description:
      "Giống cơm vàng, hạt lép, vị béo nhẹ, mùi thơm nồng đặc trưng. Thích hợp đất bazan, thịt quả khô ráo.",
    origin: "Đồng Nai",
    maturityDays: 120,
    yieldKgPerTree: 60,
    season: ["Mùa mưa", "Tháng 5-7"],
    resistance: ["Xì mủ tốt", "Sâu đục thân TB"],
    hashtags: ["Đặc sản", "Xuất khẩu", "OCOP"],
    notes: "Cần tỉa cành tạo tán thông thoáng, chú ý thoát nước mùa mưa.",
    isCertified: true,
    certificationCode: "OCOP-4SAO-2024",
    docType: "editor",
    docContent:
      "<h3>Quy trình trồng Sầu Riêng Ri6</h3><p>Mật độ trồng: 8m x 8m. Bón lót phân chuồng hoai mục 10-15kg/hố.</p><ul><li>Tưới nước: Giữ ẩm thường xuyên giai đoạn cây con.</li><li>Phân bón: NPK 20-20-15 giai đoạn kiến thiết.</li></ul>",
    batches: [
      { batch: "Lô A1-2024", mfg: "2024-05-01", exp: "2024-05-15", qty: 500 },
      { batch: "Lô B2-2024", mfg: "2024-06-01", exp: "2024-06-20", qty: 750 },
    ],
    related: ["Sầu riêng Monthong", "Sầu riêng Musang King"],
  },
  {
    id: "VAR002",
    name: "Đậu nành DT84",
    treeName: "Đậu nành",
    imgUrl:
      "https://lh6.googleusercontent.com/proxy/MkmLTr7RaC47H6aLuMX0yGGlXhtKf77bRQ0sEwVhPiHI01aj7WPJYpuBWIbN422tMgVbH5Z67gqzUj9h-LmQpjem8pVrKg",
    description:
      "Giống ngắn ngày (90–100 ngày), chịu hạn tốt, hạt vàng sáng, thích hợp trồng luân canh.",
    origin: "Việt Nam (Viện Di truyền)",
    maturityDays: 95,
    yieldKgPerTree: 0.5, // Tính theo bụi/m2
    season: ["Vụ Đông", "Vụ Xuân"],
    resistance: ["Rỉ sắt", "Phấn trắng"],
    hashtags: ["Ngắn ngày", "Chịu hạn"],
    notes: "Gieo mật độ 30-35 cây/m2. Thu hoạch khi quả chín vàng 95%.",
    isCertified: false,
    docType: "file",
    docContent: "ky-thuat-dau-nanh-dt84.pdf",
    batches: [],
    related: ["Đậu nành ĐX11"],
  },
  {
    id: "VAR003",
    name: "Xoài Cát Hòa Lộc",
    treeName: "Xoài",
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT-gVdW45kdVTF4JvE9b-95dYoJ5ZriLWpvQ&s",
    description:
      "Trái to, hình thon dài, vỏ vàng tươi khi chín. Thịt quả vàng ươm, ít xơ, ngọt thanh.",
    origin: "Tiền Giang",
    maturityDays: 110,
    yieldKgPerTree: 100,
    season: ["Tháng 3-5"],
    resistance: ["Thán thư kém"],
    hashtags: ["Đặc sản miền Tây", "GI (Chỉ dẫn địa lý)"],
    notes: "Cần bao trái sớm để tránh ruồi vàng và rám nắng.",
    isCertified: true,
    certificationCode: "GI-TIENGIANG-001",
    docType: "editor",
    docContent:
      "<p><strong>Xử lý ra hoa:</strong> Sử dụng Paclobutrazol liều lượng 1g a.i/m đường kính tán.</p>",
    batches: [
      {
        batch: "XOAI-TIENGIANG-01",
        mfg: "2024-04-10",
        exp: "2024-04-25",
        qty: 1200,
      },
    ],
    related: ["Xoài Cát Chu", "Xoài Tứ Quý"],
  },
  {
    id: "VAR004",
    name: "Cà phê Robusta TR4",
    treeName: "Cà phê",
    imgUrl:
      "https://simexcodl.com.vn/wp-content/uploads/2024/08/giong-ca-phe-tr4-1.jpg",
    description:
      "Sinh trưởng mạnh, cành ngang rủ, năng suất cao (5-7 tấn/ha). Hạt to, tỷ lệ tươi/nhân 4.1.",
    origin: "Đắk Lắk (WASI)",
    maturityDays: 270,
    yieldKgPerTree: 5, // Nhân/cây
    season: ["Thu hoạch tháng 11-12"],
    resistance: ["Gỉ sắt cao"],
    hashtags: ["Năng suất cao", "Xuất khẩu"],
    notes: "Tái canh bằng phương pháp ghép chồi cải tạo.",
    isCertified: true,
    certificationCode: "UTZ-CERTIFIED",
    docType: "file",
    docContent: "quy-trinh-tai-canh-cafe-tr4.pdf",
    batches: [],
    related: ["Cà phê TR9", "Cà phê Arabica TH1"],
  },
  {
    id: "VAR005",
    name: "Bưởi Da Xanh",
    treeName: "Bưởi",
    imgUrl:
      "https://thuyanhfruits.com/wp-content/uploads/2020/11/102382686_1330968067101436_1834408349160379163_n.jpg",
    description:
      "Vỏ xanh, ruột hồng, tép bưởi bó chặt, vị ngọt thanh không hạt. Bảo quản được lâu.",
    origin: "Bến Tre",
    maturityDays: 210,
    yieldKgPerTree: 80,
    season: ["Quanh năm"],
    resistance: ["Sâu vẽ bùa", "Nhện đỏ"],
    hashtags: ["OCOP 5 Sao", "VietGAP"],
    notes: "Yêu cầu nước tưới đầy đủ, không chịu ngập úng.",
    isCertified: true,
    certificationCode: "VIETGAP-BT-2023",
    docType: "editor",
    docContent:
      "<p>Tỉa cành tạo tán sau thu hoạch. Bón thúc NPK 15-15-15 + TE.</p>",
    batches: [
      { batch: "BDX-BT-L1", mfg: "2024-01-15", exp: "2024-03-15", qty: 2000 },
    ],
    related: ["Bưởi Năm Roi"],
  },
  {
    id: "VAR006",
    name: "Lúa ST25",
    treeName: "Lúa",
    imgUrl:
      "https://gaophuongnam.vn/wp-content/uploads/2020/05/gao-st25-ong-cua.jpg",
    description:
      "Gạo ngon nhất thế giới 2019. Hạt dài, trắng trong, cơm dẻo, thơm mùi lá dứa.",
    origin: "Sóc Trăng",
    maturityDays: 105,
    yieldKgPerTree: 0, // Năng suất tính theo ha
    season: ["Đông Xuân", "Hè Thu"],
    resistance: ["Đạo ôn", "Phèn mặn nhẹ"],
    hashtags: ["Gạo ngon nhất thế giới", "Thơm lài"],
    notes: "Canh tác tốt trên đất tôm-lúa.",
    isCertified: true,
    certificationCode: "HACCP-RICE-VN",
    docType: "file",
    docContent: "ky-thuat-canh-tac-st25.pdf",
    batches: [
      {
        batch: "LUA-ST25-DX",
        mfg: "2024-02-20",
        exp: "2024-08-20",
        qty: 10000,
      },
    ],
    related: ["Lúa ST24", "Nàng Thơm Chợ Đào"],
  },
  {
    id: "VAR007",
    name: "Bắp Nếp HN88",
    treeName: "Bắp",
    imgUrl: "https://vina-seed.com.vn/uploads/products/ngo-nep-hn88.jpg",
    description:
      "Bắp nếp lai đơn, bắp to, hạt trắng sữa, dẻo, ngọt, thơm. Thời gian thu hoạch ngắn.",
    origin: "Việt Nam",
    maturityDays: 65,
    yieldKgPerTree: 0.3,
    season: ["Quanh năm"],
    resistance: ["Khô vằn", "Đốm lá"],
    hashtags: ["Ăn tươi", "Chế biến"],
    notes: "Mật độ 57.000 cây/ha. Thu hoạch khi râu ngô khô héo.",
    isCertified: false,
    docType: "editor",
    docContent:
      "<ul><li>Gieo hạt: 1 hạt/hốc.</li><li>Khoảng cách: 70cm x 25cm.</li></ul>",
    batches: [],
    related: ["Bắp Mỹ", "Bắp Ngọt"],
  },
  {
    id: "VAR008",
    name: "Hồ Tiêu Vĩnh Linh",
    treeName: "Hồ tiêu",
    imgUrl:
      "https://nongnghiep.farmvina.com/wp-content/uploads/2016/06/tieu-vinh-linh.jpg",
    description:
      "Giống tiêu lá trung, sinh trưởng khỏe, chịu hạn khá. Hạt tiêu chắc, dung trọng cao.",
    origin: "Quảng Trị",
    maturityDays: 0, // Cây lâu năm
    yieldKgPerTree: 3.5, // Tiêu khô/trụ
    season: ["Thu hoạch tháng 2-4"],
    resistance: ["Chết nhanh", "Tuyến trùng TB"],
    hashtags: ["Cay nồng", "Xuất khẩu"],
    notes: "Trồng trụ sống (keo dậu, lồng mức) để che bóng.",
    isCertified: true,
    certificationCode: "GLOBALGAP-PEPPER",
    docType: "file",
    docContent: "quy-trinh-trong-tieu-sinh-hoc.pdf",
    batches: [],
    related: ["Tiêu Sẻ Đất Đỏ", "Tiêu Trâu"],
  },
  {
    id: "VAR009",
    name: "Thanh Long Ruột Đỏ LĐ1",
    treeName: "Thanh Long",
    imgUrl: "https://favri.org.vn/images/hinh_anh/thanh_long_ruot_do_LD1.jpg",
    description:
      "Vỏ đỏ, tai xanh, ruột đỏ tím, vị ngọt đậm (Brix 16%). Năng suất cao hơn ruột trắng.",
    origin: "Bình Thuận (Viện Cây ăn quả)",
    maturityDays: 30, // Từ khi nở hoa
    yieldKgPerTree: 30, // kg/trụ/lứa
    season: ["Quanh năm (xông đèn)"],
    resistance: ["Đốm nâu trung bình"],
    hashtags: ["Xuất khẩu TQ", "Vitamin C"],
    notes: "Xông đèn 8-10 giờ/đêm vào mùa nghịch.",
    isCertified: true,
    certificationCode: "VIETGAP-BTH-2024",
    docType: "editor",
    docContent: "<p>Kỹ thuật thắp đèn ra hoa trái vụ...</p>",
    batches: [
      { batch: "TL-RD-01", mfg: "2024-05-10", exp: "2024-05-25", qty: 5000 },
    ],
    related: ["Thanh Long Ruột Trắng", "Thanh Long Vỏ Vàng"],
  },
  {
    id: "VAR010",
    name: "Chè Shan Tuyết cổ thụ",
    treeName: "Chè",
    imgUrl: "https://tinhhoa.net/wp-content/uploads/2018/10/che-shan-tuyet.jpg",
    description:
      "Búp chè to, phủ lớp lông tyset trắng. Nước trà vàng ong, vị chát dịu, hậu ngọt sâu.",
    origin: "Hà Giang (Suối Giàng)",
    maturityDays: 45, // Lứa hái
    yieldKgPerTree: 5, // Búp tươi/cây cổ thụ
    season: ["Vụ Xuân", "Vụ Thu"],
    resistance: ["Sâu bệnh tốt", "Chịu lạnh"],
    hashtags: ["Đặc sản Tây Bắc", "Hữu cơ tự nhiên"],
    notes: "Thu hái thủ công 1 tôm 2 lá.",
    isCertified: true,
    certificationCode: "ORGANIC-EU",
    docType: "editor",
    docContent:
      "<p>Sao chè bằng chảo gang truyền thống hoặc máy sao gas...</p>",
    batches: [
      {
        batch: "CHE-SUOIGIANG-01",
        mfg: "2024-03-15",
        exp: "2026-03-15",
        qty: 100,
      },
    ],
    related: ["Chè Tân Cương", "Chè Oolong"],
  },
];

export const useVarietyStore = create<VarietyState>()(
  persist(
    (set, get) => ({
      varieties: MOCK_DATA,
      isLoading: false,

      getVarietyById: (id) => get().varieties.find((v) => v.id === id),

      addVariety: async (data) => {
        set({ isLoading: true });
        // Giả lập delay
        await new Promise((r) => setTimeout(r, 800));

        set((state) => ({
          varieties: [data, ...state.varieties],
          isLoading: false,
        }));
        return true;
      },

      updateVariety: async (id, data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));

        set((state) => ({
          varieties: state.varieties.map((v) =>
            v.id === id ? { ...v, ...data } : v
          ),
          isLoading: false,
        }));
        return true;
      },

      deleteVariety: (id) => {
        set((state) => ({
          varieties: state.varieties.filter((v) => v.id !== id),
        }));
      },
    }),
    {
      name: "variety-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
