import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye, // Giữ lại nếu cần sau này
  IconFileExcel,
  IconTrash,
  IconPlus,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import { useState } from "react";
import Table from "../../components/Table";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import {
  usePackagingStore,
  type PackagingSpecification,
} from "../zustand/packagingStore";

const BASE_UNITS = [
  "Cái",
  "Chiếc",
  "Kg",
  "Gói",
  "Lít",
  "Mét",
  "Viên",
  "Cuộn",
  "Hộp",
  "Chai",
  "Lon",
];
const PACKAGING_TYPES = [
  "Hộp",
  "Túi",
  "Bao",
  "Bịch",
  "Thùng",
  "Lốc",
  "Pallet",
  "Kiện",
];

const PackagingSpecificationPage = () => {
  // Store Hooks
  const {
    packagings,
    addPackaging,
    updatePackaging,
    deletePackaging,
    isLoading,
  } = usePackagingStore();

  // Modal State
  const [opened, { open, close }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

  // Data State
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PackagingSpecification>({
    id: "",
    name: "",
    packagingType: "",
    conversionQuantity: 1,
    baseUnit: "",
  });

  // --- HANDLERS ---

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setFormData({
      id: "",
      name: "",
      packagingType: "",
      conversionQuantity: 1,
      baseUnit: "",
    });
    open();
  };

  const handleOpenEdit = (pkg: PackagingSpecification) => {
    setIsEditMode(true);
    setFormData(pkg); // Fill data vào form
    open();
  };

  const handleSave = async () => {
    // Validate cơ bản
    if (
      !formData.id ||
      !formData.name ||
      !formData.baseUnit ||
      !formData.packagingType
    ) {
      notifications.show({
        title: "Lỗi",
        message: "Vui lòng điền đầy đủ thông tin",
        color: "red",
      });
      return;
    }

    let success = false;
    if (isEditMode) {
      success = await updatePackaging(formData.id, formData);
    } else {
      success = await addPackaging(formData);
    }

    if (success) {
      notifications.show({
        title: "Thành công",
        message: isEditMode ? "Cập nhật thành công" : "Tạo mới thành công",
        color: "green",
      });
      close();
    } else {
      notifications.show({
        title: "Thất bại",
        message: "Mã quy cách đã tồn tại hoặc lỗi hệ thống",
        color: "red",
      });
    }
  };

  const handleDelete = () => {
    if (selectedId) {
      deletePackaging(selectedId);
      notifications.show({ title: "Đã xóa", color: "green", message: "" });
      closeDelete();
    }
  };

  // --- TABLE COLUMNS ---
  const columns: MRT_ColumnDef<PackagingSpecification>[] = [
    {
      accessorKey: "id",
      header: "Mã quy cách",
      size: 100,
      Cell: ({ cell }) => <Text fw={500}>{cell.getValue<string>()}</Text>,
    },
    { accessorKey: "name", header: "Tên quy cách", size: 200 },
    {
      accessorKey: "packagingType",
      header: "Dạng đóng gói",
      size: 120,
      Cell: ({ cell }) => <Text c="dimmed">{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "conversionQuantity",
      header: "SL Quy đổi",
      size: 150,
      Cell: ({ row }) => (
        <Text fw={500} c="blue">
          {row.original.conversionQuantity.toLocaleString("vi-VN")}{" "}
          {row.original.baseUnit}
        </Text>
      ),
    },
    { accessorKey: "baseUnit", header: "Đơn vị tính", size: 100 },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 80,
      Cell: ({ row }) => (
        <Menu shadow="md" position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDotsVertical size={20} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {/* <Menu.Item leftSection={<IconEye size={18} />}>Chi tiết</Menu.Item> */}
            <Menu.Item
              leftSection={<IconEdit size={18} color="blue" />}
              onClick={() => handleOpenEdit(row.original)}
            >
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size={18} color="red" />}
              onClick={() => {
                setSelectedId(row.original.id);
                openDelete();
              }}
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
        <Title order={2}>Quản lý Quy cách</Title>
        <Group>
          <Button variant="outline" radius="md" leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button
            radius="md"
            onClick={handleOpenCreate}
            leftSection={<IconPlus size={18} />}
          >
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table
        //@ts-expect-error no check
        columns={columns}
        //@ts-expect-error no check
        data={packagings}
      />

      {/* --- MODAL THÊM / SỬA --- */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Text fw={600} size="lg">
            {isEditMode ? "Cập nhật Quy cách" : "Tạo mới Quy cách"}
          </Text>
        }
        centered
      >
        <Stack gap="md" pos="relative">
          <LoadingOverlay visible={isLoading} />

          <TextInput
            radius="md"
            label="Mã quy cách"
            placeholder="VD: PKG001"
            withAsterisk
            value={formData.id}
            onChange={(e) =>
              setFormData({ ...formData, id: e.currentTarget.value })
            }
            readOnly={isEditMode} // Không cho sửa ID khi edit
            disabled={isEditMode}
          />
          <TextInput
            radius="md"
            label="Tên quy cách"
            placeholder="VD: Thùng 24 lon"
            withAsterisk
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.currentTarget.value })
            }
          />

          <Group grow>
            <Select
              searchable
              clearable
              label="Dạng đóng gói"
              placeholder="Chọn dạng"
              data={PACKAGING_TYPES}
              radius="md"
              withAsterisk
              value={formData.packagingType}
              onChange={(val) =>
                setFormData({ ...formData, packagingType: val || "" })
              }
            />

            <Select
              searchable
              clearable
              label="Đơn vị tính (Cơ bản)"
              placeholder="Chọn ĐVT"
              data={BASE_UNITS}
              radius="md"
              withAsterisk
              value={formData.baseUnit}
              onChange={(val) =>
                setFormData({ ...formData, baseUnit: val || "" })
              }
            />
          </Group>

          <NumberInput
            radius="md"
            label="Số lượng quy đổi"
            description={`1 ${formData.packagingType || "..."} = ? ${
              formData.baseUnit || "..."
            }`}
            placeholder="VD: 24"
            withAsterisk
            min={1}
            value={formData.conversionQuantity}
            onChange={(val) =>
              setFormData({ ...formData, conversionQuantity: Number(val) })
            }
            rightSection={
              <Text size="xs" c="dimmed" mr="xs">
                {formData.baseUnit}
              </Text>
            }
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={close}>
              Hủy
            </Button>
            <Button onClick={handleSave} color="green">
              {isEditMode ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* --- MODAL XÓA --- */}
      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title="Xác nhận xóa"
        centered
      >
        <Text>Bạn có chắc chắn muốn xóa quy cách này không?</Text>
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

export default PackagingSpecificationPage;
