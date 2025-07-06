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
  eppo_code: string;
  icc_code: string;
  vn_name: string;
  group_tree: string;
  note: string;
};
const catalogData: CatalogType[] = [
  {
    id: "CT01",
    name: "Durio zibethinus",
    vn_name: "Sầu riêng",
    eppo_code: "DURZI",
    icc_code: "DZ001",
    group_tree: "Cây ăn quả nhiệt đới",
    note: "Loài cây nhiệt đới cho quả lớn, giàu dinh dưỡng.",
  },
  {
    id: "CT02",
    name: "Mangifera indica",
    vn_name: "Xoài",
    eppo_code: "MANIN",
    icc_code: "MI002",
    group_tree: "Cây ăn quả nhiệt đới",
    note: "Trồng phổ biến tại Việt Nam, nhiều giống như Cát Chu, Keo, Tượng.",
  },
  {
    id: "CT03",
    name: "Musa acuminata",
    vn_name: "Chuối",
    eppo_code: "MUSA",
    icc_code: "MA003",
    group_tree: "Cây ăn quả nhiệt đới",
    note: "Chuối già Nam Mỹ và chuối cau là giống phổ biến.",
  },
  {
    id: "CT04",
    name: "Coffea canephora",
    vn_name: "Cà phê Robusta",
    eppo_code: "COFCA",
    icc_code: "CF004",
    group_tree: "Cây công nghiệp lâu năm",
    note: "Trồng nhiều ở Tây Nguyên, năng suất cao.",
  },
  {
    id: "CT05",
    name: "Camellia sinensis",
    vn_name: "Chè",
    eppo_code: "CAMES",
    icc_code: "CS005",
    group_tree: "Cây công nghiệp lâu năm",
    note: "Nguyên liệu chính để sản xuất trà.",
  },
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
      accessorKey: "vn_name",
      header: "Danh mục cây ( tiếng việt )",
    },
    {
      accessorKey: "eppo_code",
      header: "Mã EPPO",
    },
    {
      accessorKey: "icc_code",
      header: "Mã ICC",
    },

    {
      accessorKey: "group_tree",
      header: "Nhóm cây",
    },
    {
      accessorKey: "note",
      header: "Ghi chú",
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

      <Table columns={cropTypeColumns} data={catalogData} />
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
