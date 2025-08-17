import { useState } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Collapse,
  Divider,
  Grid,
  Group,
  Image,
  Menu,
  Modal,
  MultiSelect,
  Paper,
  ScrollAreaAutosize,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconBadge,
  IconBorderAll,
  IconCalendar,
  IconCertificate,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFilter,
  IconMap2,
  IconRotateClockwise2,
  IconSearch,
  IconShieldCheck,
  IconSparkles,
  IconTrash,
} from "@tabler/icons-react";
import Table from "../../../components/Table";
import type { MRT_ColumnDef } from "mantine-react-table";
import MapBox from "../Region/Detail/components/Map";
import Scrollable from "../../../components/Scrollable";

import {
  ResourceCard,
  type Resource,
} from "../../PlanManagementPage/Assign/Add/components/ConfirmStep";
import {
  TreeDetailModal,
  type TreeDetail,
} from "../Search/components/TreeDetailModal";
import { InfoRow } from "../Region/Add";
import { areaOptions } from "../Row/Add";
import { EmployeeCardList } from "../../HRManagementPage/Team/Add/components/EmployeeCardList";

// ---------------- Types & mock data ----------------
type TreeCrop = {
  id: string; // Mã cây trồng
  name: string; // Cây trồng
  variety: string; // Giống cây
  seedType: string; // Hạt giống
  plantingDate: string; // Thời gian trồng
};
type CultivationHistory = {
  id: string;
  cropSeasonName: string; // Mùa vụ
  planName: string; // Kế hoạch
  actualStart: string; // Thời gian thực hiện
  expectedEnd: string; // Thời gian dự kiến hoàn thành
  actualEnd: string; // Thời gian hoàn thành thực tế
  manager: string; // Nhân sự quản lý
  qualityStaff: string; // Nhân sự kiểm định chất lượng
};
type CultivationNote = {
  id: string; // Số phiếu
  expectedStart: string; // Thời gian dự kiến thực hiện
  expectedEnd: string; // Thời gian dự kiến hoàn thành
  actualStart: string; // Thời gian thực hiện
  actualEnd: string; // Thời gian hoàn thành
};

const cultivationNoteData: CultivationNote[] = [
  {
    id: "PH001",
    expectedStart: "2025-02-01",
    expectedEnd: "2025-02-10",
    actualStart: "2025-02-02",
    actualEnd: "2025-02-09",
  },
  {
    id: "PH002",
    expectedStart: "2024-06-05",
    expectedEnd: "2024-06-15",
    actualStart: "2024-06-06",
    actualEnd: "2024-06-14",
  },
];
const cultivationHistoryData: CultivationHistory[] = [
  {
    id: "PH001",
    cropSeasonName: "Mùa vụ Xuân 2025",
    planName: "Kế hoạch phun thuốc sâu",
    actualStart: "2025-02-02",
    expectedEnd: "2025-02-10",
    actualEnd: "2025-02-09",
    manager: "Nguyễn Văn A",
    qualityStaff: "Trần Thị B",
  },
  {
    id: "PH002",
    cropSeasonName: "Mùa vụ Hè 2024",
    planName: "Bón phân hữu cơ",
    actualStart: "2024-06-05",
    expectedEnd: "2024-06-15",
    actualEnd: "2024-06-14",
    manager: "Lê Văn C",
    qualityStaff: "Nguyễn Thị D",
  },
];

const resource: Resource[] = [
  {
    type: "Thiết bị",
    name: "Máy cày Kubota L3218",
    quantity: 3,
    unit: "cái",
    img: "https://kubotadailoi.com/uploads/images/P-1176_L3218_slide.jpg",
  },
  {
    type: "Thiết bị",
    name: "Máy bay nông nghiệp DJI Agras",
    quantity: 1,
    unit: "cái",
    img: "https://agridrone.vn/wp-content/uploads/2023/02/16887_T50_%E6%AD%A3%E4%BE%A7.jpg",
  },
  {
    type: "Vật tư",
    name: "Béc tưới nhỏ giọt 8L/h",
    quantity: 1200,
    unit: "cái",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXj6nfv7JlBEuVoQo0o9DUUXGAnLXXec-JLg&s",
  },
  {
    type: "Vật tư",
    name: "Ống HDPE Φ16",
    quantity: 800,
    unit: "m",
    img: "https://bizweb.dktcdn.net/thumb/1024x1024/100/348/321/products/ong-hdpe-wata-20.jpg?v=1669780765193",
  },
  {
    type: "Thuốc BVTV",
    name: "Thuốc trừ sâu Emamectin 5%",
    quantity: 40,
    unit: "chai",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV9s4k_p9Y4CZNPLFlRhbQPc4GZZvVNSoGVg&s",
  },
  {
    type: "Thuốc BVTV",
    name: "Thuốc trừ nấm Mancozeb 80WP",
    quantity: 8,
    unit: "gói",
    img: "https://nongduochai.vn/images/products/2021/04/13/original/manozeb-80wp_xanh_1kg_1618288208.png",
  },
];
const treeCropData: TreeCrop[] = [
  {
    id: "TREE001",
    name: "Sầu riêng",
    variety: "Ri6",
    seedType: "Hạt lai F1",
    plantingDate: "2023-05-10",
  },
  {
    id: "TREE002",
    name: "Xoài",
    variety: "Cát Chu",
    seedType: "Ghép cành",
    plantingDate: "2024-03-15",
  },
];
const treeDetail: TreeDetail = {
  id: "CT001",
  name: "Sầu riêng Ri6",
  type: "Cây ăn trái",
  note: "Ưa đất thịt, thoát nước tốt.",
  seedCode: "SR-RI6",
  seedName: "Giống Ri6",
  supplier: "Công ty Nông sản Việt",
  origin: "Việt Nam",
  germinationRate: "85",
  yield: "25",
  seedNote: "Giống được kiểm định bởi Bộ NN&PTNT.",
  seedDoc: null,
  harvestMethod: "Theo quả",
  growthCycle: "Trung bình 3 năm",
  growthStages: [
    "Ươm giống",
    "Trồng cây con",
    "Chăm sóc sinh trưởng",
    "Ra hoa",
    "Kết trái",
  ],
  growthTime: "1095",
  growthNote: "Cần tỉa cành định kỳ và phòng ngừa sâu bệnh.",
};
const companyOptions = [
  {
    label:
      "Hộ ông Nguyễn Văn A - Nguyễn Văn A - Ấp 1, xã Tân Lập, huyện Hớn Quản, Bình Phước",
    value: "company1",
  },
  {
    label:
      "HTX Nông nghiệp Bền Vững - Trần Thị B - Xã Phú Riềng, huyện Phú Riềng, Bình Phước",
    value: "company2",
  },
  // Thêm các doanh nghiệp/nông hộ khác ở đây
];

