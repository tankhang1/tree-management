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
import Table from "../../components/Table";
import { useState } from "react";
type PackagingSpecification = {
  id: string; // Mã quy cách
  name: string; // Tên quy cách
  packagingType: string; // Dạng đóng gói (bịch, túi, bao, hộp, ...)
  conversionQuantity: number; // Số lượng quy đổi
};
const packagingSpecifications: PackagingSpecification[] = [
  {
    id: "PKG001",
    name: "Hộp giấy nhỏ",
    packagingType: "Hộp",
    conversionQuantity: 50,
  },
  {
    id: "PKG002",
    name: "Túi nilon lớn",
    packagingType: "Túi",
    conversionQuantity: 100,
  },
  {
    id: "PKG003",
    name: "Bao tải 25kg",
    packagingType: "Bao",
    conversionQuantity: 25,
  },
  {
    id: "PKG004",
    name: "Bịch nhựa 1kg",
    packagingType: "Bịch",
    conversionQuantity: 10,
  },
];

const PackagingSpecificationPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSpecification, setNewSpecification] = useState({
    id: "",
    name: "",
    packagingType: "",
    conversionQuantity: 0,
  });

  const handleCreate = () => {
    console.log("Tạo mới Quy cách:", newSpecification);
    setIsModalOpen(false);
    // Reset form
    setNewSpecification({
      id: "",
      name: "",
      packagingType: "",
      conversionQuantity: 0,
    });
  };
  const packagingColumns: MRT_ColumnDef<PackagingSpecification>[] = [
    { accessorKey: "id", header: "Mã quy cách" },
    { accessorKey: "name", header: "Tên quy cách" },
    { accessorKey: "packagingType", header: "Dạng đóng gói" },
    {
      accessorKey: "conversionQuantity",
      header: "Số lượng quy đổi",
      Cell: ({ cell }) => (
        <Text fw={500} color="blue">
          {cell.getValue<number>().toLocaleString("vi-VN")}
        </Text>
      ),
    },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 10,
      Cell: () => (
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="transparent" c={"gray"}>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={() => console.log("Chi tiết")}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item leftSection={<IconEdit size={18} color="green" />}>
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={18} />} color="red">
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
          Quản lý Quy cách
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button
            radius={4}
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={packagingColumns} data={packagingSpecifications} />
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={<Text fw={500}>Tạo mới Quy cách</Text>}
      >
        <Stack gap="xs">
          <TextInput
            radius={4}
            label="Mã quy cách"
            placeholder="Nhập mã quy cách"
            value={newSpecification.id}
            onChange={(e) =>
              setNewSpecification((prev) => ({
                ...prev,
                id: e.currentTarget.value,
              }))
            }
          />
          <TextInput
            radius={4}
            label="Tên quy cách"
            placeholder="Nhập tên quy cách"
            value={newSpecification.name}
            onChange={(e) =>
              setNewSpecification((prev) => ({
                ...prev,
                name: e.currentTarget.value,
              }))
            }
          />
          <Select
            label="Dạng đóng gói"
            placeholder="Chọn dạng đóng gói"
            data={[
              { value: "Hộp", label: "Hộp" },
              { value: "Túi", label: "Túi" },
              { value: "Bao", label: "Bao" },
              { value: "Bịch", label: "Bịch" },
            ]}
            radius={4}
            value={newSpecification.packagingType}
            onChange={(value) =>
              setNewSpecification((prev) => ({
                ...prev,
                packagingType: value || "",
              }))
            }
          />
          <NumberInput
            radius={4}
            label="Số lượng quy đổi"
            placeholder="Nhập số lượng quy đổi"
            value={newSpecification.conversionQuantity}
          />
          <Group justify="flex-end">
            <Button
              radius={4}
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Hủy
            </Button>
            <Button radius={4} onClick={handleCreate}>
              Tạo mới
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};
export default PackagingSpecificationPage;
