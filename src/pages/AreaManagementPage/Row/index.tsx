import {
  ActionIcon,
  Autocomplete,
  Button,
  Group,
  Menu,
  Stack,
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
  IconTree,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";

type Row = {
  name: string;
  code: string;
  regionId: string;
  areaId: string;
  plotId: string;
  crop: string;
  treeCount: number;
  gps: string;
};
const rowData: Row[] = [
  {
    name: "Hàng 1",
    code: "H-001",
    regionId: "V01",
    areaId: "V01-A01",
    plotId: "V01-A01-P01",
    crop: "Sầu riêng",
    treeCount: 20,
    gps: "10.77,106.69 10.78,106.70",
  },
  {
    name: "Hàng 2",
    code: "H-002",
    regionId: "V01",
    areaId: "V01-A01",
    plotId: "V01-A01-P01",
    crop: "Xoài",
    treeCount: 15,
    gps: "10.79,106.71 10.80,106.72",
  },
];
const AreaManagementRowPage = () => {
  const navigate = useNavigate();
  const onRowDetail = () => {
    navigate(PATH.AREA_ROW_DETAIL);
  };
  const onAddRow = () => {
    navigate(PATH.AREA_ADD_ROW);
  };
  const rowColumns: MRT_ColumnDef<Row>[] = [
    {
      accessorKey: "code",
      header: "Mã hàng",
    },
    {
      accessorKey: "name",
      header: "Tên hàng",
    },
    {
      accessorKey: "regionId",
      header: "Tên vùng",
    },
    {
      accessorKey: "areaId",
      header: "Tên khu vực",
    },
    {
      accessorKey: "plotId",
      header: "Tên lô",
    },
    {
      accessorKey: "crop",
      header: "Cây trồng",
    },
    {
      accessorKey: "treeCount",
      header: "Số cây",
      Cell: ({ row }) => `${row.original.treeCount} cây`,
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
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={onRowDetail}
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
          Quản lý hàng
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddRow}>
            Tạo mới
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
          leftSection={<IconTree size={18} />}
          placeholder="Cây trồng"
          data={["Sầu riêng"]}
        />
      </Group>
      <Table columns={rowColumns} data={rowData} />
    </Stack>
  );
};
export default AreaManagementRowPage;
