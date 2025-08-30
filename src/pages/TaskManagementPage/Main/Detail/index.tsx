import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Drawer,
  Grid,
  Group,
  Menu,
  NumberInput,
  Paper,
  Progress,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconArrowLeft, IconDotsVertical, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../../components/Table";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type EmployeeTask = {
  employee: string;
  taskName: string;
  assignment: string;
  startDate: string;
  endDate: string;
  status: "Đã hoàn thành" | "Đang thực hiện" | "Chưa bắt đầu";
  reviewer: string;
};

const EMPLOYEE_AVATAR = "/avatar-farmer.png";

const initialTasks: EmployeeTask[] = [
  {
    employee: "Nguyễn Văn A",
    taskName: "Phun thuốc trừ sâu đợt 1",
    assignment: "Phiếu giao việc 001",
    startDate: "2025-07-02",
    endDate: "2025-07-04",
    status: "Đang thực hiện",
    reviewer: "Lê Quang D",
  },
  {
    employee: "Nguyễn Văn A",
    taskName: "Làm cỏ khu B",
    assignment: "Phiếu giao việc 002",
    startDate: "2025-07-05",
    endDate: "2025-07-06",
    status: "Chưa bắt đầu",
    reviewer: "Lê Quang D",
  },
  {
    employee: "Nguyễn Văn A",
    taskName: "Bón phân giai đoạn 1",
    assignment: "Phiếu giao việc 003",
    startDate: "2025-07-07",
    endDate: "2025-07-08",
    status: "Đã hoàn thành",
    reviewer: "Ngô Thanh T",
  },
  {
    employee: "Nguyễn Văn B",
    taskName: "Tưới nước khu A",
    assignment: "Phiếu giao việc 004",
    startDate: "2025-07-03",
    endDate: "2025-07-03",
    status: "Đã hoàn thành",
    reviewer: "Nguyễn Thị K",
  },
  {
    employee: "Nguyễn Văn B",
    taskName: "Cắt tỉa cành khu C",
    assignment: "Phiếu giao việc 005",
    startDate: "2025-07-04",
    endDate: "2025-07-05",
    status: "Đang thực hiện",
    reviewer: "Nguyễn Thị K",
  },
  {
    employee: "Trần Văn C",
    taskName: "Kiểm tra sâu bệnh khu D",
    assignment: "Phiếu giao việc 006",
    startDate: "2025-07-06",
    endDate: "2025-07-07",
    status: "Chưa bắt đầu",
    reviewer: "Nguyễn Thị K",
  },
  {
    employee: "Trần Văn C",
    taskName: "Ghi nhận độ ẩm đất",
    assignment: "Phiếu giao việc 007",
    startDate: "2025-07-08",
    endDate: "2025-07-08",
    status: "Đang thực hiện",
    reviewer: "Ngô Thanh T",
  },
  {
    employee: "Lê Thị D",
    taskName: "Thu hoạch đợt 1",
    assignment: "Phiếu giao việc 008",
    startDate: "2025-07-09",
    endDate: "2025-07-10",
    status: "Chưa bắt đầu",
    reviewer: "Nguyễn Văn Q",
  },
  {
    employee: "Lê Thị D",
    taskName: "Vận chuyển nông sản",
    assignment: "Phiếu giao việc 009",
    startDate: "2025-07-11",
    endDate: "2025-07-11",
    status: "Đang thực hiện",
    reviewer: "Nguyễn Văn Q",
  },
  {
    employee: "Lê Thị D",
    taskName: "Phơi sấy nông sản",
    assignment: "Phiếu giao việc 010",
    startDate: "2025-07-12",
    endDate: "2025-07-13",
    status: "Chưa bắt đầu",
    reviewer: "Nguyễn Văn Q",
  },
  {
    employee: "Phạm Văn E",
    taskName: "Bón phân hữu cơ khu E",
    assignment: "Phiếu giao việc 011",
    startDate: "2025-07-13",
    endDate: "2025-07-14",
    status: "Đang thực hiện",
    reviewer: "Ngô Thanh T",
  },
  {
    employee: "Phạm Văn E",
    taskName: "Phun vi sinh khu F",
    assignment: "Phiếu giao việc 012",
    startDate: "2025-07-15",
    endDate: "2025-07-15",
    status: "Đã hoàn thành",
    reviewer: "Ngô Thanh T",
  },
  {
    employee: "Nguyễn Văn F",
    taskName: "Kiểm kê vật tư",
    assignment: "Phiếu giao việc 013",
    startDate: "2025-07-16",
    endDate: "2025-07-17",
    status: "Đang thực hiện",
    reviewer: "Nguyễn Thị K",
  },
  {
    employee: "Nguyễn Văn F",
    taskName: "Sửa chữa máy bơm nước",
    assignment: "Phiếu giao việc 014",
    startDate: "2025-07-18",
    endDate: "2025-07-18",
    status: "Chưa bắt đầu",
    reviewer: "Nguyễn Thị K",
  },
  {
    employee: "Nguyễn Văn G",
    taskName: "Lắp đặt hệ thống tưới tự động",
    assignment: "Phiếu giao việc 015",
    startDate: "2025-07-19",
    endDate: "2025-07-20",
    status: "Đang thực hiện",
    reviewer: "Lê Quang D",
  },
];

