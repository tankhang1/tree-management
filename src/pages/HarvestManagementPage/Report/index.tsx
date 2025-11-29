import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Collapse,
  Group,
  Modal,
  NumberInput,
  Paper,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Table as MantineTable,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconCalendarStats,
  IconChevronDown,
  IconChevronRight,
  IconFileExcel,
  IconLeaf,
  IconMapPin,
  IconScale,
  IconSection,
  IconTrees,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import groupBy from "lodash/groupBy";
import orderBy from "lodash/orderBy";
import sumBy from "lodash/sumBy";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import * as XLSX from "xlsx";
import { useForm } from "@mantine/form";

dayjs.extend(customParseFormat);

type HarvestRecord = {
  id: string;
  batchName: string;
  date: string;
  tree: string;
  region: string;
  area: string;
  plot: string;
  quantity: number;
  unit: string;
  convertedQuantity: number;
  convertedUnit: string;
};

const TREE_CONFIG: Record<
  string,
  { unit: string; convUnit: string; rate: number }
> = {
  "Sầu riêng": { unit: "Kg", convUnit: "Sọt", rate: 20 },
  Xoài: { unit: "Kg", convUnit: "Rổ", rate: 15 },
  Chuối: { unit: "Kg", convUnit: "Buồng", rate: 12 },
  Bưởi: { unit: "Kg", convUnit: "Bao", rate: 30 },
};

const TREES = Object.keys(TREE_CONFIG);
const REGIONS = ["Miền Đông", "Tây Nguyên", "Miền Tây"];
const AREAS = ["Khu A", "Khu B", "Khu C"];
const PLOTS = ["Lô 01", "Lô 02", "Lô 03", "Lô 04", "Lô 05"];

const generateData = (): HarvestRecord[] => {
  const data: HarvestRecord[] = [];
  for (let i = 0; i < 100; i++) {
    const date = dayjs().subtract(i % 60, "day");
    const tree = TREES[i % TREES.length];
    const config = TREE_CONFIG[tree];
    const qty = Math.floor(Math.random() * 500 + 50);

    data.push({
      id: `HV-${i}`,
      batchName: `Đợt thu hoạch ${date.format("DD/MM")}`,
      date: date.format("YYYY-MM-DD"),
      tree,
      region: REGIONS[i % REGIONS.length],
      area: AREAS[i % AREAS.length],
      plot: PLOTS[i % PLOTS.length],
      quantity: qty,
      unit: config.unit,
      convertedQuantity: parseFloat((qty / config.rate).toFixed(1)),
      convertedUnit: config.convUnit,
    });
  }
  return orderBy(data, "date", "desc");
};

const rawData = generateData();

const StatCard = ({ title, value, subtext, icon, color }: any) => (
  <Paper withBorder radius="md" p="md" shadow="sm">
    <Group justify="space-between">
      <div>
        <Text c="dimmed" tt="uppercase" fw={700} size="xs">
          {title}
        </Text>
        <Text fw={700} size="xl" mt="xs">
          {value}
        </Text>
        <Text c="dimmed" size="xs" mt={4}>
          {subtext}
        </Text>
      </div>
      <ThemeIcon color={color} variant="light" size={48} radius="md">
        {icon}
      </ThemeIcon>
    </Group>
  </Paper>
);

