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
