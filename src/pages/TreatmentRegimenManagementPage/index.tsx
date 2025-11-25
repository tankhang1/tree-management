"use client";

import { useState, useMemo } from "react";
import {
  Text,
  Group,
  Badge,
  TextInput,
  Select,
  ScrollArea,
  Tabs,
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
  Progress,
  List,
  ActionIcon,
  rem,
  UnstyledButton,
  MultiSelect,
  Collapse,
  Alert,
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
  IconSun,
  IconCurrencyDollar,
  IconInfoCircle,
  IconArrowRight,
  IconMist,
  IconFilter,
  IconX,
  IconBiohazard,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

// --- 1. TYPE DEFINITIONS ---

type Severity = "nhẹ" | "trung-binh" | "nang";
type ProtocolStatus = "dang-ap-dung" | "de-xuat" | "tam-dung" | "luu-tru";
type DiseaseType = "nấm" | "sâu-hại" | "vi-khuẩn" | "dinh-dưỡng";

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

  // Header Info
  species: string;
  variety: string;
  plantImage: string;
  growthStage: string;

  // Disease Info
  disease: string;
  diseaseType: DiseaseType;
  diseaseImage: string;
  symptoms: string[];

  // Meta Info
  severity: Severity;
  status: ProtocolStatus;
  durationDays: number;
  estimatedCost: string;
  expertName: string;
  expertAvatar: string;
  weatherCondition: string;

  // Content
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

// --- 2. RICH MOCK DATA ---

const protocols: TreatmentProtocol[] = [
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
    withBorder
    p="sm"
    radius="md"
    bg="white"
    className="hover:shadow-md transition-all"
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

const CustomTab = ({ active, label, icon: Icon, onClick }: any) => (
  <UnstyledButton
    onClick={onClick}
    py="sm"
    px="md"
    style={{
      borderBottom: active
        ? `2px solid var(--mantine-color-teal-6)`
        : "2px solid transparent",
      color: active
        ? "var(--mantine-color-teal-7)"
        : "var(--mantine-color-gray-6)",
      transition: "all 0.2s ease",
      fontWeight: 600,
      fontSize: rem(14),
    }}
  >
    <Group gap={6}>
      <Icon size={16} />
      <Text inherit>{label}</Text>
    </Group>
  </UnstyledButton>
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
  const selectedData = useMemo(
    () => protocols.find((p) => p.id === selectedId) || protocols[0],
    [selectedId]
  );

  const filteredList = useMemo(() => {
    return protocols.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase());
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
    <Flex bg="#f8f9fa" style={{ overflow: "hidden" }}>
      {/* --- SIDEBAR: ADVANCED FILTER & LIST --- */}
      <Flex
        direction="column"
        w={300}
        h="100%"
        bg="white"
        style={{ borderRight: "1px solid #f1f3f5", zIndex: 10 }}
      >
        {/* Sidebar Header */}
        <Box p="md" pb={0}>
          <Group justify="space-between" mb="sm">
            <Title order={4} fw={800} c="dark.7">
              Phác Đồ Điều Trị
            </Title>
            <ActionIcon
              variant="light"
              color="teal"
              onClick={clearFilters}
              disabled={!search && filterSpecies.length === 0}
              title="Xóa bộ lọc"
            >
              <IconX size={18} />
            </ActionIcon>
          </Group>

          <TextInput
            placeholder="Tìm kiếm tên, mã..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="filled"
            radius="md"
            mb="sm"
          />

          <UnstyledButton
            onClick={() => setFiltersOpen((o) => !o)}
            mb="xs"
            c="dimmed"
            style={{
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <IconFilter size={14} />{" "}
            {filtersOpen ? "Thu gọn bộ lọc" : "Bộ lọc nâng cao"}
          </UnstyledButton>

          <Collapse in={filtersOpen}>
            <Stack gap="xs" mb="md">
              <MultiSelect
                placeholder="Chọn cây trồng"
                data={["Lúa", "Bắp (Ngô)", "Sầu riêng", "Cà phê"]}
                value={filterSpecies}
                onChange={setFilterSpecies}
                variant="filled"
                radius="md"
                searchable
                clearable
                maxValues={3}
              />
              <Grid gutter="xs">
                <Grid.Col span={6}>
                  <Select
                    placeholder="Loại bệnh"
                    data={[
                      { value: "nấm", label: "Nấm bệnh" },
                      { value: "sâu-hại", label: "Sâu hại" },
                      { value: "vi-khuẩn", label: "Vi khuẩn" },
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
          <Divider mb="xs" />
          <Text size="xs" fw={700} c="dimmed" mb="xs">
            KẾT QUẢ ({filteredList.length})
          </Text>
        </Box>

        {/* List of Protocols */}
        <ScrollArea style={{ flex: 1 }} px="md">
          <Stack gap={8} pb="md">
            {filteredList.map((item) => {
              const active = item.id === selectedId;
              return (
                <UnstyledButton
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  p="md"
                  style={{
                    backgroundColor: active
                      ? "var(--mantine-color-teal-0)"
                      : "transparent",
                    borderRadius: "12px",
                    border: active
                      ? "1px solid var(--mantine-color-teal-2)"
                      : "1px solid transparent",
                    transition: "all 0.2s ease",
                    position: "relative",
                  }}
                  className="hover:bg-gray-50"
                >
                  <Group align="start" wrap="nowrap">
                    <Avatar src={item.plantImage} radius="md" size="md" />
                    <Box style={{ flex: 1 }}>
                      <Text size="sm" fw={700} c="dark.8" lineClamp={1}>
                        {item.name}
                      </Text>
                      <Group gap={6} mt={4}>
                        <Badge
                          size="xs"
                          variant="filled"
                          color="teal"
                          radius="sm"
                        >
                          {item.species}
                        </Badge>
                        <Badge
                          size="xs"
                          variant="outline"
                          color={
                            item.severity === "nang"
                              ? "red"
                              : item.severity === "trung-binh"
                              ? "yellow"
                              : "green"
                          }
                        >
                          {item.severity === "nang"
                            ? "Nghiêm trọng"
                            : item.severity === "trung-binh"
                            ? "Trung bình"
                            : "Nhẹ"}
                        </Badge>
                      </Group>
                    </Box>
                    {active && (
                      <IconArrowRight
                        size={16}
                        color="var(--mantine-color-teal-6)"
                        style={{
                          position: "absolute",
                          right: 16,
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                  </Group>
                </UnstyledButton>
              );
            })}
            {filteredList.length === 0 && (
              <Box ta="center" py="xl">
                <Text size="sm" c="dimmed">
                  Không tìm thấy phác đồ nào
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
            size="md"
            onClick={() => navigate("/treatment-regimen-management/add")}
          >
            Tạo phác đồ mới
          </Button>
        </Box>
      </Flex>

      {/* --- MAIN CONTENT --- */}
      <Box style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <ScrollArea h="100%">
          {/* HERO HEADER */}
          <Box h={280} pos="relative">
            <BackgroundImage src={selectedData.plantImage} h="100%" radius={0}>
              <Overlay
                gradient="linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 100%)"
                opacity={1}
                zIndex={1}
              />
              <Flex
                h="100%"
                direction="column"
                justify="flex-end"
                p={32}
                pos="relative"
                style={{ zIndex: 2 }}
              >
                <Group align="flex-end" justify="space-between">
                  <Box>
                    <Group mb="sm">
                      <Badge
                        size="lg"
                        radius="sm"
                        variant="filled"
                        color="teal"
                      >
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
                      {selectedData.status === "de-xuat" && (
                        <Badge color="yellow" variant="filled">
                          Đề xuất
                        </Badge>
                      )}
                    </Group>
                    <Title
                      c="white"
                      order={1}
                      fw={800}
                      style={{ letterSpacing: -0.5, fontSize: "2rem" }}
                    >
                      {selectedData.name}
                    </Title>
                    <Text c="gray.4" size="lg" mt={4} fw={500}>
                      Áp dụng cho: {selectedData.variety}
                    </Text>
                  </Box>

                  <Paper
                    pl={6}
                    pr="md"
                    py={6}
                    radius="xl"
                    bg="rgba(255,255,255,0.15)"
                    style={{ backdropFilter: "blur(10px)" }}
                  >
                    <Group gap="sm">
                      <Avatar
                        src={selectedData.expertAvatar}
                        size={42}
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
                </Group>
              </Flex>
            </BackgroundImage>
          </Box>

          <Box p={32} maw={1400} mx="auto">
            <Grid gutter={32}>
              {/* CENTER COLUMN - TABS & CONTENT */}
              <Grid.Col span={{ base: 12, lg: 8 }}>
                <Paper shadow="xs" radius="lg" bg="white" mb="lg">
                  <Group
                    gap={0}
                    px="md"
                    style={{ borderBottom: "1px solid #f1f3f5" }}
                  >
                    <CustomTab
                      active={activeTab === "overview"}
                      label="Tổng quan"
                      icon={IconInfoCircle}
                      onClick={() => setActiveTab("overview")}
                    />
                    <CustomTab
                      active={activeTab === "protocol"}
                      label="Phác đồ & Thuốc"
                      icon={IconPrescription}
                      onClick={() => setActiveTab("protocol")}
                    />
                    <CustomTab
                      active={activeTab === "safety"}
                      label="An toàn"
                      icon={IconShieldCheck}
                      onClick={() => setActiveTab("safety")}
                    />
                  </Group>

                  <Box p={0}>
                    {/* TAB 1: OVERVIEW */}
                    {activeTab === "overview" && (
                      <Box p="xl">
                        <Grid gutter="xl">
                          <Grid.Col span={7}>
                            <Group gap="xs" mb="xs">
                              <ThemeIcon
                                variant="light"
                                color="red"
                                radius="xl"
                              >
                                <IconBiohazard size={16} />
                              </ThemeIcon>
                              <Text tt="uppercase" c="red.8" fw={700} size="xs">
                                Đối tượng gây hại
                              </Text>
                            </Group>
                            <Title order={3} c="dark.8" mb="sm">
                              {selectedData.disease}
                            </Title>
                            <Text c="dimmed" size="sm" mb="lg">
                              Triệu chứng điển hình và dấu hiệu nhận biết sớm
                              trên đồng ruộng:
                            </Text>

                            <Stack gap="xs">
                              {selectedData.symptoms.map((s, i) => (
                                <Group
                                  key={i}
                                  gap="md"
                                  align="flex-start"
                                  wrap="nowrap"
                                >
                                  <IconCheck
                                    size={18}
                                    color="var(--mantine-color-teal-6)"
                                    style={{ marginTop: 2 }}
                                  />
                                  <Text size="sm" fw={500}>
                                    {s}
                                  </Text>
                                </Group>
                              ))}
                            </Stack>
                          </Grid.Col>
                          <Grid.Col span={5}>
                            <Card bg="gray.0" radius="md" p="md">
                              <Text fw={600} mb="md">
                                Điều kiện thuận lợi
                              </Text>
                              <Group mb="xs">
                                <ThemeIcon
                                  color="blue"
                                  variant="white"
                                  radius="md"
                                >
                                  <IconMist size={18} />
                                </ThemeIcon>
                                <Text size="sm">Độ ẩm & Thời tiết</Text>
                              </Group>
                              <Text size="sm" c="dimmed" mb="md" pl={34}>
                                {selectedData.weatherCondition}
                              </Text>

                              <Group mb="xs">
                                <ThemeIcon
                                  color="orange"
                                  variant="white"
                                  radius="md"
                                >
                                  <IconBug size={18} />
                                </ThemeIcon>
                                <Text size="sm">Loại bệnh</Text>
                              </Group>
                              <Badge variant="outline" color="orange" ml={34}>
                                {selectedData.diseaseType}
                              </Badge>
                            </Card>
                          </Grid.Col>
                        </Grid>
                      </Box>
                    )}

                    {/* TAB 2: PROTOCOL (REDESIGNED SPLIT VIEW) */}
                    {activeTab === "protocol" && (
                      <Box bg="#f8f9fa">
                        <Grid gutter={0}>
                          {/* LEFT: TIMELINE */}
                          <Grid.Col span={{ base: 12, md: 8 }} p="xl">
                            <Title order={5} mb="lg" c="dark.7" tt="uppercase">
                              Lộ trình xử lý ({selectedData.durationDays} ngày)
                            </Title>

                            <Timeline
                              active={1}
                              bulletSize={40}
                              lineWidth={2}
                              color="teal"
                            >
                              {selectedData.steps.map((step, idx) => (
                                <Timeline.Item
                                  key={step.id}
                                  bullet={
                                    <ThemeIcon
                                      size={40}
                                      radius="xl"
                                      color={
                                        step.type === "spray"
                                          ? "blue"
                                          : step.type === "fertilize"
                                          ? "teal"
                                          : step.type === "inject"
                                          ? "red"
                                          : "gray"
                                      }
                                      variant="filled"
                                    >
                                      {step.type === "spray" ? (
                                        <IconDroplet size={20} />
                                      ) : step.type === "fertilize" ? (
                                        <IconLeaf size={20} />
                                      ) : step.type === "inject" ? (
                                        <IconPrescription size={20} />
                                      ) : step.type === "prune" ? (
                                        <IconBug size={20} />
                                      ) : (
                                        <IconInfoCircle size={20} />
                                      )}
                                    </ThemeIcon>
                                  }
                                  title={null}
                                  lineVariant={
                                    idx === selectedData.steps.length - 1
                                      ? "dashed"
                                      : "solid"
                                  }
                                >
                                  <Paper
                                    withBorder
                                    radius="md"
                                    p="md"
                                    mb="xl"
                                    bg="white"
                                    style={{
                                      borderLeft: `4px solid var(--mantine-color-${
                                        step.type === "spray"
                                          ? "blue"
                                          : step.type === "fertilize"
                                          ? "teal"
                                          : "gray"
                                      }-5)`,
                                    }}
                                  >
                                    <Group
                                      justify="space-between"
                                      mb="xs"
                                      align="start"
                                    >
                                      <Box>
                                        <Group gap="sm" mb={4}>
                                          <Text fw={700} size="md" c="dark.9">
                                            {step.name}
                                          </Text>
                                          <ActionTypeBadge type={step.type} />
                                        </Group>
                                        <Group gap={6}>
                                          <IconClock size={14} color="gray" />
                                          <Text
                                            size="xs"
                                            c="dimmed"
                                            fw={600}
                                            tt="uppercase"
                                          >
                                            Thời điểm: {step.time}
                                          </Text>
                                        </Group>
                                      </Box>
                                    </Group>

                                    <Text size="sm" c="dark.6" mb="md" lh={1.6}>
                                      {step.desc}
                                    </Text>

                                    <Card
                                      bg="gray.0"
                                      radius="md"
                                      p="sm"
                                      withBorder
                                    >
                                      <Grid align="center">
                                        <Grid.Col
                                          span={7}
                                          style={{
                                            borderRight: "1px dashed #dee2e6",
                                          }}
                                        >
                                          {step.medicine ? (
                                            <Group gap="xs">
                                              <ThemeIcon
                                                variant="white"
                                                color="blue"
                                                size="md"
                                              >
                                                <IconDroplet size={16} />
                                              </ThemeIcon>
                                              <Box>
                                                <Text size="xs" c="dimmed">
                                                  Sản phẩm sử dụng
                                                </Text>
                                                <Text
                                                  size="sm"
                                                  fw={600}
                                                  c="blue.8"
                                                >
                                                  {step.medicine}
                                                </Text>
                                              </Box>
                                            </Group>
                                          ) : (
                                            <Group gap="xs">
                                              <ThemeIcon
                                                variant="white"
                                                color="orange"
                                                size="md"
                                              >
                                                <IconBug size={16} />
                                              </ThemeIcon>
                                              <Box>
                                                <Text size="xs" c="dimmed">
                                                  Hành động
                                                </Text>
                                                <Text
                                                  size="sm"
                                                  fw={600}
                                                  c="orange.8"
                                                >
                                                  Thủ công / Canh tác
                                                </Text>
                                              </Box>
                                            </Group>
                                          )}
                                        </Grid.Col>
                                        <Grid.Col span={5} pl="lg">
                                          <Text size="xs" c="dimmed">
                                            Liều lượng / Cách dùng
                                          </Text>
                                          <Text size="sm" fw={500}>
                                            {step.dosage ||
                                              step.desc.slice(0, 20) + "..."}
                                          </Text>
                                        </Grid.Col>
                                      </Grid>
                                    </Card>
                                  </Paper>
                                </Timeline.Item>
                              ))}
                            </Timeline>
                          </Grid.Col>

                          {/* RIGHT: MEDICINES */}
                          <Grid.Col
                            span={{ base: 12, md: 4 }}
                            bg="white"
                            p="xl"
                            style={{
                              borderLeft: "1px solid #f1f3f5",
                              minHeight: "100%",
                            }}
                          >
                            <Box style={{ position: "sticky", top: 20 }}>
                              <Group justify="space-between" mb="md">
                                <Title order={5} c="teal.9" tt="uppercase">
                                  Vật tư chuẩn bị
                                </Title>
                                <Badge
                                  variant="light"
                                  color="teal"
                                  size="lg"
                                  circle
                                >
                                  {selectedData.medicineList.length}
                                </Badge>
                              </Group>

                              <Alert
                                variant="light"
                                color="blue"
                                title="Lưu ý mua hàng"
                                icon={<IconInfoCircle size={16} />}
                                radius="md"
                                mb="md"
                              >
                                <Text size="xs">
                                  Kiểm tra kỹ thời hạn sử dụng và nguồn gốc xuất
                                  xứ trước khi mua.
                                </Text>
                              </Alert>

                              <Stack gap="sm">
                                {selectedData.medicineList.map((med, i) => (
                                  <MedicineCard key={i} item={med} />
                                ))}
                              </Stack>

                              <Divider
                                my="lg"
                                label="Tổng chi phí ước tính"
                                labelPosition="center"
                              />

                              <Card
                                bg="teal.0"
                                radius="md"
                                p="md"
                                withBorder
                                style={{
                                  borderColor: "var(--mantine-color-teal-2)",
                                }}
                              >
                                <Group justify="space-between" align="center">
                                  <Text size="sm" c="teal.9" fw={600}>
                                    Chi phí / Ha
                                  </Text>
                                  <Text size="xl" fw={800} c="teal.8">
                                    {selectedData.estimatedCost}
                                  </Text>
                                </Group>
                                <Text size="xs" c="dimmed" mt={4} ta="right">
                                  *Chưa bao gồm nhân công
                                </Text>
                              </Card>
                            </Box>
                          </Grid.Col>
                        </Grid>
                      </Box>
                    )}

                    {/* TAB 3: SAFETY */}
                    {activeTab === "safety" && (
                      <Box p="xl">
                        <Grid align="center">
                          <Grid.Col span={6}>
                            <Paper radius="md" p="lg" bg="red.0">
                              <Title order={5} c="red.8" mb="md">
                                Cảnh báo an toàn
                              </Title>
                              <List
                                spacing="xs"
                                icon={
                                  <IconAlertTriangle
                                    size={16}
                                    color="var(--mantine-color-red-6)"
                                  />
                                }
                              >
                                {selectedData.safetyNotes.map((note, i) => (
                                  <List.Item key={i}>
                                    <Text size="sm" c="red.9">
                                      {note}
                                    </Text>
                                  </List.Item>
                                ))}
                              </List>
                            </Paper>
                          </Grid.Col>
                          <Grid.Col span={6}>
                            <Stack align="center" gap={0}>
                              <RingProgress
                                size={160}
                                thickness={12}
                                roundCaps
                                sections={[
                                  {
                                    value:
                                      (selectedData.withdrawalDays / 30) * 100,
                                    color: "orange",
                                  },
                                ]}
                                label={
                                  <Stack align="center" gap={0}>
                                    <Text fz={32} fw={800} c="dark.7">
                                      {selectedData.withdrawalDays}
                                    </Text>
                                    <Text
                                      size="xs"
                                      fw={700}
                                      tt="uppercase"
                                      c="dimmed"
                                    >
                                      Ngày cách ly
                                    </Text>
                                  </Stack>
                                }
                              />
                              <Text size="xs" c="dimmed" mt="sm" ta="center">
                                Thời gian tối thiểu ngừng thuốc
                                <br />
                                trước khi thu hoạch
                              </Text>
                            </Stack>
                          </Grid.Col>
                        </Grid>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid.Col>

              {/* RIGHT COLUMN - SUMMARY */}
              <Grid.Col span={{ base: 12, lg: 4 }}>
                <Stack>
                  <Card radius="lg" p="lg" bg="white" shadow="sm" withBorder>
                    <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="md">
                      Thông tin quản trị
                    </Text>

                    <Group justify="space-between" mb="sm">
                      <Text size="sm" fw={500}>
                        Trạng thái
                      </Text>
                      {selectedData.status === "dang-ap-dung" ? (
                        <Badge
                          size="lg"
                          color="green"
                          variant="light"
                          leftSection={<IconCheck size={14} />}
                        >
                          Đang áp dụng
                        </Badge>
                      ) : selectedData.status === "de-xuat" ? (
                        <Badge size="lg" color="yellow" variant="light">
                          Đang đề xuất
                        </Badge>
                      ) : (
                        <Badge size="lg" color="gray" variant="light">
                          Lưu trữ
                        </Badge>
                      )}
                    </Group>
                    <Group justify="space-between" mb="sm">
                      <Text size="sm" fw={500}>
                        Mức độ
                      </Text>
                      <Badge
                        color={
                          selectedData.severity === "nang"
                            ? "red"
                            : selectedData.severity === "trung-binh"
                            ? "yellow"
                            : "green"
                        }
                        variant="light"
                      >
                        {selectedData.severity === "nang"
                          ? "Nghiêm trọng"
                          : selectedData.severity === "trung-binh"
                          ? "Trung bình"
                          : "Nhẹ"}
                      </Badge>
                    </Group>
                    <Divider my="md" />

                    <Group justify="space-between" mb="xs">
                      <Group gap="xs">
                        <ThemeIcon variant="light" color="blue" size="md">
                          <IconClock size={16} />
                        </ThemeIcon>
                        <Text size="sm" c="dimmed">
                          Thời gian
                        </Text>
                      </Group>
                      <Text fw={600} size="sm">
                        {selectedData.durationDays} Ngày
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Group gap="xs">
                        <ThemeIcon variant="light" color="green" size="md">
                          <IconCurrencyDollar size={16} />
                        </ThemeIcon>
                        <Text size="sm" c="dimmed">
                          Chi phí (Est)
                        </Text>
                      </Group>
                      <Text fw={600} size="sm">
                        {selectedData.estimatedCost}
                      </Text>
                    </Group>
                  </Card>

                  <Card radius="lg" p="lg" bg="teal.9" c="white" shadow="md">
                    <Group mb="sm">
                      <IconPrescription size={24} color="white" />
                      <Text fw={700} size="lg">
                        Thao tác
                      </Text>
                    </Group>
                    <Button
                      variant="white"
                      color="teal"
                      fullWidth
                      radius="md"
                      mb="xs"
                    >
                      Áp dụng phác đồ này
                    </Button>
                    <Button
                      variant="outline"
                      color="white"
                      fullWidth
                      radius="md"
                      style={{ border: "1px solid rgba(255,255,255,0.3)" }}
                    >
                      Chỉnh sửa nội dung
                    </Button>
                  </Card>
                </Stack>
              </Grid.Col>
            </Grid>
          </Box>

          <Box h={40} />
        </ScrollArea>
      </Box>
    </Flex>
  );
}
