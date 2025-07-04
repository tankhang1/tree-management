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
import AddGroupForm from "./components/AddGroupForm";
type CropType = {
  id: string; // Mã loại cây
  name: string; // Tên loại cây
};
const cropTypeData: CropType[] = [
  { id: "LC001", name: "Cây ăn trái" },
  { id: "LC002", name: "Cây công nghiệp" },
  { id: "LC003", name: "Cây rau màu" },
  { id: "LC004", name: "Cây dược liệu" },
];
const PlantManagementGroupPage = () => {
  const [
    openedAddGroupForm,
    { open: openAddGroupForm, close: closeAddGroupForm },
  ] = useDisclosure(false);
  const cropTypeColumns: MRT_ColumnDef<CropType>[] = [
    {
      accessorKey: "id",
      header: "Mã loại cây",
      Cell: ({ cell }) => <Text fw={500}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "name",
      header: "Tên loại cây",
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
          Quản lý nhóm cây trồng
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openAddGroupForm}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={cropTypeColumns} data={cropTypeData} />
      <Modal
        opened={openedAddGroupForm}
        onClose={closeAddGroupForm}
        title={<Text fw={500}>Tạo mới loại cây</Text>}
      >
        <AddGroupForm />
      </Modal>
    </Stack>
  );
};

export default PlantManagementGroupPage;
