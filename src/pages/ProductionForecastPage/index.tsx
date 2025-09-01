import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Modal,
  NumberInput,
  Paper,
  ScrollArea,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowLeft,
  IconCalendar,
  IconEdit,
  IconFileSpreadsheet,
  IconFileTypePdf,
  IconLock,
  IconRefresh,
  IconTrendingUp,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";

dayjs.extend(isoWeek);

type Region = {
  id: string;
  name: string;
  areaHa: number;
  trees: number;
  avgYieldPerHa: number;
};
type Bucket = {
  key: string;
  label: string;
  start: string;
  end: string;
  monthIndex: number;
  days: number;
};
type Policy = "average" | "growth10" | "seasonal" | "customFactor";

const REGIONS: Region[] = [
  {
    id: "V01",
    name: "Vùng 01 - Bình Dương",
    areaHa: 25,
    trees: 6800,
    avgYieldPerHa: 1200,
  },
  {
    id: "V02",
    name: "Vùng 02 - Đồng Nai",
    areaHa: 40,
    trees: 11000,
    avgYieldPerHa: 1350,
  },
  {
    id: "V03",
    name: "Vùng 03 - Tây Ninh",
    areaHa: 15,
    trees: 4200,
    avgYieldPerHa: 1050,
  },
];

const SEASONAL_FACTORS = [
  0.9, 0.95, 1.0, 1.05, 1.08, 1.12, 1.15, 1.1, 1.05, 1.0, 0.95, 0.92,
];

const kg = (n: number) => Math.round(n);

const buildBuckets = (
  granularity: "day" | "week" | "month" | "year",
  start: string,
  end: string
): Bucket[] => {
  const s = dayjs(start).startOf(granularity === "week" ? "week" : granularity);
  const e = dayjs(end).endOf(granularity === "week" ? "week" : granularity);
  const res: Bucket[] = [];
  let cur = s.clone();
  while (cur.isBefore(e)) {
    if (granularity === "day") {
      const label = cur.format("DD/MM");
      res.push({
        key: cur.format("YYYY-MM-DD"),
        label,
        start: cur.toISOString(),
        end: cur.endOf("day").toISOString(),
        monthIndex: cur.month(),
        days: 1,
      });
      cur = cur.add(1, "day");
    } else if (granularity === "week") {
      const endW = cur.endOf("week");
      res.push({
        key: `W${cur.isoWeek()}-${cur.year()}`,
        label: `Tuần ${cur.isoWeek()}/${cur.year()}`,
        start: cur.toISOString(),
        end: endW.toISOString(),
        monthIndex: cur.month(),
        days: endW.diff(cur, "day") + 1,
      });
      cur = endW.add(1, "day");
    } else if (granularity === "month") {
      const endM = cur.endOf("month");
      res.push({
        key: cur.format("YYYY-MM"),
        label: cur.format("MM/YYYY"),
        start: cur.toISOString(),
        end: endM.toISOString(),
        monthIndex: cur.month(),
        days: endM.diff(cur, "day") + 1,
      });
      cur = endM.add(1, "day");
    } else {
      const endY = cur.endOf("year");
      res.push({
        key: cur.format("YYYY"),
        label: cur.format("YYYY"),
        start: cur.toISOString(),
        end: endY.toISOString(),
        monthIndex: cur.month(),
        days: endY.diff(cur, "day") + 1,
      });
      cur = endY.add(1, "day");
    }
  }
  return res;
};

const computeForecast = ({
  buckets,
  region,
  policy,
  customFactor,
  overrides,
}: {
  buckets: Bucket[];
  region: Region;
  policy: Policy;
  customFactor: number;
  overrides: Record<string, number | undefined>;
}) => {
  const basePerDay = (region.areaHa * region.avgYieldPerHa) / 365;
  let growthSeed = 1;
  return buckets.map((b, idx) => {
    let value = basePerDay * b.days;
    if (policy === "growth10") {
      if (idx === 0) growthSeed = 1;
      else growthSeed *= 1.1;
      value *= growthSeed;
    } else if (policy === "seasonal") {
      value *= SEASONAL_FACTORS[b.monthIndex];
    } else if (policy === "customFactor") {
      value *= customFactor;
    }
    const manual = overrides[b.key];
    return {
      ...b,
      baseline: kg(basePerDay * b.days),
      forecast: kg(value),
      adjusted: kg(manual ?? value),
      edited: manual !== undefined,
    };
  });
};

