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
  Badge,
  Modal,
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
  IconPlus,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import { DatePickerInput } from "@mantine/dates";
import { useMemo, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useDeliveryStore } from "../../zustand/deliveryStore";

// IMPORT STORE

// Mapping Groups for filter
const groups = ["Phân bón", "BVTV", "Máy móc", "Vật tư"];

const StockManagementDeliveryPage = () => {
  const navigate = useNavigate();

  // 1. KẾT NỐI STORE
  const { deliveries, deleteDelivery } = useDeliveryStore();

  // 2. STATE BỘ LỌC
  const [keyword, setKeyword] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedWarehouses, setSelectedWarehouses] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  // State Modal
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 3. NAVIGATION HANDLERS
  const onAddDelivery = () => navigate(PATH.STOCK_ADD_DELIVERY);
  const onDeliveryDetail = (id: string) =>
    navigate(`${PATH.STOCK_DELIVERY_DETAIL}/${id}`);

  // 4. LOGIC FILTER
  // Tạo danh sách options động từ dữ liệu store
  const areaOptions = useMemo(() => {
    const uniqueAreas = Array.from(new Set(deliveries.map((d) => d.areaName)));
    return uniqueAreas.map((a) => ({ value: a, label: a }));
  }, [deliveries]);

  const warehouseOptions = useMemo(() => {
    const uniqueWarehouses = Array.from(
      new Set(deliveries.map((d) => d.warehouseName))
    );
    return uniqueWarehouses.map((w) => ({ value: w, label: w }));
  }, [deliveries]);

  // Logic lọc dữ liệu chi tiết (Flattening Items)
  // Vì một phiếu nhập (DeliveryNote) có nhiều items, ta cần map ra từng dòng để hiển thị trong bảng thống kê tồn kho/nhập xuất
  const flatData = useMemo(() => {
    return deliveries.flatMap((note) =>
      note.items.map((item, index) => ({
        id: `${note.id}-${index}`, // Composite ID
        noteId: note.id, // ID phiếu nhập gốc
        warehouseName: note.warehouseName,
        areaName: note.areaName,
        group: item.group,
        itemName: item.name,
        quantity: item.quantity,
        unit: item.unit,
        packing: item.packing,
        createdAt: note.createdAt,
      }))
    );
  }, [deliveries]);

  const filteredData = useMemo(() => {
    const [start, end] = dateRange;
    const norm = (s: string) => s.toLowerCase().trim();

    return flatData.filter((row) => {
      // Lọc Keyword
      if (keyword) {
        const k = norm(keyword);
        const hit =
          norm(row.itemName).includes(k) ||
          norm(row.warehouseName).includes(k) ||
          norm(row.areaName).includes(k) ||
          norm(row.group).includes(k) ||
          norm(row.noteId).includes(k);
        if (!hit) return false;
      }

      // Lọc MultiSelect
      if (selectedGroups.length && !selectedGroups.includes(row.group))
        return false;
      if (selectedAreas.length && !selectedAreas.includes(row.areaName))
        return false;
      if (
        selectedWarehouses.length &&
        !selectedWarehouses.includes(row.warehouseName)
      )
        return false;

      // Lọc Date Range
      if (start || end) {
        const d = new Date(row.createdAt);
        if (start && d < new Date(start.setHours(0, 0, 0, 0))) return false;
        if (end && d > new Date(end.setHours(23, 59, 59, 999))) return false;
      }

      return true;
    });
  }, [
    flatData,
    keyword,
    selectedGroups,
    selectedAreas,
    selectedWarehouses,
    dateRange,
  ]);

  const resetFilters = () => {
    setKeyword("");
    setSelectedGroups([]);
    setSelectedAreas([]);
    setSelectedWarehouses([]);
    setDateRange([null, null]);
  };

  // 5. DELETE LOGIC (Xóa phiếu nhập - Mock vì đang flatten item)
  const handleDelete = () => {
    // Logic xóa thực tế cần gọi deleteDelivery(noteId) trong store
    // Nhưng ở đây flatData là item con, nên ta chỉ demo thông báo
    if (selectedId) deleteDelivery(selectedId);
    notifications.show({
      title: "Chức năng xóa",
      message: "Cần xóa phiếu nhập gốc ID: " + selectedId,
      color: "blue",
    });
    closeDelete();
  };

  // 6. TABLE COLUMNS
  const columns: MRT_ColumnDef<(typeof flatData)[0]>[] = [
    {
      accessorKey: "warehouseName",
      header: "Cơ sở / Kho",
      size: 200,
      Cell: ({ cell }) => <Text fw={600}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "areaName",
      header: "Khu vực",
      size: 120,
    },
    {
      accessorKey: "group",
      header: "Nhóm hàng",
      size: 120,
      Cell: ({ cell }) => (
        <Badge variant="outline">{cell.getValue<string>()}</Badge>
      ),
    },
    {
      accessorKey: "itemName",
      header: "Tên vật tư",
      size: 200,
      Cell: ({ cell }) => <Text fw={500}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "quantity",
      header: "Số lượng",
      size: 100,
      Cell: ({ row }) => <Text>{row.original.quantity.toLocaleString()}</Text>,
    },
    {
      accessorKey: "unit",
      header: "Đơn vị",
      size: 80,
    },
    {
      accessorKey: "packing",
      header: "Quy cách",
      size: 150,
    },
    {
      accessorKey: "createdAt",
      header: "Ngày nhập",
      size: 120,
      Cell: ({ cell }) =>
        new Date(cell.getValue<string>()).toLocaleDateString("vi-VN"),
    },
    {
      id: "actions",
      header: "Thao tác",
      size: 60,
      Cell: ({ row }) => (
        <Menu shadow="md" position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="transparent" c="gray">
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              onClick={() => onDeliveryDetail(row.original.noteId)}
              leftSection={<IconEye size={18} />}
            >
              Xem phiếu nhập
            </Menu.Item>
            <Menu.Item leftSection={<IconEdit size={18} color="blue" />}>
              Sửa phiếu
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size={18} color="red" />}
              onClick={() => {
                setSelectedId(row.original.noteId);
                openDelete();
              }}
            >
              Xoá phiếu
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
            Xuất Excel
          </Button>
          <Button
            radius={4}
            onClick={onAddDelivery}
            leftSection={<IconPlus size={18} />}
          >
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
            <Tooltip label="Xoá bộ lọc">
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
              Tìm kiếm
            </Button>
          </Group>
        </Group>

        <Stack gap="sm">
          <TextInput
            radius={4}
            label="Từ khóa"
            placeholder="Nhập tên vật tư, mã phiếu, tên kho..."
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="sm">
            <MultiSelect
              radius={4}
              label="Kho / Cơ sở"
              placeholder="Chọn kho"
              data={warehouseOptions}
              value={selectedWarehouses}
              onChange={setSelectedWarehouses}
              searchable
              clearable
            />
            <MultiSelect
              radius={4}
              label="Khu vực"
              placeholder="Chọn khu vực"
              data={areaOptions}
              value={selectedAreas}
              onChange={setSelectedAreas}
              searchable
              clearable
            />
            <MultiSelect
              radius={4}
              label="Nhóm hàng"
              placeholder="Chọn nhóm"
              data={groups}
              value={selectedGroups}
              onChange={setSelectedGroups}
              clearable
            />
            <DatePickerInput
              radius={4}
              type="range"
              label="Ngày nhập"
              placeholder="Chọn khoảng thời gian"
              leftSection={<IconCalendar size={18} />}
              value={dateRange}
              //@ts-expect-error no check
              onChange={setDateRange}
              clearable
            />
          </SimpleGrid>
        </Stack>
      </Card>

      {/* Hiển thị bảng */}
      <Table columns={columns} data={filteredData} />

      {/* Modal xóa */}
      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title="Xác nhận xóa"
        centered
      >
        <Text>Bạn có chắc chắn muốn xóa phiếu nhập này không?</Text>
        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={closeDelete}>
            Hủy
          </Button>
          <Button color="red" onClick={handleDelete}>
            Xóa ngay
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
};

export default StockManagementDeliveryPage;
