import {
  ActionIcon,
  Autocomplete,
  Badge,
  Button,
  Group,
  Menu,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Table from "../../../components/Table";
import type { MRT_ColumnDef } from "mantine-react-table";
import {
  IconBrandMetabrainz,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconSandbox,
  IconTrash,
  IconTree,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
type AreaZone = {
  id: string;
  code: string;
  name: string;
  regionName: string;
  orgUnit: string;
  area: number; // diện tích (m²)
  soilType: string;
  terrain: string[];
  mainCrop: string;
  gps: string;
  numberOfLots: number;
};
const areaZoneData: AreaZone[] = [
  {
    id: "K001",
    code: "KV-A1",
    name: "Khu vực A1",
    regionName: "Vùng Trồng A",
    orgUnit: "Hộ Ông Nguyễn Văn A",
    area: 10000,
    soilType: "Đất thịt",
    terrain: ["Cao", "Dốc"],
    mainCrop: "Sầu riêng",
    gps: "x1,y1 x2,y2 x3,y3 x4,y4",
    numberOfLots: 5,
  },
  {
    id: "K002",
    code: "KV-B2",
    name: "Khu vực B2",
    regionName: "Vùng Trồng B",
    orgUnit: "Doanh nghiệp VinaFarm",
    area: 8500,
    soilType: "Đất phù sa",
    terrain: ["Thấp", "Trũng"],
    mainCrop: "Xoài",
    gps: "x1,y1 x2,y2 x3,y3 x4,y4",
    numberOfLots: 3,
  },
  {
    id: "K003",
    code: "KV-C1",
    name: "Khu vực C1",
    regionName: "Vùng Trồng C",
    orgUnit: "Hộ Bà Trần Thị C",
    area: 6000,
    soilType: "Đất cát",
    terrain: ["Bằng phẳng"],
    mainCrop: "Chuối",
    gps: "x1,y1 x2,y2 x3,y3 x4,y4",
    numberOfLots: 4,
  },
];
const AreaManagementRegionPage = () => {
  const navigate = useNavigate();
  const onRegionDetail = () => {
    navigate(PATH.AREA_REGION_DETAIL);
  };
  const areaZoneColumns: MRT_ColumnDef<AreaZone>[] = [
    {
      accessorKey: "code",
      header: "Mã khu vực",
      Cell: ({ row }) => <Text fw={500}>{row.original.code}</Text>,
    },
    {
      accessorKey: "name",
      header: "Tên khu vực",
    },
    {
      accessorKey: "regionName",
      header: "Vùng trồng",
    },
    {
      accessorKey: "orgUnit",
      header: "Đơn vị quản lý",
    },
    {
      accessorKey: "area",
      header: "Diện tích (m²)",
      Cell: ({ row }) => <Text>{row.original.area.toLocaleString()} m²</Text>,
    },
    {
      accessorKey: "soilType",
      header: "Loại đất",
    },
    {
      accessorKey: "terrain",
      header: "Địa hình",
      Cell: ({ row }) => (
        <Group gap="xs">
          {row.original.terrain.map((item, i) => (
            <Badge key={i} size="xs" color="gray">
              {item}
            </Badge>
          ))}
        </Group>
      ),
    },
    {
      accessorKey: "mainCrop",
      header: "Cây trồng chính",
    },
    {
      accessorKey: "numberOfLots",
      header: "Số lô",
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
              onClick={onRegionDetail}
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
  const onAddRegion = () => {
    navigate(PATH.AREA_ADD_REGION);
  };
  return (
    <Stack gap="lg">
      <Group justify="space-between" px={"sm"}>
        <Title flex={1} order={2}>
          Quản lý vùng trồng
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddRegion}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Group>
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
          multiple
          data={["Đất thịt"]}
        />
        <Autocomplete
          radius={4}
          multiple
          leftSection={<IconBrandMetabrainz size={18} />}
          placeholder="Chọn địa hình"
          data={["Cao"]}
        />
      </Group>
      <Table columns={areaZoneColumns} data={areaZoneData} />
    </Stack>
  );
};
export default AreaManagementRegionPage;
