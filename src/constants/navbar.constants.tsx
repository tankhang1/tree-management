import {
  IconBook2,
  IconBuildingStore,
  IconCalendarWeek,
  IconCoin,
  IconHome,
  IconMap,
  IconPackage,
  IconReportMoney,
  IconReportAnalytics,
  IconSettingsAutomation,
  IconShoppingCart,
  IconTractor,
  IconUsersGroup,
  IconTrees,
  IconMap2,
  IconBox,
  IconBuildings,
  IconReceiptRupee,
  IconCreditCard,
  IconCash,
  IconLayersIntersect,
  IconCashBanknote,
  IconSettings,
  IconCashRegister,
  IconCertificate,
} from "@tabler/icons-react";
import { PATH } from "./path.constants";

export const NAV_BAR = [
  {
    label: "Trang chủ",
    icon: IconHome,
    link: PATH.HOME,
  },
  {
    label: "Lịch trình",
    icon: IconCalendarWeek,
    link: PATH.SCHEDULE,
  },
  {
    label: "Biểu đồ vùng",
    icon: IconMap2,
    link: PATH.MAP_REGION,
    children: [
      { label: "Phân bổ vùng", link: PATH.MAP_REGION },
      { label: "Phân bổ khu vực", link: PATH.MAP_AREA },
      { label: "Phân bổ lô", link: PATH.MAP_PLOT },
      { label: "Bản đồ", link: PATH.MAP_MAP },
      { label: "Lịch sử", link: PATH.MAP_HISTORY },
    ],
  },
  {
    label: "Vùng canh tác",
    icon: IconMap,
    link: PATH.AREA_MANAGEMENT,
    children: [
      { label: "Khu vực canh tác", link: PATH.AREA_REGION },
      // { label: "Khu vực", link: PATH.AREA_ZONE },
      // { label: "Lô canh tác", link: PATH.AREA_BLOCK },
      // { label: "Hàng", link: PATH.AREA_ROW },
      { label: "Chi tiết phân bổ", link: PATH.AREA_TREE },
      { label: "Chi tiết phân bổ (v2)", link: PATH.AREA_TREE_v2 },
      { label: "Tìm kiếm cây trồng", link: PATH.AREA_SEARCH_TREE },
      { label: "Tìm kiếm vùng trồng", link: PATH.AREA_SEARCH },
      { label: "Lịch sử", link: PATH.AREA_HISTORY },
    ],
  },
  {
    label: "Chu kỳ canh tác",
    icon: IconReportAnalytics,
    link: PATH.SEASON_MANAGEMENT,
    children: [
      { label: "Mùa vụ", link: PATH.SEASON_GROWTH },
      { label: "Chu kỳ sinh trưởng", link: PATH.SEASON_CYCLE },
      { label: "Lịch sử", link: PATH.SEASON_HISTORY },
    ],
  },
  {
    label: "Kế hoạch canh tác",
    icon: IconSettingsAutomation,
    link: PATH.PLAN_MANAGEMENT,
    children: [
      { label: "Lập kế hoạch", link: PATH.PLAN_MAIN },
      { label: "Phân bổ công việc", link: PATH.PLAN_ASSIGN },
      { label: "Giao việc phát sinh", link: PATH.PLAN_UNPLANNED },
      { label: "Lịch sử", link: PATH.PLAN_HISTORY },
    ],
  },
  {
    label: "Công việc phát sinh",
    icon: IconBook2,
    link: PATH.TASK_MANAGEMENT,
    children: [
      { label: "Phân bổ công việc", link: PATH.TASK_MAIN },
      { label: "Công việc BATMAN", link: PATH.TASK_BATMAN },
      { label: "Lịch sử", link: PATH.TASK_HISTORY },
    ],
  },
  {
    label: "Vật tư nông nghiệp",
    icon: IconPackage,
    link: PATH.SUPPLY_MANAGEMENT,
    children: [
      { label: "Danh sách vật tư", link: PATH.SUPPLY_MAIN },
      { label: "Loại vật tư", link: PATH.SUPPLY_TYPE },
      { label: "Lịch sử sử dụng", link: PATH.SUPPLY_HISTORY },
      { label: "Lịch sử thanh lý", link: PATH.SUPPLY_DISPOSAL_HISTORY },
    ],
  },

  {
    label: "Máy móc - Thiết bị",
    icon: IconTractor,
    link: PATH.MACHINE_MANAGEMENT,
    children: [
      { label: "Danh sách máy móc", link: PATH.MACHINE_MAIN },
      { label: "Loại máy móc", link: PATH.MACHINE_TYPE },
      { label: "Lịch sử sử dụng", link: PATH.MACHINE_USAGE_HISTORY },
      { label: "Lịch sử bảo trì", link: PATH.MACHINE_MAINTENANCE_HISTORY },
      { label: "Lịch sử thanh lý", link: PATH.MACHINE_DISPOSAL_HISTORY },
    ],
  },
  {
    label: "Thuốc BVTV",
    icon: IconPackage,
    link: PATH.PESTICIDE_MANAGEMENT,
    children: [
      { label: "Danh sách thuốc", link: PATH.PESTICIDE_MAIN },
      { label: "Loại thuốc", link: PATH.PESTICIDE_CATEGORY },
      { label: "Lịch sử sử dụng", link: PATH.PESTICIDE_HISTORY },
      { label: "Lịch sử huỷ", link: PATH.PESTICIDE_DISPOSAL_HISTORY },
    ],
  },

  {
    label: "Phân bón",
    icon: IconBox,
    link: PATH.FERTILIZER_MAIN,
    children: [
      { label: "Danh sách phân bón", link: PATH.FERTILIZER_MAIN },
      { label: "Loại phân bón", link: PATH.FERTILIZER_TYPE },
      { label: "Lịch sử sử dụng", link: PATH.FERTILIZER_HISTORY },
      { label: "Lịch sử huỷ", link: PATH.FERTILIZER_DISPOSAL_HISTORY },
    ],
  },
  {
    label: "Cây trồng",
    icon: IconTrees,
    link: PATH.PLANT_MANAGEMENT,
    children: [
      { label: "Danh sách cây trồng", link: PATH.PLANT_TREE },
      { label: "Nhóm cây trồng", link: PATH.PLANT_GROUP },
      { label: "Giống cây", link: PATH.PLANT_VARIETY },
      { label: "Hạt giống", link: PATH.PLANT_SEED },
      { label: "Tài liệu kỹ thuật", link: PATH.PLANT_TECHNICAL_DOC },
    ],
  },

  {
    label: "Báo cáo thu hoạch",
    icon: IconReportAnalytics,
    link: PATH.HARVEST_MANAGEMENT,
    children: [
      // Thêm báo cáo thu hoạch vào đây nếu cần
      { label: "Thống kê báo cáo", link: PATH.HARVEST_REPORT },
      { label: "Thống kê hiện tại", link: PATH.HARVEST_QUERY },
    ],
  },
  {
    label: "Sản phẩm kinh doanh",
    icon: IconPackage,
    link: PATH.PRODUCT_MANAGEMENT,
    children: [
      { label: "Danh sách sản phẩm", link: PATH.PRODUCT_ITEM },
      { label: "Loại sản phẩm", link: PATH.PRODUCT_TYPE },
      { label: "Danh sách nguyên vật liệu", link: PATH.PRODUCT_RAW_MATERIAL },
      {
        label: "Loại nguyên vật liệu",
        link: PATH.PRODUCT_RAW_MATERIAL_TYPE,
      },
      { label: "Lịch sử", link: PATH.PRODUCT_HISTORY },
    ],
  },

  // {
  //   label: "Quản lý nhà máy",
  //   icon: IconBuildingFactory,
  //   link: PATH.FACTORY_MANAGEMENT,
  //   children: [
  //     { label: "Nhà máy", link: PATH.FACTORY_MAIN },
  //     { label: "Lịch sử chỉnh sửa", link: PATH.FACTORY_HISTORY },
  //   ],
  // },

  {
    label: "Nhân sự",
    icon: IconUsersGroup,
    link: PATH.HR_MANAGEMENT,
    children: [
      { label: "Danh sách nhân sự", link: PATH.HR_EMPLOYEE },
      { label: "Danh sách phòng ban", link: PATH.HR_DEPARTMENT },
      { label: "Danh sách vị trí", link: PATH.HR_POSITION },
      { label: "Danh sách đội nhóm", link: PATH.HR_TEAM },
      { label: "Lịch sử", link: PATH.HR_HISTORY },
    ],
  },
  {
    label: "Doanh nghiệp / Nông hộ",
    icon: IconBuildings,
    link: PATH.COMPANY,
    children: [
      {
        label: "Danh sách nhà cung cấp",
        link: PATH.COMPANY,
      },
      {
        label: "Danh sách khách hàng",
        link: PATH.COMPANY_CUSTOMER,
      },
      {
        label: "Danh sách đối tác",
        link: PATH.COMPANY_PARTNER,
      },
      {
        label: "Danh sách địa chỉ",
        link: PATH.COMPANY_ADDRESS,
      },
      // { label: "Danh sách liên hệ", link: PATH.CONTACT_LIST },

      { label: "Lịch sử", link: PATH.COMPANY_HISTORY },
    ],
  },

  {
    label: "Hợp đồng ký kết",
    icon: IconReportMoney,
    link: PATH.CONTRACT_MANAGEMENT,
    children: [
      { label: "Hợp đồng mua bán", link: PATH.CONTRACT_SALE },
      { label: "Hợp đồng trao đổi", link: PATH.CONTRACT_EXCHANGE },
      { label: "Hợp đồng cho tặng", link: PATH.CONTRACT_GIFT },
      { label: "Hợp đồng vay", link: PATH.CONTRACT_LOAN },
      { label: "Hợp đồng thuê", link: PATH.CONTRACT_RENT },
      { label: "Hợp đồng mượn", link: PATH.CONTRACT_BORROW },
      { label: "Hợp đồng dịch vụ", link: PATH.CONTRACT_SERVICE },
      { label: "Hợp đồng vận chuyển", link: PATH.CONTRACT_TRANSPORT },
      { label: "Hợp đồng gia công", link: PATH.CONTRACT_PROCESSING },
      { label: "Hợp đồng gửi giữ tài sản", link: PATH.CONTRACT_STORAGE },
      { label: "Hợp đồng ủy quyền", link: PATH.CONTRACT_AUTHORIZATION },
      { label: "Hợp đồng hợp tác", link: PATH.CONTRACT_PARTNERSHIP },
      { label: "Lịch sử", link: PATH.CONTRACT_HISTORY },
    ],
  },
  {
    label: "Hoá đơn",
    icon: IconReceiptRupee,
    link: PATH.BILL_MANAGEMENT,
    children: [
      {
        label: "Cá nhân",
        link: PATH.BILL_MANAGEMENT_USER,
      },
      {
        label: "Doanh nghiệp",
        link: PATH.BILL_MANAGEMENT_COMPANY,
      },
    ],
  },
  {
    label: "Công nợ",
    icon: IconReportMoney,
    link: PATH.DEBT_MANAGEMENT,
    children: [
      {
        label: "Công nợ phải thu",
        icon: IconCash,
        link: PATH.DEBT_RECEIVABLE,
      },
      {
        label: "Công nợ phải trả",
        icon: IconCreditCard,
        link: PATH.DEBT_PAYABLE,
      },
    ],
  },
  {
    label: "Kho vận",
    icon: IconCoin,
    link: PATH.STOCK_MANAGEMENT,
    children: [
      { label: "Khu vực quản lý", link: PATH.STOCK_AREA },
      { label: "Danh sách kho vận", link: PATH.STOCK_DELIVERY },
      { label: "Xuất/nhập vật tư nông nghiệp", link: PATH.STOCK_SUPPLY },
      { label: "Xuất/nhập máy móc - thiết bị", link: PATH.STOCK_MACHINE },
      { label: "Xuất/nhập thuốc BVTV", link: PATH.STOCK_PESTICIDE },
      { label: "Xuất/nhập phân bón", link: PATH.STOCK_FERTILIZER },
      { label: "Xuất/nhập hạt giống", link: PATH.STOCK_SEED },
    ],
  },
  {
    label: "Đơn hàng - Thu mua",
    icon: IconBuildingStore,
    link: PATH.PURCHASE_MANAGEMENT,
    children: [
      { label: "Sản phẩm kinh doanh", link: PATH.PURCHASE_MANAGEMENT_PRODUCT },
      { label: "Nguyên vật liệu", link: PATH.PURCHASE_MANAGEMENT_RAW_MATERIAL },
      { label: "Lịch sử", link: PATH.PURCHASE_MANAGEMENT_HISTORY },
    ],
  },
  {
    label: "Sổ quỹ",
    icon: IconCashRegister,
    link: PATH.FINANCE_PURPOSE_EXPENSE,
    children: [
      {
        label: "Phiếu thu",
        link: PATH.FINANCE_PURPOSE_RECEIVE,
      },
      {
        label: "Phiếu chi",
        link: PATH.FINANCE_PURPOSE_EXPENSE,
      },
      {
        label: "Mục đích thu - chi",
        link: PATH.FINANCE_PURPOSE_MANAGEMENT,
      },
      {
        label: "Thống kê",
        link: PATH.FINANCE_PURPOSE_STATISTIC,
      },
      // {
      //   label: "Lịch sử",
      //   link: PATH.FINANCE_PURPOSE_HISTORY,
      // },
    ],
  },
  {
    label: "Đơn hàng - Buôn bán",
    icon: IconShoppingCart,
    link: PATH.ORDER_MANAGEMENT,
    children: [
      // {
      //   label: "Địa chỉ giao hàng",
      //   link: PATH.ORDER_MANAGEMENT_ADDRESS,
      // },
      {
        label: "Đặt hàng nhanh",
        link: PATH.ORDER_MANAGEMENT_QUICK,
      },

      // {
      //   label: "Đặt hàng (đăng nhập)",
      //   link: PATH.ORDER_MANAGEMENT_LOGGED_IN,
      // },
      {
        label: "Tạo đơn hàng",
        link: PATH.ORDER_MANAGEMENT_CREATE,
      },
      { label: "Lịch sử", link: PATH.ORDER_MANAGEMENT_HISTORY },
    ],
  },
  {
    label: "Ngân hàng",
    icon: IconCashBanknote,
    link: PATH.BANK_MANAGEMENT,
  },
  {
    label: "Quy cách",
    icon: IconLayersIntersect,
    link: PATH.PACKAGING_SPECIFICATION,
  },
  {
    label: "Chứng nhận - chứng chỉ",
    icon: IconCertificate,
    link: PATH.CERTIFICATION,
  },
  // {
  //   label: "Quản lý nhà cung cấp",
  //   icon: IconBuildingWarehouse,
  //   link: PATH.VENDOR,
  // },
  // {
  //   label: "Mua hàng",
  //   icon: IconShoppingCart,
  //   link: PATH.PURCHASE,
  // },
  // {
  //   label: "Bán hàng",
  //   icon: IconBuildingStore,
  //   link: PATH.SELL,
  // },
  // {
  //   label: "Tài chính & Kế toán",
  //   icon: IconReportMoney,
  //   link: PATH.FINANCE_ACCOUNT,
  // },
  {
    label: "Cài đặt",
    icon: IconSettings,
    link: PATH.SETTINGS,
    children: [
      { label: "Địa hình", link: PATH.MAP_TERRAIN },
      { label: "Loại đất", link: PATH.AREA_SOIL },
      { label: "Phương pháp canh tác", link: PATH.AREA_CULTIVATION_METHOD },
      { label: "Phân loại cây trồng", link: PATH.PLANT_CATALOG },
    ],
  },
];
