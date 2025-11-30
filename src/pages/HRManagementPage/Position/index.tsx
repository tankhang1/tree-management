import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Modal,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconFileExcel,
  IconTrash,
  IconEye,
  IconPlus,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useForm } from "@mantine/form";
import { useState, useMemo } from "react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { usePositionStore, type Position } from "../../zustand/positionStore";
import { useHistoryStore } from "../../zustand/hrHistoryStore";

// IMPORT STORE

const HRManagementPositionPage = () => {
  // 1. STORE HOOKS
  const { positions, addPosition, updatePosition, deletePosition, isLoading } =
    usePositionStore();
  const { addLog } = useHistoryStore();
  // 2. STATES
  const [opened, { open, close }] = useDisclosure(false); // Modal Form
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false); // Modal Delete

  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 3. FORM SETUP
  const form = useForm({
    initialValues: {
      code: "",
      name: "",
      description: "",
    },
    validate: {
      code: (value) => (value.trim().length < 2 ? "Mã vị trí quá ngắn" : null),
      name: (value) => (value.trim().length < 2 ? "Tên vị trí quá ngắn" : null),
    },
  });

  // --- HANDLERS ---

  // Mở modal thêm mới
  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedId(null);
    form.reset();
    open();
  };

  // Mở modal chỉnh sửa
  const handleOpenEdit = (pos: Position) => {
    setIsEditing(true);
    setSelectedId(pos.id);
    form.setValues({
      code: pos.code,
      name: pos.name,
      description: pos.description || "",
    });
    open();
  };

  // Xử lý Submit
  const handleSubmit = async (values: typeof form.values) => {
    let success = false;

    if (isEditing && selectedId) {
      success = await updatePosition(selectedId, values);
      if (success)
        notifications.show({
          title: "Cập nhật thành công",
          color: "green",
          icon: <IconCheck />,
          message: "",
        });
    } else {
      success = await addPosition(values);
      if (success)
        notifications.show({
          title: "Thêm mới thành công",
          color: "green",
          icon: <IconCheck />,
          message: "",
        });
    }

    if (success) {
      addLog({
        action: isEditing
          ? `Cập nhật vị trí: ${values.name}`
          : `Thêm mới vị trí: ${values.name}`,
        entityType: "Position",
        // Nếu đang sửa thì dùng ID thật, nếu thêm mới mà chưa có ID trả về thì dùng tên hoặc timestamp
        performedBy: isEditing ? selectedId || "" : `POS-${Date.now()}`,
        targetName: "Admin System",
        details: values.description
          ? `Mô tả: ${values.description}`
          : "Không có mô tả",
      });
      close();
      form.reset();
    } else {
      notifications.show({
        title: "Có lỗi xảy ra",
        color: "red",
        icon: <IconX />,
        message: "",
      });
    }
  };

  // Mở modal xác nhận xóa
  const handleConfirmDelete = (id: string) => {
    setSelectedId(id);
    openDelete();
  };

  // Xử lý xóa
  const handleDelete = () => {
    if (selectedId) {
      deletePosition(selectedId);
      notifications.show({
        title: "Đã xóa vị trí",
        color: "green",
        icon: <IconCheck />,
        message: "",
      });
      closeDelete();
      setSelectedId(null);
    }
  };

  // --- TABLE COLUMNS ---
  const positionColumns: MRT_ColumnDef<Position>[] = useMemo(
    () => [
      {
        accessorKey: "code",
        header: "Mã vị trí",
        size: 100,
        Cell: ({ cell }) => <Text fw={500}>{cell.getValue<string>()}</Text>,
      },
      {
        accessorKey: "name",
        header: "Tên vị trí",
        size: 200,
        Cell: ({ cell }) => <Text fw={600}>{cell.getValue<string>()}</Text>,
      },
      {
        accessorKey: "description",
        header: "Mô tả",
        Cell: ({ cell }) => (
          <Text c="dimmed" size="sm" lineClamp={1}>
            {cell.getValue<string>() || "—"}
          </Text>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        size: 120,
      },
      {
        accessorKey: "updatedAt",
        header: "Cập nhật",
        size: 120,
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
              {/* <Menu.Item leftSection={<IconEye size={18} color="gray" />}>Chi tiết</Menu.Item> */}
              <Menu.Item
                leftSection={<IconEdit size={18} color="blue" />}
                onClick={() => handleOpenEdit(row.original)}
              >
                Chỉnh sửa
              </Menu.Item>
              <Menu.Item
                leftSection={<IconTrash size={18} color="red" />}
                onClick={() => handleConfirmDelete(row.original.id)}
              >
                Xoá
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ),
      },
    ],
    []
  );

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý vị trí (vai trò)
        </Title>
        <Group>
          <Button
            variant="outline"
            radius={4}
            leftSection={<IconFileExcel size={18} />}
          >
            Xuất Excel
          </Button>
          <Button
            radius={4}
            onClick={handleOpenCreate}
            leftSection={<IconPlus size={18} />}
          >
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table
        //@ts-expect-error no check
        columns={positionColumns}
        //@ts-expect-error no check
        data={positions}
      />

      {/* --- MODAL ADD / EDIT --- */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Text fw={700} size="lg">
            {isEditing ? "Cập nhật vị trí" : "Tạo vị trí mới"}
          </Text>
        }
        radius={4}
        centered
      >
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          style={{ position: "relative" }}
        >
          <LoadingOverlay
            visible={isLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <Stack gap="md">
            <TextInput
              label="Mã vị trí"
              placeholder="VD: MKT-SEN"
              withAsterisk
              radius={4}
              {...form.getInputProps("code")}
              readOnly={isEditing}
              variant={isEditing ? "filled" : "default"}
            />
            <TextInput
              label="Tên vị trí"
              placeholder="VD: Marketing Senior"
              withAsterisk
              radius={4}
              {...form.getInputProps("name")}
            />
            <Textarea
              label="Mô tả"
              placeholder="Mô tả trách nhiệm, yêu cầu..."
              radius={4}
              minRows={3}
              {...form.getInputProps("description")}
            />

            <Group justify="flex-end" mt="sm">
              <Button variant="default" onClick={close} radius={4}>
                Hủy
              </Button>
              <Button type="submit" radius={4} color="green">
                {isEditing ? "Lưu thay đổi" : "Tạo mới"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* --- MODAL CONFIRM DELETE --- */}
      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title="Xác nhận xóa"
        centered
        radius={4}
      >
        <Text>Bạn có chắc chắn muốn xóa vị trí này không?</Text>
        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={closeDelete} radius={4}>
            Hủy
          </Button>
          <Button color="red" onClick={handleDelete} radius={4}>
            Xóa ngay
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
};
export default HRManagementPositionPage;
