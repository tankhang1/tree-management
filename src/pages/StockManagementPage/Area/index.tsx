import { ActionIcon, Button, Group, Menu, Stack, Title } from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
interface SubArea {
  id: string;
  latitude: number;
  longitude: number;
  area: number;
  note?: string;
}

interface Area {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  area: number;
  note?: string;
  subAreas?: SubArea[];
}
const areaList: Area[] = [
  {
    id: "KV001",
    name: "Khu vực A",
    latitude: 10.762622,
    longitude: 106.660172,
    area: 1200,
    note: "Khu vực gần hồ nước",
    subAreas: [
      {
        id: "KV001-1",
        latitude: 10.7627,
        longitude: 106.6601,
        area: 400,
        note: "Phân khu phía đông",
      },
      {
        id: "KV001-2",
        latitude: 10.7629,
        longitude: 106.6602,
        area: 800,
        note: "Phân khu phía tây",
      },
    ],
  },
  {
    id: "KV002",
    name: "Khu vực B",
    latitude: 10.776889,
    longitude: 106.700806,
    area: 900,
    note: "Không phân chia",
    subAreas: [],
  },
];

const StockManagementAreaPage = () => {
  const navigate = useNavigate();

  const onAddArea = () => {
    navigate(PATH.STOCK_ADD_AREA);
  };
  const onAreaDetail = () => {
    navigate(PATH.STOCK_AREA_DETAIL);
  };
  const areaColumns: MRT_ColumnDef<Area>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Tên khu vực" },
    { accessorKey: "latitude", header: "Vĩ độ" },
    { accessorKey: "longitude", header: "Kinh độ" },
    { accessorKey: "area", header: "Diện tích (m²)" },
    { accessorKey: "note", header: "Ghi chú" },
    {
      accessorKey: "subAreas",
      header: "Số khu phụ",
      Cell: ({ cell }) => {
        const subAreas = cell.getValue<SubArea[]>();
        return subAreas?.length ?? "0";
      },
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
              onClick={onAreaDetail}
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
          Khu vực quản lí
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddArea}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table
        //@ts-expect-error no check
        columns={areaColumns}
        //@ts-expect-error no check
        data={areaList}
      />
    </Stack>
  );
};

export default StockManagementAreaPage;
