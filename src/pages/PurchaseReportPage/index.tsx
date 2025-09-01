import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Modal,
  MultiSelect,
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
  IconCalendar,
  IconCheck,
  IconDownload,
  IconEdit,
  IconPlus,
  IconRefresh,
  IconTrash,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import groupBy from "lodash/groupBy";
import sumBy from "lodash/sumBy";
import { nanoid } from "nanoid";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
  Cell,
  Line,
  LineChart,
  ComposedChart,
  Brush,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import isBetween from "dayjs/plugin/isBetween"; // 👈 thêm
import Table from "../../components/Table";
dayjs.extend(isBetween);
/** =========================
 *  Utils & constants
 *  ========================= */
type Granularity = "day" | "month";
type Status = "Đang xử lý" | "Hoàn tất" | "Huỷ";

type PurchaseOrder = {
  id: string;
  code: string;
  date: string; // YYYY-MM-DD
  branch: string;
  product: string;
  unit: "kg" | "tấn" | "thùng" | "bao";
  quantity: number; // quy đổi sang kg nếu cần
  cost: number; // VND
  supplier: string;
  status: Status;
  note?: string;
  completedAt?: string;
};

const BRANCHES = ["Chi nhánh HN", "Chi nhánh HCM", "Chi nhánh ĐN"];
const SUPPLIERS = [
  "NCC001 - An Phú",
  "NCC002 - Minh Hòa",
  "NCC003 - Đông Á",
  "NCC004 - Mekong",
];
const PRODUCTS = [
  "Sầu riêng Ri6",
  "Cà phê hạt",
  "Chuối già",
  "Xoài cát Hòa Lộc",
  "Bơ Booth",
  "Trà Ô Long",
];
const UNITS: PurchaseOrder["unit"][] = ["kg", "tấn", "thùng", "bao"];

const COLORS = {
  blue: "#228be6",
  teal: "#0ca678",
  orange: "#e8590c",
  red: "#e03131",
  grape: "#ae3ec9",
  cyan: "#0b7285",
  green: "#2f9e44",
  yellow: "#f08c00",
};
const PIE_COLORS = [
  COLORS.blue,
  COLORS.teal,
  COLORS.orange,
  COLORS.red,
  COLORS.grape,
  COLORS.cyan,
];

const fmtVND = (n: number) =>
  n.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
const fmtInt = (n: number) => n.toLocaleString("vi-VN");

/** Seed demo dữ liệu trong khoảng thời gian */
const seedOrders = (start: dayjs.Dayjs, end: dayjs.Dayjs): PurchaseOrder[] => {
  const rows: PurchaseOrder[] = [
    {
      id: nanoid(),
      code: "TM001",
      date: "2025-03-03",
      branch: "Chi nhánh HN",
      product: "Cà phê hạt",
      unit: "kg",
      quantity: 300,
      cost: 6_000_000,
      supplier: "NCC002 - Minh Hòa",
      status: "Đang xử lý",
      note: "Đơn mẫu theo yêu cầu",
    },
    {
      id: nanoid(),
      code: "TM002",
      date: "2025-03-05",
      branch: "Chi nhánh HCM",
      product: "Sầu riêng Ri6",
      unit: "kg",
      quantity: 500,
      cost: 10_000_000,
      supplier: "NCC001 - An Phú",
      status: "Hoàn tất",
      completedAt: "2025-03-06",
    },
  ];

  let cur = start.clone();
  while (cur.isBefore(end) || cur.isSame(end, "day")) {
    // mỗi ngày vài đơn ngẫu nhiên
    const dayOrders = 2 + (cur.date() % 3);
    for (let i = 0; i < dayOrders; i++) {
      const product = PRODUCTS[(cur.date() + i) % PRODUCTS.length];
      const supplier = SUPPLIERS[(cur.date() + i * 2) % SUPPLIERS.length];
      const branch = BRANCHES[(cur.date() + i * 3) % BRANCHES.length];
      const qty = 100 + ((cur.date() * (i + 1)) % 400); // 100..500 kg
      const costPerKg = 18000 + ((i + cur.month()) % 5) * 2000; // giả lập
      const cost = qty * costPerKg;
      rows.push({
        id: nanoid(),
        code: `TM${String(cur.date()).padStart(2, "0")}${i + 3}`,
        date: cur.format("YYYY-MM-DD"),
        branch,
        product,
        unit: "kg",
        quantity: qty,
        cost,
        supplier,
        status: (["Đang xử lý", "Hoàn tất"] as Status[])[(i + cur.date()) % 2],
        completedAt:
          (i + cur.date()) % 2
            ? cur.add(1, "day").format("YYYY-MM-DD")
            : undefined,
      });
    }
    cur = cur.add(1, "day");
  }
  return rows;
};

