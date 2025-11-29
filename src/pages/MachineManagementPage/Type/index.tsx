import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Modal,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconFileExcel,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

import AddMachineCategoryForm from "./components/AddMachineCategoryForm";
import {
  useMachineCategoryStore,
  type MachineCategory,
} from "../../zustand/machineCategoryStore";

const MachineManagementCategoryPage = () => {
  // 1. Kết nối Store
  const { machines, deleteMachine } = useMachineCategoryStore();

  // 2. State quản lý
  const [
    openedMachineForm,
    { open: openMachineForm, close: closeMachineForm },
  ] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 3. Handlers
  const handleCreate = () => {
    setSelectedId(null);
    openMachineForm();
  };

  const handleEdit = (id: string) => {
    setSelectedId(id);
    openMachineForm();
  };

  const confirmDelete = (id: string) => {
    setSelectedId(id);
    openDelete();
  };

  const handleDelete = () => {
    if (selectedId) {
      deleteMachine(selectedId);
      notifications.show({
        title: "Đã xóa thành công",
        color: "green",
        message: "",
      });
      closeDelete();
      setSelectedId(null);
    }
  };

  const machineTypeColumns: MRT_ColumnDef<MachineCategory>[] = [
    {
      accessorKey: "id",
      header: "Mã loại máy móc",
      size: 150,
      Cell: ({ cell }) => <Text fw={500}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "name",
      header: "Tên loại máy móc",
    },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 10,
      Cell: ({ row }) => (
        <Menu shadow="md" position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="transparent" c={"gray"}>
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
          Quản lý loại máy móc
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

      {/* Truyền data từ Store */}
      <Table
        //@ts-expect-error no check
        columns={machineTypeColumns}
        //@ts-expect-error no check
        data={machines}
      />

      {/* Modal Thêm/Sửa */}
      <Modal
        opened={openedMachineForm}
        onClose={closeMachineForm}
        title={
          <Text fw={"bold"}>
            {selectedId ? "Cập nhật loại máy móc" : "Thêm mới loại máy móc"}
          </Text>
        }
      >
        <AddMachineCategoryForm
          editId={selectedId}
          onClose={closeMachineForm}
        />
      </Modal>

      {/* Modal Xóa */}
      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title="Xác nhận xóa"
        centered
      >
        <Text>Bạn có chắc chắn muốn xóa loại máy này không?</Text>
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

export default MachineManagementCategoryPage;
