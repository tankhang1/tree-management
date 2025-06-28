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
import AddSoilTypeForm from "./components/AddSoilTypeForm";
type SoilType = {
  id: string;
  name: string;
  description?: string;
};
const soilTypeDataset: SoilType[] = [
  { id: "CLAY", name: "Đất thịt" },
  { id: "SAND", name: "Đất cát" },
  { id: "ALLUVIAL", name: "Đất phù sa" },
  { id: "PEAT", name: "Đất than bùn" },
  { id: "LATERITE", name: "Đất đỏ bazan" },
  { id: "SALINE", name: "Đất nhiễm mặn" },
];
const AreaManagementSoilTypePage = () => {
  const [openedAddRowForm, { open: openAddRowForm, close: closeAddRowForm }] =
    useDisclosure(false);
  const rowColumns: MRT_ColumnDef<SoilType>[] = [
    {
      accessorKey: "id",
      header: "Mã loại đất",
    },
    {
      accessorKey: "name",
      header: "Tên loại đất",
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

      <Table columns={rowColumns} data={soilTypeDataset} />
      <Modal
        opened={openedAddRowForm}
        onClose={closeAddRowForm}
        title={<Text fw={"bold"}>Thêm mới loại đất</Text>}
      >
        <AddSoilTypeForm />
      </Modal>
    </Stack>
  );
};
export default AreaManagementSoilTypePage;
