import {
  ActionIcon,
  Autocomplete,
  Button,
  Group,
  Image,
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
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import TreeDetailView from "./components/TreeView";
type Tree = {
  rowId: string;
  zoneId: string;
  blockId: string;
  plotId: string;
  img: string;
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
    img: "https://sinhhocchaua.com/wp-content/uploads/2024/02/gioi-thieu-cay-sau-rieng-1.jpg",
    plantedAt: new Date("2022-03-15"),
    gps: "10.762622,106.660172",
  },
  {
    rowId: "HR-002",
    zoneId: "KV-A1",
    blockId: "LO-01",
    img: "https://sinhhocchaua.com/wp-content/uploads/2024/02/gioi-thieu-cay-sau-rieng-1.jpg",

    plotId: "RG-A",
    treeId: "TREE-002",
    plantedAt: new Date("2022-03-20"),
    gps: "10.762500,106.660100",
  },
];
type TTree = {
  type: string;
  variety: string;
  img: string;
  seed: string;
  method: string;
  irrigation: string;
  plantedAt: string;
  region: string;
  area: string;
  plot: string;
  row: string;
  coords: [number, number][];
};
const tree: TTree = {
  type: "Cây sầu riêng",
  variety: "Sầu riêng Ri6",
  seed: "Hạt giống Ri6 F1",
  method: "Trồng theo hố, cách 6m",
  img: "https://sinhhocchaua.com/wp-content/uploads/2024/02/gioi-thieu-cay-sau-rieng-1.jpg",
  irrigation: "Tưới nhỏ giọt",
  plantedAt: "2024-07-05",
  region: "Vùng A",
  area: "Khu vực A1",
  plot: "Lô A1",
  row: "Hàng 1",
  coords: [
    [10.123, 106.123],
    [10.124, 106.124],
  ],
};
const AreaManagementTreePage = () => {
  const navigate = useNavigate();
  const [openedRowForm, { open: openRowForm, close: closeRowForm }] =
    useDisclosure(false);
  const onAddTree = () => {
    navigate(PATH.AREA_ADD_TREE);
  };
  const treeColumns: MRT_ColumnDef<Tree>[] = [
    {
      accessorKey: "img",
      header: "Hình ảnh",
      Cell: ({ row }) => (
        <Image src={row.original.img} w={100} h={100} radius={4} />
      ),
    },
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
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={openRowForm}
            >
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
          <Button radius={4} onClick={onAddTree}>
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
        opened={openedRowForm}
        onClose={closeRowForm}
        title={<Text fw={"bold"}>Thông tin cây</Text>}
      >
        <TreeDetailView tree={tree} />
      </Modal>
    </Stack>
  );
};
export default AreaManagementTreePage;
