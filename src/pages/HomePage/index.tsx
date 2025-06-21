import {
  Badge,
  Box,
  Card,
  Center,
  Divider,
  Grid,
  Group,
  Paper,
  Progress,
  RingProgress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const data = [
  { month: "Jan", income: 120000, expense: 90000 },
  { month: "Feb", income: 135000, expense: 100000 },
  { month: "Mar", income: 150000, expense: 110000 },
  { month: "Apr", income: 160000, expense: 115000 },
  { month: "May", income: 200000, expense: 130000 },
  { month: "Jun", income: 298483, expense: 180000 },
  { month: "Jul", income: 220000, expense: 150000 },
  { month: "Aug", income: 210000, expense: 140000 },
  { month: "Sep", income: 195000, expense: 130000 },
  { month: "Oct", income: 185000, expense: 125000 },
  { month: "Nov", income: 170000, expense: 120000 },
  { month: "Dec", income: 160000, expense: 115000 },
];
const HomePage = () => {
  return (
    <Stack>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        <Card withBorder shadow="md" radius={4} p="lg">
          <Stack gap={6}>
            <Text fw={600} size="sm" c="dimmed">
              Thời tiết hiện tại
            </Text>
            <Title order={2} c="blue">
              +27°C
            </Title>
            <Text size="xs" c="dimmed">
              Soil Temp: +23°C
            </Text>
            <Text size="xs" c="dimmed">
              Humidity: 78%
            </Text>
            <Text size="xs" c="dimmed">
              Wind Speed: 12m/s
            </Text>
            <Text size="xs" c="dimmed">
              Precipitation: 10mm
            </Text>
            <Group justify="space-between" mt="sm">
              <Text size="xs" c="dimmed">
                🌅 Sunrise: 5:22 AM
              </Text>
              <Text size="xs" c="dimmed">
                🌇 Sunset: 6:41 PM
              </Text>
            </Group>
          </Stack>
        </Card>

        <Card withBorder shadow="md" radius={4} p="lg">
          <Stack gap="xs">
            <Text fw={600} size="sm" c="dimmed">
              Độ ẩm đất
            </Text>
            <Text size="xs">8 Fields - Low</Text>
            <Progress value={30} color="red" radius={4} size="md" />
            <Text size="xs">36 Fields - Optimal</Text>
            <Progress value={50} color="blue" radius={4} size="md" />
            <Text size="xs">18 Fields - High</Text>
            <Progress value={20} color="teal" radius={4} size="md" />
          </Stack>
        </Card>

        <Card withBorder shadow="md" radius={4} p="lg">
          <Stack gap="xs" align="center">
            <Text fw={600} size="sm" c="dimmed">
              Chỉ số bền vững
            </Text>
            <RingProgress
              size={120}
              thickness={14}
              label={
                <Text ta={"center"} size="md">
                  45%
                </Text>
              }
              sections={[
                { value: 45, color: "yellow" },
                { value: 30, color: "blue" },
                { value: 25, color: "gray" },
              ]}
            />
            <Group gap={4} mt={4}>
              <Badge color="yellow">Bio-gas</Badge>
              <Badge color="blue">Renewable</Badge>
              <Badge color="gray">Hydro-electric</Badge>
            </Group>
          </Stack>
        </Card>

        <Card withBorder shadow="md" radius={4} p="lg">
          <Stack gap="xs">
            <Text fw={600} size="sm" c="dimmed">
              Quản lý công việc
            </Text>
            <Paper withBorder p="xs" radius={4} bg="green.0">
              <Text size="xs" c="green">
                Hôm nay: Phun thuốc định kỳ
              </Text>
              <Text size="xs">Paddy fields #1</Text>
            </Paper>
            <Paper withBorder p="xs" radius={4} bg="red.0">
              <Text size="xs" c="red">
                Chậm 2 ngày: Kiểm tra đồng ngô
              </Text>
              <Text size="xs">Maize fields #2</Text>
            </Paper>
          </Stack>
        </Card>
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" mt="md">
        {[
          { label: "Tổng số cây trồng", value: "1.200", color: "teal.7" },
          { label: "Sản lượng hôm nay", value: "850 kg", color: "green.7" },
          {
            label: "Tăng trưởng so với hôm qua",
            value: "+16%",
            color: "blue.6",
          },
          { label: "Báo cáo mới hôm nay", value: "5", color: "grape.6" },
          { label: "Thu hoạch hôm nay", value: "630 kg", color: "lime.6" },
          {
            label: "Sản lượng trung bình / cây",
            value: "0.71 kg",
            color: "indigo.6",
          },
          {
            label: "Số cây đã thu hoạch hôm nay",
            value: "890",
            color: "cyan.6",
          },
          {
            label: "Tỉ lệ hoàn thành thu hoạch",
            value: "74%",
            color: "pink.6",
          },
        ].map((item, i) => (
          <Card
            key={i}
            withBorder
            shadow="lg"
            radius="md"
            p="lg"
            style={{
              background: "#ffffff",
              transition: "all 0.2s ease",
              borderBottom: `4px solid var(--mantine-color-${item.color})`,
            }}
          >
            <Stack gap={6}>
              <Text size="xs" c="gray.6" fw={600} style={{ lettergap: 0.5 }}>
                {item.label.toUpperCase()}
              </Text>
              <Title order={2} c={item.color} lh={1}>
                {item.value}
              </Title>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
      <Divider my="md" label="Báo cáo sản lượng" labelPosition="left" />

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder shadow="sm" radius={4} p="md">
            <Title order={5} mb="xs">
              Chi phí & Doanh thu
            </Title>
            <Box h={300} p="lg">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="4 4" stroke="#ced4da" />
                  <XAxis
                    dataKey="month"
                    stroke="#343a40"
                    tick={{ fontSize: 13, fill: "#343a40" }}
                  />
                  <YAxis
                    stroke="#343a40"
                    tick={{ fontSize: 13, fill: "#343a40" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #dee2e6",
                      borderRadius: 10,
                      fontSize: 13,
                      color: "#212529",
                    }}
                    labelStyle={{ fontWeight: 600 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 14, color: "#212529" }} />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#1c7ed6"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      stroke: "#1c7ed6",
                      fill: "#fff",
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 6, fill: "#1c7ed6" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#f08c00"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      stroke: "#f08c00",
                      fill: "#fff",
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 6, fill: "#f08c00" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder shadow="sm" radius={4} p="md">
            <Title order={5} mb="xs">
              Vị trí xuất khẩu
            </Title>
            <Box h={260} bg="gray.1" style={{ borderRadius: 8 }}>
              <Center h="100%">[World Map giả lập]</Center>
            </Box>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
export default HomePage;
