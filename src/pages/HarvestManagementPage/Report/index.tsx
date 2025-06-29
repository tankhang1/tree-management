import { Button, Card, Group, Select, Stack, Title } from "@mantine/core";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ComposedChart,
  CartesianGrid,
  Line,
} from "recharts";
import { useMemo } from "react";
import { IconCalendarStats, IconFileExcel } from "@tabler/icons-react";
import groupBy from "lodash/groupBy";
import sumBy from "lodash/sumBy";
import Table from "../../../components/Table";
import type { MRT_ColumnDef } from "mantine-react-table";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
type ResourceTracking = {
  tree: string;
  quantityPerDay: number;
  quantityRemaining: number;
  unit: string;
  region: string;
  area: string;
  plot: string;
  row: string;
  date: string;
};

const harvestData = Array.from({ length: 30 }).map((_, i) => {
  const trees = ["Sầu riêng", "Xoài", "Chuối"];
  const regions = ["Vùng A", "Vùng B", "Vùng C"];
  const areas = ["Khu A1", "Khu B1", "Khu C1"];
  const plots = ["Lô 1", "Lô 2", "Lô 3", "Lô 4"];
  const rows = ["Hàng 1", "Hàng 2", "Hàng 3"];
  const units = ["Kg", "Thùng"];
  return {
    tree: trees[i % 3],
    quantityPerDay: Math.floor(Math.random() * 300 + 50),
    quantityRemaining: Math.floor(Math.random() * 100),
    unit: units[i % 2],
    region: regions[i % 3],
    area: areas[i % 3],
    plot: plots[i % 4],
    row: rows[i % 3],
    date: dayjs()
      .subtract(i % 7, "day")
      .format("YYYY-MM-DD"),
  };
});

const COLORS = ["#4dabf7", "#82ca9d", "#f59f00"];

const COLOR_MAP: Record<string, string> = {
  "Sầu riêng": "#4dabf7",
  Xoài: "#82ca9d",
  Chuối: "#f59f00",
};

const HarvestManagementReportPage = () => {
  const resourceTrackingColumns: MRT_ColumnDef<ResourceTracking>[] = [
    { accessorKey: "tree", header: "Cây" },
    { accessorKey: "quantityPerDay", header: "Số lượng/ngày" },
    { accessorKey: "quantityRemaining", header: "Còn lại" },
    { accessorKey: "unit", header: "Đơn vị tính" },
    { accessorKey: "region", header: "Vùng" },
    { accessorKey: "area", header: "Khu vực" },
    { accessorKey: "plot", header: "Lô" },
    { accessorKey: "row", header: "Hàng" },
  ];

  const pieData = useMemo(() => {
    const grouped = groupBy(harvestData, "tree");
    return Object.entries(grouped).map(([tree, entries]) => ({
      name: tree,
      value: sumBy(entries, "quantityPerDay"),
    }));
  }, []);

  const groupedByDate = groupBy(harvestData, "date");
  const summaryPerDay = Object.entries(groupedByDate).map(([date, items]) => ({
    date,
    totalQuantity: sumBy(items, "quantityPerDay"),
  }));
  const remainingByTree = useMemo(() => {
    return Object.entries(groupBy(harvestData, "tree")).map(
      ([tree, items]) => ({
        tree,
        quantityRemaining: sumBy(items, "quantityRemaining"),
      })
    );
  }, []);
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={3}>Báo cáo thu hoạch</Title>
        <Group align="flex-end">
          <DatePickerInput
            label="Chọn ngày"
            placeholder="Chọn ngày thu hoạch"
            leftSection={<IconCalendarStats size={16} />}
            radius={4}
            type="range"
            locale="vi"
            w={300}
          />
          <Select
            label="Chọn vùng trồng"
            placeholder="Chọn vùng trồng"
            radius={4}
          />
          <Select
            label="Chọn khu vực"
            placeholder="Chọn khu vực"
            radius={4}
            clearable
          />
          <Select label="Chọn lô" placeholder="Chọn lô" radius={4} clearable />
          <Button leftSection={<IconFileExcel size={18} />} radius={4}>
            Xuất File
          </Button>
        </Group>
      </Group>
      <Card withBorder shadow="sm" radius={4} p="lg" mt="md">
        <Title order={4} mb="md">
          Sản lượng mỗi ngày
        </Title>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart
            data={summaryPerDay}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="totalQuantity"
              barSize={30}
              fill="#4dabf7"
              name="Tổng sản lượng"
              radius={[4, 4, 0, 0]}
            />
            <Line
              type="monotone"
              dataKey="totalQuantity"
              stroke="#f03e3e"
              name="Tổng sản lượng (line)"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>
      <Stack>
        <Card withBorder shadow="sm" radius={4} p="lg">
          <Title order={4} mb="md">
            Tỉ lệ thu hoạch
          </Title>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry, index) => (
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
        </Card>

        <Card withBorder shadow="sm" radius={8} p="lg">
          <Title order={4} mb="md">
            Còn lại theo cây
          </Title>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={remainingByTree}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <XAxis dataKey="tree" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar
                dataKey="quantityRemaining"
                name="Còn lại"
                radius={[4, 4, 0, 0]}
              >
                {remainingByTree.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      COLOR_MAP[entry.tree] || COLORS[index % COLORS.length]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Stack>
      <Table columns={resourceTrackingColumns} data={harvestData} />
    </Stack>
  );
};

export default HarvestManagementReportPage;
