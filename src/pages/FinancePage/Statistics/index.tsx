import {
  Button,
  Card,
  Group,
  Stack,
  Title,
  Divider,
  Text,
  Badge,
} from "@mantine/core";
import { IconFileExcel } from "@tabler/icons-react";
import Table from "../../../components/Table";
import type { MRT_ColumnDef } from "mantine-react-table";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type Record = {
  date: string;
  type: "Thu" | "Chi";
  amount: number;
  description: string;
};

const records: Record[] = [
  {
    date: "2025-08-01",
    type: "Thu",
    amount: 5000000,
    description: "Thu tiền hợp đồng số 12345",
  },
  {
    date: "2025-08-02",
    type: "Chi",
    amount: 2000000,
    description: "Chi tiền mua văn phòng phẩm",
  },
  {
    date: "2025-08-03",
    type: "Thu",
    amount: 10000000,
    description: "Thu tiền hợp đồng số 67890",
  },
  {
    date: "2025-08-04",
    type: "Chi",
    amount: 15000000,
    description: "Chi tiền thuê văn phòng",
  },
  {
    date: "2025-08-05",
    type: "Thu",
    amount: 7000000,
    description: "Thu từ đầu tư cổ tức quý II",
  },
  {
    date: "2025-08-06",
    type: "Chi",
    amount: 3000000,
    description: "Chi bảo trì thiết bị",
  },
];

const data = [
  { month: "Tháng 1", income: 5000000, expense: 3000000 },
  { month: "Tháng 2", income: 7000000, expense: 4000000 },
  { month: "Tháng 3", income: 8000000, expense: 5000000 },
  { month: "Tháng 4", income: 6000000, expense: 2000000 },
  { month: "Tháng 5", income: 9000000, expense: 7000000 },
  { month: "Tháng 6", income: 10000000, expense: 8000000 },
  { month: "Tháng 7", income: 11000000, expense: 6500000 },
  { month: "Tháng 8", income: 12000000, expense: 9500000 },
];

const columns: MRT_ColumnDef<Record>[] = [
  {
    header: "Ngày giao dịch",
    accessorKey: "date",
    Cell: ({ row }) => new Date(row.original.date).toLocaleDateString("vi-VN"),
  },
  {
    header: "Loại giao dịch",
    accessorKey: "type",
    Cell: ({ row }) => (
      <Badge
        color={row.original.type === "Thu" ? "green" : "red"}
        variant="light"
      >
        {row.original.type}
      </Badge>
    ),
  },
  {
    header: "Số tiền (VND)",
    accessorKey: "amount",
    Cell: ({ row }) => (
      <Text color={row.original.type === "Thu" ? "green" : "red"} fw={500}>
        {row.original.amount.toLocaleString("vi-VN")} VND
      </Text>
    ),
  },
  {
    header: "Mô tả",
    accessorKey: "description",
  },
];

const FinancePurposeStatisticPage = () => {
  return (
    <Stack gap="lg">
      <Group justify="space-between" px="sm">
        <Stack gap={2}>
          <Title order={2}>Thống kê thu chi</Title>
          <Text size="sm" color="dimmed">
            Biểu đồ trực quan và danh sách chi tiết các giao dịch thu/chi
          </Text>
        </Stack>
        <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
          Xuất Excel
        </Button>
      </Group>

      <Card withBorder radius={4} padding="lg" shadow="sm">
        <Title order={5} mb="xs">
          Biểu đồ thu chi theo tháng
        </Title>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toLocaleString()} VND`} />
            <Legend />
            <Bar dataKey="income" fill="#82ca9d" name="Thu nhập" />
            <Bar dataKey="expense" fill="#ff6b6b" name="Chi phí" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card shadow="sm" padding="lg" radius={4} withBorder>
        <Title order={5} ta="center">
          Danh sách giao dịch chi tiết
        </Title>
        <Divider my="sm" />
        <Table columns={columns} data={records} />
      </Card>
    </Stack>
  );
};

export default FinancePurposeStatisticPage;
