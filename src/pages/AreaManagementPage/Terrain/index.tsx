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
import AddTerrainForm from "./components/AddTerrainForm";
type TerrainType = {
  id: string;
  name: string;
  description?: string;
};
const terrainDataset: TerrainType[] = [
  { id: "HIGH", name: "Cao" },
  { id: "LOW", name: "Thấp" },
  { id: "SLOPE", name: "Dốc" },
  { id: "FLAT", name: "Bằng phẳng" },
  { id: "DEPRESSED", name: "Trũng" },
];
const AreaManagementTerrainPage = () => {
  const [openedAddRowForm, { open: openAddRowForm, close: closeAddRowForm }] =
    useDisclosure(false);
  const rowColumns: MRT_ColumnDef<TerrainType>[] = [
    {
      accessorKey: "id",
      header: "Mã loại địa hình",
    },
    {
      accessorKey: "name",
      header: "Tên địa hình",
    },
    {
      accessorKey: "description",
      header: "Mô tả",
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
          Quản lý hàng
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openAddRowForm}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={rowColumns} data={terrainDataset} />
      <Modal
        opened={openedAddRowForm}
        onClose={closeAddRowForm}
        title={<Text fw={"bold"}>Thêm mới địa hình</Text>}
      >
        <AddTerrainForm />
      </Modal>
    </Stack>
  );
};
export default AreaManagementTerrainPage;
