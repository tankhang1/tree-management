import {
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  MultiSelect,
  NumberInput,
  Paper,
  RingProgress,
  ScrollArea,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RTooltip,
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
import { useMemo, useState } from "react";
import { IconCalendarStats, IconFileExcel } from "@tabler/icons-react";
import groupBy from "lodash/groupBy";
import sumBy from "lodash/sumBy";
import orderBy from "lodash/orderBy";
import uniq from "lodash/uniq";
import Table from "../../../components/Table";
import type { MRT_ColumnDef } from "mantine-react-table";
import { DatePickerInput } from "@mantine/dates";
import * as XLSX from "xlsx";
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

const SEED_TREES = ["Sầu riêng", "Xoài", "Chuối"];
const SEED_REGIONS = ["Vùng A", "Vùng B", "Vùng C"];
const SEED_AREAS = ["Khu A1", "Khu B1", "Khu C1"];
const SEED_PLOTS = ["Lô 1", "Lô 2", "Lô 3", "Lô 4"];
const SEED_ROWS = ["Hàng 1", "Hàng 2", "Hàng 3"];
const SEED_UNITS = ["Kg", "Thùng"];

const harvestData: ResourceTracking[] = Array.from({ length: 120 }).map(
  (_, i) => {
    const d = dayjs().subtract(i % 14, "day");
    return {
      tree: SEED_TREES[i % SEED_TREES.length],
      quantityPerDay: Math.floor(Math.random() * 400 + 80),
      quantityRemaining: Math.floor(Math.random() * 150),
      unit: SEED_UNITS[i % SEED_UNITS.length],
      region: SEED_REGIONS[i % SEED_REGIONS.length],
      area: SEED_AREAS[i % SEED_AREAS.length],
      plot: SEED_PLOTS[i % SEED_PLOTS.length],
      row: SEED_ROWS[i % SEED_ROWS.length],
      date: d.format("YYYY-MM-DD"),
    };
  }
);

const COLORS = [
  "#4dabf7",
  "#82ca9d",
  "#f59f00",
  "#ae3ec9",
  "#12b886",
  "#ff922b",
];
const COLOR_MAP: Record<string, string> = {
  "Sầu riêng": "#4dabf7",
  Xoài: "#82ca9d",
  Chuối: "#f59f00",
};

const fmtKg = (n: number) => n.toLocaleString("vi-VN");
const toDate = (s?: string | null) =>
  s
    ? dayjs(s)
    : //@ts-expect-error no check
      dayjs.invalid();

const HarvestManagementReportPage = () => {
  const [range, setRange] = useState<[Date | null, Date | null]>([
    dayjs().subtract(6, "day").toDate(),
    dayjs().toDate(),
  ]);
  const [granularity, setGranularity] = useState<"day" | "week" | "month">(
    "day"
  );
  const [regions, setRegions] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [plots, setPlots] = useState<string[]>([]);
  const [trees, setTrees] = useState<string[]>(["Sầu riêng", "Xoài", "Chuối"]);

  const dataInRange = useMemo(() => {
    const [s, e] = range;
    const sd = toDate(s?.toString()).startOf("day");
    const ed = toDate(e?.toString()).endOf("day");
    return harvestData.filter((r) => {
      const d = dayjs(r.date);
      const inRange =
        d.isValid() &&
        d.isAfter(sd.subtract(1, "ms")) &&
        d.isBefore(ed.add(1, "ms"));
      const regionOk = regions.length ? regions.includes(r.region) : true;
      const areaOk = areas.length ? areas.includes(r.area) : true;
      const plotOk = plots.length ? plots.includes(r.plot) : true;
      const treeOk = trees.length ? trees.includes(r.tree) : true;
      return inRange && regionOk && areaOk && plotOk && treeOk;
    });
  }, [range, regions, areas, plots, trees]);

  const regionOptions = useMemo(
    () =>
      uniq(dataInRange.map((d) => d.region)).map((v) => ({
        value: v,
        label: v,
      })),
    [dataInRange]
  );
  const areaOptions = useMemo(
    () =>
      uniq(dataInRange.map((d) => d.area)).map((v) => ({ value: v, label: v })),
    [dataInRange]
  );
  const plotOptions = useMemo(
    () =>
      uniq(dataInRange.map((d) => d.plot)).map((v) => ({ value: v, label: v })),
    [dataInRange]
  );
  const treeOptions = useMemo(
    () =>
      uniq(harvestData.map((d) => d.tree)).map((v) => ({ value: v, label: v })),
    []
  );

  const totals = useMemo(() => {
    const totalQty = sumBy(dataInRange, "quantityPerDay");
    const totalRemain = sumBy(dataInRange, "quantityRemaining");
    const days = uniq(dataInRange.map((d) => d.date)).length || 1;
    const avgPerDay = totalQty / days;
    const byDay = Object.entries(groupBy(dataInRange, "date")).map(
      ([date, items]) => ({
        date,
        total: sumBy(items, "quantityPerDay"),
      })
    );
    const maxDay = byDay.length
      ? byDay.reduce((a, b) => (a.total > b.total ? a : b))
      : { date: "-", total: 0 };
    const minDay = byDay.length
      ? byDay.reduce((a, b) => (a.total < b.total ? a : b))
      : { date: "-", total: 0 };
    const completion =
      totalQty + totalRemain > 0
        ? (totalQty / (totalQty + totalRemain)) * 100
        : 0;
    return { totalQty, totalRemain, avgPerDay, maxDay, minDay, completion };
  }, [dataInRange]);

  const summaryPerX = useMemo(() => {
    const grouper =
      granularity === "day"
        ? (x: ResourceTracking) => x.date
        : granularity === "week"
        ? (x: ResourceTracking) =>
            dayjs(x.date).startOf("week").format("GGGG-[W]WW")
        : (x: ResourceTracking) =>
            dayjs(x.date).startOf("month").format("YYYY-MM");

    const grouped = groupBy(dataInRange, grouper);
    const series = orderBy(
      Object.entries(grouped).map(([bucket, items]) => ({
        bucket,
        totalQuantity: sumBy(items, "quantityPerDay"),
      })),
      (x) => x.bucket
    );

    const withMA = series.map((s, i, arr) => {
      const window = arr.slice(Math.max(0, i - 6), i + 1);
      const ma =
        window.reduce((a, b) => a + b.totalQuantity, 0) / window.length;
      return { ...s, movingAvg: Math.round(ma) };
    });

    return withMA.map((d) => ({
      label:
        granularity === "day"
          ? d.bucket
          : granularity === "week"
          ? d.bucket.replace("W", "Tuần ")
          : dayjs(d.bucket + "-01").format("MM/YYYY"),
      totalQuantity: d.totalQuantity,
      movingAvg: d.movingAvg,
    }));
  }, [dataInRange, granularity]);

  const pieData = useMemo(() => {
    const grouped = groupBy(dataInRange, "tree");
    return Object.entries(grouped).map(([tree, entries]) => ({
      name: tree,
      value: sumBy(entries, "quantityPerDay"),
    }));
  }, [dataInRange]);

  const remainingByTree = useMemo(() => {
    const grouped = groupBy(dataInRange, "tree");
    return Object.entries(grouped).map(([tree, items]) => ({
      tree,
      quantityRemaining: sumBy(items, "quantityRemaining"),
    }));
  }, [dataInRange]);

  const byRegion = useMemo(() => {
    const grouped = groupBy(dataInRange, "region");
    return Object.entries(grouped).map(([region, items], idx) => ({
      region,
      total: sumBy(items, "quantityPerDay"),
      color: COLORS[idx % COLORS.length],
    }));
  }, [dataInRange]);

  const topPlots = useMemo(() => {
    const grouped = groupBy(dataInRange, "plot");
    const list = Object.entries(grouped).map(([plot, items]) => ({
      plot,
      region: items[0]?.region,
      area: items[0]?.area,
      total: sumBy(items, "quantityPerDay"),
    }));
    return orderBy(list, (x) => x.total, "desc").slice(0, 5);
  }, [dataInRange]);

  const anomalies = useMemo(() => {
    const byDay = Object.entries(groupBy(dataInRange, "date")).map(
      ([date, items]) => ({
        date,
        total: sumBy(items, "quantityPerDay"),
      })
    );
    const mean = byDay.reduce((a, b) => a + b.total, 0) / (byDay.length || 1);
    const variance =
      byDay.reduce((a, b) => a + Math.pow(b.total - mean, 2), 0) /
      (byDay.length || 1);
    const std = Math.sqrt(variance);
    return byDay.filter((d) => Math.abs(d.total - mean) > 2 * std);
  }, [dataInRange]);

  const tableColumns: MRT_ColumnDef<ResourceTracking>[] = [
    { accessorKey: "date", header: "Ngày" },
    { accessorKey: "tree", header: "Cây" },
    { accessorKey: "quantityPerDay", header: "Số lượng/ngày" },
    { accessorKey: "quantityRemaining", header: "Còn lại" },
    { accessorKey: "unit", header: "Đơn vị" },
    { accessorKey: "region", header: "Vùng" },
    { accessorKey: "area", header: "Khu vực" },
    { accessorKey: "plot", header: "Lô" },
    { accessorKey: "row", header: "Hàng" },
  ];

  const exportExcel = () => {
    const ws1 = XLSX.utils.json_to_sheet(dataInRange);
    const ws2 = XLSX.utils.aoa_to_sheet([
      ["Tổng quan"],
      ["Tổng sản lượng", totals.totalQty],
      ["Còn lại", totals.totalRemain],
      ["TB/ngày", Math.round(totals.avgPerDay)],
      ["Ngày cao nhất", `${totals.maxDay.date} - ${totals.maxDay.total}`],
      ["Ngày thấp nhất", `${totals.minDay.date} - ${totals.minDay.total}`],
      ["Hoàn thành (%)", `${totals.completion.toFixed(1)}%`],
    ]);
    const ws3 = XLSX.utils.json_to_sheet(summaryPerX);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, "Chi tiết");
    XLSX.utils.book_append_sheet(wb, ws3, "Tổng hợp theo kỳ");
    XLSX.utils.book_append_sheet(wb, ws2, "Tổng quan");
    XLSX.writeFile(wb, "bao-cao-thu-hoach.xlsx");
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <Stack gap={2}>
          <Title order={3}>Báo cáo thu hoạch</Title>
          <Text c="dimmed" size="sm">
            {dayjs(range[0]).format("DD/MM/YYYY")} –{" "}
            {dayjs(range[1]).format("DD/MM/YYYY")}
          </Text>
        </Stack>
        <Group align="flex-end" gap="sm" wrap="wrap">
          <DatePickerInput
            label="Khoảng ngày"
            placeholder="Chọn khoảng ngày"
            leftSection={<IconCalendarStats size={16} />}
            radius={4}
            type="range"
            locale="vi"
            value={range}
            //@ts-expect-error no check
            onChange={setRange}
            w={280}
          />
          <SegmentedControl
            value={granularity}
            onChange={(v: any) => setGranularity(v)}
            data={[
              { value: "day", label: "Ngày" },
              { value: "week", label: "Tuần" },
              { value: "month", label: "Tháng" },
            ]}
            radius={4}
          />

          <Button
            leftSection={<IconFileExcel size={18} />}
            radius={4}
            onClick={exportExcel}
          >
            Xuất Excel
          </Button>
        </Group>
      </Group>
      <Group>
        <MultiSelect
          label="Cây"
          searchable
          clearable
          radius={4}
          value={trees}
          onChange={setTrees}
          data={treeOptions}
        />
        <MultiSelect
          label="Vùng"
          searchable
          clearable
          radius={4}
          value={regions}
          onChange={setRegions}
          data={regionOptions}
          w={220}
        />
        <MultiSelect
          label="Khu vực"
          searchable
          clearable
          radius={4}
          value={areas}
          onChange={setAreas}
          data={areaOptions}
          w={220}
        />
        <MultiSelect
          label="Lô"
          searchable
          clearable
          radius={4}
          value={plots}
          onChange={setPlots}
          data={plotOptions}
          w={220}
        />
      </Group>
      <SimpleGrid cols={{ base: 1, md: 3 }}>
        <Card withBorder shadow="sm" radius={4} p="lg">
          <Text size="xs" c="dimmed">
            Tổng sản lượng
          </Text>
          <Group justify="space-between" align="center" mt={4}>
            <Title order={3}>
              {fmtKg(totals.totalQty)} {dataInRange[0]?.unit || "Kg"}
            </Title>
          </Group>
          <Divider my="sm" />
          <Group gap="xs">
            <Badge variant="dot" color="gray">
              Bản ghi: {dataInRange.length}
            </Badge>
            <Badge variant="light">
              Ngày: {uniq(dataInRange.map((d) => d.date)).length}
            </Badge>
          </Group>
        </Card>
        <Card withBorder shadow="sm" radius={4} p="lg">
          <Text size="xs" c="dimmed">
            Trung bình/ngày
          </Text>
          <Group justify="space-between" align="center" mt={4}>
            <Title order={3} c="teal">
              {fmtKg(Math.round(totals.avgPerDay))}{" "}
              {dataInRange[0]?.unit || "Kg"}
            </Title>
          </Group>
          <Divider my="sm" />
          <Text size="sm">
            Cao nhất: {totals.maxDay.date} • {fmtKg(totals.maxDay.total)}
          </Text>
          <Text size="sm" c="dimmed">
            Thấp nhất: {totals.minDay.date} • {fmtKg(totals.minDay.total)}
          </Text>
        </Card>
        <Card withBorder shadow="sm" radius={4} p="lg">
          <Text size="xs" c="dimmed">
            Hoàn thành
          </Text>
          <Group justify="space-between" align="center" mt={4}>
            <Title order={3} c="indigo">
              {fmtKg(totals.totalQty)} /{" "}
              {fmtKg(totals.totalQty + totals.totalRemain)}
            </Title>
          </Group>
          <Divider my="sm" />
          <Text size="sm" c="dimmed">
            Còn lại: {fmtKg(totals.totalRemain)} {dataInRange[0]?.unit || "Kg"}
          </Text>
        </Card>
      </SimpleGrid>

      <Card withBorder shadow="sm" radius={4} p="lg" mt="md">
        <Group justify="space-between" mb="xs">
          <Title order={4}>
            Sản lượng theo{" "}
            {granularity === "day"
              ? "ngày"
              : granularity === "week"
              ? "tuần"
              : "tháng"}
          </Title>
        </Group>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart
            data={summaryPerX}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <RTooltip />
            <Legend />
            <Bar
              dataKey="totalQuantity"
              barSize={28}
              name="Tổng sản lượng"
              radius={[4, 4, 0, 0]}
              background
              fill="#4dabf7"
            />
            <Line
              type="monotone"
              dataKey="movingAvg"
              stroke="#fa5252"
              strokeWidth={2}
              name="Trung bình động"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder shadow="sm" radius={4} p="lg">
            <Title order={4} mb="md">
              Tỉ lệ thu hoạch theo cây
            </Title>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLOR_MAP[entry.name] || COLORS[index % COLORS.length]
                      }
                    />
                  ))}
                </Pie>
                <RTooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder shadow="sm" radius={4} p="lg">
            <Title order={4} mb="md">
              Phân bố sản lượng theo vùng
            </Title>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={byRegion}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="region" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <RTooltip />
                <Bar dataKey="total" name="Sản lượng" radius={[4, 4, 0, 0]}>
                  {byRegion.map((entry, index) => (
                    <Cell key={`r-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder shadow="sm" radius={4} p="lg">
            <Title order={4} mb="md">
              Còn lại theo cây
            </Title>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={remainingByTree}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="tree" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <RTooltip />
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
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder shadow="sm" radius={4} p="lg">
            <Title order={4} mb="md">
              Top 5 lô theo sản lượng
            </Title>
            <ScrollArea.Autosize mah={220}>
              <Stack gap="xs">
                {topPlots.map((p, idx) => (
                  <Group key={p.plot} justify="space-between">
                    <Group gap="xs">
                      <Badge variant="filled">{idx + 1}</Badge>
                      <Text fw={600}>{p.plot}</Text>
                      <Badge variant="light" color="gray">
                        {p.region}
                      </Badge>
                      <Badge variant="light" color="gray">
                        {p.area}
                      </Badge>
                    </Group>
                    <Text fw={600}>
                      {fmtKg(p.total)} {dataInRange[0]?.unit || "Kg"}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </ScrollArea.Autosize>
            <Divider my="sm" />
            <Title order={6} c="dimmed">
              Ngày bất thường
            </Title>
            <Stack gap={4} mt={6}>
              {anomalies.length === 0 ? (
                <Text size="sm" c="dimmed">
                  Không ghi nhận bất thường
                </Text>
              ) : (
                anomalies.map((a) => (
                  <Group key={a.date} justify="space-between">
                    <Text size="sm">{a.date}</Text>
                    <Badge color="red" variant="light">
                      {fmtKg(a.total)}
                    </Badge>
                  </Group>
                ))
              )}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      <Card withBorder shadow="sm" radius={4} p="lg">
        <Group justify="space-between" mb="md">
          <Title order={4}>Bảng chi tiết</Title>
          <Group gap="xs">
            <NumberInput
              label="Ngưỡng cảnh báo (kg/ngày)"
              min={0}
              defaultValue={300}
              radius={6}
            />
            <Select
              label="Đơn vị hiển thị"
              data={[
                { value: "Kg", label: "Kg" },
                { value: "Thùng", label: "Thùng" },
              ]}
              defaultValue={dataInRange[0]?.unit || "Kg"}
              radius={6}
            />
          </Group>
        </Group>
        <Table
          columns={tableColumns}
          data={orderBy(dataInRange, (r) => r.date, "desc")}
        />
      </Card>
    </Stack>
  );
};

export default HarvestManagementReportPage;
