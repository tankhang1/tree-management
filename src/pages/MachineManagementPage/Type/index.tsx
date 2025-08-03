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
import AddMachineCategoryForm from "./components/AddMachineCategoryForm";

type MachineType = {
  id: string; // Mã loại máy móc
  name: string; // Tên loại máy móc
};

export const machineTypes: MachineType[] = [
  {
    id: "MCH01",
    name: "Máy cày",
  },
  {
    id: "MCH02",
    name: "Máy phun thuốc",
  },
  {
    id: "MCH03",
    name: "Máy gặt",
  },
  {
    id: "MCH04",
    name: "Máy bay nông nghiệp",
  },
];

const MachineManagementCategoryPage = () => {
  const [
    openedMachineForm,
    { open: openMachineForm, close: closeMachineForm },
  ] = useDisclosure(false);

  const machineTypeColumns: MRT_ColumnDef<MachineType>[] = [
    {
      accessorKey: "id",
      header: "Mã loại máy móc",
    },
    {
      accessorKey: "name",
      header: "Tên loại máy móc",
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
          Quản lý danh mục máy móc
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openMachineForm}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={machineTypeColumns} data={machineTypes} />
      <Modal
        opened={openedMachineForm}
        onClose={closeMachineForm}
        title={<Text fw={"bold"}>Thêm mới danh mục máy móc</Text>}
      >
        <AddMachineCategoryForm />
      </Modal>
    </Stack>
  );
};

export default MachineManagementCategoryPage;
