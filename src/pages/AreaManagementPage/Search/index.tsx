import { useMemo, useState, useEffect } from "react";
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
import { TreeDetailModal } from "./components/TreeDetailModal";
import { InfoRow } from "../Region/Add";
import { useTreeStore } from "../../zustand/treeStore";
import { useSeedStore } from "../../zustand/seedStore";
import { useRegionStore } from "../../zustand/regionStore";
import { useAreaSetupStore } from "../../zustand/areaSetupStore";
import { useCertificateStore } from "../../zustand/certificateStore";

// ---------------- Types & Mock Data Generators ----------------

// Mở rộng Type để chứa đủ thông tin hiển thị
type TreeCropDisplay = {
  id: string;
  img: string;
  name: string;
  variety: string;
  seedType: string;
  plantingDate: string;
  regionId: string;
  region: string;
  // Extra fields for detail view
  areaName: string;
  plotName: string;
  companyName: string;
  note: string;
  healthStatus: "Tốt" | "Khá" | "Trung bình";
  certificateIds: string[];
};

type CultivationHistory = {
  id: string;
  cropSeasonName: string;
  planName: string;
  actualStart: string;
  expectedEnd: string;
  actualEnd: string;
  manager: string;
  qualityStaff: string;
};

type CultivationNote = {
  id: string;
  expectedStart: string;
  expectedEnd: string;
  actualStart: string;
  actualEnd: string;
};

type PestRecord = {
  id: string;
  detectedAt: string;
  resolvedAt: string;
  pestStatus: string;
  solution: string;
  pesticides: string[];
  staffHandler: string;
  staffManager: string;
  staffQuality: string;
};

type HarvestInfo = {
  id: string;
  harvestDate: string;
  yield: number;
  unit: string;
};

type Stage = {
  id: string;
  name: string;
  duration: string;
  percent?: number;
};

type GrowthCycle = {
  id: string;
  name: string;
  stages: Stage[];
};
// --- HELPER FUNCTIONS & DATA POOLS ---

// 1. Dữ liệu mẫu (Pools)
const NAMES = [
  "Nguyễn Văn Hòa",
  "Trần Thị Lan",
  "Lê Văn Dũng",
  "Nguyễn Thị Mai",
  "Phạm Văn Bình",
  "Nguyễn Thị Hoa",
  "Võ Quốc Huy",
  "Trần Văn Nam",
  "Lý Thị Hạnh",
  "Đỗ Văn Long",
  "Hoàng Văn Thái",
  "Phan Thị Thu",
];

const SEASONS = [
  "Vụ Xuân 2025",
  "Vụ Đông Xuân 2024",
  "Vụ Hè Thu 2024",
  "Vụ Mùa 2024",
];

const PLANS = [
  "Gieo trồng đợt 1",
  "Cải tạo đất",
  "Bón phân thúc đợt 2",
  "Phun thuốc phòng ngừa",
  "Thu hoạch đại trà",
  "Kiểm tra sâu bệnh định kỳ",
];

const PESTS = [
  { name: "Rệp sáp", solution: "Phun thuốc sinh học Bio-B" },
  { name: "Sâu đục thân", solution: "Sử dụng bẫy đèn và thuốc Virtako" },
  { name: "Bệnh rỉ sắt", solution: "Phun Anvil 5SC, cắt tỉa lá bệnh" },
  { name: "Nhện đỏ", solution: "Tưới phun sương, dùng Ortus 5SC" },
  { name: "Nấm hồng", solution: "Quét thuốc Bordeaux lên vết bệnh" },
];

const PESTICIDES = [
  "Bio-B",
  "Nano Bạc",
  "Virtako 40WG",
  "Anvil 5SC",
  "Ortus 5SC",
  "Confidor 100SL",
  "Radiant 60SC",
  "Regent 800WG",
];

// 2. Hàm tiện ích Random
const getRandomItem = (arr: any[]) =>
  arr[Math.floor(Math.random() * arr.length)];

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
    .toISOString()
    .split("T")[0];
};

const getRandomSubArray = (arr: any[], maxItems: number): any[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, getRandomInt(1, maxItems));
};

// --- GENERATORS ---

