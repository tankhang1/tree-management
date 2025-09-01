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
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconArrowLeft,
  IconCalendar,
  IconDownload,
  IconMail,
  IconRefresh,
  IconShare2,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import groupBy from "lodash/groupBy";
import sumBy from "lodash/sumBy";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

type Granularity = "day" | "month" | "year";

type Tx = {
  id: string;
  date: string;
  branch: string;
  product: string;
  collaborator: string;
  channel: "Online" | "Offline";
  payment: "Tiền mặt" | "Chuyển khoản" | "Ví điện tử";
  revenue: number;
  cost: number;
  profit: number;
  orders: number;
  items: number;
};

const BRANCHES = ["Chi nhánh HN", "Chi nhánh HCM", "Chi nhánh ĐN"];
const PRODUCTS = [
  "Sầu riêng Ri6",
  "Xoài cát Hòa Lộc",
  "Chuối già",
  "Cà phê hạt",
  "Trà Ô Long",
  "Bơ Booth",
];
const COLLABS = ["CTV Mai", "CTV Long", "CTV Huyền", "CTV Dũng", "CTV Vy"];
const CHANNELS: Array<Tx["channel"]> = ["Online", "Offline"];
const PAYMENTS: Array<Tx["payment"]> = [
  "Tiền mặt",
  "Chuyển khoản",
  "Ví điện tử",
];

const COLORS = {
  blue: "#228be6",
  green: "#2f9e44",
  yellow: "#f08c00",
  red: "#e03131",
  grape: "#ae3ec9",
  teal: "#0ca678",
  cyan: "#0b7285",
  indigo: "#364fc7",
  orange: "#e8590c",
  pink: "#d6336c",
};
const PIE_COLORS = [
  COLORS.blue,
  COLORS.green,
  COLORS.yellow,
  COLORS.red,
  COLORS.grape,
  COLORS.teal,
  COLORS.cyan,
  COLORS.indigo,
  COLORS.orange,
  COLORS.pink,
];

const fmtVND = (n: number) =>
  n.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
const fmtInt = (n: number) => n.toLocaleString("vi-VN");
const fmtPct = (n: number) =>
  `${n.toLocaleString("vi-VN", { maximumFractionDigits: 1 })}%`;

const seedData = (start: dayjs.Dayjs, end: dayjs.Dayjs): Tx[] => {
  const arr: Tx[] = [];
  let cur = start.startOf("day");
  let id = 1;
  while (cur.isBefore(end) || cur.isSame(end, "day")) {
    BRANCHES.forEach((b, bi) => {
      PRODUCTS.forEach((p, pi) => {
        const base =
          Math.abs(Math.sin((cur.diff(start, "day") + 1 + pi) * 0.55 + bi)) +
          0.3;
        const orders = Math.round(base * (6 + (pi % 3) * 2) + (bi + 1));
        if (orders <= 0) return;
        const aov = 150000 + (pi + 1) * 25000 + (bi + 1) * 12000;
        const revenue = orders * aov * (1 + (cur.day() === 6 ? 0.15 : 0));
        const costRate = 0.66 + ((pi + bi) % 3) * 0.04;
        const cost = revenue * costRate;
        const items = Math.max(
          orders,
          Math.round(orders * (1.6 + (pi % 2) * 0.2))
        );
        arr.push({
          id: `TX-${id++}`,
          date: cur.format("YYYY-MM-DD"),
          branch: b,
          product: p,
          collaborator: COLLABS[(bi + pi) % COLLABS.length],
          channel: CHANNELS[(bi + pi + cur.date()) % 2],
          payment: PAYMENTS[(bi + pi + cur.month()) % 3],
          revenue,
          cost,
          profit: revenue - cost,
          orders,
          items,
        });
      });
    });
    cur = cur.add(1, "day");
  }
  return arr;
};

