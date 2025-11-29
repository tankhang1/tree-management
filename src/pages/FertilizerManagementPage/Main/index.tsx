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
  Modal,
  Badge,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconRefresh,
  IconSearch,
  IconTrash,
  IconPlus,
  IconCheck,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import { useState, useMemo } from "react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

// IMPORT STORE
import {
  useFertilizerStore,
  type Fertilizer,
} from "../../zustand/fertilizerStore";

const FertilizerManagementMainPage = () => {
  const navigate = useNavigate();

  // 1. KẾT NỐI STORE
  const { fertilizers, deleteFertilizer } = useFertilizerStore();

  // 2. STATE BỘ LỌC
  const [keyword, setKeyword] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>(
    []
  );

  // State Modal Xóa
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 3. NAVIGATION
  const onFertilizerAdd = () => navigate(PATH.FERTILIZER_MAIN_ADD);

  // Điều hướng kèm ID để Sửa/Xem chi tiết (Dùng chung trang Add hoặc trang Detail riêng)
  const onEditFertilizer = (id: string) =>
    navigate(`${PATH.FERTILIZER_MAIN_ADD}/${id}`);
  const onFertilizerDetail = (id: string) =>
    navigate(`${PATH.FERTILIZER_MAIN_DETAIL}/${id}`);

  // 4. LOGIC DELETE
  const confirmDelete = (id: string) => {
    setSelectedId(id);
    openDelete();
  };

  const handleDelete = () => {
    if (selectedId) {
      deleteFertilizer(selectedId);
      notifications.show({
        title: "Thành công",
        message: "Đã xóa phân bón khỏi hệ thống",
        color: "green",
        icon: <IconCheck />,
      });
      closeDelete();
      setSelectedId(null);
    }
  };

  const handleResetFilters = () => {
    setKeyword("");
    setSelectedTypes([]);
    setSelectedManufacturers([]);
  };

  // 5. LOGIC FILTER
  const filteredData = useMemo(() => {
    return fertilizers.filter((item) => {
      // Lọc theo từ khóa (Mã, Tên)
      const matchKeyword =
        !keyword ||
        item.name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.id.toLowerCase().includes(keyword.toLowerCase());

      // Lọc theo Loại
      const matchType =
        selectedTypes.length === 0 || selectedTypes.includes(item.type);

      // Lọc theo Nhà sản xuất
      const matchManufacturer =
        selectedManufacturers.length === 0 ||
        selectedManufacturers.includes(item.manufacturer);

      return matchKeyword && matchType && matchManufacturer;
    });
  }, [fertilizers, keyword, selectedTypes, selectedManufacturers]);

  // Tạo danh sách Options động cho bộ lọc
  const typeOptions = useMemo(
    () => Array.from(new Set(fertilizers.map((f) => f.type))),
    [fertilizers]
  );
  const manufacturerOptions = useMemo(
    () => Array.from(new Set(fertilizers.map((f) => f.manufacturer))),
    [fertilizers]
  );

  // 6. CẤU HÌNH CỘT
  const fertilizerColumns: MRT_ColumnDef<Fertilizer>[] = [
    {
      accessorKey: "code", // Dùng code thay vì id để hiển thị mã thân thiện
      header: "Mã phân bón",
      size: 120,
      Cell: ({ cell }) => <Text fw={500}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "name",
      header: "Tên phân bón",
      size: 200,
      Cell: ({ cell }) => <Text fw={600}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "type",
      header: "Loại",
      size: 120,
      Cell: ({ cell }) => (
        <Badge variant="outline" color="blue">
          {cell.getValue<string>()}
        </Badge>
      ),
    },
    {
      accessorKey: "nutrientContent",
      header: "Hàm lượng",
      size: 150,
    },
    {
      accessorKey: "unit",
      header: "Đơn vị",
      size: 100,
    },
    {
      accessorKey: "manufacturer",
      header: "Nhà sản xuất",
      size: 180,
    },
    {
      accessorKey: "description",
      header: "Ghi chú",
      Cell: ({ cell }) => (
        <Text size="sm" c="dimmed" lineClamp={1}>
          {cell.getValue<string>() || "—"}
        </Text>
      ),
    },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 60,
      Cell: ({ row }) => (
        <Menu shadow="md" position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="transparent" c={"gray"}>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              onClick={() => onFertilizerDetail(row.original.id)}
              leftSection={<IconEye size={18} color="gray" />}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item
              leftSection={<IconEdit size={18} color="green" />}
              onClick={() => onEditFertilizer(row.original.id)}
            >
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size={18} />}
              color="red"
              onClick={() => confirmDelete(row.original.id)}
            >
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
          Quản lý thông tin phân bón
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất Excel
          </Button>
          <Button
            radius={4}
            onClick={onFertilizerAdd}
            leftSection={<IconPlus size={18} />}
          >
            Thêm mới
          </Button>
        </Group>
      </Group>

      {/* --- FILTER CARD --- */}
      <Card withBorder shadow="sm" radius={4} p="md">
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm phân bón</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc loại phân bón, nhà sản xuất
            </Text>
          </Stack>

          <Group>
            <Tooltip label="Xoá tất cả bộ lọc">
              <Button
                radius={4}
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={handleResetFilters}
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
            label="Khung tìm kiếm"
            description="Ví dụ: Phân NPK, F001"
            placeholder="Nhập tên hoặc mã phân bón..."
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <MultiSelect
              label="Loại phân"
              description="Ví dụ: Phân NPK, Phân hữu cơ"
              placeholder="Chọn loại"
              data={typeOptions} // Data động từ store
              value={selectedTypes}
              onChange={setSelectedTypes}
              searchable
              clearable
              radius={4}
            />
            <MultiSelect
              label="Nhà sản xuất"
              description="Ví dụ: Bình Điền, Đạm Phú Mỹ"
              placeholder="Chọn nhà sản xuất"
              data={manufacturerOptions} // Data động từ store
              value={selectedManufacturers}
              onChange={setSelectedManufacturers}
              searchable
              clearable
              radius={4}
            />
          </SimpleGrid>
        </Stack>
      </Card>

      {/* --- TABLE --- */}
      <Table
        //@ts-expect-error no check
        columns={fertilizerColumns}
        //@ts-expect-error no check
        data={filteredData}
      />

      {/* --- DELETE MODAL --- */}
      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title="Xác nhận xóa"
        centered
      >
        <Text>Bạn có chắc chắn muốn xóa loại phân bón này không?</Text>
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

export default FertilizerManagementMainPage;