const generateHistory = (treeId: string): CultivationHistory[] => {
  const count = getRandomInt(1, 4); // Tạo 1 đến 4 lịch sử ngẫu nhiên
  return Array.from({ length: count }).map((_, idx) => {
    const startDate = getRandomDate(new Date(2024, 0, 1), new Date(2025, 3, 1));
    const endDate = new Date(
      new Date(startDate).getTime() + getRandomInt(2, 10) * 86400000
    )
      .toISOString()
      .split("T")[0]; // +2 đến 10 ngày

    return {
      id: `HIS-${treeId}-${idx + 1}`,
      cropSeasonName: getRandomItem(SEASONS),
      planName: getRandomItem(PLANS),
      actualStart: startDate,
      expectedEnd: endDate,
      actualEnd: endDate,
      manager: getRandomItem(NAMES),
      qualityStaff: getRandomItem(NAMES),
    };
  });
};

const generatePestRecords = (treeId: string): PestRecord[] => {
  const hasPest = Math.random() > 0.3; // 70% cơ hội có sâu bệnh
  if (!hasPest) return [];

  const count = getRandomInt(1, 2);
  return Array.from({ length: count }).map((_, idx) => {
    const pestInfo = getRandomItem(PESTS);
    const detectDate = getRandomDate(new Date(2025, 0, 1), new Date());
    const resolveDate = new Date(
      new Date(detectDate).getTime() + getRandomInt(1, 5) * 86400000
    )
      .toISOString()
      .split("T")[0];

    return {
      id: `PEST-${treeId}-${idx + 1}`,
      detectedAt: detectDate,
      resolvedAt: resolveDate,
      pestStatus: pestInfo.name,
      solution: pestInfo.solution,
      pesticides: getRandomSubArray(PESTICIDES, 2),
      staffHandler: getRandomItem(NAMES),
      staffManager: getRandomItem(NAMES),
      staffQuality: getRandomItem(NAMES),
    };
  });
};

const generateHarvestInfo = (treeId: string): HarvestInfo[] => {
  const count = getRandomInt(1, 3);
  return Array.from({ length: count }).map((_, idx) => {
    return {
      id: `HV-${treeId}-${idx + 1}`,
      harvestDate: getRandomDate(new Date(2023, 0, 1), new Date(2024, 11, 31)),
      yield: parseFloat((Math.random() * 5 + 2).toFixed(1)), // Random từ 2.0 đến 7.0
      unit: getRandomItem(["tấn/ha", "tạ/ha", "kg/cây"]),
    };
  });
};

const cultivationNoteData: CultivationNote[] = [
  {
    id: "CN-PH001",
    expectedStart: "2025-03-10",
    expectedEnd: "2025-03-12",
    actualStart: "2025-03-11",
    actualEnd: "2025-03-12",
  },
];

const resource: Resource[] = [
  {
    type: "Thiết bị",
    name: "Máy cày Kubota L3218",
    quantity: 1,
    unit: "cái",
    img: "https://kubotadailoi.com/uploads/images/P-1176_L3218_slide.jpg",
  },
  {
    type: "Vật tư",
    name: "Béc tưới nhỏ giọt",
    quantity: 500,
    unit: "cái",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXj6nfv7JlBEuVoQo0o9DUUXGAnLXXec-JLg&s",
  },
];

// --- GROWTH CYCLE GENERATOR HELPERS ---

const CYCLE_NAMES = [
  "Chu kỳ tiêu chuẩn (90-100 ngày)",
  "Chu kỳ ngắn ngày (75-85 ngày)",
  "Chu kỳ VietGAP (110-120 ngày)",
  "Chu kỳ canh tác hữu cơ",
  "Chu kỳ mùa khô",
];

