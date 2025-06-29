import {
  Badge,
  Box,
  Card,
  Divider,
  Grid,
  Group,
  Progress,
  RingProgress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import type { MRT_ColumnDef } from "mantine-react-table";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import Table from "../../components/Table";

const data = [
  { month: "1", income: 120000, expense: 90000 },
  { month: "2", income: 135000, expense: 100000 },
  { month: "3", income: 150000, expense: 110000 },
  { month: "4", income: 160000, expense: 115000 },
  { month: "5", income: 200000, expense: 130000 },
  { month: "6", income: 298483, expense: 180000 },
  { month: "7", income: 220000, expense: 150000 },
  { month: "8", income: 210000, expense: 140000 },
  { month: "9", income: 195000, expense: 130000 },
  { month: "10", income: 185000, expense: 125000 },
  { month: "11", income: 170000, expense: 120000 },
  { month: "12", income: 160000, expense: 115000 },
];
const summaryCards = [
  { label: "Tổng số cây trồng", value: "1.200", color: "teal.7" },
  { label: "Sản lượng hôm nay", value: "850 kg", color: "green.7" },
  { label: "Tăng trưởng so với hôm qua", value: "+16%", color: "blue.6" },
  { label: "Báo cáo mới hôm nay", value: "5", color: "grape.6" },
  { label: "Thu hoạch hôm nay", value: "630 kg", color: "lime.6" },
  { label: "Sản lượng trung bình / cây", value: "0.71 kg", color: "indigo.6" },
  { label: "Số cây đã thu hoạch hôm nay", value: "890", color: "cyan.6" },
  { label: "Tỉ lệ hoàn thành thu hoạch", value: "74%", color: "pink.6" },
];
type TaskItem = {
  title: string; // Tên công việc và khu vực
  status: string; // Trạng thái hiển thị (ví dụ: "Đúng tiến độ", "Trong 1 ngày")
  assignee: string; // Người phụ trách
  badges: string[]; // Danh sách các nhãn trạng thái bổ sung
  notes?: string; // Ghi chú bổ sung (tùy chọn)
  color: "green" | "orange" | "red"; // Màu trạng thái cho phần nền
};
const taskItems: TaskItem[] = [
  {
    title: "Phun thuốc định kỳ - Khu lúa số 1",
    status: "Đúng tiến độ",
    assignee: "Nguyễn Văn A",
    badges: ["Chuẩn bị thiết bị", "Đang thực hiện"],
    color: "green",
  },
  {
    title: "Thu hoạch thử nghiệm - Khu chuối số 3",
    status: "Trong 1 ngày",
    assignee: "Lê Thị B",
    badges: ["Ưu tiên thấp"],
    color: "orange",
  },
  {
    title: "Kiểm tra đồng ngô - Khu ngô số 2",
    status: "Quá hạn 2 ngày",
    assignee: "Trần Văn C",
    badges: ["Chưa bắt đầu", "Ưu tiên cao"],
    notes: "Cần kiểm tra sâu bệnh kỹ hơn do mưa lớn",
    color: "red",
  },
];

const HomePage = () => {
  const columns: MRT_ColumnDef<TaskItem>[] = [
    {
      accessorKey: "title",
      header: "Tên công việc",
      Cell: ({ row }) => (
        <Stack gap={2}>
          <Text fw={600}>{row.original.title}</Text>
          {row.original.notes && (
            <Text size="xs" c="dimmed">
              📝 {row.original.notes}
            </Text>
          )}
        </Stack>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      Cell: ({ row }) => (
        <Badge color={row.original.color} variant="light">
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "assignee",
      header: "Người phụ trách",
      Cell: ({ row }) => <Text>{row.original.assignee}</Text>,
    },
    {
      accessorKey: "badges",
      header: "Thông tin liên quan",
      Cell: ({ row }) => (
        <Group gap="xs">
          {row.original.badges.map((badge, i) => (
            <Badge key={i} size="xs" color="gray">
              {badge}
            </Badge>
          ))}
        </Group>
      ),
    },
  ];

  return (
    <Stack>
      {/* Cards Section */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {/* Weather Card */}
        <Card
          withBorder
          shadow="lg"
          radius={4}
          style={{ background: "linear-gradient(145deg, #e3f2fd, #ffffff)" }}
        >
          <Stack gap="xs">
            <Text fw={700} size="sm" c="blue.7" tt="uppercase">
              Thông tin thời tiết
            </Text>
            <Title order={2} c="blue">
              +27°C
            </Title>
            <Group justify="space-between">
              <Text size="xs" c="gray.6">
                Nhiệt độ đất: +23°C
              </Text>
              <Text size="xs" c="gray.6">
                Độ ẩm: 78%
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="xs" c="gray.6">
                Tốc độ gió: 12m/s
              </Text>
              <Text size="xs" c="gray.6">
                Lượng mưa: 10mm
              </Text>
            </Group>
            <Divider my={4} />
            <Group justify="space-between">
              <Text size="xs" c="gray.6">
                🌅 Mặt trời mọc: 5:22 SA
              </Text>
              <Text size="xs" c="gray.6">
                🌇 Mặt trời lặn: 6:41 CH
              </Text>
            </Group>
          </Stack>
        </Card>

        {/* Soil Moisture */}
        <Card
          withBorder
          shadow="lg"
          radius={4}
          style={{ background: "linear-gradient(145deg, #e8f5e9, #ffffff)" }}
        >
          <Stack gap="xs">
            <Text fw={700} size="sm" c="green.7" tt="uppercase">
              Tình trạng độ ẩm đất
            </Text>
            <Group justify="space-between">
              <Text size="xs">8 khu vực - Mức thấp</Text>
              <Progress
                value={30}
                color="red"
                radius={4}
                size="md"
                style={{ flex: 1 }}
              />
            </Group>
            <Group justify="space-between">
              <Text size="xs">36 khu vực - Mức tối ưu</Text>
              <Progress
                value={50}
                color="blue"
                radius={4}
                size="md"
                style={{ flex: 1 }}
              />
            </Group>
            <Group justify="space-between">
              <Text size="xs">18 khu vực - Mức cao</Text>
              <Progress
                value={20}
                color="teal"
                radius={4}
                size="md"
                style={{ flex: 1 }}
              />
            </Group>
          </Stack>
        </Card>

        {/* Irrigation Status */}
        <Card
          withBorder
          shadow="lg"
          radius={4}
          style={{ background: "linear-gradient(145deg, #fffde7, #ffffff)" }}
        >
          <Stack gap="xs" align="center">
            <Text fw={700} size="sm" c="yellow.7" tt="uppercase">
              Hiệu suất hệ thống tưới tiêu
            </Text>
            <RingProgress
              size={120}
              thickness={14}
              label={
                <Text ta="center" size="md" fw={600}>
                  85%
                </Text>
              }
              sections={[
                { value: 85, color: "green" },
                { value: 10, color: "yellow" },
                { value: 5, color: "red" },
              ]}
            />
            <Group gap={4} mt={4} justify="center">
              <Badge color="green">Vận hành ổn định</Badge>
              <Badge color="yellow">Cần kiểm tra</Badge>
              <Badge color="red">Phát hiện lỗi</Badge>
            </Group>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Summary Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" mt="md">
        {summaryCards.map((item, i) => (
          <Card
            key={i}
            withBorder
            shadow="lg"
            radius={4}
            p="xl"
            style={{
              background: "linear-gradient(135deg, #f8f9fa, #ffffff)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              borderLeft: `6px solid var(--mantine-color-${item.color})`,
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Stack gap="xs">
              <Group justify="space-between" align="flex-start">
                <Text
                  size="xs"
                  fw={700}
                  c="gray.7"
                  tt="uppercase"
                  style={{ letterSpacing: 1 }}
                >
                  {item.label}
                </Text>
                <Badge
                  variant="outline"
                  color={item.color.split(".")[0]}
                  size="xs"
                >
                  Cập nhật
                </Badge>
              </Group>
              <Title order={2} c={item.color} lh={1.1} ff="sans-serif">
                {item.value}
              </Title>
              <Text size="xs" c="gray.6">
                {item.label.includes("cây")
                  ? "Tổng dữ liệu theo vùng trồng"
                  : "So sánh với cùng kỳ hôm qua"}
              </Text>
            </Stack>
            <Box
              pos="absolute"
              top={-15}
              right={-15}
              style={{
                opacity: 0.08,
                fontSize: 120,
                fontWeight: 900,
                color: `var(--mantine-color-${item.color})`,
              }}
            >
              ⬤
            </Box>
          </Card>
        ))}
      </SimpleGrid>
      <Divider my="md" label="Báo cáo tổng hợp" labelPosition="left" />

      {/* Chart and Map */}
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder shadow="lg" radius={4}>
            <Stack>
              <Title order={4} c="blue.7">
                Biểu đồ tổng hợp
              </Title>
              <Box h={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data.map((item) => ({
                      ...item,
                      profit: item.income - item.expense,
                      expenseRate: (item.expense / item.income) * 100,
                      stockProposal: item.income * 0.05, // giả định: 5% sản lượng cần trữ kho
                      loss: item.expense * 0.08, // giả định: 8% chi phí là hao hụt
                    }))}
                    margin={{ top: 20, right: 40, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#dee2e6" />
                    <XAxis
                      dataKey="month"
                      stroke="#495057"
                      tick={{ fontSize: 12, fill: "#495057" }}
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        value.toLocaleString(),
                        name === "expenseRate"
                          ? "% Chi phí/Doanh thu"
                          : name === "stockProposal"
                          ? "Đề xuất lưu kho"
                          : name === "loss"
                          ? "Tổn thất ước tính"
                          : name,
                      ]}
                      labelFormatter={(label) => `Tháng: ${label}`}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: 10,
                        fontSize: 13,
                      }}
                      labelStyle={{ fontWeight: 600 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 13 }} />
                    <Line
                      type="monotone"
                      dataKey="income"
                      name="Doanh thu"
                      stroke="#228be6"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        stroke: "#228be6",
                        fill: "#fff",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 6, fill: "#228be6" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      name="Chi phí"
                      stroke="#f59f00"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        stroke: "#f59f00",
                        fill: "#fff",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 6, fill: "#f59f00" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      name="Lợi nhuận"
                      stroke="#40c057"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      dot={{
                        r: 3,
                        stroke: "#40c057",
                        fill: "#fff",
                        strokeWidth: 1,
                      }}
                      activeDot={{ r: 5, fill: "#40c057" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="stockProposal"
                      name="Đề xuất lưu kho"
                      stroke="#845ef7"
                      strokeWidth={2}
                      dot={{
                        r: 3,
                        stroke: "#845ef7",
                        fill: "#fff",
                        strokeWidth: 1,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="loss"
                      name="Tổn thất ước tính"
                      stroke="#e03131"
                      strokeDasharray="4 2"
                      strokeWidth={2}
                      dot={{
                        r: 2,
                        stroke: "#e03131",
                        fill: "#fff",
                        strokeWidth: 1,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder shadow="lg" radius={4}>
            <Title order={5} c="gray.7" mb="xs">
              Khu vực trồng trọt
            </Title>
            <Box h={310} style={{ borderRadius: 4, overflow: "hidden" }}>
              <iframe
                title="Bản đồ mật độ Việt Nam"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src="https://www.openstreetmap.org/export/embed.html?bbox=102.0%2C8.0%2C110.0%2C23.5&layer=hot&marker=16.0%2C107.5"
                allowFullScreen
              ></iframe>
            </Box>
          </Card>
        </Grid.Col>
      </Grid>
      <Divider
        my="md"
        label="Quản lý công việc nông trại"
        labelPosition="left"
      />

      {/* Task Management */}
      <Table columns={columns} data={taskItems} />
    </Stack>
  );
};

export default HomePage;
