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
  IconEye,
  IconFileExcel,
  IconTrash,
} from "@tabler/icons-react";
import Table from "../../../components/Table";
import type { MRT_ColumnDef } from "mantine-react-table";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

import AddGroupForm from "./components/AddGroupForm";
import {
  useCropGroupStore,
  type CropGroup,
} from "../../zustand/cropGroupStore";
// Import Store và Interface

const PlantManagementGroupPage = () => {
  // 1. Kết nối Store
  const { groups, deleteGroup } = useCropGroupStore();

  // 2. State quản lý Modal và ID đang chọn
  const [openedForm, { open: openForm, close: closeForm }] =
    useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 3. Handlers (Xử lý sự kiện)
  const handleCreate = () => {
    setSelectedId(null); // Reset ID để form hiểu là thêm mới
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
      deleteGroup(selectedId);
      notifications.show({
        title: "Đã xóa thành công",
        color: "green",
        message: "",
      });
      closeDelete();
      setSelectedId(null);
    }
  };

  // 4. Cấu hình cột bảng
  const cropTypeColumns: MRT_ColumnDef<CropGroup>[] = [
    {
      accessorKey: "id",
      header: "Mã loại cây",
      size: 120,
      Cell: ({ cell }) => <Text fw={500}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "name",
      header: "Tên loại cây",
      size: 200,
    },
    {
      accessorKey: "note",
      header: "Ghi chú",
      Cell: ({ cell }) => (
        <Text c="dimmed" size="sm" lineClamp={1}>
          {cell.getValue<string>()}
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
            {/* Nếu cần chức năng xem chi tiết thì thêm sau */}
            {/* <Menu.Item leftSection={<IconEye size={18} color="gray" />}>Chi tiết</Menu.Item> */}

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
          Quản lý nhóm cây trồng
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

      {/* Truyền dữ liệu từ Store vào Table */}
      <Table
        //@ts-expect-error no check
        columns={cropTypeColumns}
        //@ts-expect-error no check
        data={groups}
      />

      {/* Modal Thêm/Sửa */}
      <Modal
        opened={openedForm}
        onClose={closeForm}
        title={
          <Text fw={500}>
            {selectedId ? "Cập nhật loại cây" : "Tạo mới loại cây"}
          </Text>
        }
      >
        <AddGroupForm editId={selectedId} onClose={closeForm} />
      </Modal>

      {/* Modal Xác nhận Xóa */}
      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title="Xác nhận xóa"
        centered
      >
        <Text>Bạn có chắc chắn muốn xóa nhóm cây này không?</Text>
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

export default PlantManagementGroupPage;