// Các mẫu giai đoạn khác nhau cho phong phú
const STAGE_TEMPLATES = [
  // Mẫu cây ăn quả/lấy hạt
  [
    { name: "Nảy mầm", min: 5, max: 7 },
    { name: "Sinh trưởng sinh dưỡng", min: 25, max: 35 },
    { name: "Ra hoa", min: 10, max: 15 },
    { name: "Tạo quả/hạt", min: 20, max: 30 },
    { name: "Chín & Thu hoạch", min: 10, max: 15 },
  ],
  // Mẫu cây lấy lá/ngắn ngày
  [
    { name: "Ươm giống", min: 3, max: 5 },
    { name: "Hồi xanh", min: 5, max: 7 },
    { name: "Phát triển thân lá", min: 20, max: 30 },
    { name: "Thu hoạch", min: 5, max: 10 },
  ],
  // Mẫu chi tiết
  [
    { name: "Xử lý đất & Gieo", min: 3, max: 5 },
    { name: "Cây con (3-5 lá)", min: 10, max: 15 },
    { name: "Đẻ nhánh/Vươn lóng", min: 20, max: 25 },
    { name: "Trỗ cờ/Phun râu", min: 10, max: 12 },
    { name: "Chín sinh lý", min: 15, max: 20 },
  ],
];

