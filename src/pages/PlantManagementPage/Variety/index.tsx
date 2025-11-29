import {
  ActionIcon,
  Button,
  Card,
  Group,
  Image,
  Menu,
  Modal,
  MultiSelect,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import {
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
import { useDisclosure } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { notifications } from "@mantine/notifications";

import AddVarietyForm from "./components/AddVarietyForm";
import VarietyDetailModal from "./components/VarietyDetailModal";
import { useVarietyStore, type Variety } from "../../zustand/varietyStore";

const PlantManagementVarietyPage = () => {
  // 1. STORE & STATE
  const { varieties, deleteVariety } = useVarietyStore();

  // Modal states
  const [openedForm, { open: openForm, close: closeForm }] =
    useDisclosure(false);
  const [openedDetail, { open: openDetail, close: closeDetail }] =
    useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

  // Selection states
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filter states
  const [keyword, setKeyword] = useState("");
  const [selectedTrees, setSelectedTrees] = useState<string[]>([]);

  // 2. LOGIC FILTER
  const filteredRows = useMemo(() => {
    return varieties.filter((v) => {
      const matchKeyword =
        !keyword ||
        v.name.toLowerCase().includes(keyword.toLowerCase()) ||
        v.id.toLowerCase().includes(keyword.toLowerCase());

      const matchTree =
        !selectedTrees.length || selectedTrees.includes(v.treeName);

      return matchKeyword && matchTree;
    });
  }, [varieties, keyword, selectedTrees]);

  // 3. HANDLERS
  const handleCreate = () => {
    setSelectedId(null); // Reset ID để form hiểu là thêm mới
    openForm();
  };

  const handleEdit = (id: string) => {
    setSelectedId(id);
    openForm();
  };

  const handleView = (id: string) => {
    setSelectedId(id);
    openDetail();
  };

  const confirmDelete = (id: string) => {
    setSelectedId(id);
    openDelete();
  };

  const handleDelete = () => {
    if (selectedId) {
      deleteVariety(selectedId);
      notifications.show({ title: "Đã xóa", color: "green", message: "" });
      closeDelete();
      setSelectedId(null);
    }
  };

  // 4. TABLE COLUMNS
  const columns: MRT_ColumnDef<Variety>[] = [
    {
      accessorKey: "imgUrl",
      header: "Hình ảnh",
      size: 80,
      Cell: ({ cell }) => (
        <Image
          src={cell.getValue<string>()}
          alt="img"
          h={48}
          w={48}
          radius={4}
          fit="cover"
          fallbackSrc="https://placehold.co/48x48?text=No+Image"
        />
      ),
    },
    { accessorKey: "treeName", header: "Tên cây" },
    { accessorKey: "id", header: "Mã giống" },
    { accessorKey: "name", header: "Tên giống" },
    {
      accessorKey: "description",
      header: "Mô tả",
      size: 300,
      Cell: ({ cell }) => (
        <Tooltip label={cell.getValue<string>()} multiline w={300}>
          <Text lineClamp={2} size="sm">
            {cell.getValue<string>()}
          </Text>
        </Tooltip>
      ),
    },
    {
      accessorKey: "docType", // Dùng trường này để hiển thị trạng thái tài liệu
      header: "Tài liệu",
      Cell: ({ row }) =>
        row.original.docType === "file" ? (
          <Text c="blue" td="underline" size="sm">
            {row.original.docContent}
          </Text>
        ) : (
          <Text c="dimmed" size="sm">
            Xem chi tiết
          </Text>
        ),
    },
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
            <Menu.Item
              onClick={() => handleView(row.original.id)}
              leftSection={<IconEye size={18} color="gray" />}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item
              onClick={() => handleEdit(row.original.id)}
              leftSection={<IconEdit size={18} color="green" />}
            >
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item
              onClick={() => confirmDelete(row.original.id)}
              leftSection={<IconTrash size={18} />}
              color="red"
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
          Quản lý giống cây
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={handleCreate}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Card withBorder shadow="sm" radius={4} p="md">
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm giống cây</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc loại cây
            </Text>
          </Stack>
          <Group>
            <Tooltip label="Làm mới">
              <Button
                radius={4}
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={() => {
                  setKeyword("");
                  setSelectedTrees([]);
                }}
              >
                Làm mới
              </Button>
            </Tooltip>
          </Group>
        </Group>

        <Group gap="sm">
          <TextInput
            radius={4}
            label="Khung tìm kiếm"
            placeholder="Nhập tên giống, mã giống..."
            leftSection={<IconSearch size={16} />}
            value={keyword}
            flex={1}
            onChange={(e) => setKeyword(e.currentTarget.value)}
          />
          <MultiSelect
            label="Cây trồng"
            placeholder="Chọn cây trồng"
            data={["Sầu riêng", "Xoài", "Bưởi", "Đậu nành", "Bắp"]}
            radius={4}
            value={selectedTrees}
            onChange={setSelectedTrees}
            searchable
            clearable
            flex={1}
          />
        </Group>
      </Card>

      <Table
        //@ts-expect-error no check
        columns={columns}
        //@ts-expect-error no check
        data={filteredRows}
      />

      {/* Modal Thêm/Sửa */}
      <Modal
        opened={openedForm}
        onClose={closeForm}
        size="lg"
        title={
          <Text fw={500}>
            {selectedId ? "Cập nhật giống cây" : "Tạo mới giống cây"}
          </Text>
        }
      >
        <AddVarietyForm editId={selectedId} onClose={closeForm} />
      </Modal>

      {/* Modal Chi tiết */}
      <VarietyDetailModal
        opened={openedDetail}
        onClose={closeDetail}
        viewId={selectedId}
      />

      {/* Modal Xóa */}
      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title="Xác nhận xóa"
        centered
      >
        <Text>Bạn có chắc chắn muốn xóa giống cây này không?</Text>
        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={closeDelete}>
            Hủy
          </Button>
          <Button color="red" onClick={handleDelete}>
            Xóa
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
};

export default PlantManagementVarietyPage;
