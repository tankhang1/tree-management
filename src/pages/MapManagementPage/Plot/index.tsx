import { ActionIcon, Button, Group, Menu, Stack, Title } from "@mantine/core";
import Table from "../../../components/Table";
import type { MRT_ColumnDef } from "mantine-react-table";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconTrash,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
type TPlot = {
  id: string;
  areaId: string; // Chọn khu vực
  code: string;
  name: string;
  area: number;

  gps: string;
  contour: string;
  numberOfRows: number;
};
const areaBlockList: TPlot[] = [
  {
    id: "L001",
    areaId: "KV001",
    code: "LO-A1",
    name: "Lô A1",
    area: 1500,
    contour: "Địa hình dốc nhẹ, từ 48m đến 56m",
    gps: "10.776,106.699 10.777,106.698 10.778,106.700",
    numberOfRows: 8,
  },
  {
    id: "L002",
    areaId: "KV002",
    code: "LO-B1",
    name: "Lô B1",
    area: 2000,
    contour: "Địa hình dốc nhẹ, từ 48m đến 56m",
    gps: "10.779,106.695 10.780,106.696 10.781,106.694",
    numberOfRows: 12,
  },
];

const MapManagementPlotPage = () => {
  const navigate = useNavigate();
  const onBlockDetail = () => {
    navigate(PATH.MAP_PLOT_DETAIL);
  };
  const areaBlockColumns: MRT_ColumnDef<TPlot>[] = [
    { accessorKey: "code", header: "Mã lô" },
    { accessorKey: "name", header: "Tên lô" },
    {
      accessorKey: "area",
      header: "Diện tích (m²)",
      Cell: ({ row }) => row.original.area.toLocaleString() + " m²",
    },

    { accessorKey: "contour", header: "Đường bình độ" },
    {
      accessorKey: "numberOfRows",
      header: "Số hàng",
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
              onClick={onBlockDetail}
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
  const onAddBlock = () => {
    navigate(PATH.MAP_ADD_PLOT);
  };
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Phân bổ lô
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddBlock}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={areaBlockColumns} data={areaBlockList} />
    </Stack>
  );
};
export default MapManagementPlotPage;
