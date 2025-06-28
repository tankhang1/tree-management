import {
  ActionIcon,
  Autocomplete,
  Button,
  Group,
  Menu,
  Stack,
  Title,
} from "@mantine/core";
import Table from "../../../components/Table";
import type { MRT_ColumnDef } from "mantine-react-table";
import {
  IconBrandMetabrainz,
  IconChartAreaFilled,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconSandbox,
  IconSearch,
  IconTrash,
  IconTree,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
type TPlot = {
  id: string;
  areaId: string; // Chọn khu vực
  code: string;
  name: string;
  area: number;
  mainCrops: string[];
  irrigation: string;
  farming: string;
  gps: string;
  numberOfRows: number;
};
const areaBlockList: TPlot[] = [
  {
    id: "L001",
    areaId: "KV001",
    code: "LO-A1",
    name: "Lô A1",
    area: 1500,
    mainCrops: ["Sầu riêng"],
    irrigation: "Tưới nhỏ giọt",
    farming: "Hữu cơ",
    gps: "10.776,106.699 10.777,106.698 10.778,106.700",
    numberOfRows: 8,
  },
  {
    id: "L002",
    areaId: "KV002",
    code: "LO-B1",
    name: "Lô B1",
    area: 2000,
    mainCrops: ["Xoài", "Mãng cầu"],
    irrigation: "Tưới phun mưa",
    farming: "Truyền thống",
    gps: "10.779,106.695 10.780,106.696 10.781,106.694",
    numberOfRows: 12,
  },
];

const AreaManagementBlockPage = () => {
  const navigate = useNavigate();
  const onZoneDetail = () => {
    navigate(PATH.AREA_ZONE_DETAIL);
  };
  const areaBlockColumns: MRT_ColumnDef<TPlot>[] = [
    { accessorKey: "code", header: "Mã lô" },
    { accessorKey: "name", header: "Tên lô" },
    {
      accessorKey: "area",
      header: "Diện tích (m²)",
      Cell: ({ row }) => row.original.area.toLocaleString() + " m²",
    },
    {
      accessorKey: "mainCrops",
      header: "Cây trồng chính",
      Cell: ({ row }) => row.original.mainCrops.join(", "),
    },
    { accessorKey: "irrigation", header: "Phương pháp tưới tiêu" },
    { accessorKey: "farming", header: "Phương pháp canh tác" },
    { accessorKey: "gps", header: "Tọa độ GPS" },
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
              onClick={onZoneDetail}
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
  const onAddZone = () => {
    navigate(PATH.AREA_ADD_ZONE);
  };
  return (
    <Stack gap="lg">
      <Group justify="space-between" px={"sm"}>
        <Title flex={1} order={2}>
          Quản lý lô
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddZone}>
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
          leftSection={<IconTree size={18} />}
          placeholder="Chọn cây trồng chính"
          data={["Sầu riêng"]}
        />
        <Autocomplete
          radius={4}
          leftSection={<IconSandbox size={18} />}
          placeholder="Chọn loại đất"
          data={["Đất thịt"]}
        />
        <Autocomplete
          radius={4}
          leftSection={<IconBrandMetabrainz size={18} />}
          placeholder="Chọn địa hình"
          data={["Cao"]}
        />
      </Group>
      <Table columns={areaBlockColumns} data={areaBlockList} />
    </Stack>
  );
};
export default AreaManagementBlockPage;
