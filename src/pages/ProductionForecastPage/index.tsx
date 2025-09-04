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
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Title,
  MultiSelect,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCalendar,
  IconEdit,
  IconFileSpreadsheet,
  IconFileTypePdf,
  IconLock,
  IconRefresh,
  IconTrendingUp,
  IconDownload,
  IconChartBar,
  IconChartLine,
  IconChartArea,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
  Line,
  ComposedChart,
  ReferenceLine,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import * as htmlToImage from "html-to-image";
import Table from "../../components/Table";

dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);

type Region = { id: string; name: string };
type Crop = { id: string; name: string };
type RegionCropDist = {
  cropId: string;
  areaHa: number;
  trees: number;
  avgYieldPerHa: number;
};
type Granularity = "day" | "week" | "month" | "quarter" | "year";
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
  { id: "V01", name: "Vùng 01 - Bình Dương" },
  { id: "V02", name: "Vùng 02 - Đồng Nai" },
  { id: "V03", name: "Vùng 03 - Tây Ninh" },
];

const CROPS: Crop[] = [
  { id: "C01", name: "Lúa" },
  { id: "C02", name: "Xoài" },
  { id: "C03", name: "Cà phê" },
  { id: "C04", name: "Tiêu" },
  { id: "C05", name: "Rau cải" },
];

const REGION_CROP: Record<string, RegionCropDist[]> = {
  V01: [
    { cropId: "C01", areaHa: 8, trees: 0, avgYieldPerHa: 5200 },
    { cropId: "C02", areaHa: 5, trees: 3200, avgYieldPerHa: 9000 },
    { cropId: "C05", areaHa: 12, trees: 0, avgYieldPerHa: 1800 },
  ],
  V02: [
    { cropId: "C01", areaHa: 6, trees: 0, avgYieldPerHa: 5400 },
    { cropId: "C03", areaHa: 18, trees: 9200, avgYieldPerHa: 2500 },
    { cropId: "C04", areaHa: 16, trees: 14000, avgYieldPerHa: 2100 },
  ],
  V03: [
    { cropId: "C02", areaHa: 4, trees: 2600, avgYieldPerHa: 8800 },
    { cropId: "C03", areaHa: 7, trees: 3800, avgYieldPerHa: 2400 },
    { cropId: "C04", areaHa: 4, trees: 3500, avgYieldPerHa: 2050 },
  ],
};

const SEASONAL_FACTORS = [
  0.9, 0.95, 1.0, 1.05, 1.08, 1.12, 1.15, 1.1, 1.05, 1.0, 0.95, 0.92,
];
const COLORS = [
  "#4dabf7",
  "#ffd43b",
  "#63e6be",
  "#b197fc",
  "#ffa8a8",
  "#66d9e8",
  "#fab005",
];
const kg = (n: number) => Math.round(n);
const fmt = (n: number) => (n ?? 0).toLocaleString("vi-VN");

