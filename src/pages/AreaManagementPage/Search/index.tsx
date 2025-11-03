import { useMemo, useState } from "react";
import {
  Accordion,
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
  Progress,
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
  IconCalendarClock,
  IconCertificate,
  IconClockHour4,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFilter,
  IconHash,
  IconLeaf,
  IconMap2,
  IconRotateClockwise2,
  IconSearch,
  IconShieldCheck,
  IconSparkles,
  IconTimeline,
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
import { TreeDetailModal, type TreeDetail } from "./components/TreeDetailModal";
import { InfoRow } from "../Region/Add";

// ---------------- Types & mock data ----------------
type TreeCrop = {
  id: string; // Mã cây trồng
  img: string;
  name: string; // Cây trồng
  variety: string; // Giống cây
  seedType: string; // Hạt giống
  plantingDate: string; // Thời gian trồng
  region: string;
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
type PestRecord = {
  id: string; // Số phiếu
  detectedAt: string; // Thời gian phát hiện
  resolvedAt: string; // Thời gian xử lý
  pestStatus: string; // Tình trạng sâu bệnh
  solution: string; // Nội dung xử lý
  pesticides: string[]; // Thuốc BVTV (nhiều loại)
  staffHandler: string; // Nhân viên xử lý
  staffManager: string; // Nhân viên quản lý
  staffQuality: string; // Nhân viên kiểm định chất lượng
};
const cultivationNoteData: CultivationNote[] = [
  {
    id: "CN-PH001",
    expectedStart: "2025-03-10",
    expectedEnd: "2025-03-12",
    actualStart: "2025-03-11",
    actualEnd: "2025-03-12",
  },
  {
    id: "CRN-PH002",
    expectedStart: "2025-02-18",
    expectedEnd: "2025-02-20",
    actualStart: "2025-02-19",
    actualEnd: "2025-02-20",
  },
];
const cultivationHistoryData: CultivationHistory[] = [
  {
    id: "CN-HIS001",
    cropSeasonName: "Vụ Xuân 2025",
    planName: "Gieo trồng đậu nành HL02",
    actualStart: "2025-03-11",
    expectedEnd: "2025-03-12",
    actualEnd: "2025-03-12",
    manager: "Nguyễn Văn Hòa",
    qualityStaff: "Trần Thị Lan",
  },
  {
    id: "CRN-HIS002",
    cropSeasonName: "Vụ Đông Xuân 2025",
    planName: "Trồng bắp VN886",
    actualStart: "2025-02-19",
    expectedEnd: "2025-02-20",
    actualEnd: "2025-02-20",
    manager: "Lê Văn Dũng",
    qualityStaff: "Nguyễn Thị Mai",
  },
];

const pestRecordData: PestRecord[] = [
  {
    id: "CN-PEST001",
    detectedAt: "2025-04-14",
    resolvedAt: "2025-04-16",
    pestStatus: "Rệp đậu nành",
    solution: "Phun Confidor 100SL và kiểm tra lại sau 5 ngày",
    pesticides: ["Confidor 100SL", "Radiant 60SC"],
    staffHandler: "Phạm Văn Bình",
    staffManager: "Nguyễn Thị Hoa",
    staffQuality: "Võ Quốc Huy",
  },
  {
    id: "CRN-PEST002",
    detectedAt: "2025-03-25",
    resolvedAt: "2025-03-27",
    pestStatus: "Sâu đục thân bắp",
    solution: "Phun thuốc Brightin 5WG, vệ sinh gốc cây",
    pesticides: ["Brightin 5WG", "Regent 800WG"],
    staffHandler: "Vũ Văn Nam",
    staffManager: "Lý Thị Hạnh",
    staffQuality: "Đỗ Văn Long",
  },
];

type HarvestInfo = {
  id: string;
  harvestDate: string; // Thời gian thu hoạch
  yield: number; // Sản lượng
  unit: string; // Đơn vị / Quy cách
};
const harvestInfoData: HarvestInfo[] = [
  { id: "SOY-H001", harvestDate: "2025-07-05", yield: 2.9, unit: "tấn/ha" },
  { id: "CORN-H002", harvestDate: "2025-07-02", yield: 7.3, unit: "tấn/ha" },
];

type Stage = {
  id: string;
  name: string;
  duration: string; // e.g. "7 ngày" or "10–12 ngày"
  percent?: number; // optional progress share (0–100)
};
type GrowthStage = {
  id: string;
  name: string; // Tên giai đoạn
  duration: string; // Thời gian (ví dụ: "30 ngày")
};

type GrowthCycle = {
  id: string;
  name: string; // Tên chu kỳ (ví dụ: "Chu kỳ trung bình (3-5 năm)")
  stages: GrowthStage[]; // Danh sách các giai đoạn
};

const growthCycles: GrowthCycle[] = [
  {
    id: "soy-cycle",
    name: "Đậu nành (chu kỳ 85–110 ngày)",
    stages: [
      { id: "s1", name: "Nảy mầm", duration: "5–7 ngày" },
      { id: "s2", name: "Sinh trưởng sinh dưỡng", duration: "30 ngày" },
      { id: "s3", name: "Ra hoa", duration: "8 ngày" },
      { id: "s4", name: "Tạo hạt", duration: "28 ngày" },
      { id: "s5", name: "Chín", duration: "12 ngày" },
    ],
  },
  {
    id: "corn-cycle",
    name: "Bắp (chu kỳ 95–120 ngày)",
    stages: [
      { id: "c1", name: "Nảy mầm", duration: "6 ngày" },
      { id: "c2", name: "3–7 lá", duration: "20 ngày" },
      { id: "c3", name: "Trỗ cờ/Phun râu", duration: "9 ngày" },
      { id: "c4", name: "Làm hạt", duration: "30 ngày" },
      { id: "c5", name: "Chín sáp/Chín khô", duration: "25 ngày" },
    ],
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
    id: "SOY001",
    img: "https://lh6.googleusercontent.com/proxy/MkmLTr7RaC47H6aLuMX0yGGlXhtKf77bRQ0sEwVhPiHI01aj7WPJYpuBWIbN422tMgVbH5Z67gqzUj9h-LmQpjem8pVrKg",
    name: "Đậu nành",
    variety: "HL02",
    seedType: "Hạt giống thuần",
    plantingDate: "2025-03-15",
    region: "Vùng đồng bằng sông Cửu Long",
  },
  {
    id: "SOY002",
    img: "https://lh6.googleusercontent.com/proxy/MkmLTr7RaC47H6aLuMX0yGGlXhtKf77bRQ0sEwVhPiHI01aj7WPJYpuBWIbN422tMgVbH5Z67gqzUj9h-LmQpjem8pVrKg",
    name: "Đậu nành",
    variety: "ĐX11",
    seedType: "Hạt lai F1",
    plantingDate: "2025-07-25",
    region: "Vùng Đông Nam Bộ",
  },
  {
    id: "CORN001",
    img: "https://cdn.tgdd.vn/Products/Images/8785/241815/bhx/bap-my-202402261032060598.jpg",
    name: "Bắp",
    variety: "VN886",
    seedType: "Hạt giống xác nhận",
    plantingDate: "2025-02-20",
    region: "Tây Nguyên",
  },
  {
    id: "CORN002",
    img: "https://cdn.tgdd.vn/Products/Images/8785/241815/bhx/bap-my-202402261032060598.jpg",
    name: "Bắp",
    variety: "LVN10",
    seedType: "Hạt lai F1",
    plantingDate: "2025-08-05",
    region: "Duyên hải Nam Trung Bộ",
  },
];
const treeDetail: TreeDetail = {
  id: "SOY-DETAIL",
  name: "Đậu nành HL02",
  type: "Cây ngắn ngày",
  note: "Ưa sáng, thoát nước tốt, phù hợp đất phù sa nhẹ.",
  seedCode: "DN-HL02",
  seedName: "Đậu nành HL02",
  supplier: "Trung tâm Giống Cây Trồng Quốc Gia",
  origin: "Việt Nam",
  germinationRate: "89",
  yield: "2.9",
  seedNote: "Gieo hàng cách hàng 25–30 cm, cây cách cây 5 cm.",
  seedDoc: null,
  harvestMethod: "Thu hạt khô",
  growthCycle: "85–110 ngày",
  growthStages: ["Nảy mầm", "Sinh trưởng", "Ra hoa", "Tạo hạt", "Chín"],
  growthTime: "95",
  growthNote: "Phòng rệp và sâu xanh; tránh úng nước.",
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
const plantVarietyOptions = [
  {
    label: "Sầu riêng - Ri6",
    value: "saurieng-ri6",
  },
  {
    label: "Xoài - Cát Chu",
    value: "xoai-catchu",
  },
  {
    label: "Cà phê - Robusta",
    value: "caphe-robusta",
  },
  // Thêm các cây trồng và giống khác ở đây
];
// ---------------- Component ----------------
const StatChip = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <Paper withBorder radius={4} p="sm">
    <Group gap={8} align="center">
      <ThemeIcon variant="light" size="lg" radius={4}>
        {icon}
      </ThemeIcon>
      <Stack gap={0}>
        <Text size="xs" c="gray.6">
          {label}
        </Text>
        <Text size="sm" fw={600}>
          {value}
        </Text>
      </Stack>
    </Group>
  </Paper>
);

// Stage line with optional progress
const StageRow = ({ stage }: { stage: Stage }) => (
  <Box>
    <Group justify="space-between" gap={8} align="center">
      <Text size="sm" fw={600}>
        {stage.name}
      </Text>
      <Group gap={6}>
        <ThemeIcon size={22} variant="light" radius={6}>
          <IconClockHour4 size={14} />
        </ThemeIcon>
        <Text size="sm" c="gray.7">
          {stage.duration}
        </Text>
      </Group>
    </Group>
    {typeof stage.percent === "number" && (
      <Progress value={stage.percent} mt={6} radius="xl" />
    )}
  </Box>
);
export default function MVFarmSearch() {
  const [keyword, setKeyword] = useState("");
  const [view, setView] = useState<"details" | "list">("details");
  const [cultivationDetail, setCultivationDetail] = useState(false);
  const [cultivationNoteDetail, setCultivationNoteDetail] = useState(false);
  const [openedTreeDetail, setOpenedTreeDetail] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  // ---------- Columns ----------
  const treeCropColumns: MRT_ColumnDef<TreeCrop>[] = useMemo(
    () => [
      { accessorKey: "id", header: "Mã cây trồng" },
      {
        accessorKey: "img",
        header: "Hình ảnh",
        Cell: ({ row }) => <Image src={row.original.img} w={100} />,
      },
      { accessorKey: "name", header: "Cây trồng" },
      { accessorKey: "variety", header: "Giống cây" },
      { accessorKey: "seedType", header: "Hạt giống" },
      { accessorKey: "plantingDate", header: "Thời gian trồng" },
      { accessorKey: "region", header: "Khu vực canh tác" },
      {
        accessorKey: "actions",
        header: "Tuỳ chọn",
        enableColumnActions: false,
        size: 10,
        Cell: () => (
          <Menu shadow="md" withinPortal>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEye size={18} />}
                onClick={() => setOpenedTreeDetail(true)}
              >
                Chi tiết
              </Menu.Item>
              <Menu.Item leftSection={<IconEdit size={18} />} color="green">
                Chỉnh sửa
              </Menu.Item>
              <Menu.Item leftSection={<IconTrash size={18} />} color="red">
                Xoá
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ),
      },
    ],
    []
  );
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

  const pestRecordColumns: MRT_ColumnDef<PestRecord>[] = [
    { accessorKey: "id", header: "Số phiếu" },
    { accessorKey: "detectedAt", header: "Thời gian phát hiện" },
    { accessorKey: "resolvedAt", header: "Thời gian xử lý" },
    { accessorKey: "pestStatus", header: "Tình trạng sâu bệnh" },
    { accessorKey: "solution", header: "Nội dung xử lý" },
    {
      accessorKey: "pesticides",
      header: "Thuốc BVTV",
      Cell: ({ cell }) => cell.getValue<string[]>().join(", "),
    },
    { accessorKey: "staffHandler", header: "Nhân viên xử lý" },
    { accessorKey: "staffManager", header: "Nhân viên quản lý" },
    { accessorKey: "staffQuality", header: "Nhân viên kiểm định chất lượng" },
  ];
  const harvestInfoColumns: MRT_ColumnDef<HarvestInfo>[] = [
    { accessorKey: "harvestDate", header: "Thời gian thu hoạch" },
    { accessorKey: "yield", header: "Sản lượng" },
    { accessorKey: "unit", header: "Đơn vị / Quy cách" },
  ];
  // Quick counts for header badges (mock derived)
  const totalTrees = treeCropData.length;

  return (
    <Stack p="md" gap="md">
      {/* ------ Header / Filters ------ */}
      <Card withBorder radius={4} shadow="sm" p="lg">
        <Stack gap="md">
          {/* Header */}
          <Group gap="md" align="center" justify="space-between">
            <Group gap="md">
              <ThemeIcon variant="light" radius="xl" size={36}>
                <IconBorderAll size={20} />
              </ThemeIcon>
              <Title order={3}>Tìm kiếm cây trồng</Title>
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
              placeholder="Sầu riêng Ri6"
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
                  <ThemeIcon variant="light" color="green" radius="xl">
                    <IconLeaf size={18} />
                  </ThemeIcon>
                  <Title order={5} fw={600}>
                    Thông tin cây trồng
                  </Title>
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
                    searchable
                    clearable
                    label="Giống cây trồng"
                    data={plantVarietyOptions}
                    styles={{ dropdown: { zIndex: 1000 } }}
                  />
                </SimpleGrid>

                <Divider my="xs" />

                <Group gap={8}>
                  <ThemeIcon variant="light" color="teal" radius="xl">
                    <IconMap2 size={18} />
                  </ThemeIcon>
                  <Title order={5} fw={600}>
                    Thông tin vùng trồng
                  </Title>
                </Group>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                  <MultiSelect
                    radius={4}
                    label="Giấy chứng nhận"
                    placeholder="Giấy chứng nhận"
                    data={["VietGAP", "GlobalGAP"]}
                  />
                  <Select
                    label="Khu vực canh tác"
                    placeholder="Chọn khu vực canh tác"
                    radius={4}
                    searchable
                    clearable
                    data={[
                      "Khu vực canh tác Đồng Nai",
                      "Khu vực canh tác Bình Dương",
                    ]}
                    styles={{ dropdown: { zIndex: 1000 } }}
                  />
                  <MultiSelect
                    label="Vùng trồng"
                    clearable
                    placeholder="Tìm kiếm vùng trồng"
                    radius={4}
                    searchable
                    leftSection={<IconSearch size={16} />}
                    data={["Vùng Trồng Tây Nguyên", "Vùng Trồng Miền Tây"]}
                    styles={{ dropdown: { zIndex: 1000 } }}
                  />
                  <MultiSelect
                    label="Khu vực"
                    clearable
                    placeholder="Tìm theo địa danh"
                    radius={4}
                    searchable
                    leftSection={<IconSearch size={16} />}
                    data={[
                      "Khu vực phía Bắc",
                      "Khu vực phía Nam",
                      "Khu vực phía Tây",
                    ]}
                    styles={{ dropdown: { zIndex: 1000 } }}
                  />
                  <MultiSelect
                    placeholder="Tìm kiếm lô"
                    label="Lô"
                    radius={4}
                    searchable
                    leftSection={<IconSearch size={16} />}
                    data={["Lô A1", "Lô B2", "Lô C3"]}
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
              <Card shadow="sm" radius={4} withBorder p="lg">
                <Group gap="md" align="flex-start" wrap="nowrap">
                  <Image
                    src="https://lh6.googleusercontent.com/proxy/MkmLTr7RaC47H6aLuMX0yGGlXhtKf77bRQ0sEwVhPiHI01aj7WPJYpuBWIbN422tMgVbH5Z67gqzUj9h-LmQpjem8pVrKg"
                    alt="Đậu nành"
                    h={220}
                    w={300}
                    radius={4}
                    fit="cover"
                  />
                  <Stack gap={8} style={{ flex: 1 }}>
                    <Group gap="xs">
                      <Title order={4} style={{ lineHeight: 1.1 }}>
                        Đậu nành
                      </Title>
                      <Badge variant="light" color="green" radius="sm">
                        Canh tác tốt
                      </Badge>
                    </Group>

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={6}>
                      <Text size="sm" c="gray.7">
                        <b>Mã cây:</b> SOY001
                      </Text>
                      <Text size="sm">
                        <b>Giống cây trồng:</b> HL02
                      </Text>
                      <Text size="sm">
                        <b>Hình thức thu hoạch:</b> Thu hạt khô
                      </Text>
                      <Text size="sm">
                        <b>Hạt giống:</b> Hạt giống thuần
                      </Text>
                      <Text size="sm">
                        <b>Nhóm cây trồng:</b> Cây công nghiệp ngắn ngày
                      </Text>
                      <Group gap={6} align="center">
                        <Text size="sm" component="span">
                          <b>Sức khỏe cây trồng:</b>
                        </Text>
                        <Badge
                          component="span"
                          color="green"
                          variant="light"
                          radius="sm"
                        >
                          Tốt
                        </Badge>
                      </Group>
                    </SimpleGrid>

                    <Divider my={6} />
                    <Text size="sm" c="gray.7">
                      <b>Ghi chú:</b> Ưa sáng, thoát nước tốt, thích hợp đất phù
                      sa nhẹ.
                    </Text>

                    <Group gap="xs" mt="xs">
                      <Tooltip label="Xem chi tiết">
                        <ActionIcon variant="light" radius={4}>
                          <IconEye size={18} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Chỉnh sửa">
                        <ActionIcon variant="light" color="green" radius={4}>
                          <IconEdit size={18} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Xoá">
                        <ActionIcon variant="light" color="red" radius={4}>
                          <IconTrash size={18} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Stack>
                </Group>
              </Card>

              <Card shadow="sm" radius={4} withBorder p="lg" mt="md">
                <Stack gap={8}>
                  <Group gap="xs">
                    <ThemeIcon variant="light">
                      <IconBadge size={16} />
                    </ThemeIcon>
                    <Text fw={700} size="lg">
                      Lịch sử canh tác
                    </Text>
                  </Group>
                  <Table
                    columns={cultivationHistoryColumns}
                    data={cultivationHistoryData}
                  />
                </Stack>
              </Card>

              <Card shadow="sm" radius={4} withBorder p="lg" mt="md">
                <Stack gap={8}>
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="red">
                      <IconBadge size={16} />
                    </ThemeIcon>
                    <Text fw={700} size="lg">
                      Lịch sử sâu bệnh
                    </Text>
                  </Group>
                  <Table columns={pestRecordColumns} data={pestRecordData} />
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
                      <Text size="sm">
                        <b>Hàng:</b> Hàng 8
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
                      <MapBox marker />
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
                <Card shadow="sm" radius={4} withBorder p="lg">
                  {/* Header */}
                  <Group justify="space-between" align="center">
                    <Group gap="xs">
                      <ThemeIcon variant="light" radius={10} size={34}>
                        <IconBadge size={18} />
                      </ThemeIcon>
                      <Stack gap={0}>
                        <Text fw={700} size="lg">
                          Thông tin chu kỳ sinh trưởng
                        </Text>
                        <Text size="xs" c="gray.6">
                          Tổng quan mùa vụ và các giai đoạn
                        </Text>
                      </Stack>
                    </Group>
                    <Badge
                      variant="light"
                      size="md"
                      leftSection={<IconTimeline size={14} />}
                    >
                      Chu kỳ: {growthCycles.length}
                    </Badge>
                  </Group>

                  <Divider my="md" />

                  {/* Season summary */}
                  <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={10}>
                    <StatChip
                      icon={<IconLeaf size={16} />}
                      label="Tên mùa vụ"
                      value={"Mùa vụ Xuân 2025"}
                    />
                    <StatChip
                      icon={<IconHash size={16} />}
                      label="Mã"
                      value={"MSV2025XUAN"}
                    />
                    <StatChip
                      icon={<IconCalendarClock size={16} />}
                      label="Ước tính"
                      value={"90 ngày"}
                    />
                  </SimpleGrid>

                  <Tooltip label={`Hoàn thành ước tính: 70%`} withArrow>
                    <Box mt="sm">
                      <Progress value={70} radius="xl" size="lg" />
                    </Box>
                  </Tooltip>

                  <Divider my="md" />

                  {/* Cycles & stages */}
                  <Accordion variant="separated" radius={4} multiple>
                    {growthCycles.map((cycle) => (
                      <Accordion.Item key={cycle.id} value={cycle.id}>
                        <Accordion.Control
                          icon={
                            <ThemeIcon variant="light" size={26} radius={4}>
                              <IconLeaf size={16} />
                            </ThemeIcon>
                          }
                        >
                          <Group justify="space-between" wrap="nowrap">
                            <Text fw={600}>{cycle.name}</Text>
                            <Badge variant="light">
                              {cycle.stages.length} giai đoạn
                            </Badge>
                          </Group>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Stack gap="sm" pl={2}>
                            {cycle.stages.map((stage) => (
                              <StageRow key={stage.id} stage={stage} />
                            ))}
                          </Stack>
                        </Accordion.Panel>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Card>
                <Card shadow="sm" radius={4} withBorder p="lg" mt="md">
                  <Stack gap={8}>
                    <Group gap="xs">
                      <ThemeIcon variant="light">
                        <IconBadge size={16} />
                      </ThemeIcon>
                      <Text fw={700} size="lg">
                        Lịch sử thu hoạch
                      </Text>
                    </Group>
                    <Table
                      columns={harvestInfoColumns}
                      data={harvestInfoData}
                    />
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      ) : (
        <Card withBorder radius={4} shadow="sm" p="lg">
          <Group mb="sm" justify="space-between">
            <Text fw={700}>Danh sách cây trồng</Text>
            <Text size="sm" c="dimmed">
              Tổng cộng {totalTrees} mục
            </Text>
          </Group>
          <Table columns={treeCropColumns} data={treeCropData} />
        </Card>
      )}

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
          opened={openedTreeDetail ?? undefined}
          onClose={() => setOpenedTreeDetail(false)}
          data={treeDetail}
        />
      )}
    </Stack>
  );
}
