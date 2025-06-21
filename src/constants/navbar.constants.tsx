import {
  IconBook2,
  IconBuildingCottage,
  IconBuildingStore,
  IconCalendarWeek,
  IconCoin,
  IconHome,
  IconReportMoney,
  IconShoppingCart,
  IconTractor,
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
    label: "Quản lý vườn cây",
    icon: IconBuildingCottage,
    link: PATH.GARDEN_MANAGEMENT,
    children: [
      {
        label: "Loại cây trồng",
        link: PATH.GARDEN_MANAGEMENT_TYPE,
      },
      {
        label: "Vùng trồng",
        link: PATH.GARDEN_MANAGEMENT_AREA,
      },
      {
        label: "Bản đồ nông nghiệp",
        link: PATH.GARDEN_MANAGEMENT_MAP,
      },
    ],
  },
  {
    label: "Quản lý canh tác",
    icon: IconTractor,
    link: PATH.FARMING_MANAGEMENT,
    children: [
      {
        label: "Kế hoạch canh tác",
        link: PATH.FARMING_PLAN,
      },
      {
        label: "Công việc theo kế hoạch",
        link: PATH.FARMING_TASK_BY_PLAN,
      },
      {
        label: "Công việc phát sinh",
        link: PATH.FARMING_UNPLANNED_TASK,
      },
      {
        label: "Kế hoạch BATMAN",
        link: PATH.FARMING_BATMAN_PLAN,
      },
      {
        label: "Dự báo sản lượng",
        link: PATH.FARMING_YIELD_FORECAST,
      },
      {
        label: "Menu",
        link: PATH.FARMING_MENU,
      },
    ],
  },
  {
    label: "Biểu mẫu canh tác",
    icon: IconBook2,
    link: PATH.FARMING_FORM_ROOT,
    children: [
      {
        label: "Nhật ký canh tác",
        link: PATH.FARMING_FORM_HISTORY,
      },
      {
        label: "Phiếu giao việc theo kế hoạch",
        link: PATH.FARMING_FORM_BY_PLAN,
      },
      {
        label: "Phiếu giao việc phát sinh",
        link: PATH.FARMING_FORM_UNPLANNED,
      },
      {
        label: "Phiếu BATMAN",
        link: PATH.FARMING_FORM_BATMAN,
      },
    ],
  },

  {
    label: "Quản lý kho & Tài sản",
    icon: IconCoin,
    link: PATH.INVENTORY_AND_ASSET_MANAGEMENT,
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
    chidren: [],
  },
  {
    label: "Tài chính & Kế toán",
    icon: IconReportMoney,
    link: PATH.FINANCE_ACCOUNT,
  },
];