const ExportButtons = ({
  rows,
  meta,
}: {
  rows: ReturnType<typeof computeForecast>;
  meta: { region: Region; period: string; policyText: string };
}) => {
  const exportPDF = () => {
    const doc = new jsPDF({ unit: "pt" });
    doc.setFontSize(14);
    doc.text("Báo cáo dự báo sản lượng", 40, 40);
    doc.setFontSize(10);
    doc.text(`Vùng: ${meta.region.name}`, 40, 58);
    doc.text(`Khoảng thời gian: ${meta.period}`, 40, 72);
    doc.text(`Chính sách: ${meta.policyText}`, 40, 86);
    const body = rows.map((r) => [
      r.label,
      r.baseline.toLocaleString("vi-VN"),
      r.forecast.toLocaleString("vi-VN"),
      r.adjusted.toLocaleString("vi-VN"),
    ]);
    autoTable(doc, {
      startY: 104,
      head: [["Kỳ", "Cơ sở (kg)", "Dự báo (kg)", "Điều chỉnh (kg)"]],
      body,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [17, 122, 101] },
    });
    doc.save("du-bao-san-luong.pdf");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["Báo cáo dự báo sản lượng"],
      [`Vùng: ${meta.region.name}`],
      [`Khoảng thời gian: ${meta.period}`],
      [`Chính sách: ${meta.policyText}`],
      [],
      ["Kỳ", "Cơ sở (kg)", "Dự báo (kg)", "Điều chỉnh (kg)"],
      ...rows.map((r) => [r.label, r.baseline, r.forecast, r.adjusted]),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Forecast");
    XLSX.writeFile(wb, "du-bao-san-luong.xlsx");
  };

  return (
    <Group gap="xs">
      <Button
        radius={4}
        leftSection={<IconFileTypePdf size={16} />}
        onClick={exportPDF}
      >
        Xuất PDF
      </Button>
      <Button
        radius={4}
        variant="light"
        leftSection={<IconFileSpreadsheet size={16} />}
        onClick={exportExcel}
      >
        Xuất Excel
      </Button>
    </Group>
  );
};

