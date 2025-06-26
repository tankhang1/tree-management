import {
  IconBook2,
  IconBuildingFactory,
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
    label: "Quản lý vùng trồng",
    icon: IconMap,
    link: PATH.AREA_MANAGEMENT,
    children: [
      { label: "Vùng trồng", link: PATH.AREA_REGION },
      { label: "Khu vực", link: PATH.AREA_ZONE },
      { label: "Lô", link: PATH.AREA_BLOCK },
      { label: "Hàng", link: PATH.AREA_ROW },
      { label: "Cây", link: PATH.AREA_TREE },
      { label: "Bản đồ địa chính", link: PATH.AREA_MAP },
      { label: "Loại đất", link: PATH.AREA_SOIL },
      { label: "Địa hình", link: PATH.AREA_TERRAIN },
      { label: "Phương pháp canh tác", link: PATH.AREA_CULTIVATION_METHOD },
      { label: "Lịch sử", link: PATH.AREA_HISTORY },
    ],
  },
  {
    label: "Quản lý cây trồng",
    icon: IconTrees,
    link: PATH.PLANT_MANAGEMENT,
    children: [
      { label: "Cây trồng", link: PATH.PLANT_TREE },
      { label: "Nhóm cây trồng", link: PATH.PLANT_GROUP },
      { label: "Khu vực cây trồng", link: PATH.PLANT_AREA },
      { label: "Giống cây", link: PATH.PLANT_VARIETY },
      { label: "Hạt giống", link: PATH.PLANT_SEED },
      { label: "Thực thu hoạch", link: PATH.PLANT_HARVEST },
      { label: "Tài liệu kỹ thuật", link: PATH.PLANT_TECHNICAL_DOC },
    ],
  },
  {
    label: "Quản lý mùa vụ & chu kỳ",
    icon: IconReportAnalytics,
    link: PATH.SEASON_MANAGEMENT,
    children: [
      { label: "Vụ & sinh trưởng", link: PATH.SEASON_GROWTH },
      { label: "Giai đoạn", link: PATH.SEASON_STAGE },
      { label: "Mùa vụ & chu kỳ", link: PATH.SEASON_CYCLE },
    ],
  },
  {
    label: "Quản lý kế hoạch",
    icon: IconSettingsAutomation,
    link: PATH.PLAN_MANAGEMENT,
    children: [
      { label: "Kế hoạch", link: PATH.PLAN_MAIN },
      { label: "Phân công việc", link: PATH.PLAN_ASSIGN },
      { label: "Giao việc phát sinh", link: PATH.PLAN_UNPLANNED },
      { label: "Lịch sử", link: PATH.PLAN_HISTORY },
    ],
  },
  {
    label: "Quản lý công việc",
    icon: IconBook2,
    link: PATH.TASK_MANAGEMENT,
    children: [
      { label: "Công việc", link: PATH.TASK_MAIN },
      { label: "Công việc BATMAN", link: PATH.TASK_BATMAN },
    ],
  },
  {
    label: "Quản lý thu hoạch",
    icon: IconReportAnalytics,
    link: PATH.HARVEST_MANAGEMENT,
    children: [
      { label: "Báo cáo thu hoạch", link: PATH.HARVEST_REPORT },
      { label: "Truy vấn cây theo bản đồ", link: PATH.HARVEST_QUERY },
    ],
  },
  {
    label: "Quản lý sản phẩm",
    icon: IconPackage,
    link: PATH.PRODUCT_MANAGEMENT,
    children: [
      { label: "Sản phẩm", link: PATH.PRODUCT_ITEM },
      { label: "Đơn vị tính", link: PATH.PRODUCT_UNIT },
      { label: "BOM", link: PATH.PRODUCT_BOM },
      { label: "Nguyên vật liệu", link: PATH.PRODUCT_RAW_MATERIAL },
    ],
  },
  {
    label: "Quản lý hợp đồng",
    icon: IconReportMoney,
    link: PATH.CONTRACT_MANAGEMENT,
  },
  {
    label: "Quản lý nhân sự",
    icon: IconUsersGroup,
    link: PATH.HR_MANAGEMENT,
    children: [
      { label: "Phòng ban", link: PATH.HR_DEPARTMENT },
      { label: "Vị trí", link: PATH.HR_POSITION },
      { label: "Tổ đội", link: PATH.HR_TEAM },
      { label: "Nhân viên", link: PATH.HR_EMPLOYEE },
    ],
  },
  {
    label: "Quản lý nhà máy",
    icon: IconBuildingFactory,
    link: PATH.FACTORY_MANAGEMENT,
    children: [
      { label: "Nhà máy", link: PATH.FACTORY_MAIN },
      { label: "Lịch sử chỉnh sửa", link: PATH.FACTORY_HISTORY },
    ],
  },
  {
    label: "Quản lý máy móc",
    icon: IconTractor,
    link: PATH.MACHINE_MANAGEMENT,
    children: [
      { label: "Máy móc", link: PATH.MACHINE_MAIN },
      { label: "Lịch sử sử dụng", link: PATH.MACHINE_USAGE_HISTORY },
      { label: "Lịch sử bảo trì", link: PATH.MACHINE_MAINTENANCE_HISTORY },
    ],
  },
  {
    label: "Thuốc BVTV",
    icon: IconPackage,
    link: PATH.PESTICIDE_MANAGEMENT,
    children: [
      { label: "Thuốc", link: PATH.PESTICIDE_MAIN },
      { label: "Danh mục thuốc", link: PATH.PESTICIDE_CATEGORY },
    ],
  },
  {
    label: "Quản lý vật tư",
    icon: IconPackage,
    link: PATH.SUPPLY_MANAGEMENT,
  },
  {
    label: "Quản lý kho",
    icon: IconCoin,
    link: PATH.STOCK_MANAGEMENT,
    children: [
      { label: "Xuất/nhập vật tư", link: PATH.STOCK_SUPPLY },
      { label: "Xuất/nhập thuốc", link: PATH.STOCK_PESTICIDE },
      { label: "Xuất/nhập máy móc", link: PATH.STOCK_MACHINE },
      { label: "Xuất/nhập hạt giống", link: PATH.STOCK_SEED },
      { label: "Tạo phiếu xuất/nhập", link: PATH.STOCK_FORM },
    ],
  },
  {
    label: "Mua hàng",
    icon: IconShoppingCart,
    link: PATH.PURCHASE,
  },
  {
    label: "Bán hàng",
    icon: IconBuildingStore,
    link: PATH.SELL,
  },
  {
    label: "Tài chính & Kế toán",
    icon: IconReportMoney,
    link: PATH.FINANCE_ACCOUNT,
  },
];