const generateGrowthCycles = (treeId: string): GrowthCycle[] => {
  // 1. Chọn ngẫu nhiên một mẫu giai đoạn
  const template = getRandomItem(STAGE_TEMPLATES);
  const cycleName = getRandomItem(CYCLE_NAMES);

  // 2. Xác định ngẫu nhiên giai đoạn hiện tại (để tính %)
  // Ví dụ: Đang ở giai đoạn 2 thì giai đoạn 0,1 là 100%, giai đoạn 2 là random %, giai đoạn 3,4 là 0%
  const currentStageIndex = getRandomInt(0, template.length - 1);
  const currentStagePercent = getRandomInt(10, 90);

  const stages: Stage[] = template.map((step, index) => {
    let percent = 0;

    if (index < currentStageIndex) {
      percent = 100; // Các giai đoạn trước đã xong
    } else if (index === currentStageIndex) {
      percent = currentStagePercent; // Giai đoạn hiện tại đang chạy
    } else {
      percent = 0; // Các giai đoạn sau chưa tới
    }

    return {
      id: `s-${treeId}-${index}`,
      name: step.name,
      duration: `${step.min}–${step.max} ngày`,
      percent: percent,
    };
  });

  return [
    {
      id: `cycle-${treeId}`,
      name: cycleName,
      stages: stages,
    },
  ];
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
  // --- STORE HOOKS ---
  const { trees } = useTreeStore();
  const { seeds } = useSeedStore();
  const { regions } = useRegionStore();
  const { certificates } = useCertificateStore();
  // --- LOCAL STATE ---
  const [keyword, setKeyword] = useState("");
  const [view, setView] = useState<"details" | "list">("details");
  const [cultivationDetail, setCultivationDetail] = useState(false);
  const [cultivationNoteDetail, setCultivationNoteDetail] = useState(false);
  const [openedTreeDetail, setOpenedTreeDetail] = useState(false);
  const [isFilter, setIsFilter] = useState(false);

  // Filters State
  const [selectedSeed, setSelectedSeed] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string[]>([]);

  // Selection State (Detail View)
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);

  // --- DATA PROCESSING LOGIC ---
  const processedData = useMemo<TreeCropDisplay[]>(() => {
    // Nếu chưa có data từ store, dùng dummy data mặc định để UI không rỗng
    if (seeds.length === 0 && trees.length === 0) {
      return [
        {
          id: "MOCK-001",
          img: "https://cdn.tgdd.vn/Products/Images/8785/241815/bhx/bap-my-202402261032060598.jpg",
          name: "Bắp Mỹ",
          variety: "VN886",
          seedType: "F1",
          plantingDate: "2025-02-20",
          region: "Tây Nguyên",
          areaName: "Khu vực A",
          plotName: "Lô 1",
          companyName: "Hộ ông Nguyễn Văn A",
          note: "Cây phát triển tốt",
          healthStatus: "Tốt",
          certificateIds: ["GCN-001"],
          regionId: "",
        },
      ];
    }
    // Map data từ store: Seeds là gốc (đại diện cho các đợt trồng/giống)
    return seeds.map((seed, index) => {
      const parentTree = trees.find((t) => t.seedCode === seed.id);
      // Giả lập gán vùng trồng (vì store Seed chưa link trực tiếp vùng)
      const assignedRegion = regions[index % regions.length];

      return {
        id: seed.id || `SEED-${index}`,
        img: seed.imgUrl || parentTree?.imgUrl || "https://placehold.co/400",
        name: parentTree?.name,
        variety: seed.name,
        seedType: seed.origin || "F1",
        plantingDate: "2025-01-15", // Mock date
        regionId: assignedRegion.region.codeSystem,
        region: assignedRegion?.region.name || "Chưa xác định",
        areaName: assignedRegion?.areas[0]?.name || "Khu vực 1",
        plotName: `Lô ${index + 1}`,
        companyName:
          index % 2 === 0 ? "Hộ ông Nguyễn Văn A" : "HTX Nông nghiệp Bền Vững",
        note: seed.note || "Đang trong giai đoạn sinh trưởng mạnh.",
        healthStatus: "Tốt",
        certificateIds: ["GCN-001"],
      };
    });
  }, [seeds, trees, regions]);

  // --- FILTERING LOGIC ---
  const filteredData = useMemo(() => {
    return processedData.filter((item) => {
      // Keyword filter
      const searchStr =
        `${item.name} ${item.variety} ${item.id} ${item.region}`.toLowerCase();
      if (keyword && !searchStr.includes(keyword.toLowerCase())) return false;

      // Dropdown filters
      if (selectedSeed && item.variety !== selectedSeed) return false;
      if (selectedRegion.length > 0 && !selectedRegion.includes(item.region))
        return false;

      return true;
    });
  }, [processedData, keyword, selectedSeed, selectedRegion]);
  // --- CURRENT ITEM LOGIC (Detail View) ---
  const currentItem = useMemo(() => {
    if (selectedTreeId) {
      return (
        filteredData.find((item) => item.id === selectedTreeId) ||
        filteredData[0]
      );
    }
    return filteredData[0];
  }, [filteredData, selectedTreeId]);
  const certificateData = useMemo(() => {
    if (!currentItem || !certificates) return undefined;

    // Cách 1: Nếu đã truyền certificateIds vào currentItem ở Bước 1 (Khuyên dùng)
    const certIds = currentItem.certificateIds;

    // Cách 2: Nếu chỉ truyền setupId/regionId vào currentItem (Cách cũ của bạn nhưng đã fix logic)
    /* const foundSetup = setups.find(s => s.id === currentItem.setupId);
    const certIds = foundSetup?.certificateIds || [];
    */

    if (!certIds || certIds.length === 0) return undefined;

    // Tìm chứng chỉ đầu tiên khớp với ID
    // Lưu ý: setup.certificateIds là mảng string, certificates là mảng object
    return certificates.find((cert) => certIds.includes(cert.id));
  }, [currentItem, certificates]);

  // Options cho Filter Dropdown
  const seedOptions = useMemo(
    () => [...new Set(processedData.map((d) => d.variety))],
    [processedData]
  );
  const regionOptions = useMemo(
    () => [...new Set(processedData.map((d) => d.region))],
    [processedData]
  );

  // ---------- Columns Definition ----------
  const treeCropColumns: MRT_ColumnDef<TreeCropDisplay>[] = useMemo(
    () => [
      { accessorKey: "id", header: "Mã cây trồng" },
      {
        accessorKey: "img",
        header: "Hình ảnh",
        Cell: ({ row }) => (
          <Image src={row.original.img} w={80} h={50} fit="cover" radius="sm" />
        ),
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
        Cell: ({ row }) => (
          <Menu shadow="md" withinPortal>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEye size={18} />}
                onClick={() => {
                  setSelectedTreeId(row.original.id);
                  if (view === "list") setView("details");
                }}
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
    [view]
  );

  // Column definitions for inner tables (Static columns)
  const cultivationHistoryColumns: MRT_ColumnDef<CultivationHistory>[] =
    useMemo(
      () => [
        { accessorKey: "cropSeasonName", header: "Mùa vụ" },
        { accessorKey: "planName", header: "Kế hoạch" },
        { accessorKey: "actualStart", header: "Thời gian thực hiện" },
        { accessorKey: "expectedEnd", header: "Dự kiến xong" },
        { accessorKey: "actualEnd", header: "Hoàn thành" },
        { accessorKey: "manager", header: "Quản lý" },
        { accessorKey: "qualityStaff", header: "Kiểm định" },
        {
          accessorKey: "actions",
          header: "Tuỳ chọn",
          size: 10,
          Cell: () => (
            <ActionIcon
              variant="transparent"
              c="gray"
              onClick={() => setCultivationDetail(true)}
            >
              <IconEye size={18} />
            </ActionIcon>
          ),
        },
      ],
      []
    );

  const pestRecordColumns: MRT_ColumnDef<PestRecord>[] = useMemo(
    () => [
      { accessorKey: "id", header: "Số phiếu" },
      { accessorKey: "detectedAt", header: "Phát hiện" },
      { accessorKey: "pestStatus", header: "Tình trạng" },
      { accessorKey: "solution", header: "Xử lý" },
      {
        accessorKey: "pesticides",
        header: "Thuốc BVTV",
        Cell: ({ cell }) => cell.getValue<string[]>().join(", "),
      },
    ],
    []
  );

  const harvestInfoColumns: MRT_ColumnDef<HarvestInfo>[] = useMemo(
    () => [
      { accessorKey: "harvestDate", header: "Thời gian thu hoạch" },
      { accessorKey: "yield", header: "Sản lượng" },
      { accessorKey: "unit", header: "Đơn vị" },
    ],
    []
  );

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
              placeholder="Tên cây, mã số, hoặc khu vực..."
              leftSection={<IconSearch size={16} />}
              value={keyword}
              onChange={(e) => setKeyword(e.currentTarget.value)}
            />
            <Tooltip label="Bộ lọc nâng cao" openDelay={300}>
              <Button
                radius={4}
                leftSection={<IconFilter size={16} />}
                variant={isFilter ? "light" : "filled"}
                onClick={() => {
                  setIsFilter(!isFilter);
                }}
              >
                {isFilter ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
              </Button>
            </Tooltip>
            <Tooltip label="Xoá bộ lọc" openDelay={300}>
              <ActionIcon
                variant="light"
                radius={4}
                aria-label="reset"
                onClick={() => {
                  setKeyword("");
                  setSelectedRegion([]);
                  setSelectedSeed(null);
                }}
              >
                <IconRotateClockwise2 size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>

          <Collapse in={isFilter} transitionDuration={170}>
            <Paper withBorder p="lg" radius={4} bg="gray.0">
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
                    data={["Hộ ông Nguyễn Văn A", "HTX Nông nghiệp Bền Vững"]}
                    styles={{ dropdown: { zIndex: 1000 } }}
                  />
                  <Select
                    radius={4}
                    searchable
                    clearable
                    label="Giống cây trồng"
                    data={seedOptions}
                    value={selectedSeed}
                    onChange={setSelectedSeed}
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
                    label="Vùng trồng"
                    clearable
                    placeholder="Tìm kiếm vùng trồng"
                    searchable
                    leftSection={<IconSearch size={16} />}
                    data={regionOptions}
                    value={selectedRegion}
                    onChange={setSelectedRegion}
                    styles={{ dropdown: { zIndex: 1000 } }}
                  />
                  <MultiSelect
                    label="Khu vực"
                    clearable
                    placeholder="Tìm theo khu vực"
                    radius={4}
                    searchable
                    data={["Khu vực phía Bắc", "Khu vực phía Nam"]}
                    styles={{ dropdown: { zIndex: 1000 } }}
                  />
                </SimpleGrid>
              </Stack>
            </Paper>
          </Collapse>
        </Stack>
      </Card>

      {/* ------ Content ------ */}
      {view === "details" ? (
        currentItem ? (
          <Stack gap="md">
            <Grid gutter="md">
              {/* LEFT COLUMN */}
              <Grid.Col span={{ base: 12, md: 7 }}>
                <Card shadow="sm" radius={4} withBorder p="lg">
                  <Group gap="md" align="flex-start" wrap="nowrap">
                    <Image
                      src={currentItem.img}
                      alt={currentItem.name}
                      h={220}
                      w={300}
                      radius={4}
                      fit="cover"
                    />
                    <Stack gap={8} style={{ flex: 1 }}>
                      <Group gap="xs" justify="space-between">
                        <Group gap="xs">
                          <Title order={4} style={{ lineHeight: 1.1 }}>
                            {currentItem.name}
                          </Title>
                          <Badge variant="light" color="blue">
                            {currentItem.variety}
                          </Badge>
                        </Group>
                        <Badge variant="outline" color="gray">
                          {currentItem.id}
                        </Badge>
                      </Group>
                      <Badge
                        variant="light"
                        color="green"
                        radius="sm"
                        w="fit-content"
                      >
                        Sức khoẻ: {currentItem.healthStatus}
                      </Badge>

                      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={6}>
                        <Text size="sm" c="gray.7">
                          <b>Ngày trồng:</b> {currentItem.plantingDate}
                        </Text>
                        <Text size="sm">
                          <b>Loại hạt:</b> {currentItem.seedType}
                        </Text>
                        <Text size="sm">
                          <b>Thu hoạch:</b> Thu hạt khô
                        </Text>
                        <Text size="sm">
                          <b>Nhóm:</b> Cây công nghiệp
                        </Text>
                      </SimpleGrid>

                      <Divider my={6} />
                      <Text size="sm" c="gray.7" lineClamp={2}>
                        <b>Ghi chú:</b> {currentItem.note}
                      </Text>

                      <Group gap="xs" mt="xs">
                        <Tooltip label="Xem chi tiết">
                          <ActionIcon
                            variant="light"
                            radius={4}
                            onClick={() => setOpenedTreeDetail(true)}
                          >
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

                {/* DUMMY DATA FOR TABLES BASED ON CURRENT ITEM ID */}
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
                      data={generateHistory(currentItem.id)}
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
                    <Table
                      columns={pestRecordColumns}
                      data={generatePestRecords(currentItem.id)}
                    />
                  </Stack>
                </Card>
              </Grid.Col>

              {/* RIGHT COLUMN */}
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Stack gap="md">
                  <Card shadow="sm" radius={4} withBorder p="lg">
                    <Stack gap={"xs"}>
                      <Group gap="sm">
                        <Image
                          src="https://incucdep.com/wp-content/uploads/2015/02/logo-doanh-nghiep-BENTO.jpg"
                          alt="Logo doanh nghiệp"
                          width={40}
                          height={40}
                          radius={40}
                          fit="contain"
                        />
                        <Text fw={700} size="lg">
                          {currentItem.companyName}
                        </Text>
                        <Badge color="green" variant="light" radius="sm">
                          VietGap
                        </Badge>
                      </Group>
                      <SimpleGrid cols={2} spacing={8}>
                        <Text size="sm" c="gray.6">
                          <b>Mã vùng:</b>{" "}
                          {currentItem.region.substring(0, 3).toUpperCase()}
                        </Text>
                        <Text size="sm">
                          <b>Vùng:</b> {currentItem.region}
                        </Text>
                        <Text size="sm">
                          <b>Khu vực:</b> {currentItem.areaName}
                        </Text>
                        <Text size="sm">
                          <b>Lô:</b> {currentItem.plotName}
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
                        style={{
                          position: "relative",
                          overflow: "hidden",
                          borderRadius: 8,
                          zIndex: 0,
                        }}
                      >
                        <MapBox marker />
                      </Box>
                    </Stack>
                  </Card>
                  <Card withBorder radius={4} shadow="sm" p="md" h={300}>
                    <Title order={5} mb="xs">
                      🏅 Giấy chứng nhận
                    </Title>

                    <Group align="flex-start" gap="lg" wrap="nowrap">
                      {/* Ảnh chứng nhận + dấu mộc */}
                      <Tooltip label="Dấu chứng nhận VietGAP" withArrow>
                        <Image
                          w={"40%"}
                          src={certificateData?.orgLogo}
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
                              {certificateData?.orgName}
                            </Title>
                          </Group>
                          <Badge
                            color="teal"
                            variant="light"
                            leftSection={<IconShieldCheck size={14} />}
                          >
                            Hiệu lực {certificateData?.validYears} năm
                          </Badge>
                        </Group>

                        <Group gap="xs" wrap="wrap">
                          <Badge variant="light">
                            {certificateData?.certCode}
                          </Badge>
                          <Badge variant="outline">
                            {certificateData?.certName}
                          </Badge>
                          <Badge
                            variant="outline"
                            leftSection={<IconCalendar size={14} />}
                          >
                            Cấp ngày {certificateData?.issueDate}
                          </Badge>
                        </Group>

                        <Divider my={4} />

                        <Stack gap={4}>
                          <InfoRow
                            label="Tên chứng nhận"
                            value="Chứng nhận VietGAP"
                          />
                          <InfoRow
                            label="Mã số"
                            value={certificateData?.certCode || ""}
                          />
                          <InfoRow
                            label="Tổ chức cấp"
                            value={certificateData?.certName || ""}
                          />
                          <InfoRow
                            label="Ngày cấp"
                            value={certificateData?.createdAt || ""}
                          />
                          <InfoRow
                            label="Thời hạn hiệu lực"
                            value={`${certificateData?.validYears || 0} năm`}
                          />
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
                        </Stack>
                      </Group>
                    </Group>

                    <Divider my="md" />

                    {/* Season summary */}
                    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={10}>
                      <StatChip
                        icon={<IconLeaf size={16} />}
                        label="Mùa vụ"
                        value={"Xuân 2025"}
                      />
                      <StatChip
                        icon={<IconHash size={16} />}
                        label="Mã"
                        value={`S25-${currentItem.id}`}
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
                    <Accordion
                      variant="separated"
                      radius={4}
                      multiple
                      defaultValue={["cycle-1"]}
                    >
                      {generateGrowthCycles(currentItem.id).map((cycle) => (
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
                        data={generateHarvestInfo(currentItem.id)}
                      />
                    </Stack>
                  </Card>
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        ) : (
          <Paper p="xl" withBorder ta="center" bg="gray.0">
            <Text c="dimmed">Không tìm thấy dữ liệu phù hợp.</Text>
          </Paper>
        )
      ) : (
        <Card withBorder radius={4} shadow="sm" p="lg">
          <Group mb="sm" justify="space-between">
            <Text fw={700}>Danh sách cây trồng</Text>
            <Text size="sm" c="dimmed">
              Tổng cộng {filteredData.length} mục
            </Text>
          </Group>
          <Table columns={treeCropColumns} data={filteredData} />
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
              // Reuse columns definition but map data properly if needed
              columns={[
                { accessorKey: "id", header: "Số phiếu" },
                { accessorKey: "expectedStart", header: "Dự kiến" },
                { accessorKey: "actualStart", header: "Thực tế" },
              ]}
              data={cultivationNoteData}
            />
          ) : (
            <Text c="red">Không có dữ liệu!</Text>
          )}
        </Modal>
      )}

      {/* Modal Sổ tay canh tác (Static Content for Demo) */}
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
              </Group>
              <Divider />
              <Text size="sm">
                <b>Hạng mục sử dụng:</b>
              </Text>
              <SimpleGrid cols={2} spacing="sm">
                {resource.map((r, i) => (
                  <ResourceCard key={i} r={r} />
                ))}
              </SimpleGrid>
            </Stack>
          </Card>
        </Modal>
      )}

      {/* Modal Detail Tree Info (Dynamic Data) */}
      {openedTreeDetail && currentItem && (
        <TreeDetailModal
          opened={openedTreeDetail ?? undefined}
          onClose={() => setOpenedTreeDetail(false)}
          data={{
            id: currentItem.id,
            name: currentItem.name,
            seedName: currentItem.variety,
            type: "Cây trồng",
            note: currentItem.note,
            supplier: currentItem.companyName,
            origin: "Việt Nam",
            germinationRate: "95",
            yield: "N/A",
            seedCode: currentItem.id,
            seedDoc: null,
            harvestMethod: "Thu hoạch",
            growthCycle: "Ngắn ngày",
            growthStages: [],
            growthTime: "90",
            growthNote: "",
            seedNote: currentItem.note,
          }}
        />
      )}
    </Stack>
  );
}
