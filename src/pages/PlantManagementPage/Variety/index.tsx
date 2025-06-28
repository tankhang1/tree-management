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
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import AddVarietyForm from "./components/AddVarietyForm";

type CropVariety = {
  id: string; // Mã giống cây (hệ thống)
  name: string; // Tên giống cây
  categoryId: string; // ID danh mục cây trồng
  categoryName: string; // Tên danh mục cây trồng (hiển thị)
};
const cropVarietyData: CropVariety[] = [
  {
    id: "VRI-001",
    name: "Sầu riêng Dona",
    categoryId: "CT001",
    categoryName: "Sầu riêng",
  },
  {
    id: "VRI-002",
    name: "Cà phê vối",
    categoryId: "CT002",
    categoryName: "Cà phê",
  },
  {
    id: "VRI-003",
    name: "Xoài Cát Chu",
    categoryId: "CT003",
    categoryName: "Xoài",
  },
];

const PlantManagementVarietyPage = () => {
  const [
    openedVarietyForm,
    { open: openVarietyForm, close: closeVarietyForm },
  ] = useDisclosure(false);
  const cropVarietyColumns: MRT_ColumnDef<CropVariety>[] = [
    {
      accessorKey: "id",
      header: "Mã giống cây",
    },
    {
      accessorKey: "name",
      header: "Tên giống cây",
    },
    {
      accessorKey: "categoryName",
      header: "Danh mục cây trồng",
    },
    {
      accessorKey: "actions",
      header: "",
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
            <Menu.Item leftSection={<IconEye size={18} color="gray" />}>
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
      <Group justify="space-between" px={"sm"}>
        <Title flex={1} order={2}>
          Quản lý giống cây
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openVarietyForm}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={cropVarietyColumns} data={cropVarietyData} />
      <Modal
        opened={openedVarietyForm}
        onClose={closeVarietyForm}
        title={<Text fw={500}>Tạo mới giống cây</Text>}
      >
        <AddVarietyForm />
      </Modal>
    </Stack>
  );
};

export default PlantManagementVarietyPage;
