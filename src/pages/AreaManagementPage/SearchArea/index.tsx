import { useMemo, useState } from "react";
import {
  Accordion,
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Image,
  Menu,
  Modal,
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
  IconCalendarClock,
  IconCheck,
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
  IconTable,
  IconTimeline,
  IconTrash,
} from "@tabler/icons-react";
import Table from "../../../components/Table";
import type { MRT_ColumnDef } from "mantine-react-table";
import { CompanyList } from "../../../components/CompanyList";
import { areaOptions, cropOptions, plotOptions, seedOptions } from "../Row/Add";
import AreaCards from "../Zone/Add/components/AreaCards";
import PlotCardSelector from "../Row/Add/components/PlotCards";
import MapBox from "../Region/Detail/components/Map";
import Scrollable from "../../../components/Scrollable";
import CropCards from "../../SeasonManagementPage/Growth/Add/components/CropCards";
import SeedCards from "../../SeasonManagementPage/Growth/Add/components/SeedCards";
import { regionOptions } from "../Block/Add";
import RegionCardSelector from "../Row/Add/components/RegionCards";
import {
  ResourceCard,
  type Resource,
} from "../../PlanManagementPage/Assign/Add/components/ConfirmStep";
import {
  TreeDetailModal,
  type TreeDetail,
} from "../Search/components/TreeDetailModal";

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

const pestRecordData: PestRecord[] = [
  {
    id: "PH001",
    detectedAt: "2025-03-15",
    resolvedAt: "2025-03-18",
    pestStatus: "Rầy nâu",
    solution: "Phun thuốc và kiểm tra lại sau 7 ngày",
    pesticides: ["Confidor", "Actara"],
    staffHandler: "Nguyễn Văn A",
    staffManager: "Trần Thị B",
    staffQuality: "Lê Văn C",
  },
  {
    id: "PH002",
    detectedAt: "2025-04-10",
    resolvedAt: "2025-04-13",
    pestStatus: "Sâu đục thân",
    solution: "Cắt bỏ cành bị hại, phun thuốc sinh học",
    pesticides: ["Regent", "Vertimec"],
    staffHandler: "Phạm Văn D",
    staffManager: "Nguyễn Thị E",
    staffQuality: "Trần Văn F",
  },
];

