import {
  ActionIcon,
  Autocomplete,
  Button,
  Group,
  Menu,
  Modal,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconChartAreaFilled,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconLivePhoto,
  IconSearch,
  IconTableRow,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import AddTreeForm from "./components/AddTreeForm";
type Tree = {
  rowId: string;
  zoneId: string;
  blockId: string;
  plotId: string;
  treeId: string;
  plantedAt: Date;
  gps: string;
};
const treeData: Tree[] = [
  {
    rowId: "HR-001",
    zoneId: "KV-A1",
    blockId: "LO-01",
    plotId: "RG-A",
    treeId: "TREE-001",
    plantedAt: new Date("2022-03-15"),
    gps: "10.762622,106.660172",
  },
  {
    rowId: "HR-002",
    zoneId: "KV-A1",
    blockId: "LO-01",
    plotId: "RG-A",
    treeId: "TREE-002",
    plantedAt: new Date("2022-03-20"),
    gps: "10.762500,106.660100",
  },
];
const AreaManagementTreePage = () => {
  const [openedAddRowForm, { open: openAddRowForm, close: closeAddRowForm }] =
    useDisclosure(false);
  const treeColumns: MRT_ColumnDef<Tree>[] = [
    {
      accessorKey: "treeId",
      header: "Mã cây",
    },
    {
      accessorKey: "rowId",
      header: "Mã hàng",
    },
    {
      accessorKey: "zoneId",
      header: "Khu vực",
    },
    {
      accessorKey: "blockId",
      header: "Mã lô",
    },
    {
      accessorKey: "plotId",
      header: "Vùng trồng",
    },
    {
      accessorKey: "plantedAt",
      header: "Ngày trồng",
      Cell: ({ row }) =>
        new Date(row.original.plantedAt).toLocaleDateString("vi-VN"),
    },
    {
      accessorKey: "gps",
      header: "Toạ độ GPS",
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
          Quản lý cây
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
      <Group>
        <Autocomplete
          radius={4}
          leftSection={<IconSearch size={18} />}
          placeholder="Tìm kiếm vùng"
          data={["Vùng trồng sầu riêng Đồng Nai"]}
        />
        <Autocomplete
          radius={4}
          leftSection={<IconChartAreaFilled size={18} />}
          placeholder="Tìm kiếm khu vực"
          data={["Vùng trồng sầu riêng Đồng Nai"]}
        />
        <Autocomplete
          radius={4}
          leftSection={<IconLivePhoto size={18} />}
          placeholder="Tìm kiếm lô"
          data={["Vùng trồng sầu riêng Đồng Nai"]}
        />
        <Autocomplete
          radius={4}
          leftSection={<IconTableRow size={18} />}
          placeholder="Tìm kiếm hàng"
          data={["Vùng trồng sầu riêng Đồng Nai"]}
        />
      </Group>
      <Table columns={treeColumns} data={treeData} />
      <Modal
        opened={openedAddRowForm}
        onClose={closeAddRowForm}
        title={<Text fw={"bold"}>Thêm mới cây</Text>}
      >
        <AddTreeForm />
      </Modal>
    </Stack>
  );
};
export default AreaManagementTreePage;