const AreaRow = ({
  areaName,
  records,
}: {
  areaName: string;
  records: HarvestRecord[];
}) => {
  const [opened, setOpened] = useState(false);
  const totalQty = sumBy(records, "quantity");
  const totalConv = sumBy(records, "convertedQuantity");
  const unit = records[0].unit;
  const convUnit = records[0].convertedUnit;

  const plots = useMemo(() => {
    const g = groupBy(records, "plot");
    return Object.entries(g).map(([pName, pItems]) => ({
      name: pName,
      qty: sumBy(pItems, "quantity"),
      conv: sumBy(pItems, "convertedQuantity"),
    }));
  }, [records]);

  return (
    <Box mb={4}>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        w="100%"
        p="xs"
        bg={opened ? "gray.1" : "white"}
        style={{ border: "1px solid #eee", borderRadius: 4 }}
      >
        <Group justify="space-between">
          <Group gap="xs">
            <IconChevronRight
              size={14}
              style={{
                transform: opened ? "rotate(90deg)" : "none",
                transition: "0.2s",
              }}
            />
            <Group gap={4}>
              <IconSection size={16} color="gray" />
              <Text size="sm" fw={500}>
                {areaName}
              </Text>
            </Group>
          </Group>
          <Group gap="xl">
            <Text size="sm" w={100} ta="right">
              {totalQty.toLocaleString()} {unit}
            </Text>
            <Text size="sm" w={100} ta="right" c="dimmed">
              {totalConv.toLocaleString()} {convUnit}
            </Text>
          </Group>
        </Group>
      </UnstyledButton>
      <Collapse in={opened}>
        <Box pl={34} py="xs">
          <MantineTable withTableBorder withColumnBorders bg="white">
            <MantineTable.Thead bg="gray.0">
              <MantineTable.Tr>
                <MantineTable.Th>Lô trồng</MantineTable.Th>
                <MantineTable.Th style={{ textAlign: "right" }}>
                  Số lượng ({unit})
                </MantineTable.Th>
                <MantineTable.Th style={{ textAlign: "right" }}>
                  Quy đổi ({convUnit})
                </MantineTable.Th>
              </MantineTable.Tr>
            </MantineTable.Thead>
            <MantineTable.Tbody>
              {plots.map((p) => (
                <MantineTable.Tr key={p.name}>
                  <MantineTable.Td fw={500}>{p.name}</MantineTable.Td>
                  <MantineTable.Td align="right">
                    {p.qty.toLocaleString()}
                  </MantineTable.Td>
                  <MantineTable.Td align="right" c="dimmed">
                    {p.conv.toLocaleString()}
                  </MantineTable.Td>
                </MantineTable.Tr>
              ))}
            </MantineTable.Tbody>
          </MantineTable>
        </Box>
      </Collapse>
    </Box>
  );
};

const RegionRow = ({
  regionName,
  records,
}: {
  regionName: string;
  records: HarvestRecord[];
}) => {
  const [opened, setOpened] = useState(false);
  const totalQty = sumBy(records, "quantity");
  const totalConv = sumBy(records, "convertedQuantity");
  const unit = records[0].unit;
  const convUnit = records[0].convertedUnit;

  const areas = useMemo(() => {
    const g = groupBy(records, "area");
    return Object.entries(g).map(([aName, aItems]) => ({
      name: aName,
      items: aItems,
    }));
  }, [records]);

  return (
    <Box mb={6}>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        w="100%"
        p="sm"
        bg="blue.0"
        style={{ borderRadius: 6 }}
      >
        <Group justify="space-between">
          <Group gap="xs">
            <IconChevronDown
              size={16}
              style={{
                transform: opened ? "rotate(180deg)" : "none",
                transition: "0.2s",
              }}
            />
            <Group gap={4}>
              <IconMapPin size={18} color="#228be6" />
              <Text size="sm" fw={700} c="blue.8">
                {regionName}
              </Text>
            </Group>
          </Group>
          <Group gap="xl">
            <Text size="sm" fw={700} w={100} ta="right">
              {totalQty.toLocaleString()} {unit}
            </Text>
            <Text size="sm" w={100} ta="right" c="blue.6">
              {totalConv.toLocaleString()} {convUnit}
            </Text>
          </Group>
        </Group>
      </UnstyledButton>
      <Collapse in={opened}>
        <Stack
          gap={4}
          mt="xs"
          pl="lg"
          style={{ borderLeft: "2px solid #e7f5ff" }}
        >
          {areas.map((area) => (
            <AreaRow
              key={area.name}
              areaName={area.name}
              records={area.items}
            />
          ))}
        </Stack>
      </Collapse>
    </Box>
  );
};

