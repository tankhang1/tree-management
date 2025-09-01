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
  IconPencil,
  IconPlus,
  IconRefresh,
  IconTrash,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isoWeek from "dayjs/plugin/isoWeek";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Cell,
  Legend,
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
dayjs.extend(isoWeek);

type TxType = "Thu" | "Chi";
type Tx = {
  id: string;
  code: string;
  type: TxType;
  amount: number;
  date: string; // ISO
  branch: string;
  category: string;
  method: "Tiền mặt" | "Chuyển khoản";
  counterparty?: string;
  reference?: string;
  note?: string;
};

const BRANCHES = ["Hà Nội", "TP.HCM", "Đà Nẵng"];
const CATEGORIES_THU = ["Bán hàng", "Thu hồi công nợ", "Khác"];
const CATEGORIES_CHI = ["Mua vật tư", "Lương", "Vận chuyển", "Khác"];
const METHODS: Tx["method"][] = ["Tiền mặt", "Chuyển khoản"];

const PIE_COLORS = [
  "#4dabf7",
  "#ff922b",
  "#20c997",
  "#845ef7",
  "#e03131",
  "#12b886",
  "#fab005",
];
const COLORS = {
  income: "#20c997",
  expense: "#ff6b6b",
  net: "#228be6",
  balance: "#845ef7",
};

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
const fmtInt = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(Math.round(n));

const seed: Tx[] = [
  {
    id: "1",
    code: "GD001",
    type: "Thu",
    amount: 5000000,
    date: "2025-03-03",
    branch: "Hà Nội",
    category: "Bán hàng",
    method: "Chuyển khoản",
    counterparty: "KH001",
    reference: "HD-001",
  },
  {
    id: "2",
    code: "GD002",
    type: "Chi",
    amount: 2000000,
    date: "2025-03-04",
    branch: "Hà Nội",
    category: "Mua vật tư",
    method: "Tiền mặt",
    reference: "PNK-01",
  },
  {
    id: "3",
    code: "GD003",
    type: "Thu",
    amount: 3000000,
    date: "2025-03-05",
    branch: "TP.HCM",
    category: "Thu hồi công nợ",
    method: "Chuyển khoản",
    counterparty: "KH003",
  },
  {
    id: "4",
    code: "GD004",
    type: "Chi",
    amount: 3500000,
    date: "2025-03-07",
    branch: "TP.HCM",
    category: "Lương",
    method: "Chuyển khoản",
  },
  {
    id: "5",
    code: "GD005",
    type: "Chi",
    amount: 1200000,
    date: "2025-03-08",
    branch: "Đà Nẵng",
    category: "Vận chuyển",
    method: "Tiền mặt",
  },
  {
    id: "6",
    code: "GD006",
    type: "Thu",
    amount: 8000000,
    date: "2025-03-10",
    branch: "Đà Nẵng",
    category: "Bán hàng",
    method: "Chuyển khoản",
    counterparty: "KH005",
  },
];

const nextCode = (arr: Tx[]) => {
  const nums = arr
    .map((t) => Number(t.code.match(/\d+/)?.[0] ?? "0"))
    .filter((n) => !Number.isNaN(n));
  const n = (nums.length ? Math.max(...nums) : 0) + 1;
  return `GD${String(n).padStart(3, "0")}`;
};

const summarize = (rows: Tx[]) => {
  const income = rows
    .filter((r) => r.type === "Thu")
    .reduce((a, b) => a + b.amount, 0);
  const expense = rows
    .filter((r) => r.type === "Chi")
    .reduce((a, b) => a + b.amount, 0);
  return { income, expense, net: income - expense };
};

