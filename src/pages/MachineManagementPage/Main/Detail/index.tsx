import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Drawer,
  Grid,
  Group,
  Image,
  Modal,
  NumberInput,
  Paper,
  Select,
  Space,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../../components/Table";
import { IconArrowLeft, IconCalendar } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

type MaintenanceRecord = {
  id: string;
  date: string;
  description: string;
  performedBy: string;
  status: "Hoàn thành" | "Đang xử lý" | "Chờ duyệt";
  cost: number;
  parts: string[];
};

type Machine = {
  id: string;
  name: string;
  brand: string;
  model: string;
  modelYear: number;
  type: string;
  plate: string;
  vin: string;
  status: "Đang vận hành" | "Đang bảo trì" | "Ngừng hoạt động";
  fuelType: "Diesel" | "Xăng" | "Điện" | "Khác";
  fuelConsumption: string;
  odoHours: number;
  purchaseDate: string;
  price: number;
  quantity: number;
  warrantyExpiry: string;
  insurancePolicy: string;
  insuranceExpiry: string;
  ownerUnit: string;
  location: string;
  gpsTrackerId: string;
  specs: string;
  manualFile?: string;
  inspectionFile?: string;
  image?: string;
};

const initialMaintenance: MaintenanceRecord[] = [
  { id: "MT001", date: "2023-02-10", description: "Thay nhớt định kỳ", performedBy: "Nguyễn Văn B", status: "Hoàn thành", cost: 1500000, parts: ["Nhớt 5W-30", "Lọc nhớt"] },
  { id: "MT004", date: "2023-08-15", description: "Bảo trì hộp số", performedBy: "Cty Kỹ Thuật A", status: "Hoàn thành", cost: 7800000, parts: ["Dầu hộp số", "Phớt"] },
  { id: "MT008", date: "2024-03-28", description: "Thay lọc dầu", performedBy: "Trần Văn C", status: "Hoàn thành", cost: 900000, parts: ["Lọc dầu"] },
  { id: "MT002", date: "2022-12-05", description: "Kiểm tra động cơ", performedBy: "Lê Thị D", status: "Hoàn thành", cost: 500000, parts: [] },
  { id: "MT009", date: "2023-11-01", description: "Sơn lại vỏ xe", performedBy: "Garage 79", status: "Hoàn thành", cost: 3500000, parts: ["Sơn phủ", "Giấy nhám"] },
  { id: "MT010", date: "2024-05-10", description: "Thay bố thắng trước", performedBy: "Garage 79", status: "Hoàn thành", cost: 2200000, parts: ["Bố thắng"] },
  { id: "MT011", date: "2024-06-02", description: "Cân chỉnh góc lái", performedBy: "Trung tâm AutoPro", status: "Hoàn thành", cost: 650000, parts: [] },
  { id: "MT012", date: "2024-07-18", description: "Thay lốp sau bên trái", performedBy: "Lốp Hưng Thịnh", status: "Hoàn thành", cost: 3200000, parts: ["Lốp 8.25R16"] },
  { id: "MT013", date: "2024-08-05", description: "Bảo dưỡng hệ thống phanh", performedBy: "Cty Kỹ Thuật A", status: "Đang xử lý", cost: 0, parts: [] },
  { id: "MT014", date: "2024-09-12", description: "Kiểm tra điện ắc quy", performedBy: "Nguyễn Văn B", status: "Chờ duyệt", cost: 0, parts: [] },
  { id: "MT015", date: "2024-10-22", description: "Thay lọc gió", performedBy: "Garage 79", status: "Hoàn thành", cost: 450000, parts: ["Lọc gió"] },
  { id: "MT016", date: "2025-01-08", description: "Thay nước làm mát", performedBy: "Trung tâm AutoPro", status: "Hoàn thành", cost: 800000, parts: ["Nước làm mát"] },
  { id: "MT017", date: "2025-03-01", description: "Bảo dưỡng tổng thể quý I", performedBy: "Cty Kỹ Thuật A", status: "Hoàn thành", cost: 5200000, parts: ["Nhớt", "Lọc nhớt", "Lọc nhiên liệu"] },
  { id: "MT018", date: "2025-05-20", description: "Thay bộ giảm xóc sau", performedBy: "Garage 79", status: "Hoàn thành", cost: 4100000, parts: ["Giảm xóc"] },
  { id: "MT019", date: "2025-08-12", description: "Sửa chữa hệ thống đèn", performedBy: "Nguyễn Văn B", status: "Đang xử lý", cost: 0, parts: ["Bóng đèn", "Cầu chì"] },
];

