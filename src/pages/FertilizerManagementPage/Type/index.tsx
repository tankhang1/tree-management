import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Modal,
  Stack,
  Text,
  Title,
  TextInput,
  Card,
  Tooltip,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconFileExcel,
  IconTrash,
  IconPlus,
  IconSearch,
  IconRefresh,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import { useState, useMemo } from "react";
import { notifications } from "@mantine/notifications";

import AddFertilizerForm from "./components/AddFertilizerForm";
import {
  useFertilizerTypeStore,
  type FertilizerType,
} from "../../zustand/fertilizerTypeStore";

const FertilizerManagementTypePage = () => {
  // 1. Kết nối Store
  const { types, deleteType } = useFertilizerTypeStore();

  // 2. State quản lý
  const [openedForm, { open: openForm, close: closeForm }] =
    useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 3. Handlers
  const handleCreate = () => {
    setSelectedId(null);
    openForm();
  };

  const handleEdit = (id: string) => {
    setSelectedId(id);
    openForm();
  };

  const confirmDelete = (id: string) => {
    setSelectedId(id);
    openDelete();
  };

  const handleDelete = () => {
    if (selectedId) {
      deleteType(selectedId);
      notifications.show({
        title: "Đã xóa thành công",
        color: "green",
        message: "",
      });
      closeDelete();
      setSelectedId(null);
    }
  };

  const fertilizerColumns: MRT_ColumnDef<FertilizerType>[] = [
    {
      accessorKey: "id",
      header: "Mã loại",
      size: 100,
      Cell: ({ cell }) => <Text fw={500}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "name",
      header: "Tên phân bón",
      Cell: ({ cell }) => <Text fw={600}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "nutrientContent",
      header: "Hàm lượng dinh dưỡng",
    },
    {
      accessorKey: "unit",
      header: "ĐVT",
      size: 80,
    },
    {
      accessorKey: "description",
      header: "Ghi chú",
      Cell: ({ cell }) => (
        <Text c="dimmed" size="sm" lineClamp={1}>
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
            <ActionIcon variant="subtle" c={"gray"}>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEdit size={18} color="green" />}
              onClick={() => handleEdit(row.original.id)}
            >
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size={18} color="red" />}
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
          Quản lý loại phân bón
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất Excel
          </Button>
          <Button
            radius={4}
            onClick={handleCreate}
            leftSection={<IconPlus size={18} />}
          >
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table
        //@ts-expect-error no check
        columns={fertilizerColumns}
        //@ts-expect-error no check
        data={types}
      />

      {/* MODAL THÊM / SỬA */}
      <Modal
        opened={openedForm}
        onClose={closeForm}
        title={
          <Text fw={"bold"}>
            {selectedId ? "Cập nhật loại phân bón" : "Tạo mới loại phân bón"}
          </Text>
        }
        centered
      >
        <AddFertilizerForm editId={selectedId} onClose={closeForm} />
      </Modal>

      {/* MODAL XÓA */}
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
export default FertilizerManagementTypePage;
