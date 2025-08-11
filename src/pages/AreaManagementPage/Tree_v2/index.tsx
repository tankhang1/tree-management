import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Modal,
  Select,
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
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import TreeDetailView from "./components/TreeView";
type Allocation = {
  allocationId: string; // Mã đợt phân bổ
  recordedAt: Date; // Ngày ghi nhận
  crop: string; // Tên cây trồng
  region: string; // Vùng
  area: string; // Khu vực
  plot: string; // Lô
  cultivationZone: string; // Khu vực canh tác
};
const allocationData: Allocation[] = [
  {
    allocationId: "1",
    recordedAt: new Date("2025-08-01"),
    crop: "Sầu riêng Ri6",
    region: "Vùng A",
    area: "Khu vực A1",
    plot: "Lô A1",
    cultivationZone: "Khu vực canh tác Đồng Nai",
  },
  {
    allocationId: "2",
    recordedAt: new Date("2025-08-02"),
    crop: "Sầu riêng Monthong",
    region: "Vùng A",
    area: "Khu vực A2",
    plot: "Lô A2",
    cultivationZone: "Khu vực canh tác Đồng Nai",
  },
  {
    allocationId: "3",
    recordedAt: new Date("2025-08-03"),
    crop: "Mít Thái",
    region: "Vùng B",
    area: "Khu vực B1",
    plot: "Lô B1",
    cultivationZone: "Khu vực canh tác Tây Nguyên",
  },
  {
    allocationId: "4",
    recordedAt: new Date("2025-08-04"),
    crop: "Xoài Cát Hòa Lộc",
    region: "Vùng B",
    area: "Khu vực B2",
    plot: "Lô B2",
    cultivationZone: "Khu vực canh tác Tây Nguyên",
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
const regionOptions = [
  "Vùng trồng A - Đồng Nai",
  "Vùng trồng B - Tây Nguyên",
  "Vùng trồng C - Miền Tây",
  "Vùng trồng D - Miền Trung",
];

const areaOptions = [
  "Khu vực A1 - Đồng Nai",
  "Khu vực B2 - Tây Nguyên",
  "Khu vực C3 - Miền Tây",
  "Khu vực D4 - Miền Trung",
];

const plotOptions = [
  "Lô A1 - Khu vực A1",
  "Lô B1 - Khu vực B2",
  "Lô C1 - Khu vực C3",
  "Lô D1 - Khu vực D4",
];

const AreaManagementTreev2Page = () => {
  const navigate = useNavigate();
  const [openedRowForm, { open: openRowForm, close: closeRowForm }] =
    useDisclosure(false);
  const onAddTree = () => {
    navigate(PATH.AREA_ADD_TREE_v2);
  };
  const allocationColumns: MRT_ColumnDef<Allocation>[] = [
    {
      accessorKey: "cultivationZone",
      header: "Khu vực canh tác",
    },
    {
      accessorKey: "allocationId",
      header: "Đợt phân bổ",
    },
    {
      accessorKey: "recordedAt",
      header: "Ngày ghi nhận",
      Cell: ({ row }) =>
        new Date(row.original.recordedAt).toLocaleDateString("vi-VN"),
    },
    {
      accessorKey: "crop",
      header: "Cây trồng",
    },
    {
      accessorKey: "region",
      header: "Vùng",
    },
    {
      accessorKey: "area",
      header: "Khu vực",
    },
    {
      accessorKey: "plot",
      header: "Lô",
    },
    {
      accessorKey: "actions",
      header: "Tùy chọn",
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
              Xóa
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
          Danh mục phân bổ (v2)
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
        <Select
          searchable
          radius={4}
          leftSection={<IconSearch size={18} />}
          placeholder="Tìm kiếm vùng"
          data={regionOptions}
        />
        <Select
          searchable
          radius={4}
          leftSection={<IconChartAreaFilled size={18} />}
          placeholder="Tìm kiếm khu vực"
          data={areaOptions}
        />
        <Select
          searchable
          radius={4}
          leftSection={<IconLivePhoto size={18} />}
          placeholder="Tìm kiếm lô"
          data={plotOptions}
        />
      </Group>
      <Table columns={allocationColumns} data={allocationData} />
      <Modal
        opened={openedRowForm}
        onClose={closeRowForm}
        title={<Text fw={"bold"}>Chi tiết phân bổ</Text>}
      >
        <TreeDetailView tree={tree} />
      </Modal>
    </Stack>
  );
};
export default AreaManagementTreev2Page;
