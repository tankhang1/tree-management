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
  LoadingOverlay,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../../components/Table";
import { IconArrowLeft, IconCalendar } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom"; // Thêm useParams
import { useMemo, useState, useEffect } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween"; // Import plugin
import { notifications } from "@mantine/notifications";
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
import {
  useMachineStore,
  type Machine,
  type MaintenanceRecord,
} from "../../../zustand/machineStore";

dayjs.extend(isBetween);

// Data tĩnh cho biểu đồ (Vì store chưa có dữ liệu telemetry theo thời gian thực)
const usageSeries = [
  { month: "09/24", distance: 2100, hours: 127 },
  { month: "10/24", distance: 2380, hours: 141 },
  { month: "11/24", distance: 2310, hours: 136 },
  { month: "12/24", distance: 2590, hours: 149 },
  { month: "01/25", distance: 2420, hours: 132 },
  { month: "02/25", distance: 2280, hours: 124 },
  { month: "03/25", distance: 2715, hours: 151 },
  { month: "04/25", distance: 2640, hours: 147 },
];

const statusBadgeColor = (s: string) =>
  s === "Đang vận hành" ? "green" : s === "Đang bảo trì" ? "orange" : "gray";
const recStatusColor = (s: string) =>
  s === "Hoàn thành" ? "green" : s === "Đang xử lý" ? "orange" : "gray";
const fmtCurrency = (v: number) =>
  (v || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
const fmtDate = (d: string | undefined) =>
  d ? dayjs(d).format("DD/MM/YYYY") : "—";

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <Grid>
    <Grid.Col span={5}>
      <Text c="dimmed" size="sm">
        {label}
      </Text>
    </Grid.Col>
    <Grid.Col span={7}>
      <Text fw={600}>{value}</Text>
    </Grid.Col>
  </Grid>
);

