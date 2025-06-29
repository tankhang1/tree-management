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
import AddCatalogForm from "./components/AddCatalogForm";
type CatalogType = {
  id: string; // Mã loại cây
  name: string; // Tên loại cây
};
const cropTypeData: CatalogType[] = [
  { id: "LC001", name: "Sầu riêng" },
  { id: "LC002", name: "Cafe" },
];
const PlantManagementCatalogPage = () => {
  const [
    openedAddCatalogForm,
    { open: openAddCatalogForm, close: closeAddCatalogForm },
  ] = useDisclosure(false);
  const cropTypeColumns: MRT_ColumnDef<CatalogType>[] = [
    {
      accessorKey: "id",
      header: "Mã",
      Cell: ({ cell }) => <Text fw={500}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "name",
      header: "Danh mục cây",
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
          Quản lý danh mục cây trồng
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openAddCatalogForm}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={cropTypeColumns} data={cropTypeData} />
      <Modal
        opened={openedAddCatalogForm}
        onClose={closeAddCatalogForm}
        title={<Text fw={500}>Tạo mới danh mục cây</Text>}
      >
        <AddCatalogForm />
      </Modal>
    </Stack>
  );
};

export default PlantManagementCatalogPage;
