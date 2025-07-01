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
import AddPesticideCategoryForm from "./components/AddPesticideCategoryForm";
type PesticideType = {
  id: string; // Mã loại thuốc (mã hệ thống)
  name: string; // Tên loại thuốc
};
export const pesticideTypes: PesticideType[] = [
  {
    id: "TYPE01",
    name: "Thuốc trừ sâu",
  },
  {
    id: "TYPE02",
    name: "Thuốc trừ bệnh",
  },
  {
    id: "TYPE03",
    name: "Phân bón lá",
  },
  {
    id: "TYPE04",
    name: "Thuốc trừ cỏ",
  },
  {
    id: "TYPE05",
    name: "Chế phẩm sinh học",
  },
];

const PesticideManagementCategoryPage = () => {
  const [
    openedPesticideForm,
    { open: openPesticideForm, close: closePesticideForm },
  ] = useDisclosure(false);
  const pesticideTypeColumns: MRT_ColumnDef<PesticideType>[] = [
    {
      accessorKey: "id",
      header: "Mã loại thuốc",
    },
    {
      accessorKey: "name",
      header: "Tên loại thuốc",
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
          Quản lý danh mục thuốc
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openPesticideForm}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={pesticideTypeColumns} data={pesticideTypes} />
      <Modal
        opened={openedPesticideForm}
        onClose={closePesticideForm}
        title={<Text fw={"bold"}>Thêm mới danh mục thuốc</Text>}
      >
        <AddPesticideCategoryForm />
      </Modal>
    </Stack>
  );
};
export default PesticideManagementCategoryPage;
