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
import { useDisclosure } from "@mantine/hooks";
import AddMaterialCategoryForm from "./components/AddMaterialCategoryForm";
import Table from "../../../../components/Table";

type MaterialType = {
  id: string; // Mã loại vật tư (mã hệ thống)
  name: string; // Tên loại vật tư
};

export const materialTypes: MaterialType[] = [
  {
    id: "MAT01",
    name: "Phân bón",
  },
  {
    id: "MAT02",
    name: "Thuốc bảo vệ thực vật",
  },
  {
    id: "MAT03",
    name: "Hạt giống",
  },
  {
    id: "MAT04",
    name: "Vật tư khác",
  },
];

const ProductManagementRawMaterialTypePage = () => {
  const [
    openedMaterialForm,
    { open: openMaterialForm, close: closeMaterialForm },
  ] = useDisclosure(false);

  const materialTypeColumns: MRT_ColumnDef<MaterialType>[] = [
    {
      accessorKey: "id",
      header: "Mã",
    },
    {
      accessorKey: "name",
      header: "Tên danh mục nguyên vật liệu",
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
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý danh mục nguyên vật liệu
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openMaterialForm}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={materialTypeColumns} data={materialTypes} />
      <Modal
        opened={openedMaterialForm}
        onClose={closeMaterialForm}
        title={<Text fw={"bold"}>Thêm mới danh mục nguyên vật liệu</Text>}
      >
        <AddMaterialCategoryForm />
      </Modal>
    </Stack>
  );
};

export default ProductManagementRawMaterialTypePage;
