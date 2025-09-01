import Table from "../../components/Table";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Modal,
  NumberInput,
  Paper,
  ScrollArea,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconArrowLeft,
  IconDownload,
  IconFileTypePdf,
  IconFileSpreadsheet,
  IconInfoCircle,
  IconRefresh,
  IconZoomScan,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

dayjs.extend(isBetween);

type RecordRow = {
  id: string;
  farmId: string;
  farmName: string;
  branch: string;
  crop: string;
  date: string; // YYYY-MM-DD
  trees: number;
  yieldKg: number;
  fertChemKg: number;
  fertOrgKg: number;
  pestChemL: number;
  pestBioL: number;
  waterM3: number;
  energyKwh: number;
  baselineFertChemKg: number;
  baselinePestChemL: number;
  baselineEnergyKwh: number;
};

const BRANCHES = ["Hà Nội", "TP.HCM", "Đà Nẵng"];
const CROPS = ["Sầu riêng", "Cà phê", "Cây dược liệu"];
const FARMS = ["Farm001", "Farm002", "Farm003"];

const COLORS = {
  teal: "#20c997",
  red: "#ff6b6b",
  blue: "#228be6",
  grape: "#845ef7",
  yellow: "#fcc419",
  cyan: "#15aabf",
  orange: "#ff922b",
  green: "#12b886",
};
const PIE = [
  "#4dabf7",
  "#ff922b",
  "#20c997",
  "#845ef7",
  "#e03131",
  "#12b886",
  "#fab005",
];

const fmtInt = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(Math.round(n));
const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
const fmtKg = (n: number) => `${fmtInt(n)} kg`;
const fmtL = (n: number) => `${fmtInt(n)} L`;
const fmtM3 = (n: number) => `${fmtInt(n)} m³`;
const pct = (v: number) => `${(v * 100).toFixed(0)}%`;

// Hệ số phát thải minh hoạ (có thể cấu hình)
const EF = {
  fertChem_kgCO2_per_kg: 1.5,
  pestChem_kgCO2_per_L: 3.0,
  energy_kgCO2_per_kWh: 0.8,
};

const seed: RecordRow[] = [
  {
    id: "1",
    farmId: "Farm001",
    farmName: "Trang trại A",
    branch: "Hà Nội",
    crop: "Cây dược liệu",
    date: "2025-03-05",
    trees: 1200,
    yieldKg: 500,
    fertChemKg: 60,
    fertOrgKg: 90,
    pestChemL: 12,
    pestBioL: 8,
    waterM3: 220,
    energyKwh: 420,
    baselineFertChemKg: 100,
    baselinePestChemL: 20,
    baselineEnergyKwh: 520,
  },
  {
    id: "2",
    farmId: "Farm002",
    farmName: "Trang trại B",
    branch: "TP.HCM",
    crop: "Sầu riêng",
    date: "2025-03-12",
    trees: 1600,
    yieldKg: 820,
    fertChemKg: 110,
    fertOrgKg: 140,
    pestChemL: 18,
    pestBioL: 12,
    waterM3: 300,
    energyKwh: 690,
    baselineFertChemKg: 180,
    baselinePestChemL: 30,
    baselineEnergyKwh: 800,
  },
  {
    id: "3",
    farmId: "Farm003",
    farmName: "Trang trại C",
    branch: "Đà Nẵng",
    crop: "Cà phê",
    date: "2025-03-22",
    trees: 2100,
    yieldKg: 980,
    fertChemKg: 130,
    fertOrgKg: 160,
    pestChemL: 20,
    pestBioL: 16,
    waterM3: 380,
    energyKwh: 900,
    baselineFertChemKg: 220,
    baselinePestChemL: 32,
    baselineEnergyKwh: 1000,
  },
  {
    id: "4",
    farmId: "Farm001",
    farmName: "Trang trại A",
    branch: "Hà Nội",
    crop: "Cây dược liệu",
    date: "2025-04-06",
    trees: 1200,
    yieldKg: 540,
    fertChemKg: 58,
    fertOrgKg: 100,
    pestChemL: 10,
    pestBioL: 10,
    waterM3: 210,
    energyKwh: 410,
    baselineFertChemKg: 100,
    baselinePestChemL: 20,
    baselineEnergyKwh: 520,
  },
];