const CashFlowReportPage = () => {
  const [rows, setRows] = useState<Tx[]>(seed);
  const [granularity, setGranularity] = useState<"day" | "month">("month");
  const [range, setRange] = useState<[Date | null, Date | null]>([
    dayjs("2025-03-01").toDate(),
    dayjs("2025-03-31").toDate(),
  ]);
  const [branch, setBranch] = useState<string | null>(null);
  const [type, setType] = useState<"" | TxType>("");
  const [method, setMethod] = useState<"" | Tx["method"]>("");
  const [startingBalance, setStartingBalance] = useState<number>(20000000);

  const [editOpen, setEditOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [editing, setEditing] = useState<Tx | null>(null);

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
      const okType = type ? r.type === type : true;
      const okMethod = method ? r.method === method : true;
      return inRange && okBranch && okType && okMethod;
    });
  }, [rows, branch, type, method, periodStart, periodEnd]);

  const totals = useMemo(() => summarize(filtered), [filtered]);
  const endBalance = useMemo(
    () => startingBalance + totals.net,
    [startingBalance, totals.net]
  );

  const timeSeries = useMemo(() => {
    const buckets = new Map<
      string,
      { label: string; thu: number; chi: number }
    >();
    const fmt = granularity === "day" ? "DD/MM" : "MM/YYYY";
    const step = granularity === "day" ? "day" : "month";

    if (periodStart && periodEnd) {
      let cur = periodStart.clone().startOf(step as any);
      while (cur.isBefore(periodEnd) || cur.isSame(periodEnd, step as any)) {
        const key = cur.format(fmt);
        buckets.set(key, { label: key, thu: 0, chi: 0 });
        cur = cur.add(1, step as any);
      }
    }

    filtered.forEach((r) => {
      const key = dayjs(r.date).format(fmt);
      if (!buckets.has(key)) buckets.set(key, { label: key, thu: 0, chi: 0 });
      const cur = buckets.get(key)!;
      if (r.type === "Thu") cur.thu += r.amount;
      else cur.chi += r.amount;
    });

    let running = startingBalance;
    return Array.from(buckets.values()).map((b) => {
      running += b.thu - b.chi;
      return {
        label: b.label,
        Thu: b.thu,
        Chi: b.chi,
        "Số dư": running,
        "Dòng tiền ròng": b.thu - b.chi,
      };
    });
  }, [filtered, granularity, periodStart, periodEnd, startingBalance]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((r) => {
      const k = r.category;
      map.set(k, (map.get(k) ?? 0) + r.amount * (r.type === "Thu" ? 1 : -1));
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const quickSet = (preset: "today" | "week" | "month") => {
    if (preset === "today")
      setRange([
        dayjs().startOf("day").toDate(),
        dayjs().endOf("day").toDate(),
      ]);
    else if (preset === "week")
      setRange([
        dayjs().startOf("week").toDate(),
        dayjs().endOf("week").toDate(),
      ]);
    else
      setRange([
        dayjs().startOf("month").toDate(),
        dayjs().endOf("month").toDate(),
      ]);
  };

  const openCreate = () => {
    setEditing({
      id: crypto.randomUUID(),
      code: nextCode(rows),
      type: "Thu",
      amount: 0,
      date: dayjs().format("YYYY-MM-DD"),
      branch: BRANCHES[0],
      category: CATEGORIES_THU[0],
      method: "Tiền mặt",
    });
    setEditOpen(true);
  };
  const openEdit = (tx: Tx) => {
    setEditing({ ...tx });
    setEditOpen(true);
  };
  const saveEdit = () => {
    if (!editing) return;
    setRows((prev) => {
      const exists = prev.findIndex((p) => p.id === editing.id);
      if (exists >= 0) {
        const clone = [...prev];
        clone[exists] = editing;
        return clone;
      }
      return [editing, ...prev];
    });
    setEditOpen(false);
  };
  const askRemove = (tx: Tx) => {
    setEditing(tx);
    setRemoveOpen(true);
  };
  const confirmRemove = () => {
    if (!editing) return;
    setRows((prev) => prev.filter((p) => p.id !== editing.id));
    setRemoveOpen(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF({ unit: "pt" });
    doc.setFontSize(14);
    doc.text("Báo cáo sổ quỹ", 40, 40);
    doc.setFontSize(10);
    const period =
      periodStart && periodEnd
        ? `${periodStart.format("DD/MM/YYYY")} → ${periodEnd.format(
            "DD/MM/YYYY"
          )}`
        : "—";
    doc.text(`Khoảng thời gian: ${period}`, 40, 58);
    if (branch) doc.text(`Chi nhánh: ${branch}`, 40, 72);
    doc.text(
      `Tổng thu: ${fmtVND(totals.income)}  |  Tổng chi: ${fmtVND(
        totals.expense
      )}  |  Ròng: ${fmtVND(totals.net)}`,
      40,
      86
    );
    autoTable(doc, {
      startY: 104,
      head: [
        [
          "Mã GD",
          "Loại",
          "Số tiền",
          "Ngày",
          "Chi nhánh",
          "Danh mục",
          "PTTT",
          "Đối tác/Tham chiếu",
        ],
      ],
      body: filtered.map((r) => [
        r.code,
        r.type,
        fmtVND(r.amount),
        dayjs(r.date).format("DD/MM/YYYY"),
        r.branch,
        r.category,
        r.method,
        r.counterparty || r.reference || "",
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [35, 118, 196] },
    });
    doc.save("so-quy.pdf");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["Báo cáo sổ quỹ"],
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
        `Tổng thu: ${totals.income}`,
        `Tổng chi: ${totals.expense}`,
        `Ròng: ${totals.net}`,
      ],
      [],
      [
        "Mã GD",
        "Loại",
        "Số tiền (VND)",
        "Ngày",
        "Chi nhánh",
        "Danh mục",
        "PTTT",
        "Đối tác",
        "Tham chiếu",
        "Ghi chú",
      ],
      ...filtered.map((r) => [
        r.code,
        r.type,
        r.amount,
        dayjs(r.date).format("YYYY-MM-DD"),
        r.branch,
        r.category,
        r.method,
        r.counterparty ?? "",
        r.reference ?? "",
        r.note ?? "",
      ]),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CashFlow");
    XLSX.writeFile(wb, "so-quy.xlsx");
  };

  return (
    <Card withBorder radius={4} p="lg">
      <Stack gap="lg">
        <Group justify="space-between">
          <Group>
            <Stack gap={0}>
              <Title order={3}>💰 Quản lý sổ quỹ</Title>
              <Text size="sm" c="dimmed">
                Theo dõi dòng tiền thu/chi, xuất báo cáo PDF/Excel
              </Text>
            </Stack>
          </Group>
          <Group gap="xs">
            <Button
              radius={4}
              variant="light"
              leftSection={<IconRefresh size={16} />}
              onClick={() => {
                setBranch(null);
                setType("");
                setMethod("");
                quickSet("month");
              }}
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
            <Button
              radius={4}
              leftSection={<IconPlus size={16} />}
              onClick={openCreate}
            >
              Thêm giao dịch
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
            <Group gap="xs">
              <Button
                variant="light"
                radius={4}
                onClick={() => quickSet("today")}
              >
                Hôm nay
              </Button>
              <Button
                variant="light"
                radius={4}
                onClick={() => quickSet("week")}
              >
                Tuần này
              </Button>
              <Button
                variant="light"
                radius={4}
                onClick={() => quickSet("month")}
              >
                Tháng này
              </Button>
            </Group>
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
              clearable
              searchable
              w={220}
            />
            <Select
              radius={4}
              label="Loại"
              placeholder="Tất cả"
              data={["Thu", "Chi"]}
              value={type || null}
              onChange={(v) => setType((v as TxType) || "")}
              clearable
              w={160}
            />
            <Select
              radius={4}
              label="PT thanh toán"
              placeholder="Tất cả"
              data={METHODS}
              value={method || null}
              onChange={(v) => setMethod((v as Tx["method"]) || "")}
              clearable
              w={180}
            />
            <NumberInput
              radius={4}
              label="Số dư đầu kỳ (VND)"
              value={startingBalance}
              onChange={(v) => setStartingBalance(Number(v) || 0)}
              step={500000}
              min={0}
              w={220}
            />
          </Group>
        </Card>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
          <Paper withBorder radius={4} p="md">
            <Text size="sm" c="dimmed">
              Tổng thu
            </Text>
            <Title order={3} c="teal">
              {fmtVND(totals.income)}
            </Title>
          </Paper>
          <Paper withBorder radius={4} p="md">
            <Text size="sm" c="dimmed">
              Tổng chi
            </Text>
            <Title order={3} c="red">
              {fmtVND(totals.expense)}
            </Title>
          </Paper>
          <Paper withBorder radius={4} p="md">
            <Text size="sm" c="dimmed">
              Dòng tiền ròng
            </Text>
            <Title order={3} c="blue">
              {fmtVND(totals.net)}
            </Title>
          </Paper>
          <Paper withBorder radius={4} p="md">
            <Text size="sm" c="dimmed">
              Số dư cuối kỳ
            </Text>
            <Title order={3} c="grape">
              {fmtVND(endBalance)}
            </Title>
          </Paper>
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Card withBorder radius={4} p="md">
            <Group justify="space-between" mb="xs">
              <Title order={5}>Diễn biến dòng tiền & số dư</Title>
            </Group>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart
                data={timeSeries}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={COLORS.income}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor={COLORS.income}
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                  <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={COLORS.expense}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor={COLORS.expense}
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                  <linearGradient id="gBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={COLORS.balance}
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="100%"
                      stopColor={COLORS.balance}
                      stopOpacity={0.04}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis tickFormatter={(v) => fmtVND(Number(v))} />
                <RTooltip formatter={(v: any) => fmtVND(Number(v))} />
                <Legend />
                <BarChart data={timeSeries}>
                  <Bar
                    dataKey="Thu"
                    name="Thu"
                    fill="url(#gIncome)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Chi"
                    name="Chi"
                    fill="url(#gExpense)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
                <Area
                  type="monotone"
                  dataKey="Số dư"
                  name="Số dư"
                  stroke={COLORS.balance}
                  fill="url(#gBalance)"
                />
                <Brush dataKey="label" height={18} travellerWidth={8} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card withBorder radius={4} p="md">
            <Group justify="space-between" mb="xs">
              <Title order={5}>Cơ cấu theo danh mục (Thu trừ Chi)</Title>
            </Group>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={byCategory}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {byCategory.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
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
                  Ròng theo mục
                </text>
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </SimpleGrid>

        <Card withBorder radius={4} p="md">
          <Group justify="space-between" mb="xs">
            <Title order={5}>Danh sách giao dịch</Title>
            <Badge variant="light" color="gray">
              {fmtInt(filtered.length)} giao dịch
            </Badge>
          </Group>
          <Divider my="xs" />
          {/* Table component replaces HTML table */}
          <ScrollArea h={420}>
            <Table
              data={filtered}
              columns={[
                {
                  accessorKey: "code",
                  header: "Mã GD",
                  Cell: ({ row }) => (
                    <Badge radius="sm">{row.original.code}</Badge>
                  ),
                },
                {
                  accessorKey: "type",
                  header: "Loại",
                  Cell: ({ row }) => (
                    <Badge
                      color={row.original.type === "Thu" ? "teal" : "red"}
                      variant="light"
                    >
                      {row.original.type}
                    </Badge>
                  ),
                },
                {
                  accessorKey: "amount",
                  header: "Số tiền",
                  Cell: ({ row }) => (
                    <span
                      style={{
                        fontWeight: 600,
                        color:
                          row.original.type === "Thu"
                            ? "var(--mantine-color-teal-7)"
                            : "var(--mantine-color-red-7)",
                      }}
                    >
                      {fmtVND(row.original.amount)}
                    </span>
                  ),
                },
                {
                  accessorKey: "date",
                  header: "Ngày",
                  Cell: ({ row }) =>
                    dayjs(row.original.date).format("DD/MM/YYYY"),
                },
                { accessorKey: "branch", header: "Chi nhánh" },
                { accessorKey: "category", header: "Danh mục" },
                { accessorKey: "method", header: "PTTT" },
                {
                  accessorKey: "counterparty",
                  header: "Đối tác",
                  Cell: ({ row }) => row.original.counterparty || "—",
                },
                {
                  accessorKey: "reference",
                  header: "Tham chiếu",
                  Cell: ({ row }) => row.original.reference || "—",
                },
                {
                  accessorKey: "note",
                  header: "Ghi chú",
                  Cell: ({ row }) => row.original.note || "—",
                },
                {
                  accessorKey: "actions",
                  header: "Hành động",
                  accessorFn: (row) => row,
                  Cell: ({ row }) => (
                    <Group gap={4}>
                      <ActionIcon
                        radius={4}
                        variant="light"
                        onClick={() => openEdit(row.original)}
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                      <ActionIcon
                        radius={4}
                        variant="light"
                        color="red"
                        onClick={() => askRemove(row.original)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  ),
                },
              ]}
            />
          </ScrollArea>
        </Card>
      </Stack>

      <Modal
        opened={editOpen}
        onClose={() => setEditOpen(false)}
        title={
          <Title order={5}>
            {rows.find((x) => x.id === editing?.id)
              ? "Chỉnh sửa giao dịch"
              : "Thêm giao dịch"}
          </Title>
        }
        radius={4}
        centered
      >
        <Stack>
          <Group grow>
            <TextInput
              label="Mã giao dịch"
              value={editing?.code ?? ""}
              onChange={(e) =>
                setEditing((s) =>
                  s ? { ...s, code: e.currentTarget.value } : s
                )
              }
              radius={4}
            />
            <Select
              label="Loại"
              data={["Thu", "Chi"]}
              value={editing?.type ?? null}
              onChange={(v) =>
                setEditing((s) =>
                  s
                    ? {
                        ...s,
                        type: v as TxType,
                        category:
                          v === "Thu" ? CATEGORIES_THU[0] : CATEGORIES_CHI[0],
                      }
                    : s
                )
              }
              radius={4}
            />
          </Group>
          <Group grow>
            <NumberInput
              label="Số tiền (VND)"
              value={editing?.amount ?? 0}
              onChange={(v) =>
                setEditing((s) => (s ? { ...s, amount: Number(v) || 0 } : s))
              }
              thousandSeparator="."
              min={0}
              step={100000}
              radius={4}
            />
            <DatePickerInput
              label="Ngày"
              value={editing ? new Date(editing.date) : null}
              onChange={(d) =>
                setEditing((s) =>
                  s
                    ? {
                        ...s,
                        date: dayjs(d ?? new Date()).format("YYYY-MM-DD"),
                      }
                    : s
                )
              }
              radius={4}
            />
          </Group>
          <Group grow>
            <Select
              label="Chi nhánh"
              data={BRANCHES}
              value={editing?.branch ?? null}
              onChange={(v) =>
                setEditing((s) => (s ? { ...s, branch: v || BRANCHES[0] } : s))
              }
              searchable
              radius={4}
            />
            <Select
              label="Danh mục"
              data={editing?.type === "Chi" ? CATEGORIES_CHI : CATEGORIES_THU}
              value={editing?.category ?? null}
              onChange={(v) =>
                setEditing((s) => (s ? { ...s, category: v || "" } : s))
              }
              searchable
              radius={4}
            />
          </Group>
          <Group grow>
            <Select
              label="Phương thức"
              data={METHODS}
              value={editing?.method ?? null}
              onChange={(v) =>
                setEditing((s) =>
                  s ? { ...s, method: (v as Tx["method"]) || "Tiền mặt" } : s
                )
              }
              radius={4}
            />
            <TextInput
              label="Đối tác"
              value={editing?.counterparty ?? ""}
              onChange={(e) =>
                setEditing((s) =>
                  s ? { ...s, counterparty: e.currentTarget.value } : s
                )
              }
              radius={4}
            />
          </Group>
          <Group grow>
            <TextInput
              label="Tham chiếu"
              value={editing?.reference ?? ""}
              onChange={(e) =>
                setEditing((s) =>
                  s ? { ...s, reference: e.currentTarget.value } : s
                )
              }
              radius={4}
            />
            <TextInput
              label="Ghi chú"
              value={editing?.note ?? ""}
              onChange={(e) =>
                setEditing((s) =>
                  s ? { ...s, note: e.currentTarget.value } : s
                )
              }
              radius={4}
            />
          </Group>
          <Group justify="flex-end" mt="xs">
            <Button
              variant="default"
              radius={4}
              onClick={() => setEditOpen(false)}
            >
              Huỷ
            </Button>
            <Button
              radius={4}
              leftSection={<IconDownload size={16} />}
              onClick={saveEdit}
            >
              Lưu
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={removeOpen}
        onClose={() => setRemoveOpen(false)}
        title={<Title order={5}>Xác nhận xoá</Title>}
        radius={4}
        centered
      >
        <Stack>
          <Text>
            Bạn có chắc muốn xoá giao dịch <b>{editing?.code}</b>?
          </Text>
          <Group justify="flex-end">
            <Button
              variant="default"
              radius={4}
              onClick={() => setRemoveOpen(false)}
            >
              Huỷ
            </Button>
            <Button
              radius={4}
              color="red"
              leftSection={<IconTrash size={16} />}
              onClick={confirmRemove}
            >
              Xoá
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Card>
  );
};

export default CashFlowReportPage;
