import {
  ActionIcon,
  Button,
  Card,
  Group,
  Menu,
  MultiSelect,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconCalendar,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconRefresh,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import { DatePickerInput } from "@mantine/dates";
import { useMemo, useState } from "react";

type WarehouseStockItem = {
  id: string;
  warehouseName: string;
  areaName: string;
  group: "BVTV" | "Vật tư" | "Phân bón" | "Máy móc";
  itemName: string;
  quantity: number;
  unit: string;
  packing: string;
  createdAt: string; // yyyy-mm-dd
};

const warehouseStockDataset: WarehouseStockItem[] = [
  {
    id: "W001",
    warehouseName: "Cơ sở Long An",
    areaName: "Long An",
    group: "Phân bón",
    itemName: "Phân NPK 16-16-8",
    quantity: 200,
    unit: "bao",
    packing: "25kg/bao",
    createdAt: "2025-07-16",
  },
  {
    id: "W002",
    warehouseName: "Cơ sở Tiền Giang",
    areaName: "Tiền Giang",
    group: "BVTV",
    itemName: "Thuốc trừ sâu Regent",
    quantity: 50,
    unit: "chai",
    packing: "100ml/chai",
    createdAt: "2025-07-16",
  },
  {
    id: "W003",
    warehouseName: "Cơ sở Đà Nẵng",
    areaName: "Đà Nẵng",
    group: "Máy móc",
    itemName: "Máy cày Kubota",
    quantity: 2,
    unit: "cái",
    packing: "1 máy/đơn vị",
    createdAt: "2025-07-16",
  },
];

const groups = ["BVTV", "Vật tư", "Phân bón", "Máy móc"] as const;

const StockManagementDeliveryPage = () => {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedWarehouses, setSelectedWarehouses] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const onAddDelivery = () => navigate(PATH.STOCK_ADD_DELIVERY);
  const onDeliveryDetail = () => navigate(PATH.STOCK_DELIVERY_DETAIL);

  const areaOptions = useMemo(
    () =>
      Array.from(new Set(warehouseStockDataset.map((d) => d.areaName))).map(
        (a) => ({
          value: a,
          label: a,
        })
      ),
    []
  );

  const warehouseOptions = useMemo(
    () =>
      Array.from(
        new Set(warehouseStockDataset.map((d) => d.warehouseName))
      ).map((w) => ({
        value: w,
        label: w,
      })),
    []
  );

  const groupOptions = useMemo(
    () => groups.map((g) => ({ value: g, label: g })),
    []
  );

  const filteredData = useMemo(() => {
    const [start, end] = dateRange;
    const norm = (s: string) => s.toLowerCase().trim();

    return warehouseStockDataset.filter((row) => {
      if (keyword) {
        const k = norm(keyword);
        const hit =
          norm(row.itemName).includes(k) ||
          norm(row.warehouseName).includes(k) ||
          norm(row.areaName).includes(k) ||
          norm(row.group).includes(k) ||
          norm(row.unit).includes(k) ||
          norm(row.packing).includes(k) ||
          norm(row.id).includes(k);
        if (!hit) return false;
      }

      if (selectedGroups.length && !selectedGroups.includes(row.group))
        return false;
      if (selectedAreas.length && !selectedAreas.includes(row.areaName))
        return false;
      if (
        selectedWarehouses.length &&
        !selectedWarehouses.includes(row.warehouseName)
      )
        return false;

      if (start || end) {
        const d = new Date(row.createdAt);
        if (Number.isNaN(d.getTime())) return false;
        if (start && d < new Date(start.setHours(0, 0, 0, 0))) return false;
        if (end && d > new Date(end.setHours(23, 59, 59, 999))) return false;
      }

      return true;
    });
  }, [keyword, selectedGroups, selectedAreas, selectedWarehouses, dateRange]);

  const resetFilters = () => {
    setKeyword("");
    setSelectedGroups([]);
    setSelectedAreas([]);
    setSelectedWarehouses([]);
    setDateRange([null, null]);
  };

  const warehouseStockColumns: MRT_ColumnDef<WarehouseStockItem>[] = [
    {
      accessorKey: "warehouseName",
      header: "Cơ sở",
      Cell: ({ cell }) => <Text fw={600}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "areaName",
      header: "Khu vực",
      Cell: ({ cell }) => <Text>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "group",
      header: "Nhóm vật tư",
      Cell: ({ cell }) => <Text>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "itemName",
      header: "Tên vật tư",
      Cell: ({ cell }) => <Text>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "quantity",
      header: "Số lượng",
      Cell: ({ cell }) => <Text>{cell.getValue<number>()}</Text>,
    },
    {
      accessorKey: "unit",
      header: "Đơn vị",
      Cell: ({ cell }) => <Text>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "packing",
      header: "Quy cách",
      Cell: ({ cell }) => <Text>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      Cell: ({ cell }) => <Text>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 10,
      Cell: () => (
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="transparent" c={"gray"}>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={onDeliveryDetail}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item leftSection={<IconEdit size={18} color="green" />}>
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={18} />} color="red">
              Xoá
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý cơ sở
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddDelivery}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Card withBorder shadow="sm" radius={4} p="md">
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm cơ sở</Title>
            <Text c="dimmed" size="sm">
              Nhập từ khoá hoặc chọn Cơ sở, Khu vực, Nhóm
            </Text>
          </Stack>

          <Group>
            <Tooltip label="Xoá tất cả bộ lọc">
              <Button
                radius={4}
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={resetFilters}
              >
                Làm mới
              </Button>
            </Tooltip>
            <Button radius={4} leftSection={<IconSearch size={16} />}>
              Lọc thông tin
            </Button>
          </Group>
        </Group>

        <Stack gap="sm">
          {/* Từ cơ sởá */}
          <TextInput
            radius={4}
            label="Từ cơ sở"
            placeholder="Nhập thông tin"
            description="Tìm theo mã, tên vật tư, cơ sở, khu vực, nhóm, đơn vị, quy cách. Ví dụ: Kubota, NPK 16-16-8, W002, Long An"
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="sm">
            {/* cơ sở */}
            <MultiSelect
              label="Cơ sở"
              placeholder="Chọn cơ sở"
              description="Lọc theo tên cơ sở chứa hàng. Có thể chọn nhiều cơ sở. Ví dụ: cơ sở Long An, cơ sở Đà Nẵng"
              searchable
              radius={4}
              data={warehouseOptions}
              value={selectedWarehouses}
              onChange={setSelectedWarehouses}
            />

            {/* Khu vực */}
            <MultiSelect
              label="Khu vực"
              placeholder="Chọn khu vực"
              description="Lọc theo khu vực địa lý gắn với cơ sở. Ví dụ: Long An, Tiền Giang, Đà Nẵng"
              searchable
              radius={4}
              data={areaOptions}
              value={selectedAreas}
              onChange={setSelectedAreas}
            />

            {/* Nhóm */}
            <MultiSelect
              label="Nhóm vật tư"
              placeholder="Chọn nhóm vật tư"
              description="Phân loại vật tư: BVTV, Vật tư, Phân bón, Máy móc. Có thể chọn nhiều nhóm."
              radius={4}
              data={groupOptions}
              value={selectedGroups}
              onChange={setSelectedGroups}
            />

            {/* cơ sởảng ngày tạo */}
            <DatePickerInput
              type="range"
              radius={4}
              label="Ngày tạo"
              placeholder="Chọn ngày"
              description="Lọc theo ngày tạo/nhập cơ sở (bao gồm ngày bắt đầu và kết thúc). Ví dụ: 01/07/2025 – 20/07/2025"
              leftSection={<IconCalendar size={18} />}
              value={dateRange}
              onChange={setDateRange}
            />
          </SimpleGrid>
        </Stack>
      </Card>

      <Table columns={warehouseStockColumns} data={filteredData} />
    </Stack>
  );
};

export default StockManagementDeliveryPage;