const STATUS_OPTIONS = [
  "Đã hoàn thành",
  "Đang thực hiện",
  "Chưa bắt đầu",
] as const;
const COLORS = ["#2fb344", "#1c7ed6", "#868e96"];

const statusColor = (s: EmployeeTask["status"]) =>
  s === "Đã hoàn thành" ? "green" : s === "Đang thực hiện" ? "blue" : "gray";

export default function TaskManagementMainDetailPage() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<EmployeeTask[]>(initialTasks);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date("2025-07-01"),
    new Date("2025-07-31"),
  ]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [reviewerFilter, setReviewerFilter] = useState<string | null>(null);
  const reviewers = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.reviewer))),
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    let list = [...tasks];
    if (dateRange[0] && dateRange[1]) {
      list = list.filter((t) => {
        const d = dayjs(t.startDate);
        return (
          d.isAfter(dayjs(dateRange[0]).subtract(1, "day")) &&
          d.isBefore(dayjs(dateRange[1]).add(1, "day"))
        );
      });
    }
    if (statusFilter) list = list.filter((t) => t.status === statusFilter);
    if (reviewerFilter)
      list = list.filter((t) => t.reviewer === reviewerFilter);
    return list;
  }, [tasks, dateRange, statusFilter, reviewerFilter]);

  const kpis = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(
      (t) => t.status === "Đã hoàn thành"
    ).length;
    const doing = filteredTasks.filter(
      (t) => t.status === "Đang thực hiện"
    ).length;
    const pending = filteredTasks.filter(
      (t) => t.status === "Chưa bắt đầu"
    ).length;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;
    const spanDays =
      dateRange[0] && dateRange[1]
        ? dayjs(dateRange[1]).diff(dayjs(dateRange[0]), "day") + 1
        : "-";
    return { total, completed, doing, pending, completionRate, spanDays };
  }, [filteredTasks, dateRange]);

  const chartData = useMemo(
    () => [
      { name: "Đã hoàn thành", value: kpis.completed },
      { name: "Đang thực hiện", value: kpis.doing },
      { name: "Chưa bắt đầu", value: kpis.pending },
    ],
    [kpis]
  );

  const byDate = useMemo(() => {
    const map = new Map<string, EmployeeTask[]>();
    for (const t of filteredTasks) {
      const key = t.startDate;
      map.set(key, [...(map.get(key) || []), t]);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, items]) => ({ date, items }));
  }, [filteredTasks]);

  const columns: MRT_ColumnDef<EmployeeTask>[] = [
    { accessorKey: "taskName", header: "Tên công việc" },
    { accessorKey: "assignment", header: "Phiếu công việc" },
    {
      accessorKey: "startDate",
      header: "Bắt đầu",
      Cell: ({ cell }) => dayjs(cell.getValue<string>()).format("DD/MM/YYYY"),
    },
    {
      accessorKey: "endDate",
      header: "Kết thúc",
      Cell: ({ cell }) => dayjs(cell.getValue<string>()).format("DD/MM/YYYY"),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      Cell: ({ row }) => (
        <Badge color={statusColor(row.original.status)} variant="filled">
          {row.original.status}
        </Badge>
      ),
    },
    { accessorKey: "reviewer", header: "Người kiểm duyệt" },
  ];

  const [opened, setOpened] = useState(false);
  const [current, setCurrent] = useState<EmployeeTask | null>(null);

  const openDetail = (row: EmployeeTask) => {
    setCurrent(row);
    setOpened(true);
  };

  const saveCurrent = () => {
    if (!current) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.taskName === current.taskName && t.assignment === current.assignment
          ? current
          : t
      )
    );
    setOpened(false);
  };

  return (
    <>
      <Card withBorder shadow="sm" radius={4} p="md">
        <Group mb="md">
          <Button
            variant="subtle"
            radius={4}
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
        </Group>

        <Group justify="space-between" align="flex-start" mb="md">
          <Group align="center">
            <Avatar radius="xl" size={64} src={EMPLOYEE_AVATAR} />
            <Stack gap={0}>
              <Text fw={700} size="lg">
                Nguyễn Văn A
              </Text>
              <Text size="sm" c="dimmed">
                Nhân viên nông trại • ID: NV-001
              </Text>
            </Stack>
          </Group>

          <Group gap="sm" align="flex-start">
            <Paper p="sm" radius={4} shadow="xs" w={140} ta="center">
              <Text size="xs" c="dimmed">
                Tổng công việc
              </Text>
              <Text fw={800} size="xl">
                {kpis.total}
              </Text>
            </Paper>
            <Paper p="sm" radius={4} shadow="xs" w={140} ta="center">
              <Text size="xs" c="dimmed">
                Hoàn thành
              </Text>
              <Text fw={800} size="xl" c="green">
                {kpis.completed}
              </Text>
            </Paper>
            <Paper p="sm" radius={4} shadow="xs" w={140} ta="center">
              <Text size="xs" c="dimmed">
                Đang làm
              </Text>
              <Text fw={800} size="xl" c="blue">
                {kpis.doing}
              </Text>
            </Paper>
            <Paper p="sm" radius={4} shadow="xs" w={140} ta="center">
              <Text size="xs" c="dimmed">
                Chưa bắt đầu
              </Text>
              <Text fw={800} size="xl" c="gray">
                {kpis.pending}
              </Text>
            </Paper>
            <Paper p="sm" radius={4} shadow="xs" w={180}>
              <Group justify="space-between" mb={6}>
                <Text size="xs" c="dimmed">
                  Tỷ lệ hoàn thành
                </Text>
                <Text size="sm" fw={700}>
                  {kpis.completionRate}%
                </Text>
              </Group>
              <Progress value={kpis.completionRate} radius="xl" />
            </Paper>
          </Group>
        </Group>

        <Card withBorder shadow="xs" radius={4} p="md" mb="lg">
         <Group align="flex-end" gap={'xs'}>
           <DatePickerInput
            type="range"
            label="Khoảng ngày"
            placeholder="Chọn khoảng thời gian"
            locale="vi"
            radius={4}
            flex={1}
            value={dateRange}
          />

          <Select
            label="Trạng thái"
            placeholder="Tất cả"
            data={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
            value={statusFilter}
            onChange={setStatusFilter}
            clearable
            flex={1}
            radius={4}
          />

          <Select
            label="Người kiểm duyệt"
            placeholder="Tất cả"
            data={reviewers.map((r) => ({ value: r, label: r }))}
            value={reviewerFilter}
            onChange={setReviewerFilter}
            clearable
            radius={4}
            flex={1}
          />
          <Button
            variant="default"
            radius={4}
            onClick={() => {
              setDateRange([null, null]);
              setStatusFilter(null);
              setReviewerFilter(null);
            }}
          >
            Làm mới
          </Button>
         </Group>
        </Card>

        <Grid gutter="lg" mb="lg">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder shadow="xs" radius={4} p="md" h={360}>
              <Group justify="space-between" mb="xs">
                <Title order={5}>Phân bố trạng thái</Title>
                <Badge variant="outline">{kpis.total} công việc</Badge>
              </Group>
              <Divider my="xs" />
              <Box h={280}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <ReTooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder shadow="xs" radius={4} p="md" h={360}>
              <Group justify="space-between" mb="xs">
                <Title order={5}>Dòng thời gian</Title>
                <Badge variant="light">
                  {typeof kpis.spanDays === "number"
                    ? `${kpis.spanDays} ngày`
                    : "—"}
                </Badge>
              </Group>
              <Divider my="xs" />
              <Stack gap="xs" style={{ maxHeight: 300, overflow: "auto" }}>
                {byDate.length === 0 && (
                  <Text c="dimmed">Không có công việc trong bộ lọc.</Text>
                )}
                {byDate.map(({ date, items }) => (
                  <Card key={date} withBorder radius={4} p="sm" mih={80}>
                    <Group justify="space-between" mb={6}>
                      <Text fw={700}>{dayjs(date).format("DD/MM/YYYY")}</Text>
                      <Badge variant="outline">{items.length}</Badge>
                    </Group>
                    <Stack gap={4}>
                      {items.map((t, i) => (
                        <Group key={i} justify="space-between">
                          <Group gap={8}>
                            <Badge color={statusColor(t.status)}>
                              {t.status}
                            </Badge>
                            <Text>{t.taskName}</Text>
                          </Group>
                          <Tooltip label={t.assignment}>
                            <Badge variant="light">{t.assignment}</Badge>
                          </Tooltip>
                        </Group>
                      ))}
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Title order={4}>Chi tiết công việc</Title>
            <Text c="dimmed" size="sm">
              Nhấp vào một dòng để xem/chỉnh sửa
            </Text>
          </Group>
          <Table
            columns={[
              ...columns,
              {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 10,
      Cell: ({row}) => (
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="transparent" c={"gray"}>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={()=>openDetail(row.original)}
            >
              Chi tiết
            </Menu.Item>
            
          </Menu.Dropdown>
        </Menu>
      ),
    },
            ]}
            data={filteredTasks}
          />
        </Stack>
      </Card>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Chi tiết công việc"
        position="right"
        size="lg"
        padding="md"
        radius="md"
      >
        {current && (
          <Stack gap="md">
            <Group>
              <Avatar src={EMPLOYEE_AVATAR} radius="xl" />
              <Stack gap={0}>
                <Text fw={700}>{current.employee}</Text>
                <Text size="sm" c="dimmed">
                  {current.reviewer} • Người kiểm duyệt
                </Text>
              </Stack>
            </Group>

            <Card withBorder radius={4} p="md">
              <Title order={5}>Thông tin</Title>
              <Divider my="xs" />
              <Stack gap={8}>
                <TextInput
                  label="Tên công việc"
                  value={current.taskName}
                  onChange={(e) =>
                    setCurrent({ ...current, taskName: e.currentTarget.value })
                  }
                  radius={4}
                />
                <TextInput
                  label="Phiếu công việc"
                  value={current.assignment}
                  onChange={(e) =>
                    setCurrent({
                      ...current,
                      assignment: e.currentTarget.value,
                    })
                  }
                  radius={4}
                />
                <Group grow>
                  <DatePickerInput
                    label="Bắt đầu"
                    value={new Date(current.startDate)}
                    onChange={(d) =>
                      d &&
                      setCurrent({
                        ...current,
                        startDate: dayjs(d).format("YYYY-MM-DD"),
                      })
                    }
                    radius={4}
                  />
                  <DatePickerInput
                    label="Kết thúc"
                    value={new Date(current.endDate)}
                    onChange={(d) =>
                      d &&
                      setCurrent({
                        ...current,
                        endDate: dayjs(d).format("YYYY-MM-DD"),
                      })
                    }
                    radius={4}
                  />
                </Group>
                <Select
                  label="Trạng thái"
                  data={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
                  value={current.status}
                  onChange={(v) =>
                    v &&
                    setCurrent({
                      ...current,
                      status: v as EmployeeTask["status"],
                    })
                  }
                  radius={4}
                />
                <TextInput
                  label="Người kiểm duyệt"
                  value={current.reviewer}
                  onChange={(e) =>
                    setCurrent({ ...current, reviewer: e.currentTarget.value })
                  }
                  radius={4}
                />
              </Stack>
              <Group justify="flex-end" mt="md">
                <Button
                  variant="default"
                  radius={4}
                  onClick={() => setOpened(false)}
                >
                  Huỷ
                </Button>
                <Button radius={4} onClick={saveCurrent}>
                  Lưu thay đổi
                </Button>
              </Group>
            </Card>

            <Card withBorder radius={4} p="md">
              <Title order={5}>Tiến độ</Title>
              <Divider my="xs" />
              <Stack>
                <Group justify="space-between">
                  <Text>KPI hoàn thành</Text>
                  <Badge color={statusColor(current.status)}>
                    {current.status}
                  </Badge>
                </Group>
                <Progress
                  value={
                    current.status === "Đã hoàn thành"
                      ? 100
                      : current.status === "Đang thực hiện"
                      ? 60
                      : 0
                  }
                  radius="xl"
                />
              </Stack>
            </Card>
          </Stack>
        )}
      </Drawer>
    </>
  );
}