const MachineManagementMainDetailPage = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();

  // 1. KẾT NỐI STORE
  const { getMachineById, updateMachine, isLoading } = useMachineStore();

  const [machine, setMachine] = useState<Machine | null>(null);
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Modal States
  const [openedEdit, setOpenedEdit] = useState(false);
  const [editDraft, setEditDraft] = useState<Machine | null>(null);

  const [openedDrawer, setOpenedDrawer] = useState(false);
  const [currentRec, setCurrentRec] = useState<MaintenanceRecord | null>(null);

  const [openedAdd, setOpenedAdd] = useState(false);
  const [newRec, setNewRec] = useState<MaintenanceRecord>({
    id: `MT${Math.floor(1000 + Math.random() * 9000)}`,
    date: dayjs().format("YYYY-MM-DD"),
    description: "",
    performedBy: "",
    status: "Chờ duyệt",
    cost: 0,
    parts: [],
  });

  // 2. LOAD DATA
  useEffect(() => {
    if (id) {
      const data = getMachineById(id);
      if (data) {
        setMachine(data);
        setEditDraft(data);
      }
    }
  }, [id, getMachineById]); // Thêm dependencies để re-run khi store thay đổi (nếu cần)

  // Memoized Data from Machine
  const records = useMemo(() => machine?.maintenanceRecords || [], [machine]);

  const lastCompleted = useMemo(
    () =>
      [...records]
        .filter((r) => r.status === "Hoàn thành")
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .pop(),
    [records]
  );

  const nextMaintenance = useMemo(
    () =>
      lastCompleted
        ? dayjs(lastCompleted.date).add(90, "day").format("DD/MM/YYYY")
        : "—",
    [lastCompleted]
  );

  const filteredRecords = useMemo(() => {
    let list = [...records];
    if (range[0] && range[1]) {
      const s = dayjs(range[0]).startOf("day");
      const e = dayjs(range[1]).endOf("day");
      list = list.filter((r) => dayjs(r.date).isBetween(s, e, "day", "[]"));
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
      .sort(([a], [b]) =>
        dayjs(a, "MM/YY").isAfter(dayjs(b, "MM/YY")) ? 1 : -1
      )
      .map(([month, cost]) => ({ month, cost }));
  }, [filteredRecords]);

  const kpis = useMemo(() => {
    if (!machine)
      return {
        total: 0,
        done: 0,
        doing: 0,
        waiting: 0,
        totalCost: 0,
        bookValue: 0,
      };
    const total = records.length;
    const done = records.filter((r) => r.status === "Hoàn thành").length;
    const doing = records.filter((r) => r.status === "Đang xử lý").length;
    const waiting = records.filter((r) => r.status === "Chờ duyệt").length;
    const totalCost = records.reduce((s, r) => s + (r.cost || 0), 0);
    const bookYears = 10;
    const age = Math.max(
      0,
      dayjs().diff(dayjs(machine.purchaseDate || new Date()), "year")
    );
    const depreciated = Math.min(bookYears, age) / bookYears;
    const bookValue = Math.max(
      0,
      Math.round((machine.price || 0) * (1 - depreciated))
    );
    return { total, done, doing, waiting, totalCost, bookValue };
  }, [records, machine]);

  // --- HANDLERS ---

  const handleSaveMachine = async () => {
    if (!editDraft || !machine) return;
    const success = await updateMachine(machine.id, editDraft);
    if (success) {
      setMachine(editDraft);
      setOpenedEdit(false);
      notifications.show({
        title: "Cập nhật thành công",
        color: "green",
        message: "",
      });
    }
  };

  const handleSaveMaintenance = async () => {
    if (!machine) return;
    const updatedRecords = [newRec, ...records];
    const success = await updateMachine(machine.id, {
      maintenanceRecords: updatedRecords,
    });

    if (success) {
      setMachine({ ...machine, maintenanceRecords: updatedRecords });
      setOpenedAdd(false);
      // Reset form
      setNewRec({
        id: `MT${Math.floor(1000 + Math.random() * 9000)}`,
        date: dayjs().format("YYYY-MM-DD"),
        description: "",
        performedBy: "",
        status: "Chờ duyệt",
        cost: 0,
        parts: [],
      });
      notifications.show({
        title: "Đã thêm phiếu bảo trì",
        color: "green",
        message: "",
      });
    }
  };

  const handleUpdateRecordStatus = async (
    status: MaintenanceRecord["status"]
  ) => {
    if (!machine || !currentRec) return;
    const updatedRecords = records.map((r) =>
      r.id === currentRec.id ? { ...r, status } : r
    );
    await updateMachine(machine.id, { maintenanceRecords: updatedRecords });
    setMachine({ ...machine, maintenanceRecords: updatedRecords });
    setOpenedDrawer(false);
    notifications.show({
      title: "Đã cập nhật trạng thái",
      color: "blue",
      message: "",
    });
  };

  const handleDeleteRecord = async () => {
    if (!machine || !currentRec) return;
    if (!confirm("Xác nhận xóa phiếu bảo trì này?")) return;

    const updatedRecords = records.filter((r) => r.id !== currentRec.id);
    await updateMachine(machine.id, { maintenanceRecords: updatedRecords });
    setMachine({ ...machine, maintenanceRecords: updatedRecords });
    setOpenedDrawer(false);
    notifications.show({
      title: "Đã xóa phiếu bảo trì",
      color: "gray",
      message: "",
    });
  };

  if (!machine || !editDraft)
    return <Text p="xl">Không tìm thấy dữ liệu máy móc...</Text>;

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
      Cell: ({ row }) => (
        <Badge color={recStatusColor(row.original.status)}>
          {row.original.status}
        </Badge>
      ),
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
      <Card radius={4} shadow="md" p="xl" withBorder pos="relative">
        <LoadingOverlay visible={isLoading} />
        <Stack gap="lg">
          <Group justify="space-between">
            <Group>
              <Button
                variant="light"
                radius={4}
                leftSection={<IconArrowLeft size={18} />}
                onClick={() => navigate(-1)}
              >
                Quay lại
              </Button>
              <Title order={3} fw={800}>
                Chi tiết máy móc
              </Title>
            </Group>
            <Group>
              <Button
                radius={4}
                variant="default"
                onClick={() => setOpenedEdit(true)}
              >
                Chỉnh sửa máy
              </Button>
              <Button radius={4} onClick={() => setOpenedAdd(true)}>
                Thêm bảo trì
              </Button>
            </Group>
          </Group>

          <Grid align="stretch">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Card withBorder radius={4} p="md">
                <Grid align="center">
                  <Grid.Col span={{ base: 12, md: 5 }}>
                    <Image
                      src={
                        machine.image ||
                        "https://placehold.co/400x300?text=No+Image"
                      }
                      radius={4}
                      alt={machine.name}
                      h={190}
                      fit="cover"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 7 }}>
                    <Title order={4}>{machine.name}</Title>
                    <Space h={6} />
                    <Grid>
                      <Grid.Col span={6}>
                        <Text c="dimmed" size="sm">
                          Mã máy
                        </Text>
                        <Text fw={600}>{machine.id}</Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text c="dimmed" size="sm">
                          Loại
                        </Text>
                        <Text fw={600}>{machine.type}</Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text c="dimmed" size="sm">
                          Nhãn hiệu
                        </Text>
                        <Text fw={600}>{machine.brand || "—"}</Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text c="dimmed" size="sm">
                          Model
                        </Text>
                        <Text fw={600}>{machine.model || "—"}</Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text c="dimmed" size="sm">
                          Năm SX
                        </Text>
                        <Text fw={600}>{machine.modelYear || "—"}</Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text c="dimmed" size="sm">
                          Trạng thái
                        </Text>
                        <Badge
                          color={statusBadgeColor(machine.status)}
                          variant="light"
                        >
                          {machine.status}
                        </Badge>
                      </Grid.Col>
                    </Grid>
                  </Grid.Col>
                </Grid>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 5 }}>
              <Grid>
                <Grid.Col span={6}>
                  <Paper withBorder radius={4} p="sm" ta="center">
                    <Text c="dimmed" size="sm">
                      Tổng bảo trì
                    </Text>
                    <Title order={3}>{kpis.total}</Title>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Paper withBorder radius={4} p="sm" ta="center">
                    <Text c="dimmed" size="sm">
                      Hoàn thành
                    </Text>
                    <Title order={3} c="green">
                      {kpis.done}
                    </Title>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Paper withBorder radius={4} p="sm" ta="center">
                    <Text c="dimmed" size="sm">
                      Đang xử lý
                    </Text>
                    <Title order={3} c="orange">
                      {kpis.doing}
                    </Title>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Paper withBorder radius={4} p="sm" ta="center">
                    <Text c="dimmed" size="sm">
                      Chờ duyệt
                    </Text>
                    <Title order={3} c="gray">
                      {kpis.waiting}
                    </Title>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Paper withBorder radius={4} p="sm" ta="center">
                    <Text c="dimmed" size="sm">
                      Tổng chi phí bảo trì
                    </Text>
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
                      <Box
                        style={{ fontSize: 14 }}
                        dangerouslySetInnerHTML={{
                          __html: machine.specs || "Chưa có thông số",
                        }}
                      />
                    </Paper>
                    <Space h="xs" />
                    <Grid>
                      <Grid.Col span={6}>
                        <Text c="dimmed" size="sm">
                          Biển số
                        </Text>
                        <Text fw={600}>{machine.plate || "—"}</Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text c="dimmed" size="sm">
                          Số khung
                        </Text>
                        <Text fw={600}>{machine.vin || "—"}</Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text c="dimmed" size="sm">
                          Nhiên liệu
                        </Text>
                        <Text fw={600}>{machine.fuelType || "—"}</Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text c="dimmed" size="sm">
                          Mức tiêu hao
                        </Text>
                        <Text fw={600}>{machine.fuelConsumption || "—"}</Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text c="dimmed" size="sm">
                          Giờ vận hành
                        </Text>
                        <Text fw={600}>{machine.odoHours || 0} h</Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text c="dimmed" size="sm">
                          Số lượng
                        </Text>
                        <Text fw={600}>{machine.quantity}</Text>
                      </Grid.Col>
                    </Grid>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder radius={4} p="md">
                    <Title order={5}>Bảo hành & Bảo hiểm</Title>
                    <Divider my="xs" />
                    <InfoRow
                      label="Ngày mua"
                      value={fmtDate(machine.purchaseDate)}
                    />
                    <InfoRow
                      label="Giá mua"
                      value={fmtCurrency(machine.price)}
                    />
                    <InfoRow
                      label="Hạn bảo hành"
                      value={fmtDate(machine.warrantyExpiry)}
                    />
                    <InfoRow
                      label="Hợp đồng bảo hiểm"
                      value={machine.insurancePolicy || "—"}
                    />
                    <InfoRow
                      label="Hạn bảo hiểm"
                      value={fmtDate(machine.insuranceExpiry)}
                    />
                    <Divider my="xs" />
                    <InfoRow
                      label="Giá trị sổ sách (ước tính)"
                      value={fmtCurrency(kpis.bookValue)}
                    />
                    <Divider my="xs" />
                    <InfoRow
                      label="Đơn vị quản lý"
                      value={machine.ownerUnit || "—"}
                    />
                    <InfoRow
                      label="Vị trí hiện tại"
                      value={machine.location || "—"}
                    />
                    <InfoRow
                      label="Thiết bị GPS"
                      value={machine.gpsTrackerId || "—"}
                    />
                    <Divider my="xs" />
                    <InfoRow
                      label="Bảo trì gần nhất"
                      value={lastCompleted ? fmtDate(lastCompleted.date) : "—"}
                    />
                    <InfoRow
                      label="Bảo trì kế tiếp (ước tính)"
                      value={nextMaintenance}
                    />
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
                    {machine.manualFile ? (
                      <Paper withBorder radius={4} p="sm" bg="gray.0">
                        <iframe
                          src={machine.manualFile}
                          height="420"
                          width="100%"
                          style={{ border: "none", borderRadius: 6 }}
                          title="manual-pdf"
                        />
                      </Paper>
                    ) : (
                      <Text c="dimmed">Không có tài liệu</Text>
                    )}
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder radius={4} p="md">
                    <Title order={5}>Biên bản đăng kiểm</Title>
                    <Divider my="xs" />
                    {machine.inspectionFile ? (
                      <Paper withBorder radius={4} p="sm" bg="gray.0">
                        <iframe
                          src={machine.inspectionFile}
                          height="420"
                          width="100%"
                          style={{ border: "none", borderRadius: 6 }}
                          title="inspection-pdf"
                        />
                      </Paper>
                    ) : (
                      <Text c="dimmed">Không có tài liệu</Text>
                    )}
                  </Card>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            <Tabs.Panel value="analytics" pt="md">
              {/* Giữ nguyên phần chart */}
              <Grid>
                <Grid.Col span={12}>
                  <Card withBorder radius={4} p="md">
                    <Title order={5}>Chi phí bảo trì theo tháng</Title>
                    <Box h={300} mt="md">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={costByMonth}>
                          <defs>
                            <linearGradient
                              id="costGrad"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#fa5252"
                                stopOpacity={0.6}
                              />
                              <stop
                                offset="95%"
                                stopColor="#fa5252"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ReTooltip
                            formatter={(v: number) => fmtCurrency(v)}
                          />
                          <Area
                            type="monotone"
                            dataKey="cost"
                            stroke="#fa5252"
                            fill="url(#costGrad)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </Card>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            <Tabs.Panel value="maintenance" pt="md">
              <Grid align="end" mb={"md"}>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <DatePickerInput
                    type="range"
                    label="Khoảng ngày"
                    placeholder="Chọn khoảng thời gian"
                    value={range}
                    //@ts-expect-error no check
                    onChange={setRange}
                    radius={4}
                    leftSection={<IconCalendar size={16} />}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <Select
                    label="Trạng thái"
                    placeholder="Tất cả"
                    data={["Hoàn thành", "Đang xử lý", "Chờ duyệt"]}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    clearable
                    radius={4}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Group justify="flex-end">
                    <Button
                      variant="default"
                      radius={4}
                      onClick={() => {
                        setRange([null, null]);
                        setStatusFilter(null);
                      }}
                    >
                      Làm mới
                    </Button>
                  </Group>
                </Grid.Col>
              </Grid>

              <Table
                columns={[
                  //@ts-expect-error no check
                  ...maintenanceColumns,
                  {
                    id: "action",
                    header: "Xem",
                    //@ts-expect-error no check

                    Cell: ({ row }) => (
                      <Tooltip label="Xem chi tiết">
                        <Button
                          size="xs"
                          radius={4}
                          variant="default"
                          onClick={() => {
                            //@ts-expect-error no check

                            setCurrentRec(row.original);
                            setOpenedDrawer(true);
                          }}
                        >
                          Mở
                        </Button>
                      </Tooltip>
                    ),
                  },
                ]}
                //@ts-expect-error no check

                data={filteredRecords}
              />
            </Tabs.Panel>

            <Tabs.Panel value="asset" pt="md">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder radius={4} p="md">
                    <Title order={5}>Thông tin tài sản</Title>
                    <Divider my="xs" />
                    <InfoRow
                      label="Ngày mua"
                      value={fmtDate(machine.purchaseDate)}
                    />
                    <InfoRow
                      label="Giá mua"
                      value={fmtCurrency(machine.price)}
                    />
                    <InfoRow
                      label="Giá trị sổ sách"
                      value={fmtCurrency(kpis.bookValue)}
                    />
                    <InfoRow
                      label="Đơn vị quản lý"
                      value={machine.ownerUnit || "—"}
                    />
                    <InfoRow label="Vị trí" value={machine.location || "—"} />
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder radius={4} p="md">
                    <Title order={5}>Tuân thủ & nhãn</Title>
                    <Divider my="xs" />
                    <Group>
                      <Badge color="green" variant="light">
                        Đăng kiểm còn hạn
                      </Badge>
                      <Badge color="green" variant="light">
                        Bảo hiểm còn hạn
                      </Badge>
                      <Badge color="blue" variant="light">
                        GPS Online
                      </Badge>
                    </Group>
                  </Card>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Card>

      {/* --- MODAL EDIT MACHINE --- */}
      <Modal
        opened={openedEdit}
        onClose={() => setOpenedEdit(false)}
        title="Chỉnh sửa máy"
        radius={4}
        centered
        size="lg"
      >
        <Stack>
          <TextInput
            label="Tên máy"
            value={editDraft.name}
            onChange={(e) =>
              setEditDraft({ ...editDraft, name: e.currentTarget.value })
            }
          />
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Nhãn hiệu"
                value={editDraft.brand}
                onChange={(e) =>
                  setEditDraft({ ...editDraft, brand: e.currentTarget.value })
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Model"
                value={editDraft.model}
                onChange={(e) =>
                  setEditDraft({ ...editDraft, model: e.currentTarget.value })
                }
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={6}>
              <NumberInput
                label="Năm SX"
                value={editDraft.modelYear}
                onChange={(v) =>
                  setEditDraft({ ...editDraft, modelYear: Number(v) || 0 })
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Trạng thái"
                data={["Đang vận hành", "Đang bảo trì", "Ngừng hoạt động"]}
                value={editDraft.status}
                onChange={(v) =>
                  v &&
                  setEditDraft({ ...editDraft, status: v as Machine["status"] })
                }
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Biển số"
                value={editDraft.plate}
                onChange={(e) =>
                  setEditDraft({ ...editDraft, plate: e.currentTarget.value })
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Số khung"
                value={editDraft.vin}
                onChange={(e) =>
                  setEditDraft({ ...editDraft, vin: e.currentTarget.value })
                }
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Nhiên liệu"
                data={["Diesel", "Xăng", "Điện", "Khác"]}
                value={editDraft.fuelType}
                onChange={(v) =>
                  v &&
                  setEditDraft({
                    ...editDraft,
                    fuelType: v as Machine["fuelType"],
                  })
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Mức tiêu hao"
                value={editDraft.fuelConsumption}
                onChange={(e) =>
                  setEditDraft({
                    ...editDraft,
                    fuelConsumption: e.currentTarget.value,
                  })
                }
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={6}>
              <NumberInput
                label="Giờ vận hành"
                value={editDraft.odoHours}
                onChange={(v) =>
                  setEditDraft({ ...editDraft, odoHours: Number(v) || 0 })
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Giá"
                value={editDraft.price}
                onChange={(v) =>
                  setEditDraft({ ...editDraft, price: Number(v) || 0 })
                }
                thousandSeparator
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xs">
            <Button variant="default" onClick={() => setOpenedEdit(false)}>
              Huỷ
            </Button>
            <Button onClick={handleSaveMachine}>Lưu</Button>
          </Group>
        </Stack>
      </Modal>

      {/* --- MODAL ADD MAINTENANCE --- */}
      <Modal
        opened={openedAdd}
        onClose={() => setOpenedAdd(false)}
        title="Thêm bảo trì"
        radius={4}
        centered
      >
        <Stack>
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Mã bảo trì"
                value={newRec.id}
                onChange={(e) =>
                  setNewRec({ ...newRec, id: e.currentTarget.value })
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DatePickerInput
                label="Ngày"
                value={new Date(newRec.date)}
                onChange={(d) =>
                  d &&
                  setNewRec({ ...newRec, date: dayjs(d).format("YYYY-MM-DD") })
                }
              />
            </Grid.Col>
          </Grid>
          <TextInput
            label="Nội dung"
            value={newRec.description}
            onChange={(e) =>
              setNewRec({ ...newRec, description: e.currentTarget.value })
            }
          />
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Thực hiện bởi"
                value={newRec.performedBy}
                onChange={(e) =>
                  setNewRec({ ...newRec, performedBy: e.currentTarget.value })
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Trạng thái"
                data={["Chờ duyệt", "Đang xử lý", "Hoàn thành"]}
                value={newRec.status}
                onChange={(v) =>
                  v &&
                  setNewRec({
                    ...newRec,
                    status: v as MaintenanceRecord["status"],
                  })
                }
              />
            </Grid.Col>
          </Grid>
          <NumberInput
            label="Chi phí"
            value={newRec.cost}
            onChange={(v) => setNewRec({ ...newRec, cost: Number(v) || 0 })}
            thousandSeparator
          />
          <TextInput
            label="Vật tư (phân tách bằng dấu phẩy)"
            placeholder="Nhớt, Lọc nhớt"
            onChange={(e) =>
              setNewRec({
                ...newRec,
                parts: e.currentTarget.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setOpenedAdd(false)}>
              Huỷ
            </Button>
            <Button onClick={handleSaveMaintenance}>Lưu</Button>
          </Group>
        </Stack>
      </Modal>

      {/* --- DRAWER MAINTENANCE DETAIL --- */}
      <Drawer
        opened={openedDrawer}
        onClose={() => setOpenedDrawer(false)}
        title="Chi tiết bảo trì"
        position="right"
        size="lg"
      >
        {currentRec && (
          <Stack>
            <Card withBorder radius={4} p="md">
              <Title order={5}>Thông tin</Title>
              <Divider my="xs" />
              <InfoRow label="Mã" value={currentRec.id} />
              <InfoRow label="Ngày" value={fmtDate(currentRec.date)} />
              <InfoRow
                label="Trạng thái"
                value={
                  <Badge color={recStatusColor(currentRec.status)}>
                    {currentRec.status}
                  </Badge>
                }
              />
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
              <Group>
                {(currentRec.parts.length ? currentRec.parts : ["—"]).map(
                  (p, i) => (
                    <Badge key={i} variant="light">
                      {p}
                    </Badge>
                  )
                )}
              </Group>
            </Card>
            <Group justify="space-between">
              {currentRec.status !== "Hoàn thành" && (
                <Button
                  variant="default"
                  onClick={() => handleUpdateRecordStatus("Hoàn thành")}
                >
                  Đánh dấu hoàn thành
                </Button>
              )}
              <Group>
                <Button
                  variant="default"
                  color="red"
                  onClick={handleDeleteRecord}
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
