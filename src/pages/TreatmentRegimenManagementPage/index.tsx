"use client";

import { useState, useMemo } from "react";
import {
  Text,
  Group,
  Badge,
  TextInput,
  Select,
  ScrollArea,
  Stack,
  ThemeIcon,
  Timeline,
  Paper,
  Button,
  Avatar,
  Title,
  Box,
  Flex,
  Grid,
  RingProgress,
  Card,
  Divider,
  Overlay,
  BackgroundImage,
  List,
  ActionIcon,
  rem,
  MultiSelect,
  Collapse,
  Alert,
  SegmentedControl,
  Container,
  UnstyledButton,
} from "@mantine/core";
import {
  IconSearch,
  IconLeaf,
  IconBug,
  IconShieldCheck,
  IconPrescription,
  IconClock,
  IconAlertTriangle,
  IconCheck,
  IconDroplet,
  IconCurrencyDollar,
  IconInfoCircle,
  IconArrowRight,
  IconFilter,
  IconX,
  IconBiohazard,
  IconMist,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

// --- 1. TYPE DEFINITIONS & DATA (GIỮ NGUYÊN DỮ LIỆU CỦA BẠN) ---
// (Tôi xin phép ẩn phần data để code ngắn gọn, hãy paste lại data cũ vào đây)

type Severity = "nhẹ" | "trung-binh" | "nang";
type ProtocolStatus = "dang-ap-dung" | "de-xuat" | "tam-dung" | "luu-tru";
type DiseaseType = "nấm" | "sâu-hại" | "vi-khuẩn" | "dinh-dưỡng" | "virus";

type TreatmentStep = {
  id: string;
  name: string;
  type: "spray" | "fertilize" | "prune" | "monitor" | "inject";
  time: string;
  desc: string;
  medicine?: string;
  dosage?: string;
};

type TreatmentProtocol = {
  id: string;
  code: string;
  name: string;
  species: string;
  variety: string;
  plantImage: string;
  growthStage: string;
  disease: string;
  diseaseType: DiseaseType;
  diseaseImage: string;
  symptoms: string[];
  severity: Severity;
  status: ProtocolStatus;
  durationDays: number;
  estimatedCost: string;
  expertName: string;
  expertAvatar: string;
  weatherCondition: string;
  medicineList: {
    name: string;
    type: string;
    dosage: string;
    unit: string;
    img: string;
  }[];
  steps: TreatmentStep[];
  withdrawalDays: number;
  safetyNotes: string[];
};

// --- PASTE MOCK DATA HERE (protocols) ---
const protocols: TreatmentProtocol[] = [
  // ... (Sử dụng lại toàn bộ data từ code trước)
  {
    id: "P01",
    code: "LUA-DAOON-01",
    name: "Đạo ôn lá lúa (Cháy lá)",
    species: "Lúa",
    variety: "OM5451 / ST25",
    plantImage:
      "https://images.unsplash.com/photo-1536617621972-060234b396e1?q=80&w=600&fit=crop",
    growthStage: "Đẻ nhánh - Làm đòng",
    disease: "Bệnh đạo ôn (Pyricularia oryzae)",
    diseaseType: "nấm",
    diseaseImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Rice_Blast.jpg/640px-Rice_Blast.jpg",
    symptoms: [
      "Vết bệnh hình thoi, tâm xám trắng",
      "Xuất hiện rải rác trên lá",
      "Lá bị cháy khô khi nặng",
    ],
    severity: "trung-binh",
    status: "dang-ap-dung",
    durationDays: 7,
    estimatedCost: "650.000 đ/ha",
    expertName: "Ths. Nguyễn Văn An",
    expertAvatar:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png",
    weatherCondition: "Ẩm độ cao, sương mù dày",
    medicineList: [
      {
        name: "Tricyclazole 75WP",
        type: "Trừ nấm",
        dosage: "20g/25L",
        unit: "kg/ha",
        img: "TC",
      },
      {
        name: "Isoprothiolane 40EC",
        type: "Trừ nấm",
        dosage: "50ml/25L",
        unit: "lít/ha",
        img: "IS",
      },
    ],
    steps: [
      {
        id: "s1",
        name: "Cắt nguồn bệnh",
        type: "monitor",
        time: "Ngày 1",
        desc: "Rút nước cạn, ngưng bón đạm.",
      },
      {
        id: "s2",
        name: "Phun thuốc đặc trị",
        type: "spray",
        time: "Ngày 1",
        desc: "Phun ướt đều tán lá vào sáng sớm.",
        medicine: "Tricyclazole 75WP",
        dosage: "20g/bình 25L",
      },
      {
        id: "s3",
        name: "Bón phân phục hồi",
        type: "fertilize",
        time: "Ngày 5",
        desc: "Bón bổ sung Kali Silic giúp cứng cây.",
        medicine: "Kali Silic",
        dosage: "Rải gốc",
      },
    ],
    withdrawalDays: 14,
    safetyNotes: ["Cách ly 14 ngày", "Đeo bảo hộ khi phun"],
  },
  {
    id: "P05",
    code: "LUA-RAYNAU-02",
    name: "Rầy nâu hại lúa",
    species: "Lúa",
    variety: "Đài Thơm 8",
    plantImage:
      "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=600&fit=crop",
    growthStage: "Làm đòng - Trổ",
    disease: "Rầy nâu (Nilaparvata lugens)",
    diseaseType: "sâu-hại",
    diseaseImage:
      "https://live.staticflickr.com/65535/51152062639_b7289b7b2c_z.jpg",
    symptoms: [
      "Lúa vàng lá, khô héo (cháy rầy)",
      "Rầy cám tập trung gốc lúa",
      "Lan truyền bệnh vàng lùn",
    ],
    severity: "nang",
    status: "dang-ap-dung",
    durationDays: 5,
    estimatedCost: "900.000 đ/ha",
    expertName: "Ks. Lê Văn Tám",
    expertAvatar:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
    weatherCondition: "Nắng nóng xen kẽ mưa",
    medicineList: [
      {
        name: "Pymeterozine",
        type: "Trừ rầy",
        dosage: "15g/25L",
        unit: "kg/ha",
        img: "PY",
      },
      {
        name: "Fenobucarb",
        type: "Trừ rầy",
        dosage: "Theo nhãn",
        unit: "lít/ha",
        img: "FE",
      },
    ],
    steps: [
      {
        id: "s1",
        name: "Tháo nước",
        type: "monitor",
        time: "Trước phun",
        desc: "Tháo nước để lộ gốc lúa.",
      },
      {
        id: "s2",
        name: "Phun rẽ lúa",
        type: "spray",
        time: "Ngày 1",
        desc: "Phun thuốc vào gốc lúa nơi rầy trú ẩn.",
        medicine: "Pymeterozine",
        dosage: "Pha loãng 0.05%",
      },
    ],
    withdrawalDays: 10,
    safetyNotes: ["Tránh phun khi lúa đang phơi màu", "Độc với tôm cá"],
  },

  // --- NGÔ (BẮP) ---
  {
    id: "P02",
    code: "BAP-SAUKEO-02",
    name: "Sâu keo mùa thu hại Ngô",
    species: "Bắp (Ngô)",
    variety: "Ngô Lai F1",
    plantImage:
      "https://images.unsplash.com/photo-1622383563227-0440104a95d1?q=80&w=600&fit=crop",
    growthStage: "Cây con 3-8 lá",
    disease: "Sâu keo mùa thu",
    diseaseType: "sâu-hại",
    diseaseImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Spodoptera_frugiperda_larva.jpg/640px-Spodoptera_frugiperda_larva.jpg",
    symptoms: [
      "Lá thủng lỗ chỗ, rách nát",
      "Có phân sâu dạng mùn cưa",
      "Sâu ẩn trong nõn",
    ],
    severity: "nang",
    status: "de-xuat",
    durationDays: 10,
    estimatedCost: "1.200.000 đ/ha",
    expertName: "Ks. Lê Thị Bích",
    expertAvatar:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png",
    weatherCondition: "Nắng ráo",
    medicineList: [
      {
        name: "Emamectin Benzoate",
        type: "Trừ sâu SH",
        dosage: "Theo nhãn",
        unit: "lít/ha",
        img: "EM",
      },
    ],
    steps: [
      {
        id: "s1",
        name: "Ngắt ổ trứng",
        type: "prune",
        time: "Hàng ngày",
        desc: "Tiêu huỷ ổ trứng bằng tay.",
      },
      {
        id: "s2",
        name: "Phun thuốc vào nõn",
        type: "spray",
        time: "Ngày 1",
        desc: "Chỉnh béc phun thẳng vào nõn.",
        medicine: "Emamectin Benzoate",
        dosage: "Pha loãng 0.1%",
      },
    ],
    withdrawalDays: 7,
    safetyNotes: ["Độc với ong", "Cách ly 7 ngày"],
  },

  // --- SẦU RIÊNG ---
  {
    id: "P03",
    code: "SR-NUTTHAN-01",
    name: "Nứt thân xì mủ Sầu riêng",
    species: "Sầu riêng",
    variety: "Ri6 / Monthong",
    plantImage:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600&fit=crop",
    growthStage: "Kinh doanh (Ra trái)",
    disease: "Nấm Phytophthora",
    diseaseType: "nấm",
    diseaseImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Phytophthora_infestans_potato.jpg/640px-Phytophthora_infestans_potato.jpg",
    symptoms: [
      "Vết nứt trên vỏ cây, chảy nhựa nâu",
      "Lá vàng, rụng lá",
      "Thối rễ cám",
    ],
    severity: "nang",
    status: "dang-ap-dung",
    durationDays: 21,
    estimatedCost: "5.000.000 đ/ha",
    expertName: "Ts. Trần Văn Cường",
    expertAvatar:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
    weatherCondition: "Đất thoát nước tốt",
    medicineList: [
      {
        name: "Phosphonate (Agri-Fos)",
        type: "Thuốc lưu dẫn",
        dosage: "1:1",
        unit: "ml",
        img: "PH",
      },
      {
        name: "Matalaxyl",
        type: "Trừ nấm",
        dosage: "Quét gốc",
        unit: "kg",
        img: "MA",
      },
    ],
    steps: [
      {
        id: "s1",
        name: "Cạo vỏ vết bệnh",
        type: "prune",
        time: "Ngày 1",
        desc: "Cạo sạch phần vỏ thối đến phần gỗ khỏe.",
      },
      {
        id: "s2",
        name: "Quét thuốc đậm đặc",
        type: "fertilize",
        time: "Ngày 1",
        desc: "Quét Matalaxyl/Mancozeb lên vết bệnh.",
        medicine: "Matalaxyl",
        dosage: "Nguyên chất",
      },
      {
        id: "s3",
        name: "Tiêm thân",
        type: "inject",
        time: "Ngày 2",
        desc: "Tiêm Phosphonate để kích kháng.",
        medicine: "Phosphonate",
        dosage: "Tỉ lệ 1:1",
      },
    ],
    withdrawalDays: 30,
    safetyNotes: [
      "Đeo kính bảo hộ khi tiêm",
      "Không ăn trái trong thời gian cách ly",
    ],
  },
  {
    id: "P06",
    code: "SR-NHENDO-02",
    name: "Nhện đỏ hại Sầu riêng",
    species: "Sầu riêng",
    variety: "Tất cả",
    plantImage:
      "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600&fit=crop",
    growthStage: "Cơi đọt - Lá lụa",
    disease: "Nhện đỏ (Oligonychus)",
    diseaseType: "sâu-hại",
    diseaseImage:
      "https://upload.wikimedia.org/wikipedia/commons/2/23/Tetranychus_urticae.jpg",
    symptoms: [
      "Mặt trên lá có chấm trắng li ti",
      "Lá chuyển màu vàng xám (bạc lá)",
      "Cây còi cọc",
    ],
    severity: "trung-binh",
    status: "dang-ap-dung",
    durationDays: 10,
    estimatedCost: "1.500.000 đ/ha",
    expertName: "Ks. Đỗ Minh Quân",
    expertAvatar:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png",
    weatherCondition: "Nắng nóng, khô hạn",
    medicineList: [
      {
        name: "Abamectin",
        type: "Trừ nhện",
        dosage: "Theo nhãn",
        unit: "lít",
        img: "AB",
      },
      {
        name: "Dầu khoáng SK",
        type: "Bám dính",
        dosage: "0.5%",
        unit: "lít",
        img: "SK",
      },
    ],
    steps: [
      {
        id: "s1",
        name: "Tưới phun mưa",
        type: "monitor",
        time: "Sáng sớm",
        desc: "Tạo độ ẩm cao để hạn chế nhện.",
      },
      {
        id: "s2",
        name: "Phun thuốc kép",
        type: "spray",
        time: "Ngày 1 & 4",
        desc: "Phun 2 lần cách nhau 3-4 ngày.",
        medicine: "Abamectin + Dầu khoáng",
        dosage: "Pha loãng",
      },
    ],
    withdrawalDays: 7,
    safetyNotes: ["Luân phiên thuốc để tránh kháng"],
  },

  // --- CÀ PHÊ ---
  {
    id: "P04",
    code: "CF-REPSAP-01",
    name: "Rệp sáp hại Cà phê",
    species: "Cà phê",
    variety: "Robusta",
    plantImage:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&fit=crop",
    growthStage: "Nuôi trái non",
    disease: "Rệp sáp (Planococcus citri)",
    diseaseType: "sâu-hại",
    diseaseImage:
      "https://live.staticflickr.com/65535/49626372076_988f572c67_z.jpg",
    symptoms: [
      "Chùm quả phủ phấn trắng",
      "Rệp bám quanh cuống quả",
      "Kiến đen xuất hiện nhiều",
    ],
    severity: "trung-binh",
    status: "luu-tru",
    durationDays: 14,
    estimatedCost: "800.000 đ/ha",
    expertName: "Ks. Phạm Thu Hà",
    expertAvatar:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png",
    weatherCondition: "Khô hạn kéo dài",
    medicineList: [
      {
        name: "Dầu khoáng",
        type: "Hỗ trợ",
        dosage: "0.5%",
        unit: "lít",
        img: "OI",
      },
      {
        name: "Chlorpyrifos Ethyl",
        type: "Trừ sâu",
        dosage: "Theo nhãn",
        unit: "lít",
        img: "CH",
      },
    ],
    steps: [
      {
        id: "s1",
        name: "Tỉa cành thông thoáng",
        type: "prune",
        time: "Trước phun",
        desc: "Cắt bỏ cành bị hại nặng.",
      },
      {
        id: "s2",
        name: "Phun rửa vườn",
        type: "spray",
        time: "Ngày 1",
        desc: "Phun nước áp lực cao để rửa trôi rệp.",
      },
      {
        id: "s3",
        name: "Phun thuốc",
        type: "spray",
        time: "Ngày 2",
        desc: "Phun kỹ vào chùm quả.",
        medicine: "Chlorpyrifos Ethyl",
        dosage: "Pha loãng",
      },
    ],
    withdrawalDays: 21,
    safetyNotes: ["Rất độc", "Tránh nguồn nước"],
  },
  {
    id: "P07",
    code: "CF-RISAT-02",
    name: "Bệnh rỉ sắt Cà phê",
    species: "Cà phê",
    variety: "Arabica / Robusta",
    plantImage:
      "https://images.unsplash.com/photo-1611162458320-966971c2298e?q=80&w=600&fit=crop",
    growthStage: "Mùa mưa",
    disease: "Nấm Hemileia vastatrix",
    diseaseType: "nấm",
    diseaseImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Coffee_Rust.JPG/640px-Coffee_Rust.JPG",
    symptoms: [
      "Đốm vàng nhạt mặt dưới lá",
      "Lớp bột phấn màu cam như rỉ sắt",
      "Rụng lá hàng loạt",
    ],
    severity: "trung-binh",
    status: "de-xuat",
    durationDays: 10,
    estimatedCost: "750.000 đ/ha",
    expertName: "Ths. Trần Bình",
    expertAvatar:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png",
    weatherCondition: "Độ ẩm cao, thiếu sáng",
    medicineList: [
      {
        name: "Hexaconazole",
        type: "Trừ nấm",
        dosage: "Theo nhãn",
        unit: "lít",
        img: "HE",
      },
      {
        name: "Đồng đỏ (Copper)",
        type: "Sát khuẩn",
        dosage: "Pha loãng",
        unit: "kg",
        img: "CO",
      },
    ],
    steps: [
      {
        id: "s1",
        name: "Vệ sinh vườn",
        type: "prune",
        time: "Đầu mùa mưa",
        desc: "Tỉa cành tạo tán thông thoáng.",
      },
      {
        id: "s2",
        name: "Phun phòng",
        type: "spray",
        time: "Khi chớm bệnh",
        desc: "Phun ướt đều 2 mặt lá.",
        medicine: "Hexaconazole",
        dosage: "0.2%",
      },
    ],
    withdrawalDays: 14,
    safetyNotes: ["Không phun khi trời nắng gắt"],
  },

  // --- HỒ TIÊU ---
  {
    id: "P08",
    code: "PEP-CHETNHANH-01",
    name: "Bệnh chết nhanh Hồ tiêu",
    species: "Hồ tiêu",
    variety: "Vĩnh Linh",
    plantImage:
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600&fit=crop",
    growthStage: "Mọi giai đoạn",
    disease: "Nấm Phytophthora capsici",
    diseaseType: "nấm",
    diseaseImage:
      "https://live.staticflickr.com/4083/5036986422_9422d76550_z.jpg",
    symptoms: [
      "Dây tiêu héo rũ nhanh chóng",
      "Lá vẫn xanh nhưng héo rủ",
      "Thối gốc, rễ đen",
    ],
    severity: "nang",
    status: "dang-ap-dung",
    durationDays: 30,
    estimatedCost: "3.000.000 đ/ha",
    expertName: "Ts. Nguyễn Hữu Quan",
    expertAvatar:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-6.png",
    weatherCondition: "Mưa nhiều, ngập úng",
    medicineList: [
      {
        name: "Fosetyl-Aluminium",
        type: "Lưu dẫn",
        dosage: "Tưới gốc",
        unit: "kg",
        img: "FO",
      },
      {
        name: "Trichoderma",
        type: "Nấm đối kháng",
        dosage: "Rải gốc",
        unit: "kg",
        img: "TR",
      },
    ],
    steps: [
      {
        id: "s1",
        name: "Đánh rãnh thoát nước",
        type: "monitor",
        time: "Ngay lập tức",
        desc: "Không để vườn bị đọng nước.",
      },
      {
        id: "s2",
        name: "Xử lý thuốc hoá học",
        type: "fertilize",
        time: "Ngày 1",
        desc: "Tưới gốc thuốc đặc trị nấm.",
        medicine: "Fosetyl-Aluminium",
        dosage: "30g/gốc",
      },
      {
        id: "s3",
        name: "Bổ sung vi sinh",
        type: "fertilize",
        time: "Sau 15 ngày",
        desc: "Bón Trichoderma để tái tạo hệ vi sinh.",
        medicine: "Trichoderma",
        dosage: "Trộn phân hữu cơ",
      },
    ],
    withdrawalDays: 20,
    safetyNotes: ["Tiêu hủy cây bệnh xa vườn", "Cách ly khu vực bệnh"],
  },
  {
    id: "P09",
    code: "PEP-TUYENTRUNG-02",
    name: "Bệnh chết chậm (Tuyến trùng)",
    species: "Hồ tiêu",
    variety: "Sẻ đất",
    plantImage:
      "https://images.unsplash.com/photo-1621961458348-209252576392?q=80&w=600&fit=crop",
    growthStage: "Kinh doanh",
    disease: "Tuyến trùng & Nấm",
    diseaseType: "sâu-hại",
    diseaseImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Root-knot_nematode.jpg/640px-Root-knot_nematode.jpg",
    symptoms: [
      "Cây vàng lá, còi cọc chậm lớn",
      "Rễ có nốt sưng (u sưng)",
      "Rụng đốt tháo khớp",
    ],
    severity: "nang",
    status: "luu-tru",
    durationDays: 45,
    estimatedCost: "4.000.000 đ/ha",
    expertName: "Ks. Vũ Thị Mai",
    expertAvatar:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png",
    weatherCondition: "Đất thiếu hữu cơ",
    medicineList: [
      {
        name: "Tervigo 020SC",
        type: "Trừ tuyến trùng",
        dosage: "Tưới gốc",
        unit: "lít",
        img: "TE",
      },
      {
        name: "Phân hữu cơ vi sinh",
        type: "Dinh dưỡng",
        dosage: "5kg/gốc",
        unit: "tấn",
        img: "HC",
      },
    ],
    steps: [
      {
        id: "s1",
        name: "Xới đất nhẹ",
        type: "monitor",
        time: "Đầu mùa mưa",
        desc: "Phá váng đất quanh gốc.",
      },
      {
        id: "s2",
        name: "Xử lý tuyến trùng",
        type: "fertilize",
        time: "Ngày 1",
        desc: "Tưới thuốc quanh vùng rễ.",
        medicine: "Tervigo 020SC",
        dosage: "Theo hướng dẫn",
      },
    ],
    withdrawalDays: 14,
    safetyNotes: ["Không dùng thuốc quá liều gây chai đất"],
  },

  // --- THANH LONG ---
  {
    id: "P10",
    code: "TL-DOMTRANG-01",
    name: "Đốm trắng (Đốm nâu/Tắc kè)",
    species: "Thanh long",
    variety: "Ruột đỏ / Ruột trắng",
    plantImage:
      "https://images.unsplash.com/photo-1529503197623-6cc3795a2304?q=80&w=600&fit=crop",
    growthStage: "Ra cành - Ra quả",
    disease: "Nấm Neoscytalidium dimidiatum",
    diseaseType: "nấm",
    diseaseImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Dragon_Fruit_Pitaya.jpg/640px-Dragon_Fruit_Pitaya.jpg",
    symptoms: [
      "Đốm trắng nhỏ lõm xuống",
      "Vết bệnh chuyển nâu, sần sùi",
      "Gây thối cành, thối quả",
    ],
    severity: "nang",
    status: "dang-ap-dung",
    durationDays: 15,
    estimatedCost: "2.000.000 đ/ha",
    expertName: "Ks. Phạm Văn Dũng",
    expertAvatar:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png",
    weatherCondition: "Mưa nhiều, ẩm độ cao",
    medicineList: [
      {
        name: "Mancozeb",
        type: "Trừ nấm",
        dosage: "Phun phủ",
        unit: "kg",
        img: "MN",
      },
      {
        name: "Propiconazole",
        type: "Trừ nấm",
        dosage: "0.1%",
        unit: "lít",
        img: "PR",
      },
    ],
    steps: [
      {
        id: "s1",
        name: "Vệ sinh vườn",
        type: "prune",
        time: "Thường xuyên",
        desc: "Cắt bỏ cành bệnh đem tiêu hủy.",
      },
      {
        id: "s2",
        name: "Phun thuốc",
        type: "spray",
        time: "Sau mưa",
        desc: "Phun thuốc khi vết bệnh mới xuất hiện.",
        medicine: "Mancozeb + Propiconazole",
        dosage: "Hỗn hợp",
      },
    ],
    withdrawalDays: 10,
    safetyNotes: ["Rửa sạch quả sau thu hoạch"],
  },

  // --- CAM/BƯỞI ---
  {
    id: "P11",
    code: "CAM-GREENING-01",
    name: "Bệnh Vàng lá Greening (Gân xanh)",
    species: "Cam / Bưởi",
    variety: "Cam sành / Da xanh",
    plantImage:
      "https://images.unsplash.com/photo-1582236932599-4c3e803d1976?q=80&w=600&fit=crop",
    growthStage: "Mọi giai đoạn",
    disease: "Vi khuẩn Liberibacter (rầy chổng cánh)",
    diseaseType: "vi-khuẩn",
    diseaseImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Citrus_greening_symptoms.jpg/640px-Citrus_greening_symptoms.jpg",
    symptoms: [
      "Lá vàng lốm đốm, gân xanh",
      "Quả nhỏ, méo mó, tâm lệch",
      "Hạt bị thui đen",
    ],
    severity: "nang",
    status: "dang-ap-dung",
    durationDays: 60,
    estimatedCost: "Phá bỏ / Trồng mới",
    expertName: "Ts. Lê Quốc Phong",
    expertAvatar:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png",
    weatherCondition: "Mật độ rầy chổng cánh cao",
    medicineList: [
      {
        name: "Imidacloprid",
        type: "Trừ rầy",
        dosage: "Phun định kỳ",
        unit: "lít",
        img: "IM",
      },
    ],
    steps: [
      {
        id: "s1",
        name: "Kiểm tra rầy",
        type: "monitor",
        time: "Ra đọt non",
        desc: "Quan sát mật độ rầy chổng cánh.",
      },
      {
        id: "s2",
        name: "Tiêu huỷ cây bệnh",
        type: "prune",
        time: "Phát hiện bệnh",
        desc: "Chặt bỏ cây bệnh, đào gốc.",
      },
      {
        id: "s3",
        name: "Phun trừ rầy",
        type: "spray",
        time: "Cơi đọt",
        desc: "Phun bảo vệ đọt non.",
        medicine: "Imidacloprid",
        dosage: "Theo nhãn",
      },
    ],
    withdrawalDays: 14,
    safetyNotes: ["Chưa có thuốc trị dứt điểm", "Phòng trừ môi giới là chính"],
  },
  {
    id: "P12",
    code: "CAM-LOET-02",
    name: "Bệnh loét Cam (Canker)",
    species: "Cam / Bưởi",
    variety: "Tất cả",
    plantImage:
      "https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=600&fit=crop",
    growthStage: "Lá non - Quả non",
    disease: "Vi khuẩn Xanthomonas",
    diseaseType: "vi-khuẩn",
    diseaseImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Citrus_canker_fruit.jpg/640px-Citrus_canker_fruit.jpg",
    symptoms: [
      "Vết bệnh sần sùi, gờ nổi",
      "Xung quanh có quầng vàng",
      "Gây rụng lá và quả",
    ],
    severity: "trung-binh",
    status: "de-xuat",
    durationDays: 10,
    estimatedCost: "1.000.000 đ/ha",
    expertName: "Ks. Nguyễn Thị Lan",
    expertAvatar:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png",
    weatherCondition: "Mưa bão, gió lớn",
    medicineList: [
      {
        name: "Kasugamycin",
        type: "Kháng sinh",
        dosage: "2%",
        unit: "lít",
        img: "KA",
      },
      {
        name: "Copper Oxychloride",
        type: "Đồng",
        dosage: "0.3%",
        unit: "kg",
        img: "COC",
      },
    ],
    steps: [
      {
        id: "s1",
        name: "Phun sau mưa",
        type: "spray",
        time: "Sau cơn mưa",
        desc: "Phun thuốc gốc đồng để sát khuẩn.",
      },
      {
        id: "s2",
        name: "Phun trị",
        type: "spray",
        time: "Bệnh nặng",
        desc: "Dùng kháng sinh thực vật.",
        medicine: "Kasugamycin",
        dosage: "Pha loãng",
      },
    ],
    withdrawalDays: 7,
    safetyNotes: ["Tránh phun đồng khi hoa đang nở"],
  },
];

// --- 3. HELPER COMPONENTS ---

const ActionTypeBadge = ({ type }: { type: string }) => {
  const styles: any = {
    spray: { color: "blue", label: "Phun thuốc", icon: IconDroplet },
    fertilize: { color: "teal", label: "Bón phân", icon: IconLeaf },
    prune: { color: "orange", label: "Cắt tỉa", icon: IconBug },
    monitor: { color: "gray", label: "Theo dõi", icon: IconInfoCircle },
    inject: { color: "red", label: "Tiêm thân", icon: IconPrescription },
  };
  const s = styles[type] || styles.monitor;
  return (
    <Badge
      variant="light"
      color={s.color}
      radius="sm"
      leftSection={<s.icon size={12} />}
    >
      {s.label}
    </Badge>
  );
};

const MedicineCard = ({ item }: { item: any }) => (
  <Paper
    withBorder={false}
    shadow="xs"
    p="sm"
    radius="md"
    bg="white"
    className="hover:shadow-md transition-all"
    style={{ border: "1px solid #f1f3f5" }}
  >
    <Group wrap="nowrap" align="flex-start">
      <Avatar src={item.img} size="md" radius="md" color="teal" variant="light">
        {item.name.charAt(0)}
      </Avatar>
      <Box style={{ flex: 1 }}>
        <Text size="sm" fw={600} lh={1.2} mb={2}>
          {item.name}
        </Text>
        <Badge size="xs" variant="dot" color="gray">
          {item.type}
        </Badge>

        <Group justify="space-between" mt="xs" align="center">
          <Group gap={4}>
            <IconPrescription size={14} color="var(--mantine-color-dimmed)" />
            <Text size="xs" c="dimmed">
              Liều lượng:
            </Text>
          </Group>
          <Text size="xs" fw={700} c="teal.7">
            {item.dosage}
          </Text>
        </Group>
      </Box>
    </Group>
  </Paper>
);

// --- 4. MAIN PAGE COMPONENT ---

export default function TreatmentProtocolPage() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string>(protocols[0].id);
  const [activeTab, setActiveTab] = useState("overview");

  // Filter States
  const [search, setSearch] = useState("");
  const [filterSpecies, setFilterSpecies] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [filterDiseaseType, setFilterDiseaseType] = useState<string | null>(
    null
  );

  const [filtersOpen, setFiltersOpen] = useState(true);

  // Derived Logic
  const uniqueSpecies = useMemo(() => {
    const speciesSet = new Set(protocols.map((p) => p.species));
    return Array.from(speciesSet);
  }, []);

  const selectedData = useMemo(
    () => protocols.find((p) => p.id === selectedId) || protocols[0],
    [selectedId]
  );

  const filteredList = useMemo(() => {
    return protocols.filter((p) => {
      const normSearch = search.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(normSearch) ||
        p.code.toLowerCase().includes(normSearch) ||
        p.disease.toLowerCase().includes(normSearch) ||
        p.symptoms.some((s) => s.toLowerCase().includes(normSearch));

      const matchesSpecies =
        filterSpecies.length === 0 || filterSpecies.includes(p.species);
      const matchesStatus = !filterStatus || p.status === filterStatus;
      const matchesSeverity = !filterSeverity || p.severity === filterSeverity;
      const matchesType =
        !filterDiseaseType || p.diseaseType === filterDiseaseType;

      return (
        matchesSearch &&
        matchesSpecies &&
        matchesStatus &&
        matchesSeverity &&
        matchesType
      );
    });
  }, [search, filterSpecies, filterStatus, filterSeverity, filterDiseaseType]);

  const clearFilters = () => {
    setSearch("");
    setFilterSpecies([]);
    setFilterStatus(null);
    setFilterSeverity(null);
    setFilterDiseaseType(null);
  };

  return (
    <Flex h="100vh" bg="#f8f9fa" style={{ overflow: "hidden" }}>
      {/* --- SIDEBAR: NAVIGATION & FILTER --- */}
      <Flex
        direction="column"
        w={380}
        bg="white"
        style={{ borderRight: "1px solid #e9ecef", zIndex: 10 }}
      >
        <Box p="md" pb={0}>
          <Group justify="space-between" mb="md">
            <Title
              order={4}
              fw={800}
              c="dark.8"
              style={{ letterSpacing: -0.5 }}
            >
              Phác Đồ Điều Trị
            </Title>
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={clearFilters}
              disabled={!search && filterSpecies.length === 0}
              title="Làm mới"
            >
              <IconX size={18} />
            </ActionIcon>
          </Group>

          <TextInput
            placeholder="Tìm kiếm phác đồ..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="filled"
            radius="md"
            mb="sm"
          />

          <UnstyledButton
            onClick={() => setFiltersOpen((o) => !o)}
            mb="sm"
            c="dimmed"
            style={{
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 500,
            }}
          >
            <IconFilter size={14} />{" "}
            {filtersOpen ? "Thu gọn bộ lọc" : "Mở bộ lọc nâng cao"}
          </UnstyledButton>

          <Collapse in={filtersOpen}>
            <Stack gap="xs" mb="md">
              <MultiSelect
                placeholder="Lọc theo cây trồng"
                data={uniqueSpecies}
                value={filterSpecies}
                onChange={setFilterSpecies}
                variant="filled"
                radius="md"
                searchable
                clearable
                maxValues={5}
                hidePickedOptions
              />
              <Grid gutter="xs">
                <Grid.Col span={6}>
                  <Select
                    placeholder="Loại bệnh"
                    data={[
                      { value: "nấm", label: "Nấm bệnh" },
                      { value: "sâu-hại", label: "Sâu hại" },
                      { value: "vi-khuẩn", label: "Vi khuẩn" },
                      { value: "virus", label: "Virus" },
                    ]}
                    value={filterDiseaseType}
                    onChange={setFilterDiseaseType}
                    variant="filled"
                    radius="md"
                    clearable
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    placeholder="Trạng thái"
                    data={[
                      { value: "dang-ap-dung", label: "Đang dùng" },
                      { value: "de-xuat", label: "Đề xuất" },
                      { value: "luu-tru", label: "Lưu trữ" },
                    ]}
                    value={filterStatus}
                    onChange={setFilterStatus}
                    variant="filled"
                    radius="md"
                    clearable
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </Collapse>

          <Divider mb="sm" />
          <Text size="xs" fw={700} c="dimmed" mb="xs" tt="uppercase">
            Danh sách ({filteredList.length})
          </Text>
        </Box>

        <ScrollArea style={{ flex: 1 }} px="md">
          <Stack gap={10} pb="xl">
            {filteredList.map((item) => {
              const active = item.id === selectedId;
              return (
                <Card
                  key={item.id}
                  padding="md"
                  radius="md"
                  withBorder={!active}
                  onClick={() => setSelectedId(item.id)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: active
                      ? "var(--mantine-color-teal-0)"
                      : "white",
                    borderColor: active
                      ? "transparent"
                      : "var(--mantine-color-gray-2)",
                    borderLeft: active
                      ? "4px solid var(--mantine-color-teal-6)"
                      : "1px solid var(--mantine-color-gray-2)",
                    transition: "all 0.2s ease",
                  }}
                  className="hover:shadow-sm"
                >
                  <Group align="start" wrap="nowrap">
                    <Avatar src={item.plantImage} radius="md" size="md" />
                    <Box style={{ flex: 1 }}>
                      <Text size="sm" fw={700} c="dark.8" lineClamp={1}>
                        {item.name}
                      </Text>
                      <Group gap={6} mt={6}>
                        <Badge
                          size="xs"
                          variant="white"
                          color="gray"
                          radius="sm"
                          style={{ border: "1px solid #dee2e6" }}
                        >
                          {item.species}
                        </Badge>
                        <Badge
                          size="xs"
                          variant="light"
                          color={
                            item.severity === "nang"
                              ? "red"
                              : item.severity === "trung-binh"
                              ? "yellow"
                              : "green"
                          }
                        >
                          {item.severity === "nang"
                            ? "Cao"
                            : item.severity === "trung-binh"
                            ? "Vừa"
                            : "Thấp"}
                        </Badge>
                      </Group>
                    </Box>
                  </Group>
                </Card>
              );
            })}
            {filteredList.length === 0 && (
              <Box ta="center" py="xl">
                <Text size="sm" c="dimmed">
                  Không tìm thấy kết quả nào
                </Text>
              </Box>
            )}
          </Stack>
        </ScrollArea>

        <Box p="md" style={{ borderTop: "1px solid #f1f3f5" }}>
          <Button
            fullWidth
            radius="md"
            color="dark"
            onClick={() => navigate("/treatment-regimen-management/add")}
          >
            + Thêm phác đồ mới
          </Button>
        </Box>
      </Flex>

      {/* --- MAIN CONTENT AREA --- */}
      <Flex direction="column" style={{ flex: 1, overflow: "hidden" }}>
        {/* HERO HEADER */}
        <Box h={220} pos="relative">
          <BackgroundImage src={selectedData.plantImage} h="100%" radius={0}>
            <Overlay
              gradient="linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)"
              opacity={1}
              zIndex={1}
            />
            <Container size="xl" h="100%" px="xl">
              <Flex
                h="100%"
                align="center"
                justify="space-between"
                pos="relative"
                style={{ zIndex: 2 }}
              >
                <Box>
                  <Group mb="sm">
                    <Badge size="lg" radius="sm" variant="filled" color="teal">
                      {selectedData.species}
                    </Badge>
                    <Badge
                      size="lg"
                      radius="sm"
                      variant="white"
                      color="gray"
                      leftSection={<IconLeaf size={12} />}
                    >
                      {selectedData.growthStage}
                    </Badge>
                  </Group>
                  <Title
                    c="white"
                    order={1}
                    fw={800}
                    style={{ fontSize: "2.2rem" }}
                  >
                    {selectedData.name}
                  </Title>
                  <Text c="gray.3" size="lg" mt={4} fw={500}>
                    Áp dụng cho giống: {selectedData.variety}
                  </Text>
                </Box>

                <Paper
                  px="md"
                  py="xs"
                  radius="xl"
                  bg="rgba(255,255,255,0.1)"
                  style={{
                    backdropFilter: "blur(5px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <Group gap="sm">
                    <Avatar
                      src={selectedData.expertAvatar}
                      size={40}
                      radius="xl"
                    />
                    <Box>
                      <Text c="white" size="sm" fw={700} lh={1.2}>
                        {selectedData.expertName}
                      </Text>
                      <Text c="teal.1" size="xs" lh={1.2} fw={500}>
                        Chuyên gia BVTV
                      </Text>
                    </Box>
                  </Group>
                </Paper>
              </Flex>
            </Container>
          </BackgroundImage>
        </Box>

        {/* TABS & CONTENT */}
        <Box
          bg="white"
          style={{ borderBottom: "1px solid #e9ecef" }}
          px="xl"
          py="xs"
        >
          <Container size="xl" p={0}>
            <SegmentedControl
              value={activeTab}
              onChange={setActiveTab}
              data={[
                { label: "Tổng quan", value: "overview" },
                { label: "Phác đồ & Thuốc", value: "protocol" },
                { label: "An toàn & Cảnh báo", value: "safety" },
              ]}
              radius="md"
              size="md"
              color="teal"
              w={400}
            />
          </Container>
        </Box>

        <ScrollArea style={{ flex: 1 }} bg="#f8f9fa">
          <Container size="xl" py="xl">
            <Grid gutter={32}>
              {/* LEFT CONTENT COLUMN */}
              <Grid.Col span={{ base: 12, lg: 8 }}>
                {/* TAB 1: OVERVIEW */}
                {activeTab === "overview" && (
                  <Stack gap="lg">
                    <Paper p="xl" radius="md" shadow="xs" withBorder>
                      <Group mb="md" align="center">
                        <ThemeIcon
                          size="lg"
                          radius="md"
                          variant="light"
                          color="red"
                        >
                          <IconBiohazard size={20} />
                        </ThemeIcon>
                        <Title order={4}>Thông tin bệnh hại</Title>
                      </Group>

                      <Grid>
                        <Grid.Col span={7}>
                          <Text fw={700} size="lg" c="dark.8" mb="xs">
                            {selectedData.disease}
                          </Text>
                          <Text size="sm" c="dimmed" mb="md">
                            Loại: {selectedData.diseaseType}
                          </Text>

                          <Text size="sm" fw={600} mb="xs">
                            Triệu chứng nhận biết:
                          </Text>
                          <List
                            spacing="xs"
                            size="sm"
                            center
                            icon={
                              <IconCheck
                                size={16}
                                color="var(--mantine-color-teal-6)"
                              />
                            }
                          >
                            {selectedData.symptoms.map((s, i) => (
                              <List.Item key={i}>{s}</List.Item>
                            ))}
                          </List>
                        </Grid.Col>
                        <Grid.Col span={5}>
                          <Paper bg="gray.0" p="md" radius="md">
                            <Group mb="xs">
                              <IconMist size={18} color="gray" />
                              <Text size="sm" fw={600}>
                                Điều kiện phát sinh
                              </Text>
                            </Group>
                            <Text size="sm" c="dimmed">
                              {selectedData.weatherCondition}
                            </Text>
                          </Paper>
                        </Grid.Col>
                      </Grid>
                    </Paper>
                  </Stack>
                )}

                {/* TAB 2: PROTOCOL */}
                {activeTab === "protocol" && (
                  <Stack gap="xl">
                    {/* Medicine List */}
                    <Box>
                      <Title
                        order={5}
                        mb="md"
                        c="dimmed"
                        tt="uppercase"
                        size="xs"
                        fw={700}
                      >
                        Danh mục thuốc bảo vệ thực vật
                      </Title>
                      <Grid>
                        {selectedData.medicineList.map((med, i) => (
                          <Grid.Col span={6} key={i}>
                            <MedicineCard item={med} />
                          </Grid.Col>
                        ))}
                      </Grid>
                    </Box>

                    {/* Timeline */}
                    <Box>
                      <Title
                        order={5}
                        mb="lg"
                        c="dimmed"
                        tt="uppercase"
                        size="xs"
                        fw={700}
                      >
                        Quy trình xử lý ({selectedData.durationDays} ngày)
                      </Title>
                      <Box pl="sm">
                        <Timeline
                          active={1}
                          bulletSize={36}
                          lineWidth={2}
                          color="teal"
                        >
                          {selectedData.steps.map((step, idx) => (
                            <Timeline.Item
                              key={step.id}
                              bullet={
                                <ThemeIcon
                                  size={36}
                                  radius="xl"
                                  color={
                                    step.type === "spray"
                                      ? "blue"
                                      : step.type === "fertilize"
                                      ? "teal"
                                      : "white"
                                  }
                                  variant="light"
                                >
                                  {step.type === "spray" ? (
                                    <IconDroplet size={18} />
                                  ) : (
                                    <IconInfoCircle size={18} />
                                  )}
                                </ThemeIcon>
                              }
                              title={
                                <Text size="sm" fw={700} c="dark.9">
                                  {step.name}
                                </Text>
                              }
                            >
                              <Text size="xs" c="dimmed" mb={4}>
                                {step.time}
                              </Text>
                              <Paper
                                withBorder
                                radius="md"
                                p="md"
                                mt="xs"
                                bg="white"
                                shadow="xs"
                              >
                                <Text size="sm" c="dark.7" mb="xs">
                                  {step.desc}
                                </Text>
                                {step.medicine && (
                                  <Group
                                    gap="xs"
                                    bg="blue.0"
                                    p="xs"
                                    radius="sm"
                                    style={{
                                      border:
                                        "1px dashed var(--mantine-color-blue-3)",
                                    }}
                                  >
                                    <IconPrescription
                                      size={14}
                                      color="var(--mantine-color-blue-6)"
                                    />
                                    <Text size="xs" c="blue.8" fw={500}>
                                      {step.medicine} -{" "}
                                      <span style={{ fontWeight: 400 }}>
                                        {step.dosage}
                                      </span>
                                    </Text>
                                  </Group>
                                )}
                              </Paper>
                            </Timeline.Item>
                          ))}
                        </Timeline>
                      </Box>
                    </Box>
                  </Stack>
                )}

                {/* TAB 3: SAFETY */}
                {activeTab === "safety" && (
                  <Grid>
                    <Grid.Col span={12}>
                      <Alert
                        variant="light"
                        color="red"
                        title="Lưu ý an toàn quan trọng"
                        icon={<IconAlertTriangle />}
                      >
                        {selectedData.safetyNotes.map((n) => (
                          <Text size="sm" key={n}>
                            • {n}
                          </Text>
                        ))}
                      </Alert>
                    </Grid.Col>
                  </Grid>
                )}
              </Grid.Col>

              {/* RIGHT SUMMARY COLUMN */}
              <Grid.Col span={{ base: 12, lg: 4 }}>
                <Stack>
                  <Paper p="lg" radius="md" withBorder shadow="sm">
                    <Title order={5} mb="lg">
                      Thông tin quản trị
                    </Title>

                    <Stack gap="md">
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">
                          Trạng thái
                        </Text>
                        <Badge
                          color={
                            selectedData.status === "dang-ap-dung"
                              ? "green"
                              : "gray"
                          }
                        >
                          {selectedData.status === "dang-ap-dung"
                            ? "Đang áp dụng"
                            : "Lưu trữ"}
                        </Badge>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">
                          Mức độ nghiêm trọng
                        </Text>
                        <Badge variant="dot" color="red">
                          {selectedData.severity}
                        </Badge>
                      </Group>
                      <Divider />
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">
                          Thời gian xử lý
                        </Text>
                        <Text fw={600} size="sm">
                          {selectedData.durationDays} Ngày
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">
                          Chi phí ước tính
                        </Text>
                        <Text fw={700} size="lg" c="teal.7">
                          {selectedData.estimatedCost}
                        </Text>
                      </Group>
                    </Stack>

                    <Button fullWidth mt="xl" color="teal" size="md">
                      Áp dụng phác đồ này
                    </Button>
                    <Button fullWidth mt="sm" variant="default" size="md">
                      Chỉnh sửa
                    </Button>
                  </Paper>
                </Stack>
              </Grid.Col>
            </Grid>
          </Container>
        </ScrollArea>
      </Flex>
    </Flex>
  );
}
