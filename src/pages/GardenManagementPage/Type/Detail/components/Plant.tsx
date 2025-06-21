import {
  Box,
  Button,
  Divider,
  Group,
  Paper,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconCalendar,
  IconDatabaseExport,
  IconPlus,
  IconTableImport,
} from "@tabler/icons-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
} from "recharts";
import Table from "../../../../../components/Table";
import { useMemo } from "react";
import type { MRT_ColumnDef } from "mantine-react-table";

const chartData = [
  { area: "Khu vực A", value: 117 },
  { area: "Khu vực B", value: 124 },
  { area: "Khu vực C", value: 119 },
  { area: "Khu vực D", value: 115 },
  { area: "Khu vực E", value: 124 },
  { area: "Khu vực F", value: 117 },
  { area: "Khu vực G", value: 119 },
];
type PlantingBatch = {
  batch: string; // Ví dụ: "Đợt 1 (686)"
  area: string; // Ví dụ: "Khu vực A"
  start: string; // Ví dụ: "12/03/2025"
  harvest: string; // Ví dụ: "12/03/2026"
};
const rawData: PlantingBatch[] = [
  {
    batch: "Đợt 1 (686)",
    area: "Khu vực A",
    start: "12/03/2025",
    harvest: "12/03/2026",
  },
  {
    batch: "Đợt 2 (686)",
    area: "Khu vực B",
    start: "12/03/2025",
    harvest: "12/03/2026",
  },
  {
    batch: "Đợt 3 (686)",
    area: "Khu vực C",
    start: "12/03/2025",
    harvest: "12/03/2026",
  },
  {
    batch: "Đợt 4 (686)",
    area: "Khu vực D",
    start: "12/03/2025",
    harvest: "12/03/2026",
  },
];

const Plant = () => {
  const columns = useMemo<MRT_ColumnDef<PlantingBatch>[]>(
    () => [
      {
        accessorKey: "batch",
        header: "Đợt trồng/ Số lượng (cây)",
        size: 200,
      },
      {
        accessorKey: "area",
        header: "Khu vực",
        size: 150,
      },
      {
        accessorKey: "start",
        header: "Ngày bắt đầu trồng",
        size: 150,
      },
      {
        accessorKey: "harvest",
        header: "Ngày thu hoạch",
        size: 150,
      },
    ],
    []
  );
  return (
    <Box>
      <Group justify="space-between" mb="xs">
        <Text fz={"h3"} fw={"bold"}>
          Biểu đồ trồng trọt
        </Text>
        <DatePickerInput
          placeholder="Ngày bắt đầu - Ngày kết thúc"
          w={"auto"}
          radius={4}
          locale="vi"
          type="range"
          leftSection={<IconCalendar size={18} />}
        />
      </Group>
      <Stack gap={30}>
        <Stack gap={3}>
          <Text size="sm" c="dimmed" mb="xs">
            Trồng từ 01/01/2025 - 12/05/2025
          </Text>
          <Paper py={40} radius={4} withBorder>
            <Stack gap={20}>
              <Text ta={"center"} fw={"bold"}>
                Biểu đồ nhóm cây trồng/ Khu vực/ Cây trồng
              </Text>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={chartData}
                  margin={{ bottom: 0, left: 10, right: 10 }}
                  barSize={32}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#EAEAEA"
                  />
                  <XAxis
                    dataKey="area"
                    tick={{ fontSize: 12, fontWeight: "bold" }}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fontWeight: "bold" }}
                    axisLine={false}
                    label={{
                      value: "(Số lượng cây)",
                      angle: 0,
                      position: "top",
                      offset: -30,
                      style: { fontSize: 12 },
                    }}
                  />
                  <Tooltip cursor={{ fill: "#F9F9F9" }} />
                  <Bar dataKey="value" fill="#12B886" radius={[4, 4, 0, 0]}>
                    <LabelList
                      dataKey="value"
                      position="top"
                      content={({ x, y, value }) => (
                        <foreignObject
                          //@ts-expect-error no check
                          x={x - 5}
                          //@ts-expect-error no check
                          y={y - 24}
                          width={40}
                          height={24}
                        >
                          <Box
                            style={{
                              background: "#fff",
                              border: "2px solid #12B886",
                              borderRadius: 999,
                              padding: "0px 6px",
                              fontSize: 10,
                              fontWeight: 600,
                              color: "#12B886",
                              textAlign: "center",
                            }}
                          >
                            {value}
                          </Box>
                        </foreignObject>
                      )}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Stack>
          </Paper>
        </Stack>
        <Divider />
        <Stack>
          <Group justify="space-between">
            <Text fz={"h3"} fw={"bold"}>
              Chi tiết trồng trọt
            </Text>
            <Group>
              <Button variant="transparent" c={"black"} bd={"none"}>
                <Group align="center" gap={4}>
                  <IconTableImport size={18} />
                  <Text>Nhập file</Text>
                </Group>
              </Button>
              <Divider orientation="vertical" />
              <Button variant="transparent" c={"black"} bd={"none"}>
                <Group align="center" gap={4}>
                  <IconDatabaseExport size={18} />
                  <Text>Xuất file</Text>
                </Group>
              </Button>
              <Divider orientation="vertical" />
              <Button variant="transparent" bd={"none"}>
                <Group align="center" gap={4}>
                  <IconPlus size={18} />
                  <Text>Thêm mới</Text>
                </Group>
              </Button>
            </Group>
          </Group>
          <Group>
            <DatePickerInput
              placeholder="Ngày bắt đầu - Ngày thu hoạch"
              w={300}
              radius={4}
              locale="vi"
              type="range"
              leftSection={<IconCalendar size={18} />}
            />
            <Select placeholder="Khu vực" radius={4} data={["Vụ 1", "Vụ 2"]} />
          </Group>
          <Table columns={columns} data={rawData} />
        </Stack>
      </Stack>
    </Box>
  );
};
export default Plant;
