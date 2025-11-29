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
  Image,
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
  IconX,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

// IMPORT STORE
import {
  usePesticideStore,
  type Pesticide,
} from "../../zustand/pesticideStore";
import { PATH } from "../../../constants/path.constants";
import Table from "../../../components/Table";

// Định nghĩa danh sách loại để map hiển thị
const PESTICIDE_TYPES = [
  { value: "TYPE01", label: "Thuốc trừ sâu" },
  { value: "TYPE02", label: "Thuốc trừ bệnh" },
  { value: "TYPE03", label: "Phân bón lá" },
  { value: "TYPE04", label: "Chất kích thích sinh trưởng" },
];

const PesticideManagementMainPage = () => {
  const navigate = useNavigate();

  // 1. KẾT NỐI STORE
  const { pesticides, deletePesticide } = usePesticideStore();

  // 2. STATE BỘ LỌC
  const [keyword, setKeyword] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // State Modal Xóa
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 3. NAVIGATION HANDLERS
  const onAddPesticide = () => navigate(PATH.PESTICIDE_ADD_MAIN);
  // Giả định dùng chung trang Add để Edit (kèm ID)
  const onEditPesticide = (id: string) =>
    navigate(`${PATH.PESTICIDE_ADD_MAIN}/${id}`);
  const onPesticideDetail = (id: string) =>
    navigate(`${PATH.PESTICIDE_MAIN_DETAIL}/${id}`);

  // 4. LOGIC DELETE
  const confirmDelete = (id: string) => {
    setSelectedId(id);
    openDelete();
  };

  const handleDelete = () => {
    if (selectedId) {
      deletePesticide(selectedId);
      notifications.show({
        title: "Thành công",
        message: "Đã xóa thuốc bảo vệ thực vật",
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
  };

  // 5. LOGIC FILTER
  const filteredData = useMemo(() => {
    return pesticides.filter((item) => {
      // Lọc theo từ khóa (Mã, Tên, Hoạt chất)
      const matchKeyword =
        !keyword ||
        item.name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.id.toLowerCase().includes(keyword.toLowerCase()) ||
        item.ingredients.toLowerCase().includes(keyword.toLowerCase());

      // Lọc theo Loại thuốc (Kiểm tra xem thuốc có thuộc bất kỳ loại nào được chọn không)
      // item.typeIds là mảng string[], selectedTypes là mảng string[]
      const matchType =
        selectedTypes.length === 0 ||
        item.typeIds.some((typeId) => selectedTypes.includes(typeId));

      return matchKeyword && matchType;
    });
  }, [pesticides, keyword, selectedTypes]);

  // Helper để lấy tên loại từ ID
  const getTypeName = (typeId: string) => {
    const type = PESTICIDE_TYPES.find((t) => t.value === typeId);
    return type ? type.label : typeId;
  };

  // 6. CẤU HÌNH CỘT
  const pesticideColumns: MRT_ColumnDef<Pesticide>[] = [
    {
      accessorKey: "id",
      header: "Mã thuốc",
      size: 100,
      Cell: ({ cell }) => <Text fw={500}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "image",
      header: "Hình ảnh",
      size: 80,
      Cell: ({ cell }) => {
        const src = cell.getValue<string>();
        console.log(src);
        return src ? (
          <Image src={src} h={40} w={40} radius="sm" fit="cover" />
        ) : (
          <Text size="xs" c="dimmed">
            No Img
          </Text>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Tên thuốc",
      size: 200,
      Cell: ({ cell }) => <Text fw={600}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "typeIds",
      header: "Loại thuốc",
      size: 180,
      Cell: ({ row }) => (
        <Group gap={4}>
          {row.original.typeIds.map((id) => (
            <Badge key={id} variant="outline" color="blue" size="sm">
              {getTypeName(id)}
            </Badge>
          ))}
        </Group>
      ),
    },
    {
      accessorKey: "ingredients",
      header: "Hoạt chất",
      size: 200,
      Cell: ({ cell }) => (
        <Text size="sm" lineClamp={2} title={cell.getValue<string>()}>
          {cell.getValue<string>()}
        </Text>
      ),
    },
    {
      accessorKey: "usage",
      header: "Công dụng",
      size: 200,
      Cell: ({ cell }) => (
        <Text
          size="sm"
          c="dimmed"
          lineClamp={2}
          title={cell.getValue<string>()}
        >
          {cell.getValue<string>()}
        </Text>
      ),
    },
    {
      accessorKey: "note",
      header: "Ghi chú",
      size: 150,
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
              leftSection={<IconEye size={18} color="gray" />}
              onClick={() => onPesticideDetail(row.original.id)}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item
              leftSection={<IconEdit size={18} color="green" />}
              onClick={() => onEditPesticide(row.original.id)}
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
          Quản lý thuốc bảo vệ thực vật
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất Excel
          </Button>
          <Button
            radius={4}
            onClick={onAddPesticide}
            leftSection={<IconPlus size={18} />}
          >
            Thêm mới
          </Button>
        </Group>
      </Group>

      {/* FILTER CARD */}
      <Card withBorder shadow="sm" radius={4} p="md">
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm thuốc BVTV</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn loại thuốc để lọc dữ liệu
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
            description="Ví dụ: Bio-X, Azadirachtin..."
            placeholder="Nhập tên thuốc, mã thuốc hoặc hoạt chất"
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
          />

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm">
            <MultiSelect
              label="Loại thuốc"
              description="Ví dụ: Thuốc trừ sâu, Thuốc trừ bệnh"
              placeholder="Chọn loại thuốc"
              data={PESTICIDE_TYPES}
              value={selectedTypes}
              onChange={setSelectedTypes}
              searchable
              clearable
              radius={4}
            />
          </SimpleGrid>
        </Stack>
      </Card>

      {/* TABLE */}
      <Table
        //@ts-expect-error no check
        columns={pesticideColumns}
        //@ts-expect-error no check
        data={filteredData}
      />

      {/* DELETE MODAL */}
      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title="Xác nhận xóa"
        centered
      >
        <Text>Bạn có chắc chắn muốn xóa loại thuốc này không?</Text>
        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={closeDelete}>
            Hủy
          </Button>
          <Button color="red" onClick={handleDelete}>
            Xoá ngay
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
};

export default PesticideManagementMainPage;