const BatchRow = ({
  batchData,
  treeType,
}: {
  batchData: HarvestRecord[];
  treeType: string;
}) => {
  const [opened, setOpened] = useState(false);
  const record = batchData[0];

  const totalQty = sumBy(batchData, "quantity");
  const totalConv = sumBy(batchData, "convertedQuantity");

  const regions = useMemo(() => {
    const g = groupBy(batchData, "region");
    return Object.entries(g).map(([rName, rItems]) => ({
      name: rName,
      items: rItems,
    }));
  }, [batchData]);

  return (
    <>
      <MantineTable.Tr
        bg={opened ? "var(--mantine-color-gray-0)" : undefined}
        style={{ cursor: "pointer" }}
        onClick={() => setOpened((o) => !o)}
      >
        <MantineTable.Td>
          <Group gap="xs">
            <ActionIcon variant="subtle" color="gray" size="sm">
              <IconChevronRight
                style={{
                  transform: opened ? "rotate(90deg)" : "none",
                  transition: "0.2s",
                }}
              />
            </ActionIcon>
            <div>
              <Text fw={600} size="sm">
                {record.batchName}
              </Text>
              <Text size="xs" c="dimmed">
                {dayjs(record.date).format("YYYY-MM-DD")}
              </Text>
            </div>
          </Group>
        </MantineTable.Td>
        <MantineTable.Td>{treeType}</MantineTable.Td>
        <MantineTable.Td>
          <Text fw={700}>{totalQty.toLocaleString()}</Text>
        </MantineTable.Td>
        <MantineTable.Td>
          <Badge variant="light" color="gray">
            {record.unit}
          </Badge>
        </MantineTable.Td>
        <MantineTable.Td>
          <Text fw={700} c="blue">
            {totalConv.toLocaleString()}
          </Text>
        </MantineTable.Td>
        <MantineTable.Td>
          <Badge variant="filled" color="blue">
            {record.convertedUnit}
          </Badge>
        </MantineTable.Td>
      </MantineTable.Tr>

      <MantineTable.Tr style={{ display: opened ? "table-row" : "none" }}>
        <MantineTable.Td colSpan={6} p={0}>
          <Collapse in={opened}>
            <Box p="md" bg="gray.0">
              <Title order={6} mb="sm" c="dimmed" tt="uppercase">
                Phân bổ chi tiết theo Vùng
              </Title>
              {regions.map((r) => (
                <RegionRow key={r.name} regionName={r.name} records={r.items} />
              ))}
            </Box>
          </Collapse>
        </MantineTable.Td>
      </MantineTable.Tr>
    </>
  );
};