const machineInit: Machine = {
  id: "MC001",
  name: "Xe tải Hino 5 tấn",
  brand: "Hino",
  model: "FC9JLTA",
  modelYear: 2022,
  type: "Xe tải",
  plate: "51D-678.99",
  vin: "HIN0FC9JLTA2022XYZ",
  status: "Đang vận hành",
  fuelType: "Diesel",
  fuelConsumption: "12L/100km",
  odoHours: 3420,
  purchaseDate: "2022-08-10",
  price: 780000000,
  quantity: 2,
  warrantyExpiry: "2025-08-10",
  insurancePolicy: "MIC-PL-2024-9981",
  insuranceExpiry: "2026-01-15",
  ownerUnit: "Kho vận Trung Tâm",
  location: "Cụm kho Long An",
  gpsTrackerId: "GPS-3G-887120",
  specs: "<ul><li>Động cơ diesel Euro 4</li><li>Tải trọng: 5 tấn</li><li>Hộp số: 6MT</li><li>ABS, hỗ trợ đổ đèo</li></ul>",
  manualFile: "https://pdfobject.com/pdf/sample.pdf",
  inspectionFile: "https://pdfobject.com/pdf/sample.pdf",
  image: "https://bizweb.dktcdn.net/100/021/583/products/xe-tai-hino-5-tan-xzu.jpg?v=1550043249650",
};

const usageSeries = [
  { month: "09/24", distance: 2100, hours: 127 },
  { month: "10/24", distance: 2380, hours: 141 },
  { month: "11/24", distance: 2310, hours: 136 },
  { month: "12/24", distance: 2590, hours: 149 },
  { month: "01/25", distance: 2420, hours: 132 },
  { month: "02/25", distance: 2280, hours: 124 },
  { month: "03/25", distance: 2715, hours: 151 },
  { month: "04/25", distance: 2640, hours: 147 },
  { month: "05/25", distance: 2760, hours: 154 },
  { month: "06/25", distance: 2520, hours: 140 },
  { month: "07/25", distance: 2690, hours: 148 },
  { month: "08/25", distance: 2610, hours: 145 },
];

const statusBadgeColor = (s: Machine["status"]) => (s === "Đang vận hành" ? "green" : s === "Đang bảo trì" ? "orange" : "gray");
const recStatusColor = (s: MaintenanceRecord["status"]) => (s === "Hoàn thành" ? "green" : s === "Đang xử lý" ? "orange" : "gray");
const fmtCurrency = (v: number) => v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
const fmtDate = (d: string | Date) => dayjs(d).format("DD/MM/YYYY");

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Grid>
    <Grid.Col span={5}><Text c="dimmed" size="sm">{label}</Text></Grid.Col>
    <Grid.Col span={7}><Text fw={600}>{value}</Text></Grid.Col>
  </Grid>
);