type AreaZone = {
  id: string;
  code: string;
  name: string;
  regionName: string;
  areaName?: string;
  plotName?: string;
  employee: string;
  area: number; // diện tích (m²)
  soilType: string;
  terrain: string[];
  mainCrop: string;
  gps: string;
  numberOfLots: number;
  cultivationZone: string;
  tree: string;
};
const areaZoneData: AreaZone[] = [
  {
    id: "V001",
    code: "V-A1",
    name: "Khu vực A1",
    regionName: "Vùng Trồng A",
    employee: "Nguyễn Văn A",
    area: 10000,
    tree: "Sầu riêng",

    soilType: "Đất thịt",
    terrain: ["Cao", "Dốc"],
    mainCrop: "Sầu riêng",
    gps: "12.3456,78.9101 12.3457,78.9102 12.3458,78.9103 12.3459,78.9104",
    numberOfLots: 5,
    cultivationZone: "Khu vực canh tác Đồng Nai",
  },
  {
    id: "V002",
    code: "V-B2",
    name: "Khu vực B2",
    regionName: "Vùng Trồng B",
    employee: "Trần Thị B",
    area: 8500,
    tree: "Sầu riêng",

    soilType: "Đất phù sa",
    terrain: ["Thấp", "Trũng"],
    mainCrop: "Xoài",
    gps: "13.1234,79.5678 13.1235,79.5679 13.1236,79.5680 13.1237,79.5681",
    numberOfLots: 3,
    cultivationZone: "Khu vực canh tác Đồng Nai",
  },
  {
    id: "V003",
    code: "V-C1",
    name: "Khu vực C1",
    tree: "Sầu riêng",

    regionName: "Vùng Trồng C",
    employee: "Lê Văn C",
    area: 6000,
    soilType: "Đất cát",
    terrain: ["Bằng phẳng"],
    mainCrop: "Chuối",
    gps: "14.5678,80.1234 14.5679,80.1235 14.5680,80.1236 14.5681,80.1237",
    numberOfLots: 4,
    cultivationZone: "Khu vực canh tác Tây Nguyên",
  },
  {
    id: "V004",
    code: "V-D3",
    tree: "Sầu riêng",

    name: "Khu vực D3",
    regionName: "Vùng Trồng D",
    employee: "Phạm Thị D",
    area: 12000,
    soilType: "Đất đỏ bazan",
    terrain: ["Cao", "Bằng phẳng"],
    mainCrop: "Cà phê",
    gps: "15.6789,81.2345 15.6790,81.2346 15.6791,81.2347 15.6792,81.2348",
    numberOfLots: 6,
    cultivationZone: "Khu vực canh tác Tây Nguyên",
  },
  {
    id: "V005",
    code: "V-E4",
    tree: "Sầu riêng",

    name: "Khu vực E4",
    regionName: "Vùng Trồng E",
    employee: "Nguyễn Văn E",
    area: 9500,
    soilType: "Đất sét",
    terrain: ["Dốc", "Thấp"],
    mainCrop: "Mít",
    gps: "16.7890,82.3456 16.7891,82.3457 16.7892,82.3458 16.7893,82.3459",
    numberOfLots: 4,
    cultivationZone: "Khu vực canh tác Miền Tây",
  },
  {
    id: "V006",
    code: "V-F5",
    name: "Khu vực F5",
    areaName: "Khu vực F5",
    regionName: "Vùng Trồng F",
    employee: "Hoàng Thị F",
    area: 7000,
    soilType: "Đất phù sa",
    tree: "Bưởi",
    terrain: ["Trũng"],
    mainCrop: "Bưởi",
    gps: "17.8901,83.4567 17.8902,83.4568 17.8903,83.4569 17.8904,83.4570",
    numberOfLots: 3,
    cultivationZone: "Khu vực canh tác Miền Tây",
  },
  {
    id: "V007",
    code: "V-G6",
    areaName: "Khu vực G6",
    plotName: "Lô G61, Lô G62",
    name: "Khu vực G6",
    regionName: "Vùng Trồng G",
    employee: "Vũ Văn G",
    area: 11000,
    tree: "Sầu riêng",
    soilType: "Đất thịt",
    terrain: ["Cao", "Dốc"],
    mainCrop: "Cam",
    gps: "18.9012,84.5678 18.9013,84.5679 18.9014,84.5680 18.9015,84.5681",
    numberOfLots: 5,
    cultivationZone: "Khu vực canh tác Miền Trung",
  },
  {
    id: "V008",
    code: "V-H7",
    name: "Khu vực H7",
    regionName: "Vùng Trồng H",
    employee: "Trần Văn H",
    area: 8000,
    tree: "Sầu riêng",

    soilType: "Đất đỏ bazan",
    terrain: ["Bằng phẳng"],
    mainCrop: "Dừa",
    gps: "19.0123,85.6789 19.0124,85.6790 19.0125,85.6791 19.0126,85.6792",
    numberOfLots: 4,
    cultivationZone: "Khu vực canh tác Miền Trung",
  },
];
const PLOTS = [
  // Khu vực phía Bắc
  {
    id: "plot-001",
    areaCode: "KV-BAC",
    name: "Lô A1",
    employee: "Nguyễn Văn A",
    cultivationMethod: "Hữu cơ",
    crops: [
      {
        cropGroup: "Trái cây",
        cropCode: "SR001",
        cropName: "Cây sầu riêng",
        cultivar: "Sầu riêng Ri6",
        seedCode: "HatSR-A1",
        seedName: "Hạt giống Ri6 F1",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiewLxKYlUogAMvIFZH-d7Zk2ILXPRtmWlXA&s",
      },
      {
        cropGroup: "Trái cây",
        cropCode: "SR002",
        cropName: "Cây sầu riêng",
        cultivar: "Sầu riêng Monthong",
        seedCode: "HatSR-B2",
        seedName: "Hạt giống Monthong Thái Lan",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiewLxKYlUogAMvIFZH-d7Zk2ILXPRtmWlXA&s",
      },
      {
        cropGroup: "Trái cây",
        cropCode: "XM001",
        cropName: "Cây xoài",
        cultivar: "Xoài cát Hòa Lộc",
        seedCode: "HatXM-A1",
        seedName: "Hạt giống Hòa Lộc F1",
        image:
          "https://caylaygo.com/wp-content/uploads/2022/05/cay-xoai-cat-3.jpg",
      },
      {
        cropGroup: "Trái cây",
        cropCode: "XM002",
        cropName: "Cây xoài",
        cultivar: "Xoài keo",
        seedCode: "HatXM-B2",
        seedName: "Hạt giống xoài keo giống chuẩn",
        image:
          "https://caylaygo.com/wp-content/uploads/2022/05/cay-xoai-cat-3.jpg",
      },
    ],
  },
  {
    id: "plot-002",
    areaCode: "KV-BAC",
    name: "Lô A2",
    employee: "Nguyễn Văn A",
    cultivationMethod: "Hữu cơ",
    crops: [
      {
        cropGroup: "Trái cây",
        cropCode: "SR001",
        cropName: "Cây sầu riêng",
        cultivar: "Sầu riêng Ri6",
        seedCode: "HatSR-A1",
        seedName: "Hạt giống Ri6 F1",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiewLxKYlUogAMvIFZH-d7Zk2ILXPRtmWlXA&s",
      },
      {
        cropGroup: "Trái cây",
        cropCode: "SR002",
        cropName: "Cây sầu riêng",
        cultivar: "Sầu riêng Monthong",
        seedCode: "HatSR-B2",
        seedName: "Hạt giống Monthong Thái Lan",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiewLxKYlUogAMvIFZH-d7Zk2ILXPRtmWlXA&s",
      },
      {
        cropGroup: "Trái cây",
        cropCode: "XM001",
        cropName: "Cây xoài",
        cultivar: "Xoài cát Hòa Lộc",
        seedCode: "HatXM-A1",
        seedName: "Hạt giống Hòa Lộc F1",
        image:
          "https://caylaygo.com/wp-content/uploads/2022/05/cay-xoai-cat-3.jpg",
      },
      {
        cropGroup: "Trái cây",
        cropCode: "XM002",
        cropName: "Cây xoài",
        cultivar: "Xoài keo",
        seedCode: "HatXM-B2",
        seedName: "Hạt giống xoài keo giống chuẩn",
        image:
          "https://caylaygo.com/wp-content/uploads/2022/05/cay-xoai-cat-3.jpg",
      },
    ],
  },
  {
    id: "plot-003",
    areaCode: "KV-BAC",
    name: "Lô A3",
    employee: "Lê Văn C",
    cultivationMethod: "Tưới nhỏ giọt",
    crops: [
      {
        cropGroup: "Trái cây",
        cropCode: "SR001",
        cropName: "Cây sầu riêng",
        cultivar: "Sầu riêng Ri6",
        seedCode: "HatSR-A1",
        seedName: "Hạt giống Ri6 F1",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiewLxKYlUogAMvIFZH-d7Zk2ILXPRtmWlXA&s",
      },
    ],
  },

  // Khu vực phía Nam
  {
    id: "plot-004",
    areaCode: "KV-NAM",
    name: "Lô B1",
    employee: "Trần Thị B",
    cultivationMethod: "Thủy canh",
    crops: [
      {
        cropGroup: "Trái cây",
        cropCode: "SR001",
        cropName: "Cây sầu riêng",
        cultivar: "Sầu riêng Ri6",
        seedCode: "HatSR-A1",
        seedName: "Hạt giống Ri6 F1",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiewLxKYlUogAMvIFZH-d7Zk2ILXPRtmWlXA&s",
      },
      {
        cropGroup: "Trái cây",
        cropCode: "SR002",
        cropName: "Cây sầu riêng",
        cultivar: "Sầu riêng Monthong",
        seedCode: "HatSR-B2",
        seedName: "Hạt giống Monthong Thái Lan",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiewLxKYlUogAMvIFZH-d7Zk2ILXPRtmWlXA&s",
      },
    ],
  },
  {
    id: "plot-005",
    areaCode: "KV-NAM",
    name: "Lô B2",
    employee: "Trần Thị B",
    cultivationMethod: "Canh tác tự nhiên",
    crops: [
      {
        cropGroup: "Trái cây",
        cropCode: "XM001",
        cropName: "Cây xoài",
        cultivar: "Xoài cát Hòa Lộc",
        seedCode: "HatXM-A1",
        seedName: "Hạt giống Hòa Lộc F1",
        image:
          "https://caylaygo.com/wp-content/uploads/2022/05/cay-xoai-cat-3.jpg",
      },
      {
        cropGroup: "Trái cây",
        cropCode: "XM002",
        cropName: "Cây xoài",
        cultivar: "Xoài keo",
        seedCode: "HatXM-B2",
        seedName: "Hạt giống xoài keo giống chuẩn",
        image:
          "https://caylaygo.com/wp-content/uploads/2022/05/cay-xoai-cat-3.jpg",
      },
    ],
  },
  {
    id: "plot-006",
    areaCode: "KV-NAM",
    name: "Lô B3",
    employee: "Trần Thị B",
    cultivationMethod: "Hữu cơ",
    crops: [
      {
        cropGroup: "Trái cây",
        cropCode: "SR001",
        cropName: "Cây sầu riêng",
        cultivar: "Sầu riêng Ri6",
        seedCode: "HatSR-A1",
        seedName: "Hạt giống Ri6 F1",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiewLxKYlUogAMvIFZH-d7Zk2ILXPRtmWlXA&s",
      },
    ],
  },

  // Khu vực phía Tây
  {
    id: "plot-007",
    areaCode: "KV-TAY",
    name: "Lô C1",
    employee: "Phạm Văn C",
    cultivationMethod: "Tưới nhỏ giọt",
    crops: [
      {
        cropGroup: "Trái cây",
        cropCode: "SR001",
        cropName: "Cây sầu riêng",
        cultivar: "Sầu riêng Ri6",
        seedCode: "HatSR-A1",
        seedName: "Hạt giống Ri6 F1",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiewLxKYlUogAMvIFZH-d7Zk2ILXPRtmWlXA&s",
      },
    ],
  },
  {
    id: "plot-008",
    areaCode: "KV-TAY",
    name: "Lô C2",
    employee: "Phạm Văn C",
    cultivationMethod: "Canh tác hữu cơ",
    crops: [
      {
        cropGroup: "Trái cây",
        cropCode: "SR001",
        cropName: "Cây sầu riêng",
        cultivar: "Sầu riêng Ri6",
        seedCode: "HatSR-A1",
        seedName: "Hạt giống Ri6 F1",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiewLxKYlUogAMvIFZH-d7Zk2ILXPRtmWlXA&s",
      },
    ],
  },
  {
    id: "plot-009",
    areaCode: "KV-TAY",
    name: "Lô C3",
    employee: "Phạm Văn C",
    cultivationMethod: "Tưới phun mưa",
    crops: [
      {
        cropGroup: "Trái cây",
        cropCode: "SR001",
        cropName: "Cây sầu riêng",
        cultivar: "Sầu riêng Ri6",
        seedCode: "HatSR-A1",
        seedName: "Hạt giống Ri6 F1",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiewLxKYlUogAMvIFZH-d7Zk2ILXPRtmWlXA&s",
      },
    ],
  },
  {
    id: "plot-010",
    areaCode: "KV-TAY",
    name: "Lô C4",
    employee: "Phạm Văn C",
    cultivationMethod: "Thủy canh",
    crops: [
      {
        cropGroup: "Trái cây",
        cropCode: "SR001",
        cropName: "Cây sầu riêng",
        cultivar: "Sầu riêng Ri6",
        seedCode: "HatSR-A1",
        seedName: "Hạt giống Ri6 F1",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiewLxKYlUogAMvIFZH-d7Zk2ILXPRtmWlXA&s",
      },
      {
        cropGroup: "Trái cây",
        cropCode: "SR002",
        cropName: "Cây sầu riêng",
        cultivar: "Sầu riêng Monthong",
        seedCode: "HatSR-B2",
        seedName: "Hạt giống Monthong Thái Lan",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiewLxKYlUogAMvIFZH-d7Zk2ILXPRtmWlXA&s",
      },
      {
        cropGroup: "Trái cây",
        cropCode: "XM001",
        cropName: "Cây xoài",
        cultivar: "Xoài cát Hòa Lộc",
        seedCode: "HatXM-A1",
        seedName: "Hạt giống Hòa Lộc F1",
        image:
          "https://caylaygo.com/wp-content/uploads/2022/05/cay-xoai-cat-3.jpg",
      },
    ],
  },

  // Khu vực phía Đông
  {
    id: "plot-011",
    areaCode: "KV-DONG",
    name: "Lô D1",
    employee: "Nguyễn Thị D",
    cultivationMethod: "Tưới phun mưa",
    crops: [
      {
        cropGroup: "Trái cây",
        cropCode: "SR001",
        cropName: "Cây sầu riêng",
        cultivar: "Sầu riêng Ri6",
        seedCode: "HatSR-A1",
        seedName: "Hạt giống Ri6 F1",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiewLxKYlUogAMvIFZH-d7Zk2ILXPRtmWlXA&s",
      },
    ],
  },
  {
    id: "plot-012",
    areaCode: "KV-DONG",
    name: "Lô D2",
    employee: "Nguyễn Thị D",
    cultivationMethod: "Hữu cơ",
    crops: [
      {
        cropGroup: "Trái cây",
        cropCode: "SR001",
        cropName: "Cây sầu riêng",
        cultivar: "Sầu riêng Ri6",
        seedCode: "HatSR-A1",
        seedName: "Hạt giống Ri6 F1",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiewLxKYlUogAMvIFZH-d7Zk2ILXPRtmWlXA&s",
      },
    ],
  },
  {
    id: "plot-013",
    areaCode: "KV-DONG",
    name: "Lô D3",
    employee: "Nguyễn Thị D",
    cultivationMethod: "Tưới nhỏ giọt",
    crops: [
      {
        cropGroup: "Trái cây",
        cropCode: "SR001",
        cropName: "Cây sầu riêng",
        cultivar: "Sầu riêng Ri6",
        seedCode: "HatSR-A1",
        seedName: "Hạt giống Ri6 F1",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiewLxKYlUogAMvIFZH-d7Zk2ILXPRtmWlXA&s",
      },
    ],
  },
];
export default function MVFarmSearch() {
  const [keyword, setKeyword] = useState("");
  const [view, setView] = useState<"details" | "list">("details");
  const [cultivationDetail, setCultivationDetail] = useState(false);
  const [cultivationNoteDetail, setCultivationNoteDetail] = useState(false);
  const [openedTreeDetail, setOpenedTreeDetail] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  // ---------- Columns ----------
  const areaZoneColumns: MRT_ColumnDef<AreaZone>[] = [
    {
      accessorKey: "cultivationZone",
      header: "Khu vực canh tác",
    },
    {
      accessorKey: "regionName",
      header: "Vùng",
    },
    {
      accessorKey: "areaName",
      header: "Khu vực",
    },
    {
      accessorKey: "plotName",
      header: "Lô",
    },
    {
      accessorKey: "area",
      header: "Diện tích canh tác (m²)",
      Cell: ({ row }) => <Text>{row.original.area.toLocaleString()} m²</Text>,
    },
    {
      accessorKey: "tree",
      header: "Cây trồng",
    },
    {
      accessorKey: "employee",
      header: "Người quản lý",
    },

    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 10,
      Cell: () => (
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="transparent" c={"gray"}>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item leftSection={<IconEye size={18} color="gray" />}>
              Chi tiết
            </Menu.Item>
            <Menu.Item leftSection={<IconEdit size={18} color="green" />}>
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={18} />} color="red">
              Xoá
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];
  const cultivationNoteColumns: MRT_ColumnDef<CultivationNote>[] = [
    { accessorKey: "id", header: "Số phiếu" },
    { accessorKey: "expectedStart", header: "Thời gian dự kiến thực hiện" },
    { accessorKey: "expectedEnd", header: "Thời gian dự kiến hoàn thành" },
    { accessorKey: "actualStart", header: "Thời gian thực hiện" },
    { accessorKey: "actualEnd", header: "Thời gian hoàn thành" },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 10,
      Cell: () => (
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="transparent" c={"gray"}>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={() => setCultivationNoteDetail(true)}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item leftSection={<IconEdit size={18} color="green" />}>
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={18} />} color="red">
              Xoá
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];
  const cultivationHistoryColumns: MRT_ColumnDef<CultivationHistory>[] = [
    { accessorKey: "cropSeasonName", header: "Mùa vụ" },
    { accessorKey: "planName", header: "Kế hoạch" },
    { accessorKey: "actualStart", header: "Thời gian thực hiện" },
    { accessorKey: "expectedEnd", header: "Thời gian dự kiến hoàn thành" },
    { accessorKey: "actualEnd", header: "Thời gian hoàn thành thực tế" },
    { accessorKey: "manager", header: "Nhân sự quản lý" },
    { accessorKey: "qualityStaff", header: "Nhân sự kiểm định chất lượng" },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 10,
      Cell: () => (
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="transparent" c={"gray"}>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={() => setCultivationDetail(true)}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item leftSection={<IconEdit size={18} color="green" />}>
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={18} />} color="red">
              Xoá
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  // Quick counts for header badges (mock derived)
  const totalTrees = treeCropData.length;

  return (
    <Stack p="md" gap="md">
      {/* ------ Header / Filters ------ */}
      <Card withBorder radius={8} shadow="sm" p="lg">
        <Stack gap="md">
          {/* Header */}
          <Group gap="md" align="center" justify="space-between">
            <Group gap="md">
              <ThemeIcon variant="light" radius="xl" size={36}>
                <IconBorderAll size={20} />
              </ThemeIcon>
              <Title order={3}>Tìm kiếm vùng trồng</Title>
            </Group>
            <SegmentedControl
              value={view}
              onChange={(v) => setView(v as "details" | "list")}
              data={[
                { label: "Chi tiết", value: "details" },
                { label: "Danh sách", value: "list" },
              ]}
              radius={4}
            />
          </Group>

          {/* Search & filter actions */}
          <Group align="flex-end" wrap="nowrap">
            <TextInput
              flex={1}
              label="Từ khoá"
              radius={4}
              placeholder="Vùng trồng Đông Nam Bộ"
              leftSection={<IconSearch size={16} />}
              value={keyword}
              onChange={(e) => setKeyword(e.currentTarget.value)}
            />
            <Tooltip label="Bộ lọc nâng cao" openDelay={300}>
              <Button
                radius={4}
                leftSection={<IconFilter size={16} />}
                onClick={() => {
                  setIsFilter(!isFilter);
                }}
              >
                {isFilter ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
              </Button>
            </Tooltip>
            <Tooltip label="Xoá bộ lọc" openDelay={300}>
              <ActionIcon variant="light" radius={4} aria-label="reset">
                <IconRotateClockwise2 size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>

          <Collapse in={isFilter} transitionDuration={170}>
            <Paper withBorder p="lg" radius={4}>
              <Stack gap="sm">
                <Group gap={8}>
                  <ThemeIcon variant="light" color="teal" radius="xl">
                    <IconMap2 size={18} />
                  </ThemeIcon>
                  <Title order={5} fw={600}>
                    Thông tin vùng trồng
                  </Title>
                </Group>
                <MultiSelect
                  radius={4}
                  searchable
                  clearable
                  label="Cây trồng"
                  data={["Sầu Riêng", "Xoài"]}
                  styles={{ dropdown: { zIndex: 1000 } }}
                />
                <Group grow>
                  <MultiSelect
                    searchable
                    clearable
                    radius={4}
                    multiple
                    label="Tỉnh/Thành phố"
                    placeholder="Tỉnh/Thành phố"
                    data={[
                      "Hà Nội",
                      "TP. Hồ Chí Minh",
                      "Đà Nẵng",
                      "Cần Thơ",
                      "Hải Phòng",
                      "Nha Trang",
                      "Bình Dương",
                      "Đồng Nai",
                      "Bà Rịa - Vũng Tàu",
                      "Quảng Ninh",
                      "Thanh Hóa",
                      "Nghệ An",
                      "Huế",
                      "Quảng Nam",
                      "Quảng Ngãi",
                      "Bắc Ninh",
                      "Bắc Giang",
                      "Lâm Đồng",
                      "Tiền Giang",
                      "Long An",
                      "Vĩnh Long",
                      "Sóc Trăng",
                      "Kiên Giang",
                      "Cà Mau",
                      "Bình Thuận",
                      "Phú Yên",
                      "Khánh Hòa",
                      "Tây Ninh",
                      "Trà Vinh",
                      "Bến Tre",
                      "Hậu Giang",
                      "Đắk Lắk",
                      "Đắk Nông",
                      "Gia Lai",
                      "Kon Tum",
                      "Hà Tĩnh",
                      "Quảng Bình",
                      "Quảng Trị",
                      "Thái Bình",
                      "Nam Định",
                      "Ninh Bình",
                      "Hòa Bình",
                      "Sơn La",
                      "Lai Châu",
                      "Điện Biên",
                      "Lào Cai",
                      "Yên Bái",
                      "Tuyên Quang",
                      "Phú Thọ",
                      "Vĩnh Phúc",
                      "Hà Nam",
                      "Hưng Yên",
                      "Hải Dương",
                      "Thái Nguyên",
                      "Bắc Kạn",
                      "Cao Bằng",
                      "Lạng Sơn",
                    ]}
                  />
                  <MultiSelect
                    clearable
                    radius={4}
                    searchable
                    label="Phường/Xã"
                    placeholder="Phường/Xã"
                    data={[
                      "Phường Bến Nghé",
                      "Phường Bến Thành",
                      "Phường Nguyễn Thái Bình",
                      "Phường Phạm Ngũ Lão",
                      "Phường Tân Định",
                      "Phường Đa Kao",
                      "Phường 1 (Quận 3)",
                      "Phường 2 (Quận 3)",
                      "Phường 3 (Quận 3)",
                      "Phường 4 (Quận 3)",
                      "Phường 5 (Quận 3)",
                      "Phường 6 (Quận 3)",
                      "Phường 7 (Quận 3)",
                      "Phường 8 (Quận 3)",
                      "Phường 9 (Quận 3)",
                      "Phường 10 (Quận 3)",
                      "Phường 11 (Quận 3)",
                      "Phường 12 (Quận 3)",
                      "Xã Tân Phú Trung",
                      "Xã Bình Mỹ",
                      "Xã Thới Tam Thôn",
                      "Xã Trung An",
                      "Xã Phước Vĩnh An",
                      "Xã Phước Hiệp",
                      "Xã Phước Thạnh",
                      "Xã An Nhơn Tây",
                      "Xã Nhuận Đức",
                      "Xã Phạm Văn Cội",
                      "Xã Phú Hòa Đông",
                      "Xã Phú Mỹ Hưng",
                      "Xã Phước Lộc",
                      "Xã Long Thới",
                      "Xã Nhơn Đức",
                      "Xã Phước Kiển",
                      "Xã Bình Hưng",
                      "Xã Đa Phước",
                      "Xã Tân Kiên",
                      "Xã Tân Nhựt",
                      "Xã Lê Minh Xuân",
                      "Xã Vĩnh Lộc A",
                      "Xã Vĩnh Lộc B",
                      "Xã Phạm Văn Hai",
                      "Xã Quy Đức",
                      "Xã Hưng Long",
                      "Xã Bình Chánh",
                      "Xã An Phú Tây",
                      "Xã Tân Quý Tây",
                      "Xã Tân Túc",
                      "Xã Bình Lợi",
                      "Xã Bình Thắng",
                      "Xã Bình An",
                      "Xã Bình Chuẩn",
                      "Xã Bình Hòa",
                      "Xã Bình Nhâm",
                      "Xã Bình Phước",
                      "Xã Bình Sơn",
                      "Xã Bình Tân",
                      "Xã Bình Thạnh",
                      "Xã Bình Thuận",
                      "Xã Bình Trị",
                      "Xã Bình Xuyên",
                      "Xã Bình Yên",
                      "Xã Bình Định",
                      "Xã Bình Dương",
                      "Xã Bình Phú",
                      "Xã Bình Quới",
                      "Xã Bình Thới",
                      "Xã Bình Thành",
                      "Xã Bình Tiến",
                      "Xã Bình Trưng",
                    ]}
                  />
                </Group>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                  <Select
                    radius={4}
                    searchable
                    clearable
                    label="Doanh nghiệp / nông hộ"
                    data={companyOptions}
                    styles={{ dropdown: { zIndex: 1000 } }}
                  />

                  <Select
                    radius={4}
                    data={["V01", "V02", "V03"]}
                    label="Mã định danh"
                    searchable
                    clearable
                    styles={{ dropdown: { zIndex: 1000 } }}
                  />
                </SimpleGrid>

                <Group justify="space-between" mt="md">
                  <Button
                    variant="light"
                    radius={4}
                    leftSection={<IconRotateClockwise2 size={16} />}
                  >
                    Xoá bộ lọc
                  </Button>
                  <Button radius={4} leftSection={<IconSparkles size={16} />}>
                    Lọc dữ liệu
                  </Button>
                </Group>
              </Stack>
            </Paper>
          </Collapse>
        </Stack>
      </Card>

      {/* ------ Content ------ */}
      {view === "details" ? (
        <Stack gap="md">
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Card shadow="sm" radius={4} withBorder p="lg" mb="md">
                <Stack gap={8}>
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="green">
                      <IconBadge size={16} />
                    </ThemeIcon>
                    <Text fw={700} size="lg">
                      Thông tin canh tác
                    </Text>
                  </Group>
                  <Card withBorder radius={4} shadow="sm" p="md">
                    <Title order={5} mb="xs">
                      🌱 Thông tin các lô cây trồng theo khu vực
                    </Title>
                    <ScrollAreaAutosize mah={500}>
                      <Stack gap="md">
                        {areaOptions.map((area) => {
                          const plotsInArea = PLOTS.filter(
                            (plot) => plot.areaCode === area.code
                          );
                          if (plotsInArea.length === 0) return null;

                          return (
                            <Box key={area.code}>
                              <Card
                                withBorder
                                radius="sm"
                                shadow="xs"
                                p="sm"
                                mb="xs"
                                bg="gray.0"
                              >
                                <Group
                                  justify="space-between"
                                  align="flex-start"
                                >
                                  <Box>
                                    <Title order={6}>
                                      📦 Khu vực: {area.name} (Mã: {area.code})
                                    </Title>
                                    <Text size="sm">
                                      <strong>Diện tích:</strong> {area.area}
                                    </Text>
                                    <Text size="sm">
                                      <strong>Loại đất:</strong> {area.soilType}
                                    </Text>
                                    <Text size="sm">
                                      <strong>Địa hình:</strong>{" "}
                                      {area.terrain.join(", ")}
                                    </Text>
                                  </Box>
                                  <Badge
                                    variant="light"
                                    color="green"
                                    size="lg"
                                  >
                                    {plotsInArea.length} lô cây
                                  </Badge>
                                </Group>
                              </Card>

                              <Scrollable h={400}>
                                <Group
                                  wrap="nowrap"
                                  gap="md"
                                  align="flex-start"
                                >
                                  {plotsInArea.map((plot) => (
                                    <Card
                                      key={plot.id}
                                      withBorder
                                      radius="sm"
                                      shadow="xs"
                                      p="sm"
                                      w={450}
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <Group justify="space-between">
                                        <Box>
                                          <Text fw={600}>{plot.name}</Text>
                                          <Badge
                                            color="gray"
                                            variant="light"
                                            mt={4}
                                          >
                                            Mã khu vực: {plot.areaCode}
                                          </Badge>
                                        </Box>
                                        <Text size="sm" c="dimmed">
                                          {plot.cultivationMethod}
                                        </Text>
                                      </Group>

                                      <Box
                                        mt="xs"
                                        style={{
                                          flexGrow: 1,
                                          height: 350, // hoặc bất kỳ chiều cao phù hợp
                                          overflowY: "auto",
                                        }}
                                      >
                                        {plot.crops.length > 0 ? (
                                          <SimpleGrid cols={1} spacing="sm">
                                            {plot.crops.map((crop, i) => (
                                              <Card
                                                key={i}
                                                withBorder
                                                radius="sm"
                                                shadow="xs"
                                                w={"100%"}
                                                p={0}
                                              >
                                                <Group align="flex-start">
                                                  <Image
                                                    src={crop.image}
                                                    alt={crop.cropName}
                                                    w={"40%"}
                                                    h={150}
                                                    fit="cover"
                                                  />
                                                  <Stack
                                                    flex={1}
                                                    gap="xs"
                                                    p={"xs"}
                                                  >
                                                    <Group justify="space-between">
                                                      <Title order={5}>
                                                        {crop.cultivar}
                                                      </Title>
                                                      <Group gap={"xs"}>
                                                        <Badge
                                                          color="gray"
                                                          variant="light"
                                                        >
                                                          {crop.cropCode}
                                                        </Badge>
                                                      </Group>
                                                    </Group>

                                                    <Text size="sm" c="dimmed">
                                                      Cây trồng: {crop.cropName}
                                                    </Text>
                                                    <Text size="sm" c="dimmed">
                                                      Mã cây trồng:{" "}
                                                      {crop.seedCode}
                                                    </Text>
                                                  </Stack>
                                                </Group>
                                              </Card>
                                            ))}
                                          </SimpleGrid>
                                        ) : (
                                          <Text size="sm" c="dimmed">
                                            Chưa có cây trồng nào được thêm vào
                                            lô này.
                                          </Text>
                                        )}
                                      </Box>
                                    </Card>
                                  ))}
                                </Group>
                              </Scrollable>
                            </Box>
                          );
                        })}
                      </Stack>
                    </ScrollAreaAutosize>
                  </Card>
                </Stack>
              </Card>
              <Card withBorder radius={4} shadow="sm" p="md" mb={"md"}>
                <Title order={5} mb="xs">
                  👨‍💼 Nhân viên quản lý
                </Title>
                <EmployeeCardList
                  isDelete={false}
                  isMultiple={false}
                  isTouchable={false}
                />
              </Card>
              <Card shadow="sm" radius={4} withBorder p="lg">
                <Stack gap={8}>
                  <Group gap="xs">
                    <ThemeIcon variant="light">
                      <IconBadge size={16} />
                    </ThemeIcon>
                    <Text fw={700} size="lg">
                      Lịch sử kế hoạch canh tác
                    </Text>
                  </Group>
                  <Table
                    columns={cultivationHistoryColumns}
                    data={cultivationHistoryData}
                  />
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 5 }}>
              <Stack gap="md">
                <Card shadow="sm" radius={4} withBorder p="lg">
                  <Stack gap={"xs"}>
                    <Group gap="sm">
                      <Image
                        src="https://incucdep.com/wp-content/uploads/2015/02/logo-doanh-nghiep-BENTO.jpg"
                        alt="Logo doanh nghiệp"
                        width={40}
                        height={100}
                        radius={40}
                        fit="contain"
                      />
                      <Text fw={700} size="lg">
                        Hộ ông Nguyễn Văn A
                      </Text>
                      <Badge color="green" variant="light" radius="sm">
                        VietGap
                      </Badge>
                      <Badge color="blue" variant="light" radius="sm">
                        GlobalGap
                      </Badge>
                    </Group>
                    <SimpleGrid cols={2} spacing={8}>
                      <Text size="sm" c="gray.6">
                        <b>Mã vùng:</b> V01
                      </Text>
                      <Text size="sm">
                        <b>Vùng trồng:</b> Vùng 1
                      </Text>
                      <Text size="sm">
                        <b>Khu vực:</b> Khu vực A
                      </Text>
                      <Text size="sm">
                        <b>Lô:</b> Lô 05
                      </Text>
                    </SimpleGrid>
                    <Text size="sm">
                      <b>Địa chỉ:</b> Ấp 1, xã Tân Lập, huyện Hớn Quản, Bình
                      Phước
                    </Text>
                    <Divider my={6} />
                    <Group gap="xs">
                      <ThemeIcon variant="light" color="teal">
                        <IconMap2 size={16} />
                      </ThemeIcon>
                      <Text fw={700} size="lg">
                        Bản đồ
                      </Text>
                    </Group>
                    <Box
                      mt="sm"
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: 8,
                        zIndex: 0,
                      }}
                    >
                      <Box
                        style={{
                          position: "absolute",
                          inset: 0,
                          zIndex: 1,
                          // let clicks through but block wheel/gesture
                          pointerEvents: "none",
                        }}
                        onWheel={(e) => e.stopPropagation()}
                      />
                      <MapBox zoom={15} zone />
                    </Box>
                  </Stack>
                </Card>
                <Card withBorder radius={4} shadow="sm" p="md">
                  <Title order={5} mb="xs">
                    🏅 Giấy chứng nhận
                  </Title>

                  <Group align="flex-start" gap="lg" wrap="nowrap">
                    {/* Ảnh chứng nhận + dấu mộc */}
                    <Tooltip label="Dấu chứng nhận VietGAP" withArrow>
                      <Image
                        w={"40%"}
                        src="https://sutech.vn/wp-content/uploads/2021/09/logo-vietgap-chan-nuoi.jpg"
                        alt="Dấu chứng nhận"
                        radius="xl"
                        style={{}}
                      />
                    </Tooltip>

                    {/* Nội dung chi tiết */}
                    <Stack gap="xs" style={{ flex: 1 }}>
                      <Group justify="space-between">
                        <Group gap={8}>
                          <IconCertificate size={18} />
                          <Title order={5} lh={1.2}>
                            Chứng nhận VietGAP
                          </Title>
                        </Group>
                        <Badge
                          color="teal"
                          variant="light"
                          leftSection={<IconShieldCheck size={14} />}
                        >
                          Hiệu lực 3 năm
                        </Badge>
                      </Group>

                      <Group gap="xs" wrap="wrap">
                        <Badge variant="light">GCN-VG-2025-001</Badge>
                        <Badge variant="outline">Tổ chức VietGAP</Badge>
                        <Badge
                          variant="outline"
                          leftSection={<IconCalendar size={14} />}
                        >
                          Cấp ngày 08/01/2025
                        </Badge>
                      </Group>

                      <Divider my={4} />

                      <Stack gap={4}>
                        <InfoRow
                          label="Tên chứng nhận"
                          value="Chứng nhận VietGAP"
                        />
                        <InfoRow label="Mã số" value="GCN-VG-2025-001" />
                        <InfoRow label="Tổ chức cấp" value="Tổ chức VietGAP" />
                        <InfoRow label="Ngày cấp" value="08/01/2025" />
                        <InfoRow label="Thời hạn hiệu lực" value="3 năm" />
                        <Text size="sm" c="dimmed">
                          <strong>Định nghĩa:</strong> VietGAP là tiêu chuẩn sản
                          xuất nông nghiệp tốt.
                        </Text>
                      </Stack>
                    </Stack>
                  </Group>
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      ) : (
        <Card withBorder radius={4} shadow="sm" p="lg">
          <Group mb="sm" justify="space-between">
            <Text fw={700}>Danh sách vùng trồng</Text>
            <Text size="sm" c="dimmed">
              Tổng cộng {totalTrees} mục
            </Text>
          </Group>
          <Table columns={areaZoneColumns} data={areaZoneData} />
        </Card>
      )}

      {/* ------ Filter Modal ------ */}

      {cultivationDetail && (
        <Modal
          opened={cultivationDetail}
          onClose={() => setCultivationDetail(false)}
          size="lg"
          title={
            <Group gap={6}>
              <IconEye size={18} />
              <Text fw={600}>Chi tiết canh tác</Text>
            </Group>
          }
          centered
          withinPortal
        >
          {cultivationNoteData?.length > 0 ? (
            <Table
              data={cultivationNoteData}
              columns={cultivationNoteColumns}
            />
          ) : (
            <Text c="red">Không có dữ liệu!</Text>
          )}
        </Modal>
      )}
      {cultivationNoteDetail && (
        <Modal
          opened={cultivationNoteDetail}
          onClose={() => setCultivationNoteDetail(false)}
          size="lg"
          title={
            <Group gap={6}>
              <IconEye size={18} />
              <Text fw={600}>Chi tiết sổ tay canh tác</Text>
            </Group>
          }
          centered
          withinPortal
        >
          <Card withBorder radius={4} shadow="md" p="lg">
            <Stack gap="md">
              <Text fw={700} size="lg">
                Sổ phiếu: PH001
              </Text>
              <Divider />
              <Text size="sm">
                <b>Nhân sự thực hiện:</b>
              </Text>
              <Group gap="xs">
                <Badge color="teal" variant="light">
                  Nguyễn Văn C
                </Badge>
                <Badge color="teal" variant="light">
                  Lê Văn D
                </Badge>
              </Group>
              <Divider />
              <Text size="sm">
                <b>Nội dung canh tác:</b>
              </Text>
              <Text size="sm" c="gray.7">
                Phun thuốc sâu cho lô A1, kiểm tra sức khỏe cây.
              </Text>
              <Divider />
              <Text size="sm">
                <b>Hình ảnh ghi nhận:</b>
              </Text>
              <Scrollable h={150}>
                <Group gap="xs" wrap="nowrap">
                  <Image
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTkLFeonuxGVlj-FHk_bg7ZZGS9CoqRIp0vg&s"
                    alt="Ảnh ghi nhận"
                    h={150}
                    radius={4}
                  />
                  <Image
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScYIhqE3CmX71yYFFM3T4jkdKjIRyhJxC-wA&s"
                    alt="Ảnh ghi nhận"
                    h={150}
                    radius={4}
                  />
                </Group>
              </Scrollable>
              <Divider />
              <Text size="sm">
                <b>Hạng mục sử dụng:</b>
              </Text>
              <SimpleGrid cols={2} spacing="sm" verticalSpacing="sm">
                {resource?.map((r, i) => (
                  <ResourceCard key={i} r={r} />
                ))}
              </SimpleGrid>
            </Stack>
          </Card>
        </Modal>
      )}
      {openedTreeDetail && (
        <TreeDetailModal
          data={treeDetail ?? undefined}
          onClose={() => setOpenedTreeDetail(false)}
          opened={openedTreeDetail}
        />
      )}
    </Stack>
  );
}
