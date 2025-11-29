import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 1. Định nghĩa kiểu dữ liệu dựa trên UI của bạn
export interface Branch {
  name: string;
  phone: string;
  email: string;
  address: string;
  taxCode: string;
  taxAddress: string;
  note: string;
}

export interface BankAccount {
  bank: string;
  accountHolder: string;
  accountNumber: string;
  branch: string;
  note: string;
}

export interface Contact {
  name: string;
  phone: string;
  email: string;
  role: string;
  organization: string;
  address: string;
  note: string;
}

export interface Company {
  id: string;
  // Thông tin từ formData
  type: string;
  code: string;
  name: string;
  brand: string;
  representative: string;
  phone: string;
  email: string;
  address: string;
  taxCode: string;
  taxAddress: string;
  category: string; // "Sản xuất & phân phối" từ formData
  categoryType: string; // "customer" | "partner"... từ state selectedCategory
  note: string;

  // Các mảng dữ liệu
  branches: Branch[];
  banks: BankAccount[];
  contacts: Contact[];
}

interface CompanyState {
  companies: Company[];
  isLoading: boolean;
  addCompany: (company: Omit<Company, "id">) => Promise<boolean>;
  deleteCompany: (id: string) => void;
}

const DUMMY_DATA: Company[] = [
  {
    id: "COMP-011",
    type: "Doanh nghiệp",
    code: "ENT-VINAMILK",
    name: "Công ty Cổ phần Sữa Việt Nam",
    brand: "Vinamilk",
    representative: "Mai Kiều Liên",
    phone: "02854155555",
    email: "info@vinamilk.com.vn",
    address: "10 Tân Trào, Phú Mỹ Hưng, Quận 7, TP.HCM",
    taxCode: "0300588569",
    taxAddress: "10 Tân Trào, Quận 7, TP.HCM",
    category: "Chế biến sữa",
    categoryType: "customer",
    note: "Doanh nghiệp lớn, nhu cầu mua nguyên liệu ổn định.",
    branches: [
      {
        name: "Nhà máy sữa Bình Dương",
        phone: "02743880011",
        email: "bd.factory@vinamilk.com.vn",
        address: "KCN Mỹ Phước 2, Bình Dương",
        taxCode: "",
        taxAddress: "",
        note: "Nhà máy sản xuất chính",
      },
    ],
    banks: [
      {
        bank: "Vietcombank",
        accountHolder: "CONG TY CP SUA VIET NAM",
        accountNumber: "0071000112345",
        branch: "CN Sài Gòn",
        note: "Tài khoản thanh toán",
      },
    ],
    contacts: [
      {
        name: "Nguyễn Minh Tâm",
        phone: "0905222333",
        email: "tam.nguyen@vinamilk.com.vn",
        role: "Trưởng phòng Thu mua",
        organization: "Khối Thu mua",
        address: "",
        note: "Phụ trách hợp đồng nguyên liệu",
      },
    ],
  },
  {
    id: "COMP-012",
    type: "Hợp tác xã",
    code: "HTX-DRAGON-LA",
    name: "HTX Thanh Long Long An",
    brand: "LongAn Dragon Fruit",
    representative: "Trần Thành Liêm",
    phone: "0911222333",
    email: "htxlongan@gmail.com",
    address: "Châu Thành, Long An",
    taxCode: "1100123456",
    taxAddress: "Châu Thành, Long An",
    category: "Trái cây",
    categoryType: "partner",
    note: "Xuất khẩu sang EU & China",
    branches: [
      {
        name: "Kho bảo quản Châu Thành",
        phone: "0272999888",
        email: "",
        address: "Ấp Bình Hòa, Châu Thành, Long An",
        taxCode: "",
        taxAddress: "",
        note: "Kho lạnh bảo quản",
      },
    ],
    banks: [
      {
        bank: "Agribank",
        accountHolder: "HTX THANH LONG LONG AN",
        accountNumber: "1600208000123",
        branch: "CN Long An",
        note: "",
      },
    ],
    contacts: [
      {
        name: "Phạm Mỹ Hạnh",
        phone: "0908333444",
        email: "hanh.pham@htxlongan.vn",
        role: "Kế toán",
        organization: "Ban quản lý HTX",
        address: "",
        note: "",
      },
    ],
  },
  {
    id: "COMP-013",
    type: "Doanh nghiệp",
    code: "ENT-ANPHU-BVTV",
    name: "Công ty Thuốc BVTV An Phú",
    brand: "AnPhu Protect",
    representative: "Lê Hoàng Phúc",
    phone: "02837223344",
    email: "contact@anphuprotect.vn",
    address: "Trường Thọ, TP. Thủ Đức, TP.HCM",
    taxCode: "0315678910",
    taxAddress: "Trường Thọ, TP. Thủ Đức",
    category: "Thuốc bảo vệ thực vật",
    categoryType: "supplier",
    note: "Nhà cung cấp lâu năm",
    branches: [
      {
        name: "Kho Hóa Chất Thủ Đức",
        phone: "",
        email: "",
        address: "Quận 9, TP.Thủ Đức",
        taxCode: "",
        taxAddress: "",
        note: "",
      },
    ],
    banks: [
      {
        bank: "VietinBank",
        accountHolder: "CTY BVTV AN PHU",
        accountNumber: "10255999777",
        branch: "CN Đông Sài Gòn",
        note: "",
      },
    ],
    contacts: [
      {
        name: "Trương Bảo",
        phone: "0909555666",
        email: "bao.truong@anphuprotect.vn",
        role: "Sale Manager",
        organization: "Phòng kinh doanh",
        address: "",
        note: "Phụ trách cung ứng",
      },
    ],
  },
  {
    id: "COMP-014",
    type: "Doanh nghiệp",
    code: "EXP-VINAFOOD2",
    name: "Tổng Công ty Lương thực Miền Nam",
    brand: "Vinafood II",
    representative: "Phan Hữu Thắng",
    phone: "02838213333",
    email: "info@vinafood2.com",
    address: "12 Hàm Nghi, Quận 1, TP.HCM",
    taxCode: "0300591254",
    taxAddress: "",
    category: "Xuất khẩu gạo",
    categoryType: "partner",
    note: "Đối tác xuất khẩu gạo lớn nhất khu vực",
    branches: [
      {
        name: "Nhà máy gạo Trà Nóc",
        phone: "",
        email: "",
        address: "KCN Trà Nóc, Cần Thơ",
        taxCode: "",
        taxAddress: "",
        note: "",
      },
    ],
    banks: [
      {
        bank: "BIDV",
        accountHolder: "TCT LUONG THUC MIEN NAM",
        accountNumber: "125886600",
        branch: "CN Sài Gòn",
        note: "",
      },
    ],
    contacts: [
      {
        name: "Nguyễn Thành Long",
        phone: "0918111222",
        email: "long.nt@vinafood2.vn",
        role: "Xuất khẩu",
        organization: "Phòng Xuất khẩu",
        address: "",
        note: "",
      },
    ],
  },
  {
    id: "COMP-015",
    type: "Nông hộ",
    code: "FARM-DAULAT",
    name: "Trang trại Dâu Đà Lạt",
    brand: "DaLat Strawberry Farm",
    representative: "Ngô Hữu Nghị",
    phone: "0977888999",
    email: "strawberryfarm@gmail.com",
    address: "Phường 7, Đà Lạt, Lâm Đồng",
    taxCode: "",
    taxAddress: "",
    category: "Trồng dâu tây",
    categoryType: "customer",
    note: "Nguồn cung trái tươi",
    branches: [],
    banks: [],
    contacts: [
      {
        name: "Lê Khánh",
        phone: "0933111222",
        email: "",
        role: "Quản lý trang trại",
        organization: "",
        address: "",
        note: "",
      },
    ],
  },
  {
    id: "COMP-016",
    type: "Doanh nghiệp",
    code: "LOG-GHTK",
    name: "Công ty Giao Hàng Tiết Kiệm",
    brand: "GHTK",
    representative: "Phạm Văn Minh",
    phone: "19006067",
    email: "support@ghtk.vn",
    address: "Tòa nhà GHTK, Hà Nội",
    taxCode: "0106065678",
    taxAddress: "",
    category: "Vận chuyển",
    categoryType: "partner",
    note: "",
    branches: [
      {
        name: "Trung tâm phân loại Hồ Chí Minh",
        phone: "",
        email: "",
        address: "KCN Vĩnh Lộc, Bình Tân",
        taxCode: "",
        taxAddress: "",
        note: "",
      },
    ],
    banks: [
      {
        bank: "MB Bank",
        accountHolder: "GIAO HANG TIET KIEM",
        accountNumber: "555888666",
        branch: "CN Hà Nội",
        note: "",
      },
    ],
    contacts: [
      {
        name: "Hoàng Đạt",
        phone: "0909333444",
        email: "dat.hoang@ghtk.vn",
        role: "Quản lý vận hành",
        organization: "",
        address: "",
        note: "",
      },
    ],
  },
  {
    id: "COMP-017",
    type: "Doanh nghiệp",
    code: "FISH-MINHPHU",
    name: "Công ty CP Thủy sản Minh Phú",
    brand: "MinhPhu Seafood",
    representative: "Lê Văn Quang",
    phone: "02903888888",
    email: "info@minhphu.com",
    address: "Cà Mau",
    taxCode: "2000567890",
    taxAddress: "",
    category: "Chế biến thủy sản",
    categoryType: "customer",
    note: "",
    branches: [
      {
        name: "Nhà máy Minh Phú Hậu Giang",
        phone: "",
        email: "",
        address: "Hậu Giang",
        taxCode: "",
        taxAddress: "",
        note: "",
      },
    ],
    banks: [
      {
        bank: "Sacombank",
        accountHolder: "CTCP THUY SAN MINH PHU",
        accountNumber: "04001238888",
        branch: "CN Cà Mau",
        note: "",
      },
    ],
    contacts: [],
  },
  {
    id: "COMP-018",
    type: "Doanh nghiệp",
    code: "MACH-KUBOTA",
    name: "Công ty TNHH Kubota Việt Nam",
    brand: "Kubota",
    representative: "Yamamoto Jun",
    phone: "02899998888",
    email: "info@kubota.com.vn",
    address: "KCN Long Bình, Biên Hòa",
    taxCode: "3600123456",
    taxAddress: "",
    category: "Máy nông nghiệp",
    categoryType: "supplier",
    note: "",
    branches: [],
    banks: [],
    contacts: [
      {
        name: "Phạm Quốc Khánh",
        phone: "0909222444",
        email: "",
        role: "Kỹ thuật",
        organization: "",
        address: "",
        note: "",
      },
    ],
  },
  {
    id: "COMP-019",
    type: "Doanh nghiệp",
    code: "SEED-SSC",
    name: "Công ty Giống cây trồng Miền Nam",
    brand: "SSC",
    representative: "Nguyễn Trường Sơn",
    phone: "02838482222",
    email: "info@ssc.com.vn",
    address: "Lê Văn Khương, Quận 12, TP.HCM",
    taxCode: "0301239876",
    taxAddress: "",
    category: "Giống cây trồng",
    categoryType: "supplier",
    note: "",
    branches: [],
    banks: [
      {
        bank: "ACB",
        accountHolder: "CT GIONG CAY TRONG MIEN NAM",
        accountNumber: "8230123456",
        branch: "CN Quận 12",
        note: "",
      },
    ],
    contacts: [],
  },
  {
    id: "COMP-020",
    type: "Doanh nghiệp",
    code: "RETAIL-BHX",
    name: "Công ty Cổ phần Bách Hóa Xanh",
    brand: "Bách Hóa Xanh",
    representative: "Bùi Quốc Bảo",
    phone: "19001908",
    email: "cskh@bachhoaxanh.vn",
    address: "Võ Văn Kiệt, Bình Tân, TP.HCM",
    taxCode: "0315432100",
    taxAddress: "",
    category: "Chuỗi bán lẻ",
    categoryType: "customer",
    note: "",
    branches: [
      {
        name: "Trung tâm phân phối Tân Tạo",
        phone: "",
        email: "",
        address: "Tân Tạo, Bình Tân",
        taxCode: "",
        taxAddress: "",
        note: "",
      },
    ],
    banks: [],
    contacts: [
      {
        name: "Lê Hoàng",
        phone: "0918123123",
        email: "hoang.le@bhx.vn",
        role: "Quản lý ngành hàng tươi",
        organization: "",
        address: "",
        note: "",
      },
    ],
  },
];
export const useCompanyStore = create<CompanyState>()(
  persist(
    (set) => ({
      companies: [
        {
          id: "COMP-001",
          type: "Doanh nghiệp",
          code: "ENT-VNFOOD",
          name: "Công ty Cổ phần Nông Sản Việt",
          brand: "VietFood",
          representative: "Nguyễn Văn An",
          phone: "02838123456",
          email: "contact@vietfood.com.vn",
          address: "Lô C, KCN Tân Bình, TP.HCM",
          taxCode: "0300123456",
          taxAddress: "Lô C, KCN Tân Bình, TP.HCM",
          category: "Chế biến thực phẩm",
          categoryType: "customer",
          note: "Khách hàng VIP, thanh toán đúng hạn.",
          createdAt: "2023-01-15T08:00:00.000Z",
          branches: [
            {
              name: "Kho Bình Dương",
              phone: "02743888999",
              email: "kho.bd@vietfood.com.vn",
              address: "KCN Sóng Thần, Bình Dương",
              taxCode: "",
              taxAddress: "",
              note: "Kho nguyên liệu",
            },
          ],
          banks: [
            {
              bank: "Vietcombank",
              accountHolder: "CONG TY CP NONG SAN VIET",
              accountNumber: "0071000123456",
              branch: "CN TP.HCM",
              note: "Tài khoản chính",
            },
          ],
          contacts: [
            {
              name: "Trần Thị Bích",
              phone: "0909111222",
              email: "bich.tt@vietfood.com.vn",
              role: "Trưởng phòng Thu mua",
              organization: "Phòng Thu mua",
              address: "",
              note: "Người liên hệ chính",
            },
          ],
        },
        {
          id: "COMP-002",
          type: "Hợp tác xã",
          code: "HTX-CUCHI",
          name: "Hợp tác xã Rau Sạch Củ Chi",
          brand: "CuChiFarm",
          representative: "Lê Văn Tám",
          phone: "0912345678",
          email: "htxcuchi@gmail.com",
          address: "Ấp Bến Đình, Xã Nhuận Đức, Củ Chi, TP.HCM",
          taxCode: "0311223344",
          taxAddress: "Ấp Bến Đình, Xã Nhuận Đức, Củ Chi, TP.HCM",
          category: "Sản xuất rau màu",
          categoryType: "partner",
          note: "Đối tác chiến lược cung cấp rau ăn lá.",
          createdAt: "2023-02-10T09:30:00.000Z",
          branches: [],
          banks: [
            {
              bank: "Agribank",
              accountHolder: "HTX RAU SACH CU CHI",
              accountNumber: "1600205123456",
              branch: "CN Củ Chi",
              note: "",
            },
          ],
          contacts: [],
        },
        {
          id: "COMP-003",
          type: "Nông hộ",
          code: "FARM-BAHUNG",
          name: "Vườn Lan Ba Hùng",
          brand: "Lan Ba Hùng",
          representative: "Phạm Hùng",
          phone: "0988777666",
          email: "bahung.lan@yahoo.com",
          address: "Xã Đam B'ri, TP. Bảo Lộc, Lâm Đồng",
          taxCode: "",
          taxAddress: "",
          category: "Trồng hoa lan",
          categoryType: "supplier",
          note: "Nguồn cung hoa lan hồ điệp.",
          createdAt: "2023-03-05T14:15:00.000Z",
          branches: [],
          banks: [],
          contacts: [
            {
              name: "Chị Tư (Vợ)",
              phone: "0988777555",
              email: "",
              role: "Quản lý",
              organization: "",
              address: "",
              note: "",
            },
          ],
        },
        {
          id: "COMP-004",
          type: "Doanh nghiệp",
          code: "SUP-PHANBON",
          name: "Công ty Phân bón Bình Điền",
          brand: "Đầu Trâu",
          representative: "Ngô Văn Cường",
          phone: "02837560110",
          email: "info@binhdien.com",
          address: "C12/21 Quốc lộ 1A, Tân Kiên, Bình Chánh, TP.HCM",
          taxCode: "0302987654",
          taxAddress: "C12/21 Quốc lộ 1A, Tân Kiên, Bình Chánh, TP.HCM",
          category: "Vật tư nông nghiệp",
          categoryType: "supplier",
          note: "Nhà cung cấp phân bón NPK.",
          createdAt: "2023-01-20T10:00:00.000Z",
          branches: [
            {
              name: "Nhà máy Long An",
              phone: "",
              email: "",
              address: "KCN Nhựt Chánh, Bến Lức, Long An",
              taxCode: "",
              taxAddress: "",
              note: "",
            },
          ],
          banks: [],
          contacts: [],
        },
        {
          id: "COMP-005",
          type: "Doanh nghiệp",
          code: "LOG-GHN",
          name: "Công ty Giao Hàng Nhanh",
          brand: "GHN Logistics",
          representative: "Lương Duy Hoài",
          phone: "1900636677",
          email: "cskh@ghn.vn",
          address: "Tầng 3, Tòa nhà Rivera Park, Q10, TP.HCM",
          taxCode: "0312345679",
          taxAddress: "",
          category: "Vận chuyển",
          categoryType: "partner",
          note: "Đối tác giao hàng chặng cuối.",
          createdAt: "2023-04-12T11:20:00.000Z",
          branches: [],
          banks: [],
          contacts: [],
        },
        {
          id: "COMP-006",
          type: "Doanh nghiệp",
          code: "BANK-TCB",
          name: "Ngân hàng TMCP Kỹ Thương Việt Nam",
          brand: "Techcombank",
          representative: "Giám đốc CN",
          phone: "1800588822",
          email: "support@techcombank.com.vn",
          address: "191 Bà Triệu, Hai Bà Trưng, Hà Nội",
          taxCode: "0100230800",
          taxAddress: "",
          category: "Tài chính",
          categoryType: "bank",
          note: "Ngân hàng giải ngân vốn vay.",
          createdAt: "2022-12-01T08:00:00.000Z",
          branches: [],
          banks: [],
          contacts: [
            {
              name: "Nguyễn Minh Tuấn",
              phone: "0909000111",
              email: "tuannm@techcombank.com.vn",
              role: "Chuyên viên QHKH",
              organization: "CN Sài Gòn",
              address: "",
              note: "Phụ trách hồ sơ vay vốn",
            },
          ],
        },
        {
          id: "COMP-007",
          type: "Nông hộ",
          code: "FARM-TUAN",
          name: "Trại Heo Tuấn Mập",
          brand: "",
          representative: "Hoàng Văn Tuấn",
          phone: "0933444555",
          email: "",
          address: "Xã Gia Kiệm, Thống Nhất, Đồng Nai",
          taxCode: "",
          taxAddress: "",
          category: "Chăn nuôi",
          categoryType: "customer",
          note: "Mua cám số lượng lớn.",
          createdAt: "2023-05-20T16:45:00.000Z",
          branches: [],
          banks: [],
          contacts: [],
        },
        {
          id: "COMP-008",
          type: "Doanh nghiệp",
          code: "CUST-WINMART",
          name: "Công ty Cổ phần Dịch vụ Thương mại Tổng hợp WinCommerce",
          brand: "WinMart",
          representative: "Nguyễn Thị Phương",
          phone: "02471066866",
          email: "cskh@winmart.masangroup.com",
          address: "Tầng 5, Tòa nhà MPlaza, Q1, TP.HCM",
          taxCode: "0104918404",
          taxAddress: "",
          category: "Bán lẻ",
          categoryType: "customer",
          note: "Hệ thống siêu thị tiêu thụ nông sản.",
          createdAt: "2023-01-05T08:30:00.000Z",
          branches: [],
          banks: [],
          contacts: [
            {
              name: "Lê Hoàng",
              phone: "0918123123",
              email: "hoang.le@winmart.vn",
              role: "Quản lý ngành hàng tươi sống",
              organization: "Miền Nam",
              address: "",
              note: "",
            },
          ],
        },
        {
          id: "COMP-009",
          type: "Hợp tác xã",
          code: "HTX-XOAI",
          name: "HTX Xoài Mỹ Xương",
          brand: "Xoài Cát Chu",
          representative: "Võ Việt Hưng",
          phone: "02773123456",
          email: "htxxoaicaolanh@gmail.com",
          address: "Huyện Cao Lãnh, Đồng Tháp",
          taxCode: "1401122334",
          taxAddress: "",
          category: "Trái cây",
          categoryType: "partner",
          note: "Dự án bao tiêu xoài xuất khẩu.",
          createdAt: "2023-06-10T10:10:00.000Z",
          branches: [],
          banks: [],
          contacts: [],
        },
        {
          id: "COMP-010",
          type: "Doanh nghiệp",
          code: "TECH-FPT",
          name: "Công ty TNHH Hệ thống Thông tin FPT",
          brand: "FPT IS",
          representative: "Nguyễn Hoàng Minh",
          phone: "02435626000",
          email: "contact@fpt.com.vn",
          address: "Tòa nhà FPT, Phố Duy Tân, Cầu Giấy, Hà Nội",
          taxCode: "0100123456",
          taxAddress: "",
          category: "Công nghệ",
          categoryType: "supplier",
          note: "Cung cấp phần mềm ERP.",
          createdAt: "2022-11-15T09:00:00.000Z",
          branches: [
            {
              name: "Văn phòng TP.HCM",
              phone: "02873007300",
              email: "",
              address: "Lô T2, Đường D1, Khu Công nghệ cao, TP. Thủ Đức",
              taxCode: "",
              taxAddress: "",
              note: "",
            },
          ],
          banks: [],
          contacts: [],
        },
      ],
      isLoading: false,

      addCompany: async (newCompanyData) => {
        set({ isLoading: true });
        // Giả lập API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newCompany = {
          ...newCompanyData,
          id: newCompanyData.code || `COMP-${Date.now()}`, // Dùng mã làm ID
        };

        set((state) => ({
          companies: [newCompany, ...state.companies],
          isLoading: false,
        }));
        return true;
      },

      deleteCompany: (id) => {
        set((state) => ({
          companies: state.companies.filter((c) => c.id !== id),
        }));
      },
    }),
    {
      name: "company-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
