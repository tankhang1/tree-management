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
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import { useState } from "react";
import Table from "../../components/Table";

type PackagingSpecification = {
  id: string;
  name: string;
  packagingType: string;
  conversionQuantity: number;
  baseUnit: string;
};

// Danh sách các đơn vị tính cơ bản để nạp vào Select
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
];

const packagingSpecifications: PackagingSpecification[] = [
  {
    id: "PKG001",
    name: "Hộp giấy nhỏ",
    packagingType: "Hộp",
    conversionQuantity: 50,
    baseUnit: "Cái",
  },
  {
    id: "PKG002",
    name: "Túi nilon lớn",
    packagingType: "Túi",
    conversionQuantity: 100,
    baseUnit: "Chiếc",
  },
];

const PackagingSpecificationPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSpecification, setNewSpecification] = useState({
    id: "",
    name: "",
    packagingType: "",
    conversionQuantity: 0,
    baseUnit: "",
  });

  const handleCreate = () => {
    console.log("Tạo mới Quy cách:", newSpecification);
    setIsModalOpen(false);
    setNewSpecification({
      id: "",
      name: "",
      packagingType: "",
      conversionQuantity: 0,
      baseUnit: "",
    });
  };

  const packagingColumns: MRT_ColumnDef<PackagingSpecification>[] = [
    { accessorKey: "id", header: "Mã quy cách", size: 100 },
    { accessorKey: "name", header: "Tên quy cách" },
    { accessorKey: "packagingType", header: "Dạng đóng gói", size: 120 },
    { accessorKey: "baseUnit", header: "Đơn vị tính", size: 100 },
    {
      accessorKey: "conversionQuantity",
      header: "SL Quy đổi",
      size: 120,
      Cell: ({ row }) => (
        <Text fw={500} c="blue">
          {row.original.conversionQuantity.toLocaleString("vi-VN")}{" "}
          {row.original.baseUnit}
        </Text>
      ),
    },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 80,
      Cell: () => (
        <Menu shadow="md" position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDotsVertical size={20} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconEye size={18} />}>Chi tiết</Menu.Item>
            <Menu.Item leftSection={<IconEdit size={18} color="green" />}>
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={18} color="red" />}>
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
          <Button radius="md" onClick={() => setIsModalOpen(true)}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={packagingColumns} data={packagingSpecifications} />

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          <Text fw={600} size="lg">
            Tạo mới Quy cách
          </Text>
        }
        centered
      >
        <Stack gap="md">
          <TextInput
            radius="md"
            label="Mã quy cách"
            placeholder="VD: PKG005"
            withAsterisk
            value={newSpecification.id}
            onChange={(e) =>
              setNewSpecification((prev) => ({
                ...prev,
                id: e.currentTarget.value,
              }))
            }
          />
          <TextInput
            radius="md"
            label="Tên quy cách"
            placeholder="VD: Thùng bia 24 lon"
            withAsterisk
            value={newSpecification.name}
            onChange={(e) =>
              setNewSpecification((prev) => ({
                ...prev,
                name: e.currentTarget.value,
              }))
            }
          />

          <Group grow>
            <Select
              searchable
              clearable
              label="Dạng đóng gói"
              placeholder="Chọn dạng"
              data={["Hộp", "Túi", "Bao", "Bịch", "Thùng", "Lốc"]}
              radius="md"
              withAsterisk
              value={newSpecification.packagingType}
              onChange={(value) =>
                setNewSpecification((prev) => ({
                  ...prev,
                  packagingType: value || "",
                }))
              }
            />

            {/* --- ĐÃ CẬP NHẬT THÀNH SELECT --- */}
            <Select
              searchable
              clearable
              label="Đơn vị tính"
              placeholder="Chọn ĐVT"
              data={BASE_UNITS} // Sử dụng danh sách hằng số
              radius="md"
              withAsterisk
              value={newSpecification.baseUnit}
              onChange={(value) =>
                setNewSpecification((prev) => ({
                  ...prev,
                  baseUnit: value || "",
                }))
              }
            />
          </Group>

          <NumberInput
            radius="md"
            label="Số lượng quy đổi"
            placeholder="Nhập số lượng"
            withAsterisk
            min={0}
            value={newSpecification.conversionQuantity}
            onChange={(val) =>
              setNewSpecification((prev) => ({
                ...prev,
                conversionQuantity: Number(val),
              }))
            }
            // Hiển thị đơn vị ngay trong ô nhập để người dùng dễ hình dung
            rightSection={
              <Text size="xs" c="dimmed" mr="xs">
                {newSpecification.baseUnit}
              </Text>
            }
          />

          <Group justify="flex-end" mt="md">
            <Button
              radius="md"
              variant="default"
              onClick={() => setIsModalOpen(false)}
            >
              Hủy
            </Button>
            <Button radius="md" onClick={handleCreate}>
              Tạo mới
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default PackagingSpecificationPage;