/** =========================
 *  Component
 *  ========================= */
export default function PurchaseReportPage() {
  const [granularity, setGranularity] = useState<Granularity>("month");
  const [range, setRange] = useState<[Date | null, Date | null]>([
    dayjs().startOf("month").toDate(),
    dayjs().endOf("month").toDate(),
  ]);
  const [branches, setBranches] = useState<string[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [status, setStatus] = useState<Status | "Tất cả">("Tất cả");

  const [shareOpen, shareCtrl] = useDisclosure(false);
  const [editOpen, editCtrl] = useDisclosure(false);
  const [createOpen, createCtrl] = useDisclosure(false);

  const periodStart = dayjs(range[0] ?? new Date()).startOf("day");
  const periodEnd = dayjs(range[1] ?? range[0] ?? new Date()).endOf("day");

  const [orders, setOrders] = useState<PurchaseOrder[]>(() =>
    seedOrders(periodStart, periodEnd)
  );
  const [editing, setEditing] = useState<PurchaseOrder | null>(null);

  // Re-seed khi thay đổi khoảng thời gian
  const baseOrders = useMemo(() => seedOrders(periodStart, periodEnd), [range]);

  // Áp lọc
  const filtered = useMemo(() => {
    const pool = orders.length ? orders : baseOrders;
    return pool.filter(
      (o) =>
        dayjs(o.date).isBetween(periodStart, periodEnd, "day", "[]") &&
        (branches.length === 0 || branches.includes(o.branch)) &&
        (suppliers.length === 0 || suppliers.includes(o.supplier)) &&
        (products.length === 0 || products.includes(o.product)) &&
        (status === "Tất cả" || o.status === status)
    );
  }, [orders, baseOrders, branches, suppliers, products, status, range]);

  // Tổng hợp
  const totals = useMemo(() => {
    const totalCost = sumBy(filtered, "cost");
    const totalQty = sumBy(filtered, "quantity");
    const count = filtered.length;
    const avgCostPerKg = totalQty > 0 ? Math.round(totalCost / totalQty) : 0;
    const completed = filtered.filter((o) => o.status === "Hoàn tất").length;
    return { totalCost, totalQty, count, avgCostPerKg, completed };
  }, [filtered]);

  // Chuỗi thời gian
  const timeSeries = useMemo(() => {
    const keyer =
      granularity === "day"
        ? (d: string) => d
        : (d: string) => dayjs(d).format("YYYY-MM");
    const labler =
      granularity === "day"
        ? (k: string) => dayjs(k).format("DD/MM")
        : (k: string) => dayjs(k + "-01").format("MM/YYYY");

    const g = groupBy(filtered, (r) => keyer(r.date));
    return Object.entries(g)
      .map(([k, vs]) => ({
        key: k,
        label: labler(k),
        cost: sumBy(vs, "cost"),
        quantity: sumBy(vs, "quantity"),
        count: vs.length,
      }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [filtered, granularity]);

  // Theo NCC / sản phẩm / chi nhánh
  const bySupplier = useMemo(
    () =>
      Object.entries(groupBy(filtered, "supplier"))
        .map(([name, vs]) => ({
          name,
          cost: sumBy(vs, "cost"),
          qty: sumBy(vs, "quantity"),
          count: vs.length,
        }))
        .sort((a, b) => b.cost - a.cost),
    [filtered]
  );
  const byProduct = useMemo(
    () =>
      Object.entries(groupBy(filtered, "product"))
        .map(([name, vs]) => ({
          name,
          cost: sumBy(vs, "cost"),
          qty: sumBy(vs, "quantity"),
          count: vs.length,
        }))
        .sort((a, b) => b.cost - a.cost),
    [filtered]
  );
  const byBranch = useMemo(
    () =>
      Object.entries(groupBy(filtered, "branch")).map(([name, vs]) => ({
        name,
        cost: sumBy(vs, "cost"),
        qty: sumBy(vs, "quantity"),
        count: vs.length,
      })),
    [filtered]
  );

  const periodText = `${dayjs(range[0]).format("DD/MM/YYYY")} → ${dayjs(
    range[1]
  ).format("DD/MM/YYYY")} (${granularity === "day" ? "ngày" : "tháng"})`;

  /** ======= Handlers ======= */
  const resetFilters = () => {
    setBranches([]);
    setSuppliers([]);
    setProducts([]);
    setStatus("Tất cả");
    setGranularity("month");
    setRange([
      dayjs().startOf("month").toDate(),
      dayjs().endOf("month").toDate(),
    ]);
  };

  const openEdit = (row: PurchaseOrder) => {
    setEditing(row);
    editCtrl.open();
  };

  const saveEdit = (patch: Partial<PurchaseOrder>) => {
    if (!editing) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === editing.id ? { ...o, ...patch } : o))
    );
    setEditing(null);
    editCtrl.close();
  };

  const confirmDone = (row: PurchaseOrder) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === row.id
          ? {
              ...o,
              status: "Hoàn tất",
              completedAt: dayjs().format("YYYY-MM-DD"),
            }
          : o
      )
    );
  };

  const removeOrder = (row: PurchaseOrder) => {
    setOrders((prev) => prev.filter((o) => o.id !== row.id));
  };

  const createInitial: PurchaseOrder = {
    id: "",
    code: `TM${dayjs().format("MMDD")}-${Math.floor(Math.random() * 90 + 10)}`,
    date: dayjs().format("YYYY-MM-DD"),
    branch: BRANCHES[0],
    product: PRODUCTS[1],
    unit: "kg",
    quantity: 300,
    cost: 6_000_000,
    supplier: SUPPLIERS[1],
    status: "Đang xử lý",
    note: "",
  };

  const [creating, setCreating] = useState<PurchaseOrder>(createInitial);

  const onCreate = () => {
    const row: PurchaseOrder = { ...creating, id: nanoid() };
    setOrders((prev) => [row, ...prev]);
    setCreating({
      ...createInitial,
      code: `TM${dayjs().format("MMDD")}-${Math.floor(
        Math.random() * 90 + 10
      )}`,
    });
    createCtrl.close();
  };

  /** ======= Export ======= */
  const exportPDF = () => {
    const doc = new jsPDF({ unit: "pt" });
    doc.setFontSize(14);
    doc.text("Báo cáo thu mua • MV", 40, 40);
    doc.setFontSize(10);
    doc.text(`Thời gian: ${periodText}`, 40, 58);
    doc.text(`Chi nhánh: ${branches.join(", ") || "Tất cả"}`, 40, 72);
    doc.text(`Nhà cung cấp: ${suppliers.join(", ") || "Tất cả"}`, 40, 86);
    doc.text(
      `Sản phẩm: ${products.join(", ") || "Tất cả"} • Trạng thái: ${status}`,
      40,
      100
    );
    autoTable(doc, {
      startY: 120,
      head: [
        [
          "Mã",
          "Ngày",
          "Chi nhánh",
          "Sản phẩm",
          "SL (kg)",
          "Chi phí (VND)",
          "NCC",
          "TT",
        ],
      ],
      body: filtered.map((r) => [
        r.code,
        dayjs(r.date).format("DD/MM/YYYY"),
        r.branch,
        r.product,
        fmtInt(r.quantity),
        r.cost.toLocaleString("vi-VN"),
        r.supplier,
        r.status,
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [34, 139, 230] },
    });
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 16,
      head: [["Chỉ số", "Giá trị"]],
      body: [
        ["Tổng chi phí", fmtVND(Math.round(totals.totalCost))],
        ["Tổng số lượng (kg)", fmtInt(Math.round(totals.totalQty))],
        ["Số đơn", fmtInt(totals.count)],
        ["Giá TB / kg", fmtVND(totals.avgCostPerKg)],
        ["Đơn đã hoàn tất", fmtInt(totals.completed)],
      ],
      styles: { fontSize: 9 },
    });
    doc.save("bao-cao-thu-mua.pdf");
  };

  const exportExcel = () => {
    const head = [
      ["Báo cáo thu mua • MV"],
      [`Thời gian: ${periodText}`],
      [`Chi nhánh: ${branches.join(", ") || "Tất cả"}`],
      [`Nhà cung cấp: ${suppliers.join(", ") || "Tất cả"}`],
      [`Sản phẩm: ${products.join(", ") || "Tất cả"} | Trạng thái: ${status}`],
      [],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet([
      ...head,
      [
        "Mã",
        "Ngày",
        "Chi nhánh",
        "Sản phẩm",
        "SL (kg)",
        "Chi phí (VND)",
        "Nhà cung cấp",
        "Trạng thái",
      ],
      ...filtered.map((r) => [
        r.code,
        dayjs(r.date).format("DD/MM/YYYY"),
        r.branch,
        r.product,
        r.quantity,
        r.cost,
        r.supplier,
        r.status,
      ]),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsSummary, "Chi tiết");
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(bySupplier),
      "Theo NCC"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(byProduct),
      "Theo sản phẩm"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(byBranch),
      "Theo chi nhánh"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(timeSeries),
      "Theo thời gian"
    );
    XLSX.writeFile(wb, "bao-cao-thu-mua.xlsx");
  };

  /** ======= UI helpers ======= */
  const KPI = ({
    label,
    value,
    color,
    sub,
  }: {
    label: string;
    value: string;
    color: string;
    sub?: string;
  }) => (
    <Card withBorder radius={4} p="md">
      <Stack gap={6}>
        <Badge color={color} variant="light" radius={4}>
          {label}
        </Badge>
        <Title order={3}>{value}</Title>
        {sub && (
          <Text size="sm" c="dimmed">
            {sub}
          </Text>
        )}
      </Stack>
    </Card>
  );

  /** ======= Render ======= */
  return (
    <>
      <Card withBorder shadow="sm" radius={4} p="lg">
        <Group justify="space-between" align="flex-start" mb="md">
          <Group>
            <Stack gap={2}>
              <Title order={3}>Báo cáo thu mua</Title>
              <Group gap={8} wrap="wrap">
                <Badge variant="dot">{periodText}</Badge>
                <Badge color="red" variant="light">
                  Chỉ quản trị viên
                </Badge>
              </Group>
            </Stack>
          </Group>
          <Group gap="xs">
            <Button
              radius={4}
              leftSection={<IconPlus size={16} />}
              onClick={createCtrl.open}
            >
              Tạo mới
            </Button>
            <Button
              radius={4}
              variant="light"
              leftSection={<IconDownload size={16} />}
              onClick={exportExcel}
            >
              Xuất Excel
            </Button>
            <Button
              radius={4}
              variant="default"
              leftSection={<IconDownload size={16} />}
              onClick={exportPDF}
            >
              Xuất PDF
            </Button>
          </Group>
        </Group>

        {/* Bộ lọc */}
        <Card withBorder radius={4} p="md" mb="md">
          <Grid gutter="md" align="end">
            <Grid.Col span={{ base: 12, md: 3 }}>
              <SegmentedControl
                radius={4}
                value={granularity}
                onChange={(v: any) => setGranularity(v)}
                data={[
                  { value: "day", label: "Theo ngày" },
                  { value: "month", label: "Theo tháng" },
                ]}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <DatePickerInput
                type="range"
                locale="vi"
                label="Khoảng thời gian"
                radius={4}
                leftSection={<IconCalendar size={16} />}
                value={range}
                onChange={(v) =>
                  setRange([v?.[0] ?? null, v?.[1] ?? v?.[0] ?? null])
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Group grow>
                <MultiSelect
                  label="Chi nhánh"
                  data={BRANCHES}
                  value={branches}
                  onChange={setBranches}
                  searchable
                  clearable
                  radius={4}
                />
                <Select
                  label="Trạng thái"
                  data={["Tất cả", "Đang xử lý", "Hoàn tất", "Huỷ"]}
                  value={status}
                  onChange={(v: any) => setStatus(v)}
                  radius={4}
                />
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Group grow>
                <MultiSelect
                  label="Nhà cung cấp"
                  data={SUPPLIERS}
                  value={suppliers}
                  onChange={setSuppliers}
                  searchable
                  clearable
                  radius={4}
                />
                <MultiSelect
                  label="Sản phẩm"
                  data={PRODUCTS}
                  value={products}
                  onChange={setProducts}
                  searchable
                  clearable
                  radius={4}
                />
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Group justify="flex-end">
                <Button
                  variant="light"
                  radius={4}
                  leftSection={<IconRefresh size={16} />}
                  onClick={resetFilters}
                >
                  Đặt lại
                </Button>
              </Group>
            </Grid.Col>
          </Grid>
        </Card>

        {/* KPI */}
        <Card withBorder radius={4} p="md" mb="md">
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 3 }}>
              <KPI
                label="Tổng chi phí"
                value={fmtVND(Math.round(totals.totalCost))}
                color="blue"
                sub={`${fmtInt(totals.count)} đơn`}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <KPI
                label="Tổng số lượng"
                value={`${fmtInt(Math.round(totals.totalQty))} kg`}
                color="teal"
                sub="Quy đổi theo kg"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <KPI
                label="Giá TB / kg"
                value={fmtVND(totals.avgCostPerKg)}
                color="orange"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <KPI
                label="Đơn hoàn tất"
                value={fmtInt(totals.completed)}
                color="green"
              />
            </Grid.Col>
          </Grid>
        </Card>

        {/* Charts */}
        <Card withBorder radius={4} p="lg" mb="md">
          <Stack gap="lg">
            <Title order={5}>Tổng quan biểu đồ</Title>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
              {/* Đơn, khối lượng, chi phí theo thời gian */}
              <Card withBorder radius={4} p="md">
                <Group justify="space-between" mb="xs">
                  <Title order={6}>
                    Dòng thời gian: Số đơn / Khối lượng (kg) / Chi phí (VND)
                  </Title>
                </Group>
                <ResponsiveContainer width="100%" height={320}>
                  <ComposedChart
                    data={timeSeries}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="gCount" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor={COLORS.yellow}
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="100%"
                          stopColor={COLORS.yellow}
                          stopOpacity={0.5}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />

                    <RTooltip
                      formatter={(v: any, n: string) =>
                        n.toLowerCase().includes("vnd")
                          ? fmtVND(Number(v))
                          : fmtInt(Number(v))
                      }
                    />
                    <Legend />
                    <Bar
                      dataKey="count"
                      name="Số đơn"
                      fill="url(#gCount)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      yAxisId="L"
                      name="Số lượng (kg)"
                      type="monotone"
                      dataKey="quantity"
                      stroke={COLORS.cyan}
                      dot={false}
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="R"
                      name="Chi phí (VND)"
                      type="monotone"
                      dataKey="cost"
                      stroke={COLORS.blue}
                      dot={false}
                      strokeWidth={2}
                    />
                    <Brush dataKey="label" height={18} travellerWidth={8} />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>

              {/* Cơ cấu chi phí theo nhà cung cấp */}
              <Card withBorder radius={4} p="md">
                <Group justify="space-between" mb="xs">
                  <Title order={6}>Tỷ trọng chi phí theo nhà cung cấp</Title>
                </Group>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={bySupplier.map((s) => ({
                        name: s.name,
                        value: s.cost,
                      }))}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={2}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {bySupplier.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RTooltip formatter={(v: any) => fmtVND(Number(v))} />
                    <Legend verticalAlign="bottom" height={36} />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: 12, fill: "#666" }}
                    >
                      Tổng chi phí
                    </text>
                    <text
                      x="50%"
                      y="50%"
                      dy={16}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontWeight: 700 }}
                    >
                      {fmtVND(
                        bySupplier.reduce(
                          (a: number, b: any) => a + Number(b.cost || 0),
                          0
                        )
                      )}
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
              {/* Top sản phẩm theo chi phí */}
              <Card withBorder radius={4} p="md">
                <Group justify="space-between" mb="xs">
                  <Title order={6}>Top chi phí theo sản phẩm</Title>
                </Group>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={[...byProduct].slice(0, 8)}
                    margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => fmtVND(Number(v))} />
                    <RTooltip formatter={(v: any) => fmtVND(Number(v))} />
                    <Legend />
                    <Bar
                      dataKey="cost"
                      name="Chi phí"
                      fill={COLORS.teal}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Chi phí theo chi nhánh (bar ngang) */}
              <Card withBorder radius={4} p="md">
                <Group justify="space-between" mb="xs">
                  <Title order={6}>Chi phí theo chi nhánh</Title>
                </Group>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={byBranch}
                    layout="vertical"
                    margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      tickFormatter={(v) => fmtVND(Number(v))}
                    />
                    <YAxis type="category" dataKey="name" width={100} />
                    <RTooltip formatter={(v: any) => fmtVND(Number(v))} />
                    <Legend />
                    <Bar
                      dataKey="cost"
                      name="Chi phí"
                      fill={COLORS.grape}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </SimpleGrid>
          </Stack>
        </Card>

        {/* Bảng dữ liệu */}
        <Card withBorder radius={4} p="md">
          <Group justify="space-between" mb="xs">
            <Title order={5}>Danh sách đơn thu mua</Title>
            <Text size="sm" c="dimmed">
              {fmtInt(filtered.length)} đơn •{" "}
              {fmtVND(Math.round(totals.totalCost))}
            </Text>
          </Group>
          <Divider my="xs" />
          <Table
            data={filtered}
            columns={[
              { header: "Mã", accessorKey: "code" },
              { header: "Ngày", accessorKey: "date" },
              { header: "Chi nhánh", accessorKey: "branch" },
              { header: "Sản phẩm", accessorKey: "product" },
              { header: "Số lượng (kg)", accessorKey: "quantity" },
              { header: "Chi phí (VND)", accessorKey: "cost" },
              { header: "Nhà cung cấp", accessorKey: "supplier" },
              { header: "Trạng thái", accessorKey: "status" },
              {
                header: "Thao tác",
                accessorKey: "actions",

                Cell: ({ row }) => (
                  <Group gap="xs" justify="center">
                    <ActionIcon
                      variant="light"
                      radius={4}
                      onClick={() => openEdit(row.original)}
                      aria-label="Sửa"
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="green"
                      radius={4}
                      onClick={() => confirmDone(row.original)}
                      disabled={row.original.status === "Hoàn tất"}
                      aria-label="Xác nhận"
                    >
                      <IconCheck size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="red"
                      radius={4}
                      onClick={() => removeOrder(row.original)}
                      aria-label="Xoá"
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                ),
              },
            ]}
          />
        </Card>
      </Card>

      {/* Modal: Tạo mới */}
      <Modal
        opened={createOpen}
        onClose={createCtrl.close}
        centered
        radius={4}
        size="lg"
        title={<Title order={5}>Tạo đơn thu mua</Title>}
      >
        <Stack gap="sm">
          <Group grow>
            <TextInput
              label="Mã đơn"
              value={creating.code}
              onChange={(e) =>
                setCreating({ ...creating, code: e.currentTarget.value })
              }
              radius={4}
            />
            <Select
              label="Chi nhánh"
              data={BRANCHES}
              value={creating.branch}
              onChange={(v) =>
                setCreating({ ...creating, branch: v as string })
              }
              radius={4}
            />
          </Group>
          <Group grow>
            <Select
              label="Sản phẩm"
              data={PRODUCTS}
              value={creating.product}
              onChange={(v) =>
                setCreating({ ...creating, product: v as string })
              }
              radius={4}
              searchable
            />
            <Select
              label="Nhà cung cấp"
              data={SUPPLIERS}
              value={creating.supplier}
              onChange={(v) =>
                setCreating({ ...creating, supplier: v as string })
              }
              radius={4}
              searchable
            />
          </Group>
          <Group grow>
            <NumberInput
              label="Số lượng (kg)"
              value={creating.quantity}
              onChange={(v) =>
                setCreating({ ...creating, quantity: Number(v) })
              }
              min={1}
              radius={4}
            />
            <NumberInput
              label="Chi phí (VND)"
              value={creating.cost}
              onChange={(v) => setCreating({ ...creating, cost: Number(v) })}
              min={0}
              step={1000}
              thousandSeparator="."
              radius={4}
            />
          </Group>
          <DatePickerInput
            label="Ngày thu mua"
            value={[new Date(creating.date), new Date(creating.date)]}
            type="default"
            onChange={(d) =>
              d &&
              setCreating({
                ...creating,
                date: dayjs(Array.isArray(d) ? d[0] : d).format("YYYY-MM-DD"),
              })
            }
            radius={4}
          />
          <Group justify="flex-end" mt="sm">
            <Button variant="default" radius={4} onClick={createCtrl.close}>
              Huỷ
            </Button>
            <Button radius={4} onClick={onCreate}>
              Lưu
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Modal: Chỉnh sửa */}
      <Modal
        opened={editOpen}
        onClose={editCtrl.close}
        centered
        radius={4}
        size="lg"
        title={<Title order={5}>Chỉnh sửa đơn thu mua</Title>}
      >
        {editing && (
          <Stack gap="sm">
            <Group grow>
              <TextInput
                label="Mã đơn"
                defaultValue={editing.code}
                onChange={(e) =>
                  setEditing({ ...editing, code: e.currentTarget.value })
                }
                radius={4}
              />
              <Select
                label="Trạng thái"
                data={["Đang xử lý", "Hoàn tất", "Huỷ"]}
                value={editing.status}
                onChange={(v) =>
                  setEditing({ ...editing, status: v as Status })
                }
                radius={4}
              />
            </Group>
            <Group grow>
              <Select
                label="Chi nhánh"
                data={BRANCHES}
                value={editing.branch}
                onChange={(v) =>
                  setEditing({ ...editing, branch: v as string })
                }
                radius={4}
              />
              <Select
                label="Nhà cung cấp"
                data={SUPPLIERS}
                value={editing.supplier}
                onChange={(v) =>
                  setEditing({ ...editing, supplier: v as string })
                }
                radius={4}
              />
            </Group>
            <Group grow>
              <Select
                label="Sản phẩm"
                data={PRODUCTS}
                value={editing.product}
                onChange={(v) =>
                  setEditing({ ...editing, product: v as string })
                }
                radius={4}
                searchable
              />
              <NumberInput
                label="Số lượng (kg)"
                value={editing.quantity}
                onChange={(v) =>
                  setEditing({ ...editing, quantity: Number(v) })
                }
                min={1}
                radius={4}
              />
            </Group>
            <Group grow>
              <NumberInput
                label="Chi phí (VND)"
                value={editing.cost}
                onChange={(v) => setEditing({ ...editing, cost: Number(v) })}
                min={0}
                step={1000}
                thousandSeparator="."
                radius={4}
              />
              <DatePickerInput
                label="Ngày thu mua"
                value={new Date(editing.date)}
                onChange={(d) =>
                  d &&
                  setEditing({
                    ...editing,
                    date: dayjs(d as Date).format("YYYY-MM-DD"),
                  })
                }
                radius={4}
              />
            </Group>
            <Group justify="flex-end" mt="sm">
              <Button variant="default" radius={4} onClick={editCtrl.close}>
                Huỷ
              </Button>
              <Button radius={4} onClick={() => saveEdit(editing)}>
                Lưu
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
}