type HarvestInfo = {
  id: string;
  harvestDate: string; // Thời gian thu hoạch
  yield: number; // Sản lượng
  unit: string; // Đơn vị / Quy cách
};
const harvestInfoData: HarvestInfo[] = [
  {
    id: "H001",
    harvestDate: "2025-07-15",
    yield: 1500,
    unit: "kg",
  },
  {
    id: "H002",
    harvestDate: "2025-08-10",
    yield: 800,
    unit: "thùng (20kg)",
  },
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
    id: "cycle1",
    name: "Chu kỳ trung bình (3-5 năm)",
    stages: [
      { id: "stage1", name: "Ra hoa", duration: "30 ngày" },
      { id: "stage2", name: "Kết trái", duration: "60 ngày" },
      { id: "stage3", name: "Thu hoạch", duration: "15 ngày" },
    ],
  },
  {
    id: "cycle2",
    name: "Chu kỳ dài (5-7 năm)",
    stages: [
      { id: "stage1", name: "Ra hoa", duration: "40 ngày" },
      { id: "stage2", name: "Kết trái", duration: "80 ngày" },
      { id: "stage3", name: "Thu hoạch", duration: "20 ngày" },
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
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [view, setView] = useState<"details" | "list">("details");
  const [cultivationDetail, setCultivationDetail] = useState(false);
  const [cultivationNoteDetail, setCultivationNoteDetail] = useState(false);
  const [openedTreeDetail, setOpenedTreeDetail] = useState(false);
  // ---------- Columns ----------
  const treeCropColumns: MRT_ColumnDef<TreeCrop>[] = useMemo(
    () => [
      { accessorKey: "id", header: "Mã cây trồng" },
      { accessorKey: "name", header: "Cây trồng" },
      { accessorKey: "variety", header: "Giống cây" },
      { accessorKey: "seedType", header: "Hạt giống" },
      { accessorKey: "plantingDate", header: "Thời gian trồng" },
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
  const totalCultivations = cultivationHistoryData.length;
  const totalPests = pestRecordData.length;

  return (
    <Stack p="md" gap="md">
      {/* ------ Header / Filters ------ */}
      <Paper withBorder p="md" radius={4} shadow="xs">
        <Stack gap="sm">
          <Group justify="space-between" align="flex-start">
            <Stack gap={4}>
              <Group gap="xs">
                <ThemeIcon variant="light" radius="xl" size={28}>
                  <IconBorderAll size={16} />
                </ThemeIcon>
                <Title order={3}>Tìm kiếm vùng trồng</Title>
              </Group>
              <Group gap="xs">
                <Badge leftSection={<IconTable size={12} />} variant="light">
                  {totalTrees} cây
                </Badge>
                <Badge
                  leftSection={<IconBadge size={12} />}
                  variant="light"
                  color="green"
                >
                  {totalCultivations} canh tác
                </Badge>
                <Badge
                  leftSection={<IconBadge size={12} />}
                  variant="light"
                  color="red"
                >
                  {totalPests} sâu bệnh
                </Badge>
              </Group>
            </Stack>

            <SegmentedControl
              value={view}
              onChange={(v) => setView(v as any)}
              data={[
                { label: "Chi tiết", value: "details" },
                { label: "Danh sách", value: "list" },
              ]}
              radius={4}
            />
          </Group>

          <Group align="flex-end" wrap="nowrap">
            <TextInput
              flex={1}
              label="Từ khoá"
              radius={4}
              placeholder="Tên cây, mã vùng (V01), địa điểm…"
              leftSection={<IconSearch size={16} />}
              value={keyword}
              onChange={(e) => setKeyword(e.currentTarget.value)}
            />
            <Tooltip label="Bộ lọc nâng cao" openDelay={300}>
              <Button
                radius={4}
                leftSection={<IconFilter size={16} />}
                onClick={() => setOpenFilterModal(true)}
              >
                Lọc
              </Button>
            </Tooltip>
            <Tooltip label="Xoá bộ lọc" openDelay={300}>
              <ActionIcon variant="light" radius={4} aria-label="reset">
                <IconRotateClockwise2 size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Stack>
      </Paper>

      {/* ------ Content ------ */}
      {view === "details" ? (
        <Stack gap="md">
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Card shadow="sm" radius={4} withBorder p="lg">
                <Group gap="md" align="flex-start" wrap="nowrap">
                  <Image
                    src="https://vuacaygiong.com/wp-content/uploads/2017/11/Sau_rieng_Musang_King_d197.jpg"
                    alt="Sầu riêng"
                    h={220}
                    w={300}
                    radius={4}
                    fit="cover"
                    styles={{
                      image: {
                        border: "1px solid var(--mantine-color-gray-3)",
                      },
                    }}
                  />
                  <Stack gap={8} style={{ flex: 1 }}>
                    <Group gap="xs">
                      <Title order={4} style={{ lineHeight: 1.1 }}>
                        Sầu riêng
                      </Title>
                      <Badge variant="light" color="yellow" radius="sm">
                        Ưu tiên
                      </Badge>
                    </Group>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={6}>
                      <Text size="sm" c="gray.7">
                        <b>Mã cây:</b> TREE001
                      </Text>

                      <Text size="sm">
                        <b>Giống cây trồng:</b> Ri6
                      </Text>
                      <Text size="sm">
                        <b>Hình thức thu hoạch:</b> Thủ công
                      </Text>
                      <Text size="sm">
                        <b>Hạt giống:</b> Hạt lai F1
                      </Text>
                      <Text size="sm">
                        <b>Nhóm cây trồng:</b> Cây ăn trái
                      </Text>
                      <Text size="sm">
                        <b>Sức khỏe cây trồng:</b>{" "}
                        <Badge color="green" variant="light" radius="sm">
                          Tốt
                        </Badge>
                        {/* Nếu đang bệnh thì dùng màu đỏ */}
                        {/* <Badge color="red" variant="light" radius="sm">Đang bệnh</Badge> */}
                      </Text>
                    </SimpleGrid>
                    <Divider my={6} />
                    <Text size="sm" c="gray.7">
                      <b>Ghi chú:</b> Yêu cầu đất thịt và thoát nước tốt
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
                    </SimpleGrid>
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
                      style={{ overflow: "hidden", borderRadius: 8, zIndex: 0 }}
                    >
                      <MapBox plot zoom={17} />
                    </Box>
                  </Stack>
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

      {/* ------ Filter Modal ------ */}
      <Modal
        opened={openFilterModal}
        onClose={() => setOpenFilterModal(false)}
        size="lg"
        title={
          <Group gap={6}>
            <IconFilter size={18} />
            <Text fw={600}>Bộ lọc cây trồng</Text>
          </Group>
        }
        centered
        withinPortal
        styles={{
          inner: {
            zIndex: 999,
          },
        }}
      >
        <Stack gap="md">
          <Paper withBorder p="md" radius={4}>
            <Stack gap="sm">
              <Title order={5}>Doanh nghiệp / Nông hộ</Title>
              <CompanyList />
            </Stack>
          </Paper>
          <Paper withBorder p="md" radius={4}>
            <Stack gap="sm">
              <Title order={5}>Thông tin cây trồng</Title>
              <Select
                label="Nhóm cây trồng"
                placeholder="Chọn nhóm cây trồng"
                radius={4}
                data={[
                  "Cây ăn trái",
                  "Cây công nghiệp",
                  "Cây lương thực",
                  "Cây thuốc",
                  "Cây cảnh",
                  "Cây lấy gỗ",
                  "Cây lấy dầu",
                  "Cây lấy sợi",
                ]}
              />
              <TextInput
                label="Giống cây trồng"
                placeholder="Tìm kiếm giống cây trồng"
                radius={4}
                leftSection={<IconSearch size={18} />}
              />
              <SeedCards selected="" seeds={seedOptions} onSelect={() => {}} />
              <TextInput
                label="Cây trồng"
                placeholder="Tìm kiếm cây trồng"
                radius={4}
                leftSection={<IconSearch size={18} />}
              />

              <CropCards
                selected="1"
                plants={cropOptions}
                onSelect={() => {}}
              />
            </Stack>
          </Paper>
          <Paper withBorder p="md" radius={4}>
            <Stack gap="sm">
              <Title order={5}>Thông tin vùng trồng</Title>
              <Select
                radius={4}
                data={["V01", "V02", "V03"]}
                label="Mã định danh"
                searchable
                styles={{ dropdown: { zIndex: 1000 } }}
              />
              <Select
                label="Khu vực canh tác"
                placeholder="Chọn khu vực canh tác"
                radius={4}
                data={[
                  "Khu vực canh tác Đồng Nai",
                  "Khu vực canh tác Bình Dương",
                ]}
                searchable
                styles={{ dropdown: { zIndex: 1000 } }}
              />

              <TextInput
                label="Vùng trồng"
                placeholder="Tìm kiếm vùng trồng"
                radius={4}
                leftSection={<IconSearch size={18} />}
              />
              <RegionCardSelector
                regions={regionOptions}
                selected={"12"}
                onSelect={() => {}}
              />
              <TextInput
                label="Khu vực"
                placeholder="Tìm theo địa danh"
                radius={4}
                leftSection={<IconSearch size={16} />}
              />
              <AreaCards
                areas={areaOptions}
                selected={""}
                onSelect={() => {}}
              />
              <TextInput
                placeholder="Tìm kiếm lô"
                label="Lô"
                radius={4}
                leftSection={<IconSearch size={16} />}
              />
              <PlotCardSelector lots={plotOptions} />
            </Stack>
          </Paper>

          <Group justify="space-between">
            <Button
              radius={4}
              variant="default"
              leftSection={<IconRotateClockwise2 size={16} />}
            >
              Đặt lại
            </Button>
            <Button
              radius={4}
              leftSection={<IconCheck size={16} />}
              onClick={() => {
                setOpenFilterModal(false);
                setView("list");
              }}
            >
              Áp dụng
            </Button>
          </Group>
        </Stack>
      </Modal>
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
          <Table data={cultivationNoteData} columns={cultivationNoteColumns} />
        ) : (
          <Text c="red">Không có dữ liệu!</Text>
        )}
      </Modal>
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
      <TreeDetailModal
        data={treeDetail ?? undefined}
        onClose={() => setOpenedTreeDetail(false)}
        opened={openedTreeDetail}
      />
    </Stack>
  );
}