const buildBuckets = (
  granularity: Granularity,
  start: string,
  end: string
): Bucket[] => {
  const s = dayjs(start).startOf(
    granularity === "week"
      ? "week"
      : granularity === "quarter"
      ? "quarter"
      : granularity
  );
  const e = dayjs(end).endOf(
    granularity === "week"
      ? "week"
      : granularity === "quarter"
      ? "quarter"
      : granularity
  );
  const res: Bucket[] = [];
  let cur = s.clone();
  while (cur.isBefore(e) || cur.isSame(e)) {
    if (granularity === "day") {
      res.push({
        key: cur.format("YYYY-MM-DD"),
        label: cur.format("DD/MM"),
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
    } else if (granularity === "quarter") {
      const q = cur.quarter();
      const endQ = cur.endOf("quarter");
      res.push({
        key: `Q${q}-${cur.year()}`,
        label: `Q${q}/${cur.year()}`,
        start: cur.toISOString(),
        end: endQ.toISOString(),
        monthIndex: cur.month(),
        days: endQ.diff(cur, "day") + 1,
      });
      cur = endQ.add(1, "day");
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

const aggregateSelection = (regionIds: string[], cropIds: string[]) => {
  const cropSet = new Set(cropIds);
  let totalArea = 0;
  let totalTrees = 0;
  let sumAnnual = 0;
  const perCropAnnual: Record<string, number> = {};
  const perCropArea: Record<string, number> = {};
  const perCropTrees: Record<string, number> = {};

  for (const rid of regionIds) {
    const dists = REGION_CROP[rid] || [];
    dists.forEach((d) => {
      if (cropSet.size === 0 || cropSet.has(d.cropId)) {
        totalArea += d.areaHa;
        totalTrees += d.trees;
        sumAnnual += d.areaHa * d.avgYieldPerHa;
        perCropAnnual[d.cropId] =
          (perCropAnnual[d.cropId] || 0) + d.areaHa * d.avgYieldPerHa;
        perCropArea[d.cropId] = (perCropArea[d.cropId] || 0) + d.areaHa;
        perCropTrees[d.cropId] = (perCropTrees[d.cropId] || 0) + d.trees;
      }
    });
  }
  const basePerDay = sumAnnual / 365;
  const perCropPerDay: Record<string, number> = {};
  Object.keys(perCropAnnual).forEach(
    (cid) => (perCropPerDay[cid] = perCropAnnual[cid] / 365)
  );
  return {
    totalArea,
    totalTrees,
    basePerDay,
    perCropPerDay,
    perCropArea,
    perCropTrees,
  };
};

const computeForecast = ({
  buckets,
  basePerDay,
  policy,
  customFactor,
  overrides,
  granularity,
}: {
  buckets: Bucket[];
  basePerDay: number;
  policy: Policy;
  customFactor: number;
  overrides: Record<string, number | undefined>;
  granularity: Granularity;
}) => {
  let growthSeed = 1;
  return buckets.map((b, idx) => {
    let value = basePerDay * b.days;
    if (policy === "growth10") value *= Math.pow(1.1, idx);
    else if (policy === "seasonal") {
      if (granularity === "quarter") {
        const startMonth = dayjs(b.start).month();
        const m1 = SEASONAL_FACTORS[startMonth];
        const m2 = SEASONAL_FACTORS[(startMonth + 1) % 12];
        const m3 = SEASONAL_FACTORS[(startMonth + 2) % 12];
        value *= (m1 + m2 + m3) / 3;
      } else {
        value *= SEASONAL_FACTORS[b.monthIndex];
      }
    } else if (policy === "customFactor") value *= customFactor;
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

const buildCropStack = ({
  buckets,
  perCropPerDay,
  policy,
  customFactor,
  totalsByBucket,
  granularity,
}: {
  buckets: Bucket[];
  perCropPerDay: Record<string, number>;
  policy: Policy;
  customFactor: number;
  totalsByBucket: { key: string; forecast: number; adjusted: number }[];
  granularity: Granularity;
}) => {
  const cropIds = Object.keys(perCropPerDay);
  const stacked = buckets.map((b, bi) => {
    const row: any = { label: b.label, key: b.key };
    let bucketForecastTotal = 0;
    cropIds.forEach((cid) => {
      let v = perCropPerDay[cid] * b.days;
      if (policy === "growth10") v *= Math.pow(1.1, bi);
      else if (policy === "seasonal") {
        if (granularity === "quarter") {
          const startMonth = dayjs(b.start).month();
          const m1 = SEASONAL_FACTORS[startMonth];
          const m2 = SEASONAL_FACTORS[(startMonth + 1) % 12];
          const m3 = SEASONAL_FACTORS[(startMonth + 2) % 12];
          v *= (m1 + m2 + m3) / 3;
        } else {
          v *= SEASONAL_FACTORS[b.monthIndex];
        }
      } else if (policy === "customFactor") v *= customFactor;
      row[cid] = kg(v);
      bucketForecastTotal += v;
    });
    row._forecastTotal = kg(bucketForecastTotal);
    const t = totalsByBucket[bi];
    row._adjustedTotal = t?.adjusted ?? row._forecastTotal;
    return row;
  });

  const totalPerCropForecast: Record<string, number> = {};
  const totalPerCropAdjusted: Record<string, number> = {};
  stacked.forEach((r) => {
    let sumFc = 0;
    cropIds.forEach((cid) => (sumFc += r[cid]));
    cropIds.forEach((cid) => {
      const share = sumFc > 0 ? r[cid] / sumFc : 0;
      const adj = kg(share * r._adjustedTotal);
      totalPerCropForecast[cid] = (totalPerCropForecast[cid] || 0) + r[cid];
      totalPerCropAdjusted[cid] = (totalPerCropAdjusted[cid] || 0) + adj;
    });
  });

  return { stacked, cropIds, totalPerCropForecast, totalPerCropAdjusted };
};

const ExportButtons = ({
  rows,
  meta,
}: {
  rows: ReturnType<typeof computeForecast>;
  meta: {
    regionText: string;
    cropText: string;
    period: string;
    policyText: string;
  };
}) => {
  const exportPDF = () => {
    const doc = new jsPDF({ unit: "pt" });
    doc.setFontSize(14);
    doc.text("Báo cáo dự báo sản lượng", 40, 40);
    doc.setFontSize(10);
    doc.text(`Vùng: ${meta.regionText}`, 40, 58);
    doc.text(`Cây: ${meta.cropText || "Tất cả"}`, 40, 72);
    doc.text(`Khoảng thời gian: ${meta.period}`, 40, 86);
    doc.text(`Chính sách: ${meta.policyText}`, 40, 100);
    const body = rows.map((r) => [
      r.label,
      r.baseline.toLocaleString("vi-VN"),
      r.forecast.toLocaleString("vi-VN"),
      r.adjusted.toLocaleString("vi-VN"),
    ]);
    autoTable(doc, {
      startY: 118,
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
      [`Vùng: ${meta.regionText}`],
      [`Cây: ${meta.cropText || "Tất cả"}`],
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

function LegendToggle({
  items,
  visible,
  onToggle,
}: {
  items: { key: string; label: string; color: string }[];
  visible: Record<string, boolean>;
  onToggle: (key: string) => void;
}) {
  return (
    <Group gap={8} wrap="wrap">
      {items.map((it) => (
        <Badge
          key={it.key}
          leftSection={
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: 2,
                background: it.color,
              }}
            />
          }
          variant={visible[it.key] ? "light" : "outline"}
          onClick={() => onToggle(it.key)}
          style={{ cursor: "pointer" }}
        >
          {it.label}
        </Badge>
      ))}
    </Group>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <Paper p="sm" radius="md" withBorder>
      <Text fw={600} mb={4}>
        {label}
      </Text>
      <Stack gap={2}>
        {payload.map((p: any, i: number) => (
          <Group key={i} gap={8} justify="space-between">
            <Group gap={8}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: p.color,
                }}
              />
              <Text size="sm">{p.name}</Text>
            </Group>
            <Text size="sm" fw={600}>
              {fmt(p.value)} kg
            </Text>
          </Group>
        ))}
      </Stack>
    </Paper>
  );
}

function ChartCard({
  title,
  right,
  children,
  height = 340,
}: {
  title: string;
  right?: React.ReactNode;
  children: (ref: React.RefObject<HTMLDivElement>) => React.ReactNode;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const download = async () => {
    if (!ref.current) return;
    const dataUrl = await htmlToImage.toPng(ref.current, { pixelRatio: 2 });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.png`;
    a.click();
  };
  return (
    <Card withBorder radius={4} p="md" h="100%">
      <Group justify="space-between" mb="xs">
        <Title order={5}>{title}</Title>
        <Group gap="xs">
          {right}
          <ActionIcon variant="light" onClick={download} title="Tải PNG">
            <IconDownload size={16} />
          </ActionIcon>
        </Group>
      </Group>
      <div ref={ref} style={{ height }}>
        {
          //@ts-expect-error no check
          children(ref)
        }
      </div>
    </Card>
  );
}

function OverviewChart({
  rows,
}: {
  rows: Array<{
    label: string;
    baseline: number;
    forecast: number;
    adjusted: number;
  }>;
}) {
  const avg = useMemo(
    () =>
      Math.round(
        rows.reduce((a, b) => a + (b.forecast || 0), 0) / (rows.length || 1)
      ),
    [rows]
  );
  const [mode, setMode] = useState<"bar" | "line" | "area">("bar");
  const [visible, setVisible] = useState<Record<string, boolean>>({
    baseline: true,
    forecast: true,
    adjusted: true,
  });
  const toggle = (k: string) => setVisible((m) => ({ ...m, [k]: !m[k] }));
  const legendItems = [
    { key: "baseline", label: "Cơ sở", color: "#748ffc" },
    { key: "forecast", label: "Dự báo", color: "#40c057" },
    { key: "adjusted", label: "Điều chỉnh", color: "#fab005" },
  ];

  return (
    <ChartCard
      title="Tổng quan dự báo"
      right={
        <Group gap="xs">
          <SegmentedControl
            size="xs"
            value={mode}
            onChange={(v: any) => setMode(v)}
            data={[
              { value: "bar", label: <IconChartBar size={14} /> },
              { value: "line", label: <IconChartLine size={14} /> },
              { value: "area", label: <IconChartArea size={14} /> },
            ]}
          />
          <LegendToggle
            items={legendItems}
            visible={visible}
            onToggle={toggle}
          />
        </Group>
      }
    >
      {() => (
        <ResponsiveContainer width="100%" height="100%">
          {mode === "bar" ? (
            <BarChart data={rows}>
              <defs>
                <linearGradient id="gBaseline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#91a7ff" stopOpacity={1} />
                  <stop offset="100%" stopColor="#748ffc" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="gForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#69db7c" stopOpacity={1} />
                  <stop offset="100%" stopColor="#40c057" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="gAdjusted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffd43b" stopOpacity={1} />
                  <stop offset="100%" stopColor="#fab005" stopOpacity={0.85} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis tickFormatter={(v) => fmt(v)} />
              <RTooltip content={<CustomTooltip />} />
              {visible.baseline && (
                <Bar dataKey="baseline" name="Cơ sở" fill="url(#gBaseline)" />
              )}
              {visible.forecast && (
                <Bar dataKey="forecast" name="Dự báo" fill="url(#gForecast)" />
              )}
              {visible.adjusted && (
                <Bar
                  dataKey="adjusted"
                  name="Điều chỉnh"
                  fill="url(#gAdjusted)"
                />
              )}
              <ReferenceLine
                y={avg}
                stroke="#868e96"
                strokeDasharray="4 4"
                label={{
                  value: `TB ${fmt(avg)} kg`,
                  position: "insideTopLeft",
                  fill: "#868e96",
                }}
              />
            </BarChart>
          ) : mode === "line" ? (
            <ComposedChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis tickFormatter={(v) => fmt(v)} />
              <RTooltip content={<CustomTooltip />} />
              {visible.baseline && (
                <Line
                  type="monotone"
                  dataKey="baseline"
                  name="Cơ sở"
                  stroke="#748ffc"
                  dot={false}
                  strokeWidth={2}
                />
              )}
              {visible.forecast && (
                <Line
                  type="monotone"
                  dataKey="forecast"
                  name="Dự báo"
                  stroke="#40c057"
                  dot={false}
                  strokeWidth={2}
                />
              )}
              {visible.adjusted && (
                <Line
                  type="monotone"
                  dataKey="adjusted"
                  name="Điều chỉnh"
                  stroke="#fab005"
                  dot={false}
                  strokeWidth={2}
                />
              )}
              <ReferenceLine y={avg} stroke="#868e96" strokeDasharray="4 4" />
            </ComposedChart>
          ) : (
            <AreaChart data={rows}>
              <defs>
                <linearGradient id="aForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#63e6be" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#12b886" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="aAdjusted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffd43b" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#fab005" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="aBaseline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#91a7ff" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#748ffc" stopOpacity={0.15} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis tickFormatter={(v) => fmt(v)} />
              <RTooltip content={<CustomTooltip />} />
              {visible.baseline && (
                <Area
                  dataKey="baseline"
                  name="Cơ sở"
                  stroke="#748ffc"
                  fill="url(#aBaseline)"
                />
              )}
              {visible.forecast && (
                <Area
                  dataKey="forecast"
                  name="Dự báo"
                  stroke="#20c997"
                  fill="url(#aForecast)"
                />
              )}
              {visible.adjusted && (
                <Area
                  dataKey="adjusted"
                  name="Điều chỉnh"
                  stroke="#fab005"
                  fill="url(#aAdjusted)"
                />
              )}
              <ReferenceLine y={avg} stroke="#868e96" strokeDasharray="4 4" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

function CropStackedChart({
  stacked,
  seriesCropIds,
  cropName,
  normalized,
  onToggleNormalized,
  onToggleCrop,
  visibleMap,
}: {
  stacked: any[];
  seriesCropIds: string[];
  cropName: (id: string) => string;
  normalized: boolean;
  onToggleNormalized: (v: boolean) => void;
  onToggleCrop: (cid: string) => void;
  visibleMap: Record<string, boolean>;
}) {
  const data = useMemo(() => {
    if (!normalized) return stacked;
    return stacked.map((r) => {
      const sum = seriesCropIds.reduce((a, cid) => a + (r[cid] || 0), 0) || 1;
      const nr: any = { ...r };
      seriesCropIds.forEach(
        (cid) => (nr[cid] = Math.round((100 * (r[cid] || 0)) / sum))
      );
      return nr;
    });
  }, [stacked, seriesCropIds, normalized]);

  const legendItems = seriesCropIds.map((cid, i) => ({
    key: cid,
    label: cropName(cid),
    color: COLORS[i % COLORS.length],
  }));

  return (
    <ChartCard
      title={`Đóng góp theo cây ${normalized ? "(%)" : "(kg)"}`}
      right={
        <Group gap="xs">
          <Switch
            size="xs"
            onLabel="%"
            offLabel="kg"
            checked={normalized}
            onChange={(e) => onToggleNormalized(e.currentTarget.checked)}
          />
          <LegendToggle
            items={legendItems}
            visible={visibleMap}
            onToggle={onToggleCrop}
          />
        </Group>
      }
      height={340}
    >
      {() => (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis tickFormatter={(v) => (normalized ? `${v}%` : fmt(v))} />
            <RTooltip content={<CustomTooltip />} />
            {seriesCropIds.map((cid, i) =>
              visibleMap[cid] ? (
                <Bar
                  key={cid}
                  dataKey={cid}
                  name={cropName(cid)}
                  stackId="crop"
                  fill={COLORS[i % COLORS.length]}
                />
              ) : null
            )}
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

function CropPie({
  totalMap,
  totalsAdj,
  cropName,
}: {
  totalMap: Record<string, number>;
  totalsAdj: number;
  cropName: (id: string) => string;
}) {
  const data = Object.keys(totalMap).map((cid) => ({
    name: cropName(cid),
    value: totalMap[cid],
  }));
  return (
    <ChartCard title="Tỷ trọng điều chỉnh theo cây" height={300}>
      {() => (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label={(e) =>
                `${e.name}: ${((e.value / (totalsAdj || 1)) * 100).toFixed(1)}%`
              }
            >
              {data.map((d, i) => (
                <Cell key={d.name} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

const ProductionForecastPage = () => {
  const [regionIds, setRegionIds] = useState<string[]>(
    REGIONS.map((r) => r.id)
  );
  const [cropIds, setCropIds] = useState<string[]>([]);
  const [granularity, setGranularity] = useState<Granularity>("month");
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
  const [normalized, setNormalized] = useState(false);
  const [visibleCropMap, setVisibleCropMap] = useState<Record<string, boolean>>(
    {}
  );

  const selectedRegionText = useMemo(
    () =>
      regionIds.length === REGIONS.length
        ? "Tất cả"
        : REGIONS.filter((r) => regionIds.includes(r.id))
            .map((r) => r.name.replace("Vùng ", "V").split(" - ")[0])
            .join(", "),
    [regionIds]
  );
  const selectedCropText = useMemo(
    () =>
      CROPS.filter((c) => cropIds.includes(c.id))
        .map((c) => c.name)
        .join(", "),
    [cropIds]
  );

  const buckets = useMemo(() => {
    const s = range[0] ?? new Date();
    const e = range[1] ?? range[0] ?? new Date();
    return buildBuckets(granularity, s.toISOString(), e.toISOString());
  }, [granularity, range]);

  const agg = useMemo(
    () => aggregateSelection(regionIds, cropIds),
    [regionIds, cropIds]
  );

  const rows = useMemo(
    () =>
      computeForecast({
        buckets,
        basePerDay: agg.basePerDay,
        policy,
        customFactor,
        overrides,
        granularity,
      }),
    [buckets, agg.basePerDay, policy, customFactor, overrides, granularity]
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
    const label =
      granularity === "day"
        ? "ngày"
        : granularity === "week"
        ? "tuần"
        : granularity === "month"
        ? "tháng"
        : granularity === "quarter"
        ? "quý"
        : "năm";
    return `${s} → ${e} (${label})`;
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
    regionIds.join(","),
    cropIds.join(","),
    policy,
    customFactor,
    granularity,
    range?.[0]?.toString() + range?.[1]?.toString(),
  ]);

  const {
    stacked,
    cropIds: seriesCropIds,
    totalPerCropForecast,
    totalPerCropAdjusted,
  } = useMemo(
    () =>
      buildCropStack({
        buckets,
        perCropPerDay: agg.perCropPerDay,
        policy,
        customFactor,
        totalsByBucket: rows.map((r) => ({
          key: r.key,
          forecast: r.forecast,
          adjusted: r.adjusted,
        })),
        granularity,
      }),
    [buckets, agg.perCropPerDay, policy, customFactor, rows, granularity]
  );

  useEffect(() => {
    setVisibleCropMap((prev) => {
      const next: Record<string, boolean> = {};
      seriesCropIds.forEach((id) => (next[id] = prev[id] ?? true));
      return next;
    });
  }, [seriesCropIds.join(",")]);

  return (
    <>
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap={2}>
            <Title order={3}>📈 Dự báo sản lượng</Title>
            <Group gap="xs" wrap="wrap">
              <Badge variant="dot" color="gray">
                Vùng: {selectedRegionText}
              </Badge>
              <Badge>Cây: {selectedCropText || "Tất cả"}</Badge>
              <Badge>
                Diện tích lọc: {agg.totalArea.toLocaleString("vi-VN")} ha
              </Badge>
              <Badge>Tổng cây: {agg.totalTrees.toLocaleString("vi-VN")}</Badge>
            </Group>
          </Stack>
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
              meta={{
                regionText: selectedRegionText,
                cropText: selectedCropText,
                period: periodText,
                policyText,
              }}
            />
          </Group>
        </Group>

        <Card withBorder radius={4} p="md">
          <Grid align="end">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <MultiSelect
                radius={4}
                label="Vùng trồng"
                value={regionIds}
                onChange={setRegionIds}
                data={REGIONS.map((r) => ({ value: r.id, label: r.name }))}
                searchable
                clearable
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <MultiSelect
                radius={4}
                label="Cây trồng"
                value={cropIds}
                onChange={setCropIds}
                data={CROPS.map((c) => ({ value: c.id, label: c.name }))}
                searchable
                clearable
                placeholder="Để trống = tất cả"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Group align="end" wrap="nowrap">
                <DatePickerInput
                  radius={4}
                  type="range"
                  label="Khoảng thời gian"
                  value={range}
                  locale="vi"
                  onChange={(value) => {
                    if (!value) return;
                    const [s, e] = value as any;
                    if (s && e) setRange([new Date(s), new Date(e)]);
                  }}
                  leftSection={<IconCalendar size={16} />}
                />
              </Group>
            </Grid.Col>
          </Grid>

          <Divider my="md" />

          <Group align="flex-end">
            <SegmentedControl
              radius={4}
              value={granularity}
              onChange={(v: any) => setGranularity(v)}
              data={[
                { value: "day", label: "Ngày" },
                { value: "week", label: "Tuần" },
                { value: "month", label: "Tháng" },
                { value: "quarter", label: "Quý" },
                { value: "year", label: "Năm" },
              ]}
            />
            <Select
              radius={4}
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
        </Card>

        <OverviewChart rows={rows as any} />

        <Grid gutter="md" mt="md">
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <CropStackedChart
              stacked={
                buildCropStack({
                  buckets,
                  perCropPerDay: agg.perCropPerDay,
                  policy,
                  customFactor,
                  totalsByBucket: rows.map((r) => ({
                    key: r.key,
                    forecast: r.forecast,
                    adjusted: r.adjusted,
                  })),
                  granularity,
                }).stacked
              }
              seriesCropIds={
                buildCropStack({
                  buckets,
                  perCropPerDay: agg.perCropPerDay,
                  policy,
                  customFactor,
                  totalsByBucket: rows.map((r) => ({
                    key: r.key,
                    forecast: r.forecast,
                    adjusted: r.adjusted,
                  })),
                  granularity,
                }).cropIds
              }
              cropName={(id) => CROPS.find((c) => c.id === id)?.name || id}
              normalized={normalized}
              onToggleNormalized={setNormalized}
              visibleMap={visibleCropMap}
              onToggleCrop={(cid) =>
                setVisibleCropMap((m) => ({ ...m, [cid]: !m[cid] }))
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <CropPie
              totalMap={
                buildCropStack({
                  buckets,
                  perCropPerDay: agg.perCropPerDay,
                  policy,
                  customFactor,
                  totalsByBucket: rows.map((r) => ({
                    key: r.key,
                    forecast: r.forecast,
                    adjusted: r.adjusted,
                  })),
                  granularity,
                }).totalPerCropAdjusted
              }
              totalsAdj={totals.adj}
              cropName={(id) => CROPS.find((c) => c.id === id)?.name || id}
            />
          </Grid.Col>
        </Grid>

        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Card withBorder radius={4} p="md" h="100%">
              <Title order={5} mb="xs">
                Biểu đồ xu hướng
              </Title>
              <Stack h={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={rows}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis tickFormatter={(v) => fmt(v)} />
                    <RTooltip content={<CustomTooltip />} />
                    <Bar dataKey="baseline" name="Cơ sở" fill="#91a7ff" />
                    <Line
                      type="monotone"
                      dataKey="forecast"
                      name="Dự báo"
                      stroke="#40c057"
                      dot={false}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="adjusted"
                      name="Điều chỉnh"
                      stroke="#fab005"
                      dot={false}
                      strokeWidth={2}
                    />
                  </ComposedChart>
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
          <Title order={5} mb="md">
            Bảng dự báo (kg)
          </Title>
          <Table
            data={rows}
            columns={[
              { accessorKey: "label", header: "Kỳ" },
              { accessorKey: "baseline", header: "Cơ sở" },
              { accessorKey: "forecast", header: "Dự báo" },
              {
                accessorKey: "adjusted",
                header: "Điều chỉnh",
                Cell: ({ row }: any) => {
                  const r = row.original;
                  return (
                    <NumberInput
                      value={r.adjusted}
                      onChange={(v) =>
                        setOverrides((m) => ({ ...m, [r.key]: Number(v) }))
                      }
                      disabled={!canEdit}
                      min={0}
                      step={100}
                      w={100}
                      radius={4}
                    />
                  );
                },
              },
              {
                id: "actions",
                header: "Hành động",
                accessorFn: (r) => r,
                Cell: ({ row }: any) => {
                  const r = row.original;
                  return (
                    <Group gap={4}>
                      <ActionIcon
                        variant="light"
                        disabled={!canEdit}
                        aria-label="Edit"
                        onClick={() => onEdit(r)}
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

        <Card withBorder radius={4} p="md">
          <Title order={5} mb="md">
            Bảng chi tiết theo cây
          </Title>
          <Table
            data={(() => {
              const computed = buildCropStack({
                buckets,
                perCropPerDay: agg.perCropPerDay,
                policy,
                customFactor,
                totalsByBucket: rows.map((r) => ({
                  key: r.key,
                  forecast: r.forecast,
                  adjusted: r.adjusted,
                })),
                granularity,
              });
              return computed.cropIds
                .map((cid) => ({
                  crop: CROPS.find((x) => x.id === cid)?.name || cid,
                  area: agg.perCropArea[cid] || 0,
                  trees: agg.perCropTrees[cid] || 0,
                  forecast: computed.totalPerCropForecast[cid] || 0,
                  adjusted: computed.totalPerCropAdjusted[cid] || 0,
                  share:
                    (100 * (computed.totalPerCropAdjusted[cid] || 0)) /
                    (Object.values(computed.totalPerCropAdjusted).reduce(
                      (a, b) => a + b,
                      0
                    ) || 1),
                }))
                .sort((a, b) => b.adjusted - a.adjusted);
            })()}
            columns={[
              { accessorKey: "crop", header: "Cây" },
              { accessorKey: "area", header: "Diện tích (ha)" },
              { accessorKey: "trees", header: "Số cây" },
              { accessorKey: "forecast", header: "Tổng dự báo (kg)" },
              { accessorKey: "adjusted", header: "Tổng điều chỉnh (kg)" },
              {
                accessorKey: "share",
                header: "Tỷ trọng",
                Cell: ({ row }: any) => `${row.original.share.toFixed(1)}%`,
              },
            ]}
          />
        </Card>
      </Stack>

      <Modal
        opened={editModal}
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
            min={0}
            step={100}
            radius={4}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={close} radius={4}>
              Hủy
            </Button>
            <Button onClick={applyEdit} radius={4}>
              Lưu
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default ProductionForecastPage;
