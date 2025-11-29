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
  IconPlus,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import AddPesticideCategoryForm from "./components/AddPesticideCategoryForm";

import { useState, useMemo } from "react";
import { notifications } from "@mantine/notifications";
import {
  usePesticideTypeStore,
  type PesticideType,
} from "../../zustand/pesticideTypeStore";

const PesticideManagementCategoryPage = () => {
  // 1. Store
  const { types, deleteType } = usePesticideTypeStore();

  // 2. Local State
  const [
    openedPesticideForm,
    { open: openPesticideForm, close: closePesticideForm },
  ] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 3. Handlers
  const handleCreate = () => {
    setSelectedId(null);
    openPesticideForm();
  };

  const handleEdit = (id: string) => {
    setSelectedId(id);
    openPesticideForm();
  };

  const confirmDelete = (id: string) => {
    setSelectedId(id);
    openDelete();
  };

  const handleDelete = () => {
    if (selectedId) {
      deleteType(selectedId);
      notifications.show({ title: "Đã xóa", color: "green", message: "" });
      closeDelete();
      setSelectedId(null);
    }
  };

  const pesticideTypeColumns: MRT_ColumnDef<PesticideType>[] = [
    {
      accessorKey: "id",
      header: "Mã loại thuốc",
      Cell: ({ cell }) => <Text fw={500}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "name",
      header: "Tên loại thuốc",
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
          Quản lý loại thuốc
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
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
        columns={pesticideTypeColumns}
        //@ts-expect-error no check
        data={types}
      />

      <Modal
        opened={openedPesticideForm}
        onClose={closePesticideForm}
        title={
          <Text fw={"bold"}>
            {selectedId ? "Cập nhật loại thuốc" : "Thêm mới loại thuốc"}
          </Text>
        }
      >
        <AddPesticideCategoryForm
          editId={selectedId}
          onClose={closePesticideForm}
        />
      </Modal>

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
            Xóa ngay
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
};

export default PesticideManagementCategoryPage;