const MachineManagementMainDetailPage = () => {
  const navigate = useNavigate();
  const [machine, setMachine] = useState<Machine>(machineInit);
  const [records, setRecords] = useState<MaintenanceRecord[]>(initialMaintenance);
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const [openedEdit, setOpenedEdit] = useState(false);
  const [editDraft, setEditDraft] = useState<Machine>(machineInit);

  const [openedDrawer, setOpenedDrawer] = useState(false);
  const [currentRec, setCurrentRec] = useState<MaintenanceRecord | null>(null);

  const [openedAdd, setOpenedAdd] = useState(false);
  const [newRec, setNewRec] = useState<MaintenanceRecord>({
    id: `MT${Math.floor(100 + Math.random() * 900)}`,
    date: dayjs().format("YYYY-MM-DD"),
    description: "",
    performedBy: "",
    status: "Chờ duyệt",
    cost: 0,
    parts: [],
  });

  const lastCompleted = useMemo(
    () => [...records].filter((r) => r.status === "Hoàn thành").sort((a, b) => (a.date < b.date ? 1 : -1))[0],
    [records]
  );
  const nextMaintenance = useMemo(() => (lastCompleted ? dayjs(lastCompleted.date).add(90, "day").format("DD/MM/YYYY") : "—"), [lastCompleted]);

  const filteredRecords = useMemo(() => {
    let list = [...records];
    if (range[0] && range[1]) {
      const s = dayjs(range[0]).startOf("day");
      const e = dayjs(range[1]).endOf("day");
      list = list.filter((r) => 
        //@ts-expect-error no check
        dayjs(r.date).isBetween(s, e, "day", "[]"));
    }
    if (statusFilter) list = list.filter((r) => r.status === statusFilter);
    return list.sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [records, range, statusFilter]);

  const costByMonth = useMemo(() => {
    const map = new Map<string, number>();
    filteredRecords.forEach((r) => {
      const k = dayjs(r.date).format("MM/YY");
      map.set(k, (map.get(k) || 0) + (r.cost || 0));
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => (dayjs(a, "MM/YY").isAfter(dayjs(b, "MM/YY")) ? 1 : -1))
      .map(([month, cost]) => ({ month, cost }));
  }, [filteredRecords]);

  const kpis = useMemo(() => {
    const total = records.length;
    const done = records.filter((r) => r.status === "Hoàn thành").length;
    const doing = records.filter((r) => r.status === "Đang xử lý").length;
    const waiting = records.filter((r) => r.status === "Chờ duyệt").length;
    const totalCost = records.reduce((s, r) => s + (r.cost || 0), 0);
    const bookYears = 7;
    const age = Math.max(0, dayjs().diff(dayjs(machine.purchaseDate), "year"));
    const depreciated = Math.min(bookYears, age) / bookYears;
    const bookValue = Math.max(0, Math.round(machine.price * (1 - depreciated)));
    return { total, done, doing, waiting, totalCost, bookValue };
  }, [records, machine]);

  const maintenanceColumns: MRT_ColumnDef<MaintenanceRecord>[] = [
    { accessorKey: "id", header: "Mã bảo trì" },
    {
      accessorKey: "date",
      header: "Ngày",
      Cell: ({ row }) => fmtDate(row.original.date),
    },
    { accessorKey: "description", header: "Nội dung" },
    {
      accessorKey: "status",
      header: "Trạng thái",
      Cell: ({ row }) => <Badge color={recStatusColor(row.original.status)}>{row.original.status}</Badge>,
    },
    {
      accessorKey: "cost",
      header: "Chi phí",
      Cell: ({ row }) => <Text>{fmtCurrency(row.original.cost)}</Text>,
    },
    { accessorKey: "performedBy", header: "Thực hiện bởi" },
  ];

  return (
    <>
      <Card radius={4} shadow="md" p="xl" withBorder>
        <Stack gap="lg">
          <Group justify="space-between">
            <Group>
              <Button variant="light" radius={4} leftSection={<IconArrowLeft size={18} />} onClick={() => navigate(-1)}>
                Quay lại
              </Button>
              <Title order={3} fw={800}>Chi tiết máy móc</Title>
            </Group>
            <Group>
              <Button radius={4} variant="default" onClick={() => setOpenedEdit(true)}>Chỉnh sửa máy</Button>
              <Button radius={4}onClick={() => setOpenedAdd(true)}>Thêm bảo trì</Button>
            </Group>
          </Group>

          <Grid align="stretch">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Card withBorder radius={4} p="md">
                <Grid align="center">
                  <Grid.Col span={{ base: 12, md: 5 }}>
                    <Image src={machine.image} radius={4} alt={machine.name} h={190} fit="cover" />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 7 }}>
                    <Title order={4}>{machine.name}</Title>
                    <Space h={6} />
                    <Grid>
                      <Grid.Col span={6}><Text c="dimmed" size="sm">Mã máy</Text><Text fw={600}>{machine.id}</Text></Grid.Col>
                      <Grid.Col span={6}><Text c="dimmed" size="sm">Loại</Text><Text fw={600}>{machine.type}</Text></Grid.Col>
                      <Grid.Col span={6}><Text c="dimmed" size="sm">Nhãn hiệu</Text><Text fw={600}>{machine.brand}</Text></Grid.Col>
                      <Grid.Col span={6}><Text c="dimmed" size="sm">Model</Text><Text fw={600}>{machine.model}</Text></Grid.Col>
                      <Grid.Col span={6}><Text c="dimmed" size="sm">Năm SX</Text><Text fw={600}>{machine.modelYear}</Text></Grid.Col>
                      <Grid.Col span={6}><Text c="dimmed" size="sm">Trạng thái</Text><Badge color={statusBadgeColor(machine.status)} variant="light">{machine.status}</Badge></Grid.Col>
                    </Grid>
                  </Grid.Col>
                </Grid>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 5 }}>
              <Grid>
                <Grid.Col span={6}>
                  <Paper withBorder radius={4} p="sm" ta="center">
                    <Text c="dimmed" size="sm">Tổng bảo trì</Text>
                    <Title order={3}>{kpis.total}</Title>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Paper withBorder radius={4} p="sm" ta="center">
                    <Text c="dimmed" size="sm">Hoàn thành</Text>
                    <Title order={3} c="green">{kpis.done}</Title>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Paper withBorder radius={4} p="sm" ta="center">
                    <Text c="dimmed" size="sm">Đang xử lý</Text>
                    <Title order={3} c="orange">{kpis.doing}</Title>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Paper withBorder radius={4} p="sm" ta="center">
                    <Text c="dimmed" size="sm">Chờ duyệt</Text>
                    <Title order={3} c="gray">{kpis.waiting}</Title>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Paper withBorder radius={4} p="sm" ta="center">
                    <Text c="dimmed" size="sm">Tổng chi phí bảo trì</Text>
                    <Title order={3}>{fmtCurrency(kpis.totalCost)}</Title>
                  </Paper>
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>

          <Tabs defaultValue="overview" keepMounted={false}>
            <Tabs.List>
              <Tabs.Tab value="overview">Tổng quan</Tabs.Tab>
              <Tabs.Tab value="documents">Tài liệu</Tabs.Tab>
              <Tabs.Tab value="analytics">Phân tích</Tabs.Tab>
              <Tabs.Tab value="maintenance">Bảo trì</Tabs.Tab>
              <Tabs.Tab value="asset">Tài sản</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="overview" pt="md">
              <Grid align="stretch">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder radius={4} p="md">
                    <Title order={5}>Thông số & cấu hình</Title>
                    <Divider my="xs" />
                    <Paper withBorder p="md" radius={4} bg="gray.0">
                      <Box style={{ fontSize: 14 }} dangerouslySetInnerHTML={{ __html: machine.specs }} />
                    </Paper>
                    <Space h="xs" />
                    <Grid>
                      <Grid.Col span={6}><Text c="dimmed" size="sm">Biển số</Text><Text fw={600}>{machine.plate}</Text></Grid.Col>
                      <Grid.Col span={6}><Text c="dimmed" size="sm">Số khung</Text><Text fw={600}>{machine.vin}</Text></Grid.Col>
                      <Grid.Col span={6}><Text c="dimmed" size="sm">Nhiên liệu</Text><Text fw={600}>{machine.fuelType}</Text></Grid.Col>
                      <Grid.Col span={6}><Text c="dimmed" size="sm">Mức tiêu hao</Text><Text fw={600}>{machine.fuelConsumption}</Text></Grid.Col>
                      <Grid.Col span={6}><Text c="dimmed" size="sm">Giờ vận hành</Text><Text fw={600}>{machine.odoHours} h</Text></Grid.Col>
                      <Grid.Col span={6}><Text c="dimmed" size="sm">Số lượng</Text><Text fw={600}>{machine.quantity}</Text></Grid.Col>
                    </Grid>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder radius={4} p="md">
                    <Title order={5}>Bảo hành & Bảo hiểm</Title>
                    <Divider my="xs" />
                    <InfoRow label="Ngày mua" value={fmtDate(machine.purchaseDate)} />
                    <InfoRow label="Giá mua" value={fmtCurrency(machine.price)} />
                    <InfoRow label="Hạn bảo hành" value={fmtDate(machine.warrantyExpiry)} />
                    <InfoRow label="Hợp đồng bảo hiểm" value={machine.insurancePolicy} />
                    <InfoRow label="Hạn bảo hiểm" value={fmtDate(machine.insuranceExpiry)} />
                    <Divider my="xs" />
                    <InfoRow label="Giá trị sổ sách (ước tính)" value={fmtCurrency(kpis.bookValue)} />
                    <Divider my="xs" />
                    <InfoRow label="Đơn vị quản lý" value={machine.ownerUnit} />
                    <InfoRow label="Vị trí hiện tại" value={machine.location} />
                    <InfoRow label="Thiết bị GPS" value={machine.gpsTrackerId} />
                    <Divider my="xs" />
                    <InfoRow label="Bảo trì gần nhất" value={lastCompleted ? fmtDate(lastCompleted.date) : "—"} />
                    <InfoRow label="Bảo trì kế tiếp (ước tính)" value={nextMaintenance} />
                  </Card>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            <Tabs.Panel value="documents" pt="md">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder radius={4} p="md">
                    <Title order={5}>Sổ tay hướng dẫn</Title>
                    <Divider my="xs" />
                    <Paper withBorder radius={4} p="sm" bg="gray.0">
                      <iframe src={machine.manualFile} height="420" width="100%" style={{ border: "none", borderRadius: 6 }} title="manual-pdf" />
                    </Paper>
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder radius={4} p="md">
                    <Title order={5}>Biên bản đăng kiểm</Title>
                    <Divider my="xs" />
                    <Paper withBorder radius={4} p="sm" bg="gray.0">
                      <iframe src={machine.inspectionFile} height="420" width="100%" style={{ border: "none", borderRadius: 6 }} title="inspection-pdf" />
                    </Paper>
                  </Card>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            <Tabs.Panel value="analytics" pt="md">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder radius={4} p="md">
                    <Title order={5}>Quãng đường theo tháng</Title>
                    <Divider my="xs" />
                    <Box h={260}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={usageSeries}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ReTooltip />
                          <Bar dataKey="distance" fill="#228be6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder radius={4} p="md">
                    <Title order={5}>Giờ vận hành theo tháng</Title>
                    <Divider my="xs" />
                    <Box h={260}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={usageSeries}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ReTooltip />
                          <Line type="monotone" dataKey="hours" stroke="#12b886" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </Card>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Card withBorder radius={4} p="md">
                    <Title order={5}>Chi phí bảo trì theo tháng</Title>
                    <Divider my="xs" />
                    <Box h={260}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={costByMonth}>
                          <defs>
                            <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#fa5252" stopOpacity={0.6} />
                              <stop offset="95%" stopColor="#fa5252" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ReTooltip formatter={(v: number) => fmtCurrency(v)} />
                          <Area type="monotone" dataKey="cost" stroke="#fa5252" fill="url(#costGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </Card>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            <Tabs.Panel value="maintenance" pt="md">
              <Grid align="end" mb={'md'}>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <DatePickerInput type="range" label="Khoảng ngày" placeholder="Chọn khoảng thời gian" value={range} radius={4} leftSection={<IconCalendar size={16} />} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <Select label="Trạng thái" placeholder="Tất cả" data={["Hoàn thành", "Đang xử lý", "Chờ duyệt"]} value={statusFilter} onChange={setStatusFilter} clearable radius={4} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Group justify="flex-end">
                    <Button variant="default" radius={4} onClick={() => { setRange([null, null]); setStatusFilter(null); }}>Làm mới</Button>
                  </Group>
                </Grid.Col>
              </Grid>

              <Table
                columns={[
                  ...maintenanceColumns,
                  {
                    id: "action",
                    header: "Xem",
                    Cell: ({ row }) => (
                      <Tooltip label="Xem chi tiết">
                        <Button
                          size="xs"
                          radius={4}
                          variant="default"
                          onClick={() => { setCurrentRec(row.original); setOpenedDrawer(true); }}
                        >
                          Mở
                        </Button>
                      </Tooltip>
                    ),
                  },
                ]}
                data={filteredRecords}
              />
            </Tabs.Panel>

            <Tabs.Panel value="asset" pt="md">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder radius={4} p="md">
                    <Title order={5}>Thông tin tài sản</Title>
                    <Divider my="xs" />
                    <InfoRow label="Ngày mua" value={fmtDate(machine.purchaseDate)} />
                    <InfoRow label="Giá mua" value={fmtCurrency(machine.price)} />
                    <InfoRow label="Giá trị sổ sách" value={fmtCurrency(kpis.bookValue)} />
                    <InfoRow label="Đơn vị quản lý" value={machine.ownerUnit} />
                    <InfoRow label="Vị trí" value={machine.location} />
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder radius={4} p="md">
                    <Title order={5}>Tuân thủ & nhãn</Title>
                    <Divider my="xs" />
                    <Group>
                      <Badge color="green" variant="light">Đăng kiểm còn hạn</Badge>
                      <Badge color="green" variant="light">Bảo hiểm còn hạn</Badge>
                      <Badge color="blue" variant="light">GPS Online</Badge>
                    </Group>
                  </Card>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Card>

      <Modal opened={openedEdit} onClose={() => setOpenedEdit(false)} title="Chỉnh sửa máy" radius={4} centered>
        <Stack>
          <TextInput label="Tên máy" value={editDraft.name} onChange={(e) => setEditDraft({ ...editDraft, name: e.currentTarget.value })} />
          <Grid>
            <Grid.Col span={6}><TextInput label="Nhãn hiệu" value={editDraft.brand} onChange={(e) => setEditDraft({ ...editDraft, brand: e.currentTarget.value })} /></Grid.Col>
            <Grid.Col span={6}><TextInput label="Model" value={editDraft.model} onChange={(e) => setEditDraft({ ...editDraft, model: e.currentTarget.value })} /></Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={6}><NumberInput label="Năm SX" value={editDraft.modelYear} onChange={(v) => setEditDraft({ ...editDraft, modelYear: Number(v) || editDraft.modelYear })} /></Grid.Col>
            <Grid.Col span={6}><Select label="Trạng thái" data={["Đang vận hành", "Đang bảo trì", "Ngừng hoạt động"]} value={editDraft.status} onChange={(v) => v && setEditDraft({ ...editDraft, status: v as Machine["status"] })} /></Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={6}><TextInput label="Biển số" value={editDraft.plate} onChange={(e) => setEditDraft({ ...editDraft, plate: e.currentTarget.value })} /></Grid.Col>
            <Grid.Col span={6}><TextInput label="Số khung" value={editDraft.vin} onChange={(e) => setEditDraft({ ...editDraft, vin: e.currentTarget.value })} /></Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={6}><Select label="Nhiên liệu" data={["Diesel", "Xăng", "Điện", "Khác"]} value={editDraft.fuelType} onChange={(v) => v && setEditDraft({ ...editDraft, fuelType: v as Machine["fuelType"] })} /></Grid.Col>
            <Grid.Col span={6}><TextInput label="Mức tiêu hao" value={editDraft.fuelConsumption} onChange={(e) => setEditDraft({ ...editDraft, fuelConsumption: e.currentTarget.value })} /></Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={6}><NumberInput label="Giờ vận hành" value={editDraft.odoHours} onChange={(v) => setEditDraft({ ...editDraft, odoHours: Number(v) || 0 })} /></Grid.Col>
            <Grid.Col span={6}><NumberInput label="Giá" value={editDraft.price} onChange={(v) => setEditDraft({ ...editDraft, price: Number(v) || 0 })} thousandSeparator /></Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={6}><DatePickerInput label="Ngày mua" value={new Date(editDraft.purchaseDate)} onChange={(d) => d && setEditDraft({ ...editDraft, purchaseDate: dayjs(d).format("YYYY-MM-DD") })} /></Grid.Col>
            <Grid.Col span={6}><NumberInput label="Số lượng" value={editDraft.quantity} onChange={(v) => setEditDraft({ ...editDraft, quantity: Number(v) || 0 })} /></Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={6}><TextInput label="Đơn vị quản lý" value={editDraft.ownerUnit} onChange={(e) => setEditDraft({ ...editDraft, ownerUnit: e.currentTarget.value })} /></Grid.Col>
            <Grid.Col span={6}><TextInput label="Vị trí" value={editDraft.location} onChange={(e) => setEditDraft({ ...editDraft, location: e.currentTarget.value })} /></Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={6}><TextInput label="HĐ Bảo hiểm" value={editDraft.insurancePolicy} onChange={(e) => setEditDraft({ ...editDraft, insurancePolicy: e.currentTarget.value })} /></Grid.Col>
            <Grid.Col span={6}><DatePickerInput label="Hạn bảo hiểm" value={new Date(editDraft.insuranceExpiry)} onChange={(d) => d && setEditDraft({ ...editDraft, insuranceExpiry: dayjs(d).format("YYYY-MM-DD") })} /></Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={6}><DatePickerInput label="Hạn bảo hành" value={new Date(editDraft.warrantyExpiry)} onChange={(d) => d && setEditDraft({ ...editDraft, warrantyExpiry: dayjs(d).format("YYYY-MM-DD") })} /></Grid.Col>
            <Grid.Col span={6}><TextInput label="GPS Tracker" value={editDraft.gpsTrackerId} onChange={(e) => setEditDraft({ ...editDraft, gpsTrackerId: e.currentTarget.value })} /></Grid.Col>
          </Grid>
          <Group justify="flex-end" mt="xs">
            <Button variant="default" onClick={() => setOpenedEdit(false)}>Huỷ</Button>
            <Button onClick={() => { setMachine(editDraft); setOpenedEdit(false); }}>Lưu</Button>
          </Group>
        </Stack>
      </Modal>

      <Modal opened={openedAdd} onClose={() => setOpenedAdd(false)} title="Thêm bảo trì" radius={4} centered>
        <Stack>
          <Grid>
            <Grid.Col span={6}><TextInput label="Mã bảo trì" value={newRec.id} onChange={(e) => setNewRec({ ...newRec, id: e.currentTarget.value })} /></Grid.Col>
            <Grid.Col span={6}><DatePickerInput label="Ngày" value={new Date(newRec.date)} onChange={(d) => d && setNewRec({ ...newRec, date: dayjs(d).format("YYYY-MM-DD") })} /></Grid.Col>
          </Grid>
          <TextInput label="Nội dung" value={newRec.description} onChange={(e) => setNewRec({ ...newRec, description: e.currentTarget.value })} />
          <Grid>
            <Grid.Col span={6}><TextInput label="Thực hiện bởi" value={newRec.performedBy} onChange={(e) => setNewRec({ ...newRec, performedBy: e.currentTarget.value })} /></Grid.Col>
            <Grid.Col span={6}><Select label="Trạng thái" data={["Chờ duyệt", "Đang xử lý", "Hoàn thành"]} value={newRec.status} onChange={(v) => v && setNewRec({ ...newRec, status: v as MaintenanceRecord["status"] })} /></Grid.Col>
          </Grid>
          <NumberInput label="Chi phí" value={newRec.cost} onChange={(v) => setNewRec({ ...newRec, cost: Number(v) || 0 })} thousandSeparator />
          <TextInput label="Vật tư (phân tách bằng dấu phẩy)" placeholder="Nhớt, Lọc nhớt" onChange={(e) => setNewRec({ ...newRec, parts: e.currentTarget.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setOpenedAdd(false)}>Huỷ</Button>
            <Button
              onClick={() => {
                setRecords((prev) => [{ ...newRec }, ...prev]);
                setOpenedAdd(false);
                setNewRec({ id: `MT${Math.floor(100 + Math.random() * 900)}`, date: dayjs().format("YYYY-MM-DD"), description: "", performedBy: "", status: "Chờ duyệt", cost: 0, parts: [] });
              }}
            >
              Lưu
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Drawer opened={openedDrawer} onClose={() => setOpenedDrawer(false)} title="Chi tiết bảo trì" position="right" size="lg">
        {currentRec && (
          <Stack>
            <Card withBorder radius={4} p="md">
              <Title order={5}>Thông tin</Title>
              <Divider my="xs" />
              <InfoRow label="Mã" value={currentRec.id} />
              <InfoRow label="Ngày" value={fmtDate(currentRec.date)} />
              <InfoRow label="Trạng thái" value={<Badge color={recStatusColor(currentRec.status)}>{currentRec.status}</Badge>} />
              <InfoRow label="Chi phí" value={fmtCurrency(currentRec.cost)} />
              <InfoRow label="Thực hiện bởi" value={currentRec.performedBy} />
            </Card>
            <Card withBorder radius={4} p="md">
              <Title order={5}>Nội dung</Title>
              <Divider my="xs" />
              <Text>{currentRec.description || "—"}</Text>
            </Card>
            <Card withBorder radius={4} p="md">
              <Title order={5}>Vật tư đã thay</Title>
              <Divider my="xs" />
              <Grid>
                {(currentRec.parts.length ? currentRec.parts : ["—"]).map((p, i) => (
                  <Grid.Col key={i} span={6}><Badge variant="light">{p}</Badge></Grid.Col>
                ))}
              </Grid>
            </Card>
            <Group justify="space-between">
              <Button
                variant="default"
                onClick={() => {
                  setRecords((prev) => prev.map((r) => (r.id === currentRec.id ? { ...r, status: "Hoàn thành", cost: r.cost || 0 } : r)));
                }}
              >
                Đánh dấu hoàn thành
              </Button>
              <Group>
                <Button
                  variant="default"
                  onClick={() => {
                    setRecords((prev) => prev.filter((r) => r.id !== currentRec.id));
                    setOpenedDrawer(false);
                  }}
                >
                  Xoá
                </Button>
                <Button onClick={() => setOpenedDrawer(false)}>Đóng</Button>
              </Group>
            </Group>
          </Stack>
        )}
      </Drawer>
    </>
  );
};

export default MachineManagementMainDetailPage;