const ProductionForecastPage = () => {
  const [regionId, setRegionId] = useState(REGIONS[0].id);
  const [granularity, setGranularity] = useState<
    "day" | "week" | "month" | "year"
  >("month");
  const [range, setRange] = useState<[Date, Date]>([
    dayjs().startOf("month").toDate(),
    dayjs().endOf("month").toDate(),
  ]);
  const [policy, setPolicy] = useState<Policy>("seasonal");
  const [customFactor, setCustomFactor] = useState(1.0);
  const [overrides, setOverrides] = useState<
    Record<string, number | undefined>
  >({});
  const [canEdit, setCanEdit] = useState(true);
  const [editModal, { open, close }] = useDisclosure(false);
  const [editRow, setEditRow] = useState<{
    key: string;
    label: string;
    value: number;
  } | null>(null);

  const region = useMemo(
    () => REGIONS.find((r) => r.id === regionId)!,
    [regionId]
  );

  const buckets = useMemo(() => {
    const s = range[0] ?? new Date();
    const e = range[1] ?? range[0] ?? new Date();
    return buildBuckets(granularity, s.toISOString(), e.toISOString());
  }, [granularity, range]);

  const rows = useMemo(
    () => computeForecast({ buckets, region, policy, customFactor, overrides }),
    [buckets, region, policy, customFactor, overrides]
  );

  const totals = useMemo(() => {
    const base = rows.reduce((a, b) => a + b.baseline, 0);
    const fc = rows.reduce((a, b) => a + b.forecast, 0);
    const adj = rows.reduce((a, b) => a + b.adjusted, 0);
    return { base: kg(base), fc: kg(fc), adj: kg(adj) };
  }, [rows]);

  const periodText = useMemo(() => {
    const s = dayjs(range[0] ?? new Date()).format("DD/MM/YYYY");
    const e = dayjs(range[1] ?? range[0] ?? new Date()).format("DD/MM/YYYY");
    return `${s} → ${e} (${granularity})`;
  }, [range, granularity]);

  const policyText = useMemo(() => {
    if (policy === "average") return "Bình quân";
    if (policy === "growth10") return "Tăng trưởng 10%";
    if (policy === "customFactor") return `Hệ số ${customFactor}x`;
    return "Theo mùa vụ";
  }, [policy, customFactor]);

  const onEdit = (r: { key: string; label: string; adjusted: number }) => {
    setEditRow({ key: r.key, label: r.label, value: r.adjusted });
    open();
  };

  const applyEdit = () => {
    if (editRow) {
      setOverrides((m) => ({ ...m, [editRow.key]: editRow.value }));
      close();
    }
  };

  useEffect(() => {
    setOverrides({});
  }, [
    regionId,
    policy,
    customFactor,
    granularity,
    range?.[0]?.toString() + range?.[1]?.toString(),
  ]);
  return (
    <>
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Group>
            <Stack gap={2}>
              <Title order={3}>📈 Dự báo sản lượng</Title>
              <Group gap="xs">
                <Badge variant="dot" color="gray">
                  {region.name}
                </Badge>
                <Badge>Diện tích: {region.areaHa} ha</Badge>
                <Badge>{region.trees} cây</Badge>
                <Badge>TB: {region.avgYieldPerHa} kg/ha</Badge>
              </Group>
            </Stack>
          </Group>
          <Group gap="xs">
            <Button
              radius={4}
              variant="light"
              leftSection={<IconRefresh size={16} />}
              onClick={() => setOverrides({})}
            >
              Reset điều chỉnh
            </Button>
            <ExportButtons
              rows={rows}
              meta={{ region, period: periodText, policyText }}
            />
          </Group>
        </Group>

        <Card withBorder radius={4} p="md">
          <Group align="flex-end">
            <Select
              radius={4}
              flex={1}
              label="Vùng trồng"
              value={regionId}
              onChange={(v) => setRegionId(v!)}
              data={REGIONS.map((r) => ({ value: r.id, label: r.name }))}
            />
            <SegmentedControl
              radius={4}
              value={granularity}
              onChange={(v: any) => setGranularity(v)}
              data={[
                { value: "day", label: "Ngày" },
                { value: "week", label: "Tuần" },
                { value: "month", label: "Tháng" },
                { value: "year", label: "Năm" },
              ]}
            />
            <DatePickerInput
              radius={4}
              flex={1}
              type="range"
              label="Khoảng thời gian"
              value={range}
              locale="vi"
              onChange={(value) =>
                setRange([new Date(value[0]), new Date(value[1])])
              }
              leftSection={<IconCalendar size={16} />}
            />
            <Group gap="xs" align="end">
              <Select
                radius={4}
                flex={1}
                label="Chính sách"
                value={policy}
                onChange={(v: any) => setPolicy(v)}
                data={[
                  { value: "average", label: "Bình quân" },
                  { value: "growth10", label: "Tăng trưởng 10%" },
                  { value: "seasonal", label: "Theo mùa vụ" },
                  { value: "customFactor", label: "Hệ số tuỳ chỉnh" },
                ]}
              />
              <NumberInput
                radius={4}
                label="Hệ số"
                value={customFactor}
                onChange={(v) => setCustomFactor(Number(v))}
                min={0.1}
                step={0.1}
                disabled={policy !== "customFactor"}
              />
            </Group>
          </Group>
        </Card>

        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Card withBorder radius={4} p="md" h="100%">
              <Title order={5} mb="xs">
                Biểu đồ dự báo (kg)
              </Title>
              <Stack h={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rows}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <RTooltip />
                    <Legend />
                    <Bar dataKey="baseline" name="Cơ sở" fill="#8884d8" />
                    <Bar dataKey="forecast" name="Dự báo" fill="#82ca9d" />
                    <Bar dataKey="adjusted" name="Điều chỉnh" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            <Card withBorder radius={4} p="md" h="100%">
              <Title order={5} mb="xs">
                Tổng hợp
              </Title>
              <SimpleGrid cols={3}>
                <Stack gap={2}>
                  <Text size="xs" c="dimmed">
                    Tổng cơ sở
                  </Text>
                  <Text fw={700}>{totals.base.toLocaleString("vi-VN")} kg</Text>
                </Stack>
                <Stack gap={2}>
                  <Text size="xs" c="dimmed">
                    Tổng dự báo
                  </Text>
                  <Text fw={700} c="teal">
                    {totals.fc.toLocaleString("vi-VN")} kg
                  </Text>
                </Stack>
                <Stack gap={2}>
                  <Text size="xs" c="dimmed">
                    Tổng điều chỉnh
                  </Text>
                  <Text fw={700} c="blue">
                    {totals.adj.toLocaleString("vi-VN")} kg
                  </Text>
                </Stack>
              </SimpleGrid>
              <Divider my="sm" />
              <Group gap="xs">
                <IconTrendingUp size={16} />
                <Text size="sm">
                  Chênh lệch: {(totals.adj - totals.fc).toLocaleString("vi-VN")}{" "}
                  kg
                </Text>
              </Group>
              <Group gap="xs" mt="sm">
                <IconLock size={16} />
                <Text size="sm" c="dimmed">
                  Quyền sửa: {canEdit ? "Được phép" : "Bị khoá"}
                </Text>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        <Card withBorder radius={4} p="md">
          <Title order={5} mb={"md"}>
            Bảng dự báo (kg)
          </Title>

          <Table
            data={rows}
            columns={[
              { accessorKey: "label", header: "Kỳ" },
              { accessorKey: "baseline", header: "Cơ sở" },
              { accessorKey: "forecast", header: "Dự báo" },
              { accessorKey: "adjusted", header: "Điều chỉnh" },
              {
                accessorKey: "actions",
                header: "Hành động",
                accessorFn: (r) => r,
                Cell: () => {
                  return (
                    <Group gap={4}>
                      <ActionIcon
                        variant="light"
                        disabled={!canEdit}
                        aria-label="Edit"
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Group>
                  );
                },
              },
            ]}
          />
        </Card>
      </Stack>

      <Modal
        opened={!!editRow}
        onClose={close}
        centered
        radius={4}
        title={<Title order={5}>Chỉnh sửa kỳ</Title>}
      >
        <Stack>
          <Text size="sm" c="dimmed">
            {editRow?.label}
          </Text>
          <NumberInput
            label="Sản lượng điều chỉnh (kg)"
            value={editRow?.value ?? 0}
            onChange={(v) =>
              setEditRow((s) => (s ? { ...s, value: Number(v) } : s))
            }
            thousandSeparator="."
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={close}>
              Hủy
            </Button>
            <Button onClick={applyEdit}>Lưu</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default ProductionForecastPage;
