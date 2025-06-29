import {
  Badge,
  Card,
  Group,
  Stack,
  Text,
  Title,
  Paper,
  Avatar,
  Box,
  Button,
} from "@mantine/core";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMemo, useState } from "react";
import Table from "../../../../components/Table";
import type { MRT_ColumnDef } from "mantine-react-table";
import dayjs from "dayjs";
import { DatePickerInput } from "@mantine/dates";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
type EmployeeTask = {
  employee: string;
  taskName: string;
  assignment: string;
  startDate: string; // ISO format: yyyy-mm-dd
  endDate: string;
  status: "Đã hoàn thành" | "Đang thực hiện" | "Chưa bắt đầu";
  reviewer: string;
};
const employeeTasks: EmployeeTask[] = [
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
];

const COLORS = ["#28a745", "#007bff", "#6c757d"];

const TaskManagementMainDetailPage = () => {
  const navigate = useNavigate();
  const columns: MRT_ColumnDef<EmployeeTask>[] = [
    { accessorKey: "employee", header: "Nhân viên" },
    { accessorKey: "taskName", header: "Tên công việc" },
    { accessorKey: "assignment", header: "Phiếu công việc" },
    { accessorKey: "startDate", header: "Bắt đầu" },
    { accessorKey: "endDate", header: "Kết thúc" },
    {
      accessorKey: "status",
      header: "Trạng thái",
      Cell: ({ row }) => (
        <Badge
          color={
            row.original.status === "Đã hoàn thành"
              ? "green"
              : row.original.status === "Đang thực hiện"
              ? "blue"
              : "gray"
          }
          variant="filled"
        >
          {row.original.status}
        </Badge>
      ),
    },
    { accessorKey: "reviewer", header: "Người kiểm duyệt" },
  ];
  const [dateRange] = useState<[Date | null, Date | null]>([null, null]);

  const filteredTasks = useMemo(() => {
    if (!dateRange[0] || !dateRange[1]) return employeeTasks;
    return employeeTasks.filter((t) => {
      const taskStart = dayjs(t.startDate);
      return (
        taskStart.isAfter(dayjs(dateRange[0]).subtract(1, "day")) &&
        taskStart.isBefore(dayjs(dateRange[1]).add(1, "day"))
      );
    });
  }, [dateRange]);

  const statusCounts = useMemo(() => {
    return [
      {
        name: "Đã hoàn thành",
        value: filteredTasks.filter((t) => t.status === "Đã hoàn thành").length,
      },
      {
        name: "Đang thực hiện",
        value: filteredTasks.filter((t) => t.status === "Đang thực hiện")
          .length,
      },
      {
        name: "Chưa bắt đầu",
        value: filteredTasks.filter((t) => t.status === "Chưa bắt đầu").length,
      },
    ];
  }, [filteredTasks]);

  return (
    <Card withBorder shadow="sm" radius={8} p="md">
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
      </Group>
      <Group justify="space-between" mb="md" align="flex-start">
        <Group align="center">
          <Avatar radius="xl" color="blue" size={64} src="/avatar-farmer.png" />
          <Stack gap={0}>
            <Text fw={700} size="lg">
              Nguyễn Văn A
            </Text>
            <Text size="sm" c="dimmed">
              Nhân viên nông trại
            </Text>
          </Stack>
        </Group>

        <Group gap="sm">
          {statusCounts.map((item, idx) => (
            <Paper key={idx} p="sm" radius={4} shadow="xs" ta="center" w={120}>
              <Text size="xs" c="dimmed">
                {item.name}
              </Text>
              <Text fw={700} size="xl" color="blue">
                {item.value}
              </Text>
            </Paper>
          ))}
        </Group>
      </Group>

      <Box mb="lg">
        <DatePickerInput
          type="range"
          label="Lọc theo ngày làm việc"
          placeholder="Chọn khoảng thời gian"
          locale="vi"
          radius={4}
          style={{ maxWidth: 300 }}
        />
      </Box>

      <Box h={300} mb="lg">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusCounts}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {statusCounts.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Stack gap="sm">
        <Title order={4}>Chi tiết công việc</Title>
        <Table columns={columns} data={employeeTasks} />
      </Stack>
    </Card>
  );
};

export default TaskManagementMainDetailPage;