function calcCO2Reduced(r: RecordRow) {
  const fert =
    Math.max(0, r.baselineFertChemKg - r.fertChemKg) * EF.fertChem_kgCO2_per_kg;
  const pest =
    Math.max(0, r.baselinePestChemL - r.pestChemL) * EF.pestChem_kgCO2_per_L;
  const energy =
    Math.max(0, r.baselineEnergyKwh - r.energyKwh) * EF.energy_kgCO2_per_kWh;
  return fert + pest + energy;
}
function safePct(reduced: number, base: number) {
  if (base <= 0) return 0;
  return Math.max(0, Math.min(1, reduced / base));
}

const ProductionReportPage = () => {
  const [rows, setRows] = useState<RecordRow[]>(seed);
  const [granularity, setGranularity] = useState<"day" | "month">("month");
  const [range, setRange] = useState<[Date | null, Date | null]>([
    dayjs("2025-03-01").toDate(),
    dayjs("2025-03-31").toDate(),
  ]);
  const [branch, setBranch] = useState<string | null>(null);
  const [farm, setFarm] = useState<string | null>(null);
  const [crop, setCrop] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRow, setDetailRow] = useState<RecordRow | null>(null);

  const periodStart = range[0] ? dayjs(range[0]).startOf(granularity) : null;
  const periodEnd = range[1] ? dayjs(range[1]).endOf(granularity) : null;

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const d = dayjs(r.date);
      const inRange =
        periodStart && periodEnd
          ? d.isBetween(periodStart, periodEnd, "day", "[]")
          : true;
      const okBranch = branch ? r.branch === branch : true;
      const okFarm = farm ? r.farmId === farm : true;
      const okCrop = crop ? r.crop === crop : true;
      return inRange && okBranch && okFarm && okCrop;
    });
  }, [rows, branch, farm, crop, periodStart, periodEnd]);

  const kpis = useMemo(() => {
    const totalYield = filtered.reduce((a, b) => a + b.yieldKg, 0);
    const totalTrees = filtered.reduce((a, b) => a + b.trees, 0);
    const fertChem = filtered.reduce((a, b) => a + b.fertChemKg, 0);
    const pestChem = filtered.reduce((a, b) => a + b.pestChemL, 0);
    const co2Reduced = filtered.reduce((a, b) => a + calcCO2Reduced(b), 0);

    const baseFertChem = filtered.reduce((a, b) => a + b.baselineFertChemKg, 0);
    const basePestChem = filtered.reduce((a, b) => a + b.baselinePestChemL, 0);

    return {
      totalYield,
      totalTrees,
      fertChem,
      pestChem,
      co2Reduced,
      fertReducePct: safePct(baseFertChem - fertChem, baseFertChem),
      pestReducePct: safePct(basePestChem - pestChem, basePestChem),
    };
  }, [filtered]);

  const series = useMemo(() => {
    const map = new Map<
      string,
      {
        label: string;
        yieldKg: number;
        co2Reduced: number;
        fertChemKg: number;
        fertOrgKg: number;
      }
    >();
    const fmt = granularity === "day" ? "DD/MM" : "MM/YYYY";
    filtered.forEach((r) => {
      const key = dayjs(r.date).format(fmt);
      if (!map.has(key))
        map.set(key, {
          label: key,
          yieldKg: 0,
          co2Reduced: 0,
          fertChemKg: 0,
          fertOrgKg: 0,
        });
      const t = map.get(key)!;
      t.yieldKg += r.yieldKg;
      t.co2Reduced += calcCO2Reduced(r);
      t.fertChemKg += r.fertChemKg;
      t.fertOrgKg += r.fertOrgKg;
    });
    return Array.from(map.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [filtered, granularity]);

  const byFarm = useMemo(() => {
    const map = new Map<
      string,
      {
        farmId: string;
        farmName: string;
        yieldKg: number;
        co2Reduced: number;
        fertChemKg: number;
        pestChemL: number;
      }
    >();
    filtered.forEach((r) => {
      if (!map.has(r.farmId))
        map.set(r.farmId, {
          farmId: r.farmId,
          farmName: r.farmName,
          yieldKg: 0,
          co2Reduced: 0,
          fertChemKg: 0,
          pestChemL: 0,
        });
      const t = map.get(r.farmId)!;
      t.yieldKg += r.yieldKg;
      t.co2Reduced += calcCO2Reduced(r);
      t.fertChemKg += r.fertChemKg;
      t.pestChemL += r.pestChemL;
    });
    return Array.from(map.values()).sort((a, b) => b.yieldKg - a.yieldKg);
  }, [filtered]);

  const byCrop = useMemo(() => {
    const map = new Map<string, { name: string; yieldKg: number }>();
    filtered.forEach((r) =>
      map.set(r.crop, map.get(r.crop) ?? { name: r.crop, yieldKg: 0 })
    );
    filtered.forEach((r) => {
      const t = map.get(r.crop)!;
      t.yieldKg += r.yieldKg;
    });
    return Array.from(map.values()).sort((a, b) => b.yieldKg - a.yieldKg);
  }, [filtered]);

  const resetFilters = () => {
    setBranch(null);
    setFarm(null);
    setCrop(null);
    setRange([
      dayjs().startOf("month").toDate(),
      dayjs().endOf("month").toDate(),
    ]);
  };

  const exportPDF = () => {
    const doc = new jsPDF({ unit: "pt" });
    doc.setFontSize(14);
    doc.text("Báo cáo sản xuất & bền vững", 40, 40);
    doc.setFontSize(10);
    const pStart = periodStart ? periodStart.format("DD/MM/YYYY") : "—";
    const pEnd = periodEnd ? periodEnd.format("DD/MM/YYYY") : "—";
    doc.text(`Khoảng thời gian: ${pStart} → ${pEnd}`, 40, 58);
    if (branch) doc.text(`Chi nhánh: ${branch}`, 40, 72);
    if (farm) doc.text(`Farm: ${farm}`, 40, 86);
    if (crop) doc.text(`Cây trồng: ${crop}`, 40, 100);
    doc.text(
      `Sản lượng: ${fmtKg(kpis.totalYield)} | Cây: ${fmtInt(
        kpis.totalTrees
      )} | Giảm CO₂: ${fmtInt(kpis.co2Reduced)} kg`,
      40,
      118
    );
    autoTable(doc, {
      startY: 136,
      head: [
        [
          "Ngày",
          "Farm",
          "Chi nhánh",
          "Cây",
          "Sản lượng (kg)",
          "Phân hóa học (kg)",
          "Thuốc hóa học (L)",
          "Năng lượng (kWh)",
          "CO₂ giảm (kg)",
        ],
      ],
      body: filtered.map((r) => [
        dayjs(r.date).format("DD/MM/YYYY"),
        `${r.farmName} (${r.farmId})`,
        r.branch,
        r.crop,
        fmtInt(r.yieldKg),
        fmtInt(r.fertChemKg),
        fmtInt(r.pestChemL),
        fmtInt(r.energyKwh),
        fmtInt(calcCO2Reduced(r)),
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [32, 201, 151] },
    });
    doc.save("bao-cao-san-xuat.pdf");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["Báo cáo sản xuất & bền vững"],
      [
        `Khoảng thời gian: ${
          periodStart && periodEnd
            ? `${periodStart.format("DD/MM/YYYY")} → ${periodEnd.format(
                "DD/MM/YYYY"
              )}`
            : "—"
        }`,
      ],
      [
        `Sản lượng: ${kpis.totalYield}`,
        `Cây: ${kpis.totalTrees}`,
        `CO2 giảm(kg): ${Math.round(kpis.co2Reduced)}`,
      ],
      [],
      [
        "Ngày",
        "Farm",
        "Chi nhánh",
        "Cây",
        "Sản lượng (kg)",
        "Phân hóa học (kg)",
        "Phân hữu cơ (kg)",
        "Thuốc hóa học (L)",
        "Thuốc sinh học (L)",
        "Nước (m3)",
        "Năng lượng (kWh)",
        "CO2 giảm (kg)",
        "Giảm % phân hoá học vs baseline",
        "Giảm % thuốc hoá học vs baseline",
      ],
      ...filtered.map((r) => [
        dayjs(r.date).format("YYYY-MM-DD"),
        `${r.farmName} (${r.farmId})`,
        r.branch,
        r.crop,
        r.yieldKg,
        r.fertChemKg,
        r.fertOrgKg,
        r.pestChemL,
        r.pestBioL,
        r.waterM3,
        r.energyKwh,
        Math.round(calcCO2Reduced(r)),
        (
          (Math.max(0, r.baselineFertChemKg - r.fertChemKg) /
            Math.max(1, r.baselineFertChemKg)) *
          100
        ).toFixed(0) + "%",
        (
          (Math.max(0, r.baselinePestChemL - r.pestChemL) /
            Math.max(1, r.baselinePestChemL)) *
          100
        ).toFixed(0) + "%",
      ]),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Production");
    XLSX.writeFile(wb, "bao-cao-san-xuat.xlsx");
  };

  return (
    <Card withBorder radius={4} p="lg">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Group>
            <Stack gap={0}>
              <Title order={3}>🏭 Báo cáo sản xuất (MV FACTORY)</Title>
              <Text size="sm" c="dimmed">
                Theo dõi sản lượng, sử dụng vật tư & mức giảm phát thải carbon
                (dữ liệu bền vững từ MV FARM)
              </Text>
            </Stack>
          </Group>
          <Group gap="xs">
            <Button
              radius={4}
              variant="light"
              leftSection={<IconRefresh size={16} />}
              onClick={resetFilters}
            >
              Đặt lại
            </Button>
            <Button
              radius={4}
              variant="light"
              leftSection={<IconFileTypePdf size={16} />}
              onClick={exportPDF}
            >
              Xuất PDF
            </Button>
            <Button
              radius={4}
              leftSection={<IconFileSpreadsheet size={16} />}
              onClick={exportExcel}
            >
              Xuất Excel
            </Button>
          </Group>
        </Group>

        <Card withBorder radius={4} p="md">
          <Group align="end" wrap="wrap">
            <SegmentedControl
              radius={4}
              value={granularity}
              onChange={(v: any) => setGranularity(v)}
              data={[
                { value: "day", label: "Ngày" },
                { value: "month", label: "Tháng" },
              ]}
            />
            <DatePickerInput
              radius={4}
              type="range"
              label="Khoảng thời gian"
              value={range}
              onChange={setRange}
              locale="vi"
              w={280}
            />
            <Select
              radius={4}
              label="Chi nhánh"
              placeholder="Tất cả"
              data={BRANCHES}
              value={branch}
              onChange={setBranch}
              searchable
              clearable
              w={220}
            />
            <Select
              radius={4}
              label="Farm"
              placeholder="Tất cả"
              data={FARMS}
              value={farm}
              onChange={setFarm}
              searchable
              clearable
              w={220}
            />
            <Select
              radius={4}
              label="Cây trồng"
              placeholder="Tất cả"
              data={CROPS}
              value={crop}
              onChange={setCrop}
              searchable
              clearable
              w={220}
            />
            <NumberInput
              radius={4}
              label="Hệ số CO₂ phân hoá học (kg/kg)"
              value={EF.fertChem_kgCO2_per_kg}
              onChange={(v) =>
                (EF.fertChem_kgCO2_per_kg =
                  Number(v) || EF.fertChem_kgCO2_per_kg)
              }
              min={0.1}
              step={0.1}
              w={220}
            />
          </Group>
        </Card>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
          <Paper withBorder radius={4} p="md">
            <Text size="sm" c="dimmed">
              Tổng sản lượng
            </Text>
            <Title order={3} c="teal">
              {fmtKg(kpis.totalYield)}
            </Title>
            <Text size="xs" c="dimmed">
              Trung bình/cây:{" "}
              {fmtKg(kpis.totalTrees ? kpis.totalYield / kpis.totalTrees : 0)}
            </Text>
          </Paper>
          <Paper withBorder radius={4} p="md">
            <Text size="sm" c="dimmed">
              Tổng số cây
            </Text>
            <Title order={3}>{fmtInt(kpis.totalTrees)}</Title>
          </Paper>
          <Paper withBorder radius={4} p="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Giảm CO₂ ước tính
              </Text>
              <Badge variant="light" color="grape">
                minh hoạ
              </Badge>
            </Group>
            <Title order={3} c="grape">
              {fmtInt(kpis.co2Reduced)} kg
            </Title>
          </Paper>
          <Paper withBorder radius={4} p="md">
            <Text size="sm" c="dimmed">
              Giảm vật tư hoá học
            </Text>
            <Title order={4} c="red">
              Phân: {pct(kpis.fertReducePct)}
            </Title>
            <Title order={4} c="orange">
              Thuốc: {pct(kpis.pestReducePct)}
            </Title>
          </Paper>
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Card withBorder radius={4} p="md">
            <Group justify="space-between" mb="xs">
              <Title order={5}>Diễn biến sản lượng & CO₂ giảm</Title>
            </Group>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={series}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis yAxisId="L" />
                <YAxis yAxisId="R" orientation="right" />
                <RTooltip
                  formatter={(v: any, n: string) =>
                    n.includes("CO₂")
                      ? fmtInt(Number(v)) + " kg"
                      : fmtKg(Number(v))
                  }
                />
                <Legend />
                <Bar
                  yAxisId="L"
                  dataKey="yieldKg"
                  name="Sản lượng (kg)"
                  fill={COLORS.yellow}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="R"
                  type="monotone"
                  dataKey="co2Reduced"
                  name="CO₂ giảm (kg)"
                  stroke={COLORS.blue}
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card withBorder radius={4} p="md">
            <Group justify="space-between" mb="xs">
              <Title order={5}>Cơ cấu phân bón theo thời gian</Title>
            </Group>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="gChem" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={COLORS.red}
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor={COLORS.red}
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                  <linearGradient id="gOrg" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={COLORS.teal}
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor={COLORS.teal}
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <RTooltip formatter={(v: any) => fmtKg(Number(v))} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="fertChemKg"
                  name="Phân hoá học (kg)"
                  stroke={COLORS.red}
                  fill="url(#gChem)"
                />
                <Area
                  type="monotone"
                  dataKey="fertOrgKg"
                  name="Phân hữu cơ (kg)"
                  stroke={COLORS.teal}
                  fill="url(#gOrg)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Card withBorder radius={4} p="md">
            <Group justify="space-between" mb="xs">
              <Title order={5}>Top Farm theo sản lượng</Title>
            </Group>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={byFarm.slice(0, 7)}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="farmName" />
                <YAxis />
                <RTooltip formatter={(v: any) => fmtKg(Number(v))} />
                <Legend />
                <Bar
                  dataKey="yieldKg"
                  name="Sản lượng (kg)"
                  fill={COLORS.green}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card withBorder radius={4} p="md">
            <Group justify="space-between" mb="xs">
              <Title order={5}>Cơ cấu sản lượng theo cây</Title>
            </Group>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={byCrop.map((c) => ({ name: c.name, value: c.yieldKg }))}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {byCrop.map((_, i) => (
                    <Cell key={i} fill={PIE[i % PIE.length]} />
                  ))}
                </Pie>
                <RTooltip formatter={(v: any) => fmtKg(Number(v))} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </SimpleGrid>

        <Card withBorder radius={4} p="md">
          <Group justify="space-between" mb="xs">
            <Title order={5}>Bảng chi tiết</Title>
            <Badge variant="light" color="gray">
              {fmtInt(filtered.length)} dòng
            </Badge>
          </Group>
          <Divider my="xs" />
          <Table
            data={filtered}
            columns={[
              {
                accessorKey: "date",
                header: "Ngày",
                Cell: ({ row }: { row: any }) =>
                  dayjs(row.original.date).format("DD/MM/YYYY"),
              },
              {
                accessorKey: "farmName",
                header: "Farm",
                Cell: ({ row }: { row: any }) => (
                  <>
                    {row.original.farmName}{" "}
                    <Badge ml={6}>{row.original.farmId}</Badge>
                  </>
                ),
              },
              { accessorKey: "branch", header: "Chi nhánh" },
              { accessorKey: "crop", header: "Cây" },
              {
                accessorKey: "yieldKg",
                header: "Sản lượng (kg)",
                Cell: ({ row }: { row: any }) => (
                  <span style={{ fontWeight: 600 }}>
                    {fmtInt(row.original.yieldKg)}
                  </span>
                ),
              },
              {
                accessorKey: "fertChemKg",
                header: "Phân HH (kg)",
                Cell: ({ row }: { row: any }) =>
                  fmtInt(row.original.fertChemKg),
              },
              {
                accessorKey: "fertOrgKg",
                header: "Phân HC (kg)",
                Cell: ({ row }: { row: any }) => fmtInt(row.original.fertOrgKg),
              },
              {
                accessorKey: "pestChemL",
                header: "Thuốc HH (L)",
                Cell: ({ row }: { row: any }) => fmtInt(row.original.pestChemL),
              },
              {
                accessorKey: "pestBioL",
                header: "Thuốc SH (L)",
                Cell: ({ row }: { row: any }) => fmtInt(row.original.pestBioL),
              },
              {
                accessorKey: "waterM3",
                header: "Nước (m³)",
                Cell: ({ row }: { row: any }) => fmtInt(row.original.waterM3),
              },
              {
                accessorKey: "energyKwh",
                header: "Điện (kWh)",
                Cell: ({ row }: { row: any }) => fmtInt(row.original.energyKwh),
              },
              {
                accessorKey: "co2Reduced",
                header: "CO₂ giảm (kg)",
                Cell: ({ row }: { row: any }) => (
                  <span
                    style={{
                      color: "var(--mantine-color-grape-7)",
                      fontWeight: 600,
                    }}
                  >
                    {fmtInt(calcCO2Reduced(row.original))}
                  </span>
                ),
              },
              {
                accessorKey: "actions",
                header: "Chi tiết",
                accessorFn: (row: any) => row,
                Cell: ({ row }: { row: any }) => (
                  <ActionIcon
                    variant="light"
                    radius={4}
                    onClick={() => {
                      setDetailRow(row.original);
                      setDetailOpen(true);
                    }}
                  >
                    <IconZoomScan size={16} />
                  </ActionIcon>
                ),
              },
            ]}
          />
        </Card>
      </Stack>

      <Modal
        opened={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={<Title order={5}>Chi tiết farm</Title>}
        centered
        radius={4}
        size="lg"
      >
        {detailRow && (
          <Stack>
            <Group justify="space-between">
              <Stack gap={2}>
                <Text fw={600}>
                  {detailRow.farmName}{" "}
                  <Text span c="dimmed">
                    ({detailRow.farmId})
                  </Text>
                </Text>
                <Text size="sm" c="dimmed">
                  {detailRow.branch} • {detailRow.crop} •{" "}
                  {dayjs(detailRow.date).format("DD/MM/YYYY")}
                </Text>
              </Stack>
              <Badge leftSection={<IconInfoCircle size={12} />}>Bền vững</Badge>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 3 }}>
              <Paper withBorder radius={4} p="sm">
                <Text size="xs" c="dimmed">
                  Sản lượng
                </Text>
                <Title order={4} c="teal">
                  {fmtKg(detailRow.yieldKg)}
                </Title>
              </Paper>
              <Paper withBorder radius={4} p="sm">
                <Text size="xs" c="dimmed">
                  CO₂ giảm
                </Text>
                <Title order={4} c="grape">
                  {fmtInt(calcCO2Reduced(detailRow))} kg
                </Title>
              </Paper>
              <Paper withBorder radius={4} p="sm">
                <Text size="xs" c="dimmed">
                  Số cây
                </Text>
                <Title order={4}>{fmtInt(detailRow.trees)}</Title>
              </Paper>
            </SimpleGrid>

            <Card withBorder radius={4} p="md">
              <Title order={6} mb="xs">
                Vật tư & mức giảm so với baseline
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={[
                      {
                        name: "Phân hoá học",
                        Baseline: detailRow.baselineFertChemKg,
                        ThựcTế: detailRow.fertChemKg,
                      },
                      {
                        name: "Thuốc hoá học",
                        Baseline: detailRow.baselinePestChemL,
                        ThựcTế: detailRow.pestChemL,
                      },
                      {
                        name: "Năng lượng (kWh)",
                        Baseline: detailRow.baselineEnergyKwh,
                        ThựcTế: detailRow.energyKwh,
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RTooltip formatter={(v: any) => fmtInt(Number(v))} />
                    <Legend />
                    <Bar
                      dataKey="Baseline"
                      fill={COLORS.red}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="ThựcTế"
                      fill={COLORS.teal}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Phân HH", value: detailRow.fertChemKg },
                        { name: "Phân HC", value: detailRow.fertOrgKg },
                        { name: "Thuốc HH", value: detailRow.pestChemL },
                        { name: "Thuốc SH", value: detailRow.pestBioL },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {[0, 1, 2, 3].map((i) => (
                        <Cell key={i} fill={PIE[i % PIE.length]} />
                      ))}
                    </Pie>
                    <RTooltip formatter={(v: any) => fmtInt(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
              </SimpleGrid>
            </Card>

            <Group justify="flex-end">
              <Button
                radius={4}
                variant="light"
                leftSection={<IconDownload size={16} />}
                onClick={() => setDetailOpen(false)}
              >
                Đóng
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Card>
  );
};

export default ProductionReportPage;
