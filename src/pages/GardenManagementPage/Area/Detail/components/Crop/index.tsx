import {
  Accordion,
  Box,
  Button,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  Tooltip,
} from "recharts";
import Table from "../../../../../../components/Table";
import { useMemo } from "react";
import type { MRT_ColumnDef } from "mantine-react-table";

const chartData = [
  { lot: "A01", value: 117 },
  { lot: "A02", value: 124 },
  { lot: "A03", value: 119 },
  { lot: "A04", value: 115 },
  { lot: "A05", value: 124 },
  { lot: "A06", value: 117 },
  { lot: "A07", value: 119 },
];
type PlantingRow = {
  plantType: string;
  group: string;
  quantity: number;
  rowName: string;
  startDate: string;
};

const plantingData: { lot: string; records: PlantingRow[] }[] = [
  {
    lot: "Lô 1",
    records: [
      {
        plantType: "Sầu riêng",
        group: "Sầu riêng Ri6",
        quantity: 686,
        rowName: "A01-01",
        startDate: "12/03/2025",
      },
      {
        plantType: "Sầu riêng",
        group: "Sầu riêng Ri6",
        quantity: 686,
        rowName: "A01-01",
        startDate: "12/03/2025",
      },
      {
        plantType: "Sầu riêng",
        group: "Sầu riêng Ri6",
        quantity: 686,
        rowName: "A01-01",
        startDate: "12/03/2025",
      },
      {
        plantType: "Sầu riêng",
        group: "Sầu riêng Ri6",
        quantity: 686,
        rowName: "A01-01",
        startDate: "12/03/2025",
      },
    ],
  },
  { lot: "Lô 2", records: [] },
  { lot: "Lô 3", records: [] },
  { lot: "Lô 4", records: [] },
];

const Crop = () => {
  const columns = useMemo<MRT_ColumnDef<PlantingRow>[]>(
    () => [
      {
        accessorKey: "plantType",
        header: "Tên loại cây trồng",
      },
      {
        accessorKey: "group",
        header: "Tên nhóm cây trồng",
      },
      {
        accessorKey: "quantity",
        header: "Số lượng",
      },
      {
        accessorKey: "rowName",
        header: "Tên hàng",
      },
      {
        accessorKey: "startDate",
        header: "Ngày bắt đầu trồng",
      },
    ],
    []
  );
  return (
    <Stack p="md">
      <Stack gap={0}>
        <Group justify="space-between" mb="sm">
          <Title order={4}>Địa điểm trồng cây</Title>
          <Select
            data={["Khu A", "Khu B"]}
            defaultValue="Khu A"
            w={140}
            radius={4}
          />
        </Group>
        <Text size="sm" c="dimmed" mb={8}>
          Trồng từ 01/01/2025 - 12/05/2025
        </Text>
      </Stack>
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
                dataKey="lot"
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

      <Group justify="space-between" mb="xs">
        <Title order={5}>Trồng trọt</Title>
        <Group>
          <TextInput
            leftSection={<IconSearch size={16} />}
            placeholder="Tìm kiếm"
            radius={4}
          />
          <Button leftSection={<IconPlus size={16} />} radius={4}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Accordion variant="contained" radius={4}>
        {plantingData.map(({ lot, records }) => (
          <Accordion.Item value={lot} key={lot}>
            <Accordion.Control>
              <Text fw={400}>{lot}</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Table columns={columns} data={records || []} />
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>

      <Group justify="end" mt="md">
        <Button variant="default" radius={4}>
          Hủy
        </Button>
        <Button radius={4}>Lưu</Button>
      </Group>
    </Stack>
  );
};

export default Crop;