const aggregate = (rows: Tx[], by: Granularity) => {
  const keyer =
    by === "day"
      ? (r: Tx) => r.date
      : by === "month"
      ? (r: Tx) => dayjs(r.date).format("YYYY-MM")
      : (r: Tx) => dayjs(r.date).format("YYYY");
  const labler =
    by === "day"
      ? (k: string) => dayjs(k).format("DD/MM")
      : by === "month"
      ? (k: string) => dayjs(k).format("MM/YYYY")
      : (k: string) => k;
  const g = groupBy(rows, keyer);
  return Object.entries(g)
    .map(([k, vs]) => ({
      key: k,
      label: labler(k),
      revenue: sumBy(vs, "revenue"),
      profit: sumBy(vs, "profit"),
      orders: sumBy(vs, "orders"),
    }))
    .sort((a, b) => a.key.localeCompare(b.key));
};

const diffPct = (cur: number, prev: number) =>
  prev === 0 ? 0 : ((cur - prev) / prev) * 100;

export default function BusinessReportVNPage() {
  const [granularity, setGranularity] = useState<Granularity>("month");
  const [range, setRange] = useState<[Date | null, Date | null]>([
    dayjs().startOf("year").toDate(),
    dayjs().endOf("year").toDate(),
  ]);
  const [branches, setBranches] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [collabs, setCollabs] = useState<string[]>([]);
  const [channels, setChannels] = useState<Tx["channel"][]>([]);
  const [payments, setPayments] = useState<Tx["payment"][]>([]);
  const [targetProfitRate, setTargetProfitRate] = useState<number>(25);
  const [shareOpen, { open: openShare, close: closeShare }] =
    useDisclosure(false);
  const [shareTo, setShareTo] = useState({
    email: "baocao@mvshop.vn",
    zalo: "0909000000",
    note: "",
  });

  const periodStart = dayjs(range[0] ?? new Date()).startOf("day");
  const periodEnd = dayjs(range[1] ?? range[0] ?? new Date()).endOf("day");
  const prevStart = periodStart.subtract(
    periodEnd.diff(periodStart, "day") + 1,
    "day"
  );
  const prevEnd = periodStart.subtract(1, "day");

  const rawData = useMemo(() => seedData(periodStart, periodEnd), [range]);
  const prevData = useMemo(() => seedData(prevStart, prevEnd), [range]);

  const filtered = useMemo(
    () =>
      rawData.filter(
        (r) =>
          (branches.length === 0 || branches.includes(r.branch)) &&
          (products.length === 0 || products.includes(r.product)) &&
          (collabs.length === 0 || collabs.includes(r.collaborator)) &&
          (channels.length === 0 || channels.includes(r.channel)) &&
          (payments.length === 0 || payments.includes(r.payment))
      ),
    [rawData, branches, products, collabs, channels, payments]
  );

  const timeSeries = useMemo(
    () => aggregate(filtered, granularity),
    [filtered, granularity]
  );

  const kpis = useMemo(() => {
    const revenue = sumBy(filtered, "revenue");
    const orders = sumBy(filtered, "orders");
    const profit = sumBy(filtered, "profit");
    const items = sumBy(filtered, "items");
    const aov = orders ? Math.round(revenue / orders) : 0;
    const profitRate = revenue ? Math.round((profit / revenue) * 100) : 0;
    const itemsPerOrder = orders ? items / orders : 0;
    const convRate = 2.4 + (orders % 5) * 0.3;
    const refundRate = 0.8 + (orders % 3) * 0.2;
    return {
      revenue,
      orders,
      profit,
      aov,
      profitRate,
      itemsPerOrder,
      convRate,
      refundRate,
    };
  }, [filtered]);

  const kpisPrev = useMemo(() => {
    const rows =
      prevData.filter(
        (r) =>
          (branches.length === 0 || branches.includes(r.branch)) &&
          (products.length === 0 || products.includes(r.product)) &&
          (collabs.length === 0 || collabs.includes(r.collaborator)) &&
          (channels.length === 0 || channels.includes(r.channel)) &&
          (payments.length === 0 || payments.includes(r.payment))
      ) || [];
    const revenue = sumBy(rows, "revenue");
    const orders = sumBy(rows, "orders");
    const profit = sumBy(rows, "profit");
    const aov = orders ? Math.round(revenue / orders) : 0;
    const profitRate = revenue ? Math.round((profit / revenue) * 100) : 0;
    return { revenue, orders, profit, aov, profitRate };
  }, [prevData, branches, products, collabs, channels, payments]);

  const delta = {
    revenue: diffPct(kpis.revenue, kpisPrev.revenue),
    profit: diffPct(kpis.profit, kpisPrev.profit),
    orders: diffPct(kpis.orders, kpisPrev.orders),
    aov: diffPct(kpis.aov, kpisPrev.aov),
    margin: diffPct(kpis.profitRate, kpisPrev.profitRate),
  };

  const byBranch = useMemo(() => {
    const g = groupBy(filtered, "branch");
    return Object.entries(g)
      .map(([k, vs]) => ({
        name: k,
        revenue: sumBy(vs, "revenue"),
        profit: sumBy(vs, "profit"),
        orders: sumBy(vs, "orders"),
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filtered]);

  const byProduct = useMemo(() => {
    const g = groupBy(filtered, "product");
    return Object.entries(g)
      .map(([k, vs]) => ({
        name: k,
        revenue: sumBy(vs, "revenue"),
        profit: sumBy(vs, "profit"),
        orders: sumBy(vs, "orders"),
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filtered]);

  const byCollab = useMemo(() => {
    const g = groupBy(filtered, "collaborator");
    return Object.entries(g)
      .map(([k, vs]) => ({
        name: k,
        revenue: sumBy(vs, "revenue"),
        profit: sumBy(vs, "profit"),
        orders: sumBy(vs, "orders"),
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filtered]);

  const byChannel = useMemo(() => {
    const g = groupBy(filtered, "channel");
    return Object.entries(g).map(([k, vs]) => ({
      name: k,
      revenue: sumBy(vs, "revenue"),
      orders: sumBy(vs, "orders"),
    }));
  }, [filtered]);

  const byPayment = useMemo(() => {
    const g = groupBy(filtered, "payment");
    return Object.entries(g).map(([k, vs]) => ({
      name: k,
      revenue: sumBy(vs, "revenue"),
      orders: sumBy(vs, "orders"),
    }));
  }, [filtered]);

  const periodText = `${dayjs(range[0]).format("DD/MM/YYYY")} → ${dayjs(
    range[1]
  ).format("DD/MM/YYYY")} (${granularity})`;

  const exportPDF = () => {
    const doc = new jsPDF({ unit: "pt" });
    doc.setFontSize(14);
    doc.text("Báo cáo kinh doanh • MV SHOP", 40, 40);
    doc.setFontSize(10);
    doc.text(`Thời gian: ${periodText}`, 40, 58);
    doc.text(`Chi nhánh: ${branches.join(", ") || "Tất cả"}`, 40, 72);
    doc.text(`Sản phẩm: ${products.join(", ") || "Tất cả"}`, 40, 86);
    doc.text(`CTV: ${collabs.join(", ") || "Tất cả"}`, 40, 100);
    doc.text(
      `Kênh: ${channels.join(", ") || "Tất cả"} • Thanh toán: ${
        payments.join(", ") || "Tất cả"
      }`,
      40,
      114
    );
    autoTable(doc, {
      startY: 132,
      head: [["Kỳ", "Doanh thu", "Lợi nhuận", "Đơn hàng"]],
      body: timeSeries.map((r) => [
        r.label,
        r.revenue.toLocaleString("vi-VN"),
        r.profit.toLocaleString("vi-VN"),
        r.orders.toLocaleString("vi-VN"),
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [34, 139, 230] },
    });
    doc.save("bao-cao-kinh-doanh.pdf");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["Báo cáo kinh doanh • MV SHOP"],
      [`Thời gian: ${periodText}`],
      [`Chi nhánh: ${branches.join(", ") || "Tất cả"}`],
      [`Sản phẩm: ${products.join(", ") || "Tất cả"}`],
      [`CTV: ${collabs.join(", ") || "Tất cả"}`],
      [
        `Kênh: ${channels.join(", ") || "Tất cả"} | Thanh toán: ${
          payments.join(", ") || "Tất cả"
        }`,
      ],
      [],
      ["Kỳ", "Doanh thu", "Lợi nhuận", "Đơn hàng"],
      ...timeSeries.map((r) => [
        r.label,
        Math.round(r.revenue),
        Math.round(r.profit),
        r.orders,
      ]),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tổng quan");
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(byBranch),
      "Theo chi nhánh"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(byProduct),
      "Theo sản phẩm"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(byCollab),
      "Theo CTV"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(byChannel),
      "Theo kênh"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(byPayment),
      "Theo thanh toán"
    );
    XLSX.writeFile(wb, "bao-cao-kinh-doanh.xlsx");
  };

  const resetFilters = () => {
    setBranches([]);
    setProducts([]);
    setCollabs([]);
    setChannels([]);
    setPayments([]);
    setGranularity("month");
    setRange([
      dayjs().startOf("year").toDate(),
      dayjs().endOf("year").toDate(),
    ]);
  };

  const Delta = ({ v }: { v: number }) => (
    <Group gap={6}>
      {v >= 0 ? (
        <IconTrendingUp size={16} color={COLORS.teal} />
      ) : (
        <IconTrendingDown size={16} color={COLORS.red} />
      )}
      <Text size="sm" c={v >= 0 ? "teal" : "red"}>
        {fmtPct(Math.abs(v))}
      </Text>
    </Group>
  );

  const KPI = ({
    label,
    value,
    deltaPct,
    color,
    sub,
  }: {
    label: string;
    value: string;
    deltaPct?: number;
    color: string;
    sub?: string;
  }) => (
    <Card withBorder radius={4} p="md">
      <Stack gap={6}>
        <Badge color={color} variant="light" radius={4}>
          {label}
        </Badge>
        <Title order={3}>{value}</Title>
        <Group gap="xs" c="dimmed">
          {typeof deltaPct === "number" && <Delta v={deltaPct} />}
          {sub && <Text size="sm">{sub}</Text>}
        </Group>
      </Stack>
    </Card>
  );

  const bestBranch = byBranch[0]?.name || "—";
  const bestProduct = byProduct[0]?.name || "—";
  const peak = timeSeries.reduce(
    (acc, r) =>
      r.revenue > acc.max ? { label: r.label, max: r.revenue } : acc,
    { label: "—", max: 0 }
  );

  return (
    <>
      <Card withBorder shadow="sm" radius={4} p="lg">
        <Group justify="space-between" align="flex-start" mb="md">
          <Group>
            <Stack gap={2}>
              <Title order={3}>Báo cáo kinh doanh</Title>
              <Group gap={8} wrap="wrap">
                <Badge variant="dot">{periodText}</Badge>
                <Badge color="grape" variant="light">
                  MV SHOP
                </Badge>
                <Badge color="red" variant="light">
                  Chỉ quản trị viên
                </Badge>
              </Group>
            </Stack>
          </Group>
          <Group gap="xs">
            <Button
              variant="default"
              radius={4}
              leftSection={<IconDownload size={16} />}
              onClick={exportPDF}
            >
              PDF
            </Button>
            <Button
              radius={4}
              leftSection={<IconDownload size={16} />}
              onClick={exportExcel}
            >
              Excel
            </Button>
            <Button
              radius={4}
              variant="light"
              leftSection={<IconShare2 size={16} />}
              onClick={openShare}
            >
              Chia sẻ
            </Button>
          </Group>
        </Group>

        <Stack>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 3 }}>
              <KPI
                label="Doanh thu"
                value={fmtVND(Math.round(kpis.revenue))}
                deltaPct={delta.revenue}
                color="blue"
                sub={`${fmtInt(kpis.orders)} đơn • AOV ${fmtVND(kpis.aov)}`}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <KPI
                label="Lợi nhuận"
                value={fmtVND(Math.round(kpis.profit))}
                deltaPct={delta.profit}
                color="teal"
                sub={`Biên LN ${fmtPct(kpis.profitRate)} (mục tiêu ${fmtPct(
                  targetProfitRate
                )})`}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <KPI
                label="Giỏ hàng"
                value={`${kpis.itemsPerOrder.toFixed(2)} sp/đơn`}
                color="yellow"
                sub={`Chuyển đổi ~ ${fmtPct(kpis.convRate)}`}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Card withBorder radius={4} p="md">
                <Stack gap={6}>
                  <Text size="sm" c="dimmed">
                    Mục tiêu biên lợi nhuận (%)
                  </Text>
                  <NumberInput
                    value={targetProfitRate}
                    onChange={(v) => setTargetProfitRate(Number(v))}
                    min={0}
                    max={100}
                    step={1}
                    radius={4}
                  />
                  <Text size="sm" c="dimmed">
                    Hoàn/đổi khoảng {fmtPct(kpis.refundRate)}
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>

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
                    { value: "year", label: "Theo năm" },
                  ]}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 5 }}>
                <DatePickerInput
                  type="range"
                  locale="vi"
                  label="Khoảng thời gian"
                  leftSection={<IconCalendar size={16} />}
                  value={range}
                  onChange={(v) =>
                    setRange([v?.[0] ?? null, v?.[1] ?? v?.[0] ?? null])
                  }
                  radius={4}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Group grow wrap="nowrap">
                  <MultiSelect
                    label="Chi nhánh"
                    data={BRANCHES}
                    value={branches}
                    onChange={setBranches}
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
                <Group grow wrap="nowrap">
                  <MultiSelect
                    label="Cộng tác viên"
                    data={COLLABS}
                    value={collabs}
                    onChange={setCollabs}
                    searchable
                    clearable
                    radius={4}
                  />
                  <MultiSelect
                    label="Kênh"
                    data={CHANNELS}
                    value={channels}
                    onChange={setChannels}
                    radius={4}
                  />
                </Group>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Group grow align="flex-end" wrap="nowrap">
                  <MultiSelect
                    label="Thanh toán"
                    data={PAYMENTS}
                    value={payments}
                    onChange={setPayments}
                    radius={4}
                  />
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

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Paper withBorder radius={4} p="lg" h={340}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={timeSeries}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={COLORS.blue}
                          stopOpacity={0.6}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.blue}
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                      <linearGradient id="gPro" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={COLORS.teal}
                          stopOpacity={0.6}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.teal}
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <RTooltip formatter={(v: any) => fmtVND(Number(v))} />
                    <Legend />
                    <Area
                      name="Doanh thu"
                      dataKey="revenue"
                      stroke={COLORS.blue}
                      fill="url(#gRev)"
                    />
                    <Area
                      name="Lợi nhuận"
                      dataKey="profit"
                      stroke={COLORS.teal}
                      fill="url(#gPro)"
                    />
                    <Line
                      name="Đơn hàng"
                      type="monotone"
                      dataKey="orders"
                      stroke={COLORS.orange}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper withBorder radius={4} p="lg" h={340}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={byChannel}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RTooltip formatter={(v: any) => fmtVND(Number(v))} />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      name="Doanh thu"
                      fill={COLORS.indigo}
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      dataKey="orders"
                      name="Đơn hàng"
                      stroke={COLORS.red}
                      dot={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid.Col>
          </Grid>

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Paper withBorder radius={4} p="xs" h={360}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={byBranch.map((b) => ({
                        name: b.name,
                        value: b.revenue,
                      }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {byBranch.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RTooltip formatter={(v: any) => fmtVND(Number(v))} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Paper withBorder radius={4} p="xs" h={360}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[...byProduct].slice(0, 8)}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RTooltip formatter={(v: any) => fmtVND(Number(v))} />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      name="Doanh thu"
                      fill={COLORS.cyan}
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      dataKey="profit"
                      name="Lợi nhuận"
                      stroke={COLORS.green}
                      dot={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid.Col>
          </Grid>

          <Divider my="md" label="Bảng chi tiết" labelPosition="center" />
          <ScrollArea h={320}>
            <Table striped highlightOnHover withRowBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Nhóm</Table.Th>
                  <Table.Th ta="right">Doanh thu</Table.Th>
                  <Table.Th ta="right">Lợi nhuận</Table.Th>
                  <Table.Th ta="right">Đơn hàng</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {byBranch.map((r) => (
                  <Table.Tr key={`b-${r.name}`}>
                    <Table.Td>
                      <Badge radius={4} variant="light" color="blue">
                        Chi nhánh
                      </Badge>{" "}
                      {r.name}
                    </Table.Td>
                    <Table.Td ta="right">
                      {fmtVND(Math.round(r.revenue))}
                    </Table.Td>
                    <Table.Td ta="right">
                      {fmtVND(Math.round(r.profit))}
                    </Table.Td>
                    <Table.Td ta="right">{fmtInt(r.orders)}</Table.Td>
                  </Table.Tr>
                ))}
                {byProduct.map((r) => (
                  <Table.Tr key={`p-${r.name}`}>
                    <Table.Td>
                      <Badge radius={4} variant="light" color="grape">
                        Sản phẩm
                      </Badge>{" "}
                      {r.name}
                    </Table.Td>
                    <Table.Td ta="right">
                      {fmtVND(Math.round(r.revenue))}
                    </Table.Td>
                    <Table.Td ta="right">
                      {fmtVND(Math.round(r.profit))}
                    </Table.Td>
                    <Table.Td ta="right">{fmtInt(r.orders)}</Table.Td>
                  </Table.Tr>
                ))}
                {byCollab.map((r) => (
                  <Table.Tr key={`c-${r.name}`}>
                    <Table.Td>
                      <Badge radius={4} variant="light" color="teal">
                        CTV
                      </Badge>{" "}
                      {r.name}
                    </Table.Td>
                    <Table.Td ta="right">
                      {fmtVND(Math.round(r.revenue))}
                    </Table.Td>
                    <Table.Td ta="right">
                      {fmtVND(Math.round(r.profit))}
                    </Table.Td>
                    <Table.Td ta="right">{fmtInt(r.orders)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>

          <Card withBorder radius={4} p="md">
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Title order={5} mb="xs">
                  Nhận định nhanh
                </Title>
                <Stack gap={6}>
                  <Text size="sm">
                    • Chi nhánh mạnh nhất: <b>{bestBranch}</b>
                  </Text>
                  <Text size="sm">
                    • Sản phẩm chủ lực: <b>{bestProduct}</b>
                  </Text>
                  <Text size="sm">
                    • Kỳ doanh thu cao nhất: <b>{peak.label}</b> (
                    {fmtVND(Math.round(peak.max))})
                  </Text>
                  <Text size="sm">
                    • Biên lợi nhuận hiện tại: <b>{fmtPct(kpis.profitRate)}</b>{" "}
                    {kpis.profitRate >= targetProfitRate
                      ? "(đạt mục tiêu)"
                      : "(chưa đạt)"}
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Group justify="flex-end" align="end">
                  <Button
                    radius={4}
                    leftSection={<IconDownload size={16} />}
                    onClick={exportPDF}
                  >
                    Xuất PDF
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
                    leftSection={<IconShare2 size={16} />}
                    onClick={openShare}
                  >
                    Gửi email/Zalo
                  </Button>
                </Group>
              </Grid.Col>
            </Grid>
          </Card>
        </Stack>
      </Card>

      <Modal
        opened={shareOpen}
        onClose={closeShare}
        title={<Title order={5}>Chia sẻ báo cáo</Title>}
        centered
        radius={4}
        size="lg"
      >
        <Stack>
          <Group grow>
            <TextInput
              label="Email"
              leftSection={<IconMail size={16} />}
              value={shareTo.email}
              onChange={(e) =>
                setShareTo({ ...shareTo, email: e.currentTarget.value })
              }
              radius={4}
            />
            <TextInput
              label="Zalo (SĐT)"
              leftSection={<IconShare2 size={16} />}
              value={shareTo.zalo}
              onChange={(e) =>
                setShareTo({ ...shareTo, zalo: e.currentTarget.value })
              }
              radius={4}
            />
          </Group>
          <TextInput
            label="Tiêu đề"
            value={`Báo cáo kinh doanh • ${periodText}`}
            onChange={() => {}}
            radius={4}
          />
          <TextInput
            label="Ghi chú"
            placeholder="Nội dung gửi kèm"
            value={shareTo.note}
            onChange={(e) =>
              setShareTo({ ...shareTo, note: e.currentTarget.value })
            }
            radius={4}
          />
          <Divider />
          <Group justify="flex-end">
            <Button variant="default" radius={4} onClick={closeShare}>
              Huỷ
            </Button>
            <Button radius={4} onClick={closeShare}>
              Gửi
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