const HarvestReportPage = () => {
  const [data, setData] = useState<HarvestRecord[]>(rawData);
  const [range, setRange] = useState<[Date | null, Date | null]>([
    dayjs().subtract(30, "day").toDate(),
    dayjs().toDate(),
  ]);
  const [selectedTree, setSelectedTree] = useState<string | null>("Sầu riêng");

  const [modalOpened, setModalOpened] = useState(false);

  const addForm = useForm<{
    tree: string | null;
    date: Date | null;
    region: string | null;
    area: string | null;
    plot: string | null;
    quantity: number | "";
  }>({
    initialValues: {
      tree: "Sầu riêng",
      date: new Date(),
      region: REGIONS[0],
      area: AREAS[0],
      plot: PLOTS[0],
      quantity: "",
    },
    validate: {
      tree: (value) => (!value ? "Chọn loại cây" : null),
      date: (value) => (!value ? "Chọn ngày" : null),
      region: (value) => (!value ? "Chọn vùng" : null),
      area: (value) => (!value ? "Chọn khu vực" : null),
      plot: (value) => (!value ? "Chọn lô" : null),
      quantity: (value) =>
        !value || Number(value) <= 0 ? "Số lượng phải > 0" : null,
    },
  });

  const filteredData = useMemo(() => {
    const [start, end] = range;
    return data.filter((item) => {
      const d = dayjs(item.date);
      const inDate =
        start && end
          ? d.isSame(start, "day") ||
            d.isSame(end, "day") ||
            (d.isAfter(start) && d.isBefore(end))
          : true;
      const isTree = selectedTree ? item.tree === selectedTree : true;
      return inDate && isTree;
    });
  }, [range, selectedTree, data]);

  const stats = useMemo(() => {
    const totalQty = sumBy(filteredData, "quantity");
    const currentMonth = dayjs().format("MM-YYYY");
    const monthQty = sumBy(
      filteredData.filter(
        (d) => dayjs(d.date).format("MM-YYYY") === currentMonth
      ),
      "quantity"
    );
    const batches = groupBy(filteredData, (d) => d.batchName + d.date);
    const batchCount = Object.keys(batches).length || 1;

    return { totalQty, monthQty, avgBatch: totalQty / batchCount };
  }, [filteredData]);

  const topBatches = useMemo(() => {
    const g = groupBy(filteredData, "batchName");
    const list = Object.entries(g).map(([name, items]) => ({
      name,
      value: sumBy(items, "quantity"),
      unit: items[0].unit,
    }));
    return orderBy(list, "value", "desc").slice(0, 5);
  }, [filteredData]);

  const regionDist = useMemo(() => {
    const g = groupBy(filteredData, "region");
    return Object.entries(g).map(([name, items]) => ({
      name,
      value: sumBy(items, "quantity"),
    }));
  }, [filteredData]);

  const tableData = useMemo(() => {
    const g = groupBy(filteredData, (d) => `${d.batchName}|${d.date}`);
    return Object.values(g).sort((a, b) =>
      dayjs(b[0].date).diff(dayjs(a[0].date))
    );
  }, [filteredData]);

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "Harvest_Report.xlsx");
  };

  const handleAddHarvest = (values: typeof addForm.values) => {
    const config = values.tree ? TREE_CONFIG[values.tree] : undefined;
    if (
      !config ||
      !values.date ||
      !values.region ||
      !values.area ||
      !values.plot
    )
      return;

    const qty = Number(values.quantity);
    const dateStr = dayjs(values.date).format("YYYY-MM-DD");
    const batchName = `Đợt thu hoạch ${dayjs(values.date).format("DD/MM")}`;

    const record: HarvestRecord = {
      id: `HV-${Date.now()}`,
      batchName,
      date: dateStr,
      tree: values.tree || "",
      region: values.region,
      area: values.area,
      plot: values.plot,
      quantity: qty,
      unit: config.unit,
      convertedQuantity: parseFloat((qty / config.rate).toFixed(1)),
      convertedUnit: config.convUnit,
    };

    setData((prev) => [record, ...prev]);
    setModalOpened(false);
    addForm.reset();
  };

  const currentUnit = TREE_CONFIG[selectedTree || ""]?.unit || "Kg";
  const currentConvUnit = TREE_CONFIG[selectedTree || ""]?.convUnit || "Unit";

  return (
    <Stack gap="lg" mih="100vh">
      <Paper p="md" radius="md" shadow="sm" bg="white" withBorder>
        <Group justify="space-between" align="end">
          <div>
            <Title order={3}>Báo Cáo Thu Hoạch</Title>
            <Text c="dimmed" size="sm">
              Theo dõi chi tiết sản lượng từ Đợt về Lô trồng
            </Text>
          </div>
          <Group align="flex-end">
            <Select
              label="Loại cây trồng (Bắt buộc)"
              data={TREES}
              value={selectedTree}
              onChange={setSelectedTree}
              allowDeselect={false}
              leftSection={<IconTrees size={16} />}
              w={200}
            />
            <DatePickerInput
              type="range"
              label="Khoảng thời gian"
              value={range}
              //@ts-expect-error
              onChange={setRange}
              locale="vi"
              leftSection={<IconCalendarStats size={16} />}
              w={220}
            />
            <Button
              variant="light"
              color="teal"
              leftSection={<IconLeaf size={18} />}
              onClick={() => setModalOpened(true)}
            >
              Thêm đợt thu hoạch
            </Button>
            <Button
              leftSection={<IconFileExcel size={18} />}
              color="green"
              onClick={handleExport}
            >
              Xuất Excel
            </Button>
          </Group>
        </Group>
      </Paper>

      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <StatCard
          title="Tổng sản lượng"
          value={`${stats.totalQty.toLocaleString()} ${currentUnit}`}
          subtext="Trong khoảng thời gian đã chọn"
          icon={<IconScale size={24} />}
          color="blue"
        />
        <StatCard
          title="Sản lượng tháng này"
          value={`${stats.monthQty.toLocaleString()} ${currentUnit}`}
          subtext={`Tháng ${dayjs().format("MM/YYYY")}`}
          icon={<IconCalendarStats size={24} />}
          color="teal"
        />
        <StatCard
          title="Trung bình / Đợt"
          value={`${stats.avgBatch.toFixed(0).toLocaleString()} ${currentUnit}`}
          subtext="Hiệu suất trung bình"
          icon={<IconLeaf size={24} />}
          color="orange"
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <Card radius="md" shadow="sm" withBorder p="lg">
          <Title order={5} mb="md">
            Top 5 Đợt Thu Hoạch Cao Nhất
          </Title>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topBatches} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={100}
                tick={{ fontSize: 12 }}
              />
              <RTooltip />
              <Bar
                dataKey="value"
                fill="#228be6"
                radius={[0, 4, 4, 0]}
                barSize={24}
                name={`Sản lượng (${currentUnit})`}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card radius="md" shadow="sm" withBorder p="lg">
          <Title order={5} mb="md">
            Phân Bổ Theo Vùng
          </Title>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={regionDist}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <RTooltip />
              <Bar
                dataKey="value"
                fill="#12b886"
                radius={[4, 4, 0, 0]}
                barSize={40}
                name={`Sản lượng (${currentUnit})`}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </SimpleGrid>

      <Card radius="md" shadow="sm" withBorder p={0}>
        <Box p="md" bg="gray.0" style={{ borderBottom: "1px solid #dee2e6" }}>
          <Title order={4}>Chi tiết thu hoạch</Title>
        </Box>
        <ScrollArea>
          <MantineTable verticalSpacing="sm" highlightOnHover>
            <MantineTable.Thead bg="gray.1">
              <MantineTable.Tr>
                <MantineTable.Th w="30%">Đợt thu hoạch (Ngày)</MantineTable.Th>
                <MantineTable.Th>Cây trồng</MantineTable.Th>
                <MantineTable.Th>Số lượng</MantineTable.Th>
                <MantineTable.Th>Đơn vị</MantineTable.Th>
                <MantineTable.Th>SL Quy đổi</MantineTable.Th>
                <MantineTable.Th>ĐV Quy đổi</MantineTable.Th>
              </MantineTable.Tr>
            </MantineTable.Thead>
            <MantineTable.Tbody>
              {tableData.length > 0 ? (
                tableData.map((batch, idx) => (
                  <BatchRow
                    key={idx}
                    batchData={batch}
                    treeType={selectedTree || ""}
                  />
                ))
              ) : (
                <MantineTable.Tr>
                  <MantineTable.Td
                    colSpan={6}
                    align="center"
                    py="xl"
                    c="dimmed"
                  >
                    Không có dữ liệu
                  </MantineTable.Td>
                </MantineTable.Tr>
              )}
            </MantineTable.Tbody>
          </MantineTable>
        </ScrollArea>
      </Card>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Thêm đợt thu hoạch"
        centered
        size="lg"
      >
        <form onSubmit={addForm.onSubmit(handleAddHarvest)}>
          <Stack gap="sm">
            <Group grow>
              <Select
                label="Loại cây trồng"
                data={TREES}
                {...addForm.getInputProps("tree")}
              />
              <DatePickerInput
                label="Ngày thu hoạch"
                value={addForm.values.date}
                //@ts-expect-error
                onChange={(value) => addForm.setFieldValue("date", value)}
                locale="vi"
                valueFormat="DD/MM/YYYY"
                leftSection={<IconCalendarStats size={16} />}
                error={addForm.errors.date}
              />
            </Group>

            <Group grow>
              <Select
                label="Vùng"
                data={REGIONS}
                {...addForm.getInputProps("region")}
              />
              <Select
                label="Khu vực"
                data={AREAS}
                {...addForm.getInputProps("area")}
              />
              <Select
                label="Lô"
                data={PLOTS}
                {...addForm.getInputProps("plot")}
              />
            </Group>

            <NumberInput
              label="Số lượng (Kg)"
              min={0}
              thousandSeparator="."
              decimalSeparator=","
              {...addForm.getInputProps("quantity")}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={() => setModalOpened(false)}>
                Hủy
              </Button>
              <Button type="submit" color="teal">
                Lưu đợt thu hoạch
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
};

export default HarvestReportPage;
