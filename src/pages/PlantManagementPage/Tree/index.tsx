import {
  ActionIcon,
  Button,
  Card,
  Group,
  Image,
  Menu,
  MultiSelect,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
  Modal,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconGrowth,
  IconRefresh,
  IconSearch,
  IconSeedling,
  IconTractor,
  IconTrash,
} from "@tabler/icons-react";
import Table from "../../../components/Table";
import type { MRT_ColumnDef } from "mantine-react-table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import { useTreeStore, type Tree } from "../../zustand/treeStore"; // Import đúng Type Tree
import { useState, useMemo } from "react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

// Dữ liệu options cho bộ lọc (Có thể lấy từ store khác nếu cần)
const HARVEST_METHODS = [
  "Thu hoạch thủ công (Hái tay)",
  "Thu hoạch cơ giới (Máy gặt)",
  "Thu hoạch bán cơ giới",
];
const GROWTH_CYCLES = ["Ngắn hạn", "Trung hạn", "Dài hạn"];

const PlantManagementTreePage = () => {
  const navigate = useNavigate();

  // 1. KẾT NỐI STORE
  const { trees, deleteTree } = useTreeStore();

  // 2. STATE CHO FILTER
  const [keyword, setKeyword] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);

  // State cho Modal Xóa
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 3. NAVIGATION
  const onAddTree = () => navigate(PATH.PLANT_ADD_TREE);
  const onEditTree = (id: string) => navigate(`${PATH.PLANT_ADD_TREE}/${id}`); // Dùng chung trang Add để Edit
  const onTreeDetail = (id: string) =>
    navigate(`${PATH.PLANT_TREE_DETAIL}/${id}`); // Trang chi tiết (nếu có)

  // 4. LOGIC DELETE
  const confirmDelete = (id: string) => {
    setSelectedId(id);
    openDelete();
  };

  const handleDelete = () => {
    if (selectedId) {
      deleteTree(selectedId);
      notifications.show({
        title: "Đã xóa cây trồng",
        color: "green",
        message: "",
      });
      closeDelete();
      setSelectedId(null);
    }
  };

  const handleResetFilters = () => {
    setKeyword("");
    setSelectedTypes([]);
    setSelectedMethods([]);
  };

  // 5. LOGIC FILTER (Lọc dữ liệu)
  const filteredData = useMemo(() => {
    return trees.filter((tree) => {
      // Lọc theo từ khóa (Mã hoặc Tên)
      const matchKeyword =
        !keyword ||
        tree.name.toLowerCase().includes(keyword.toLowerCase()) ||
        tree.id.toLowerCase().includes(keyword.toLowerCase());

      // Lọc theo Loại cây
      const matchType =
        !selectedTypes.length || selectedTypes.includes(tree.type);

      // Lọc theo Phương pháp thu hoạch
      const matchMethod =
        !selectedMethods.length || selectedMethods.includes(tree.harvestMethod);

      return matchKeyword && matchType && matchMethod;
    });
  }, [trees, keyword, selectedTypes, selectedMethods]);

  // 6. CẤU HÌNH CỘT BẢNG
  const columns: MRT_ColumnDef<Tree>[] = [
    {
      accessorKey: "id",
      header: "Mã cây",
      size: 100,
      Cell: ({ cell }) => <Text fw={500}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "imgUrl",
      header: "Hình ảnh",
      size: 80,
      Cell: ({ cell }) => (
        <Image
          src={cell.getValue<string>()}
          h={40}
          w={40}
          radius={4}
          fit="cover"
          fallbackSrc="https://placehold.co/40x40?text=No+Image"
        />
      ),
    },
    { accessorKey: "name", header: "Tên cây", size: 150 },
    { accessorKey: "type", header: "Loại cây" },
    { accessorKey: "group", header: "Nhóm cây" },
    { accessorKey: "harvestMethod", header: "Thu hoạch" },
    {
      id: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 60,
      Cell: ({ row }) => (
        <Menu shadow="md" position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDotsVertical size={18} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {/* <Menu.Item 
                leftSection={<IconEye size={18} color="gray" />}
                onClick={() => onTreeDetail(row.original.id)}
            >
              Chi tiết
            </Menu.Item> */}
            <Menu.Item
              leftSection={<IconEdit size={18} color="blue" />}
              onClick={() => onEditTree(row.original.id)}
            >
              Sửa
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size={18} color="red" />}
              onClick={() => confirmDelete(row.original.id)}
            >
              Xóa
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
          Quản lý cây trồng
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất Excel
          </Button>
          <Button radius={4} onClick={onAddTree}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      {/* --- BỘ LỌC --- */}
      <Card withBorder shadow="sm" radius={4} p="md">
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm cây trồng</Title>
            <Text c="dimmed" size="sm">
              Lọc theo tên, mã, loại cây hoặc phương pháp thu hoạch
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
            placeholder="Nhập tên cây hoặc mã cây..."
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
          />

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="sm">
            <MultiSelect
              searchable
              clearable
              radius={4}
              leftSection={<IconSeedling size={18} />}
              label="Loại cây"
              placeholder="Chọn loại cây"
              data={["Sầu riêng", "Xoài", "Bưởi", "Đậu nành"]} // Có thể lấy động từ store unique value
              value={selectedTypes}
              onChange={setSelectedTypes}
            />
            <MultiSelect
              searchable
              clearable
              radius={4}
              leftSection={<IconTractor size={18} />}
              label="Hình thức thu hoạch"
              placeholder="Chọn hình thức"
              data={HARVEST_METHODS}
              value={selectedMethods}
              onChange={setSelectedMethods}
            />
            <MultiSelect
              searchable
              clearable
              radius={4}
              leftSection={<IconGrowth size={18} />}
              label="Chu kỳ sinh trưởng"
              placeholder="Chọn chu kỳ"
              data={GROWTH_CYCLES}
              // Logic lọc chu kỳ phức tạp hơn vì nó nằm trong mảng con, tạm thời để UI thôi
            />
          </SimpleGrid>
        </Stack>
      </Card>

      {/* --- BẢNG DỮ LIỆU --- */}
      <Table
        //@ts-expect-error no check
        columns={columns}
        //@ts-expect-error no check
        data={filteredData}
      />

      {/* --- MODAL XÓA --- */}
      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title="Xác nhận xóa"
        centered
      >
        <Text>Bạn có chắc chắn muốn xóa cây trồng này không?</Text>
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

export default PlantManagementTreePage;
