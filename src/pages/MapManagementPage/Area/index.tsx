import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Menu,
  Select,
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
  area: number; // diện tích (m²)
  soilType: string;
  terrain: string[];
  gps: string;
  numberOfLots: number;
};
const areaZoneData: AreaZone[] = [
  {
    id: "K001",
    code: "KV-A1",
    name: "Khu vực A1",
    regionName: "Vùng Trồng A",
    area: 10000,
    soilType: "Đất thịt",
    terrain: ["Cao", "Dốc"],
    gps: "10.762622,106.660172 10.762700,106.660200 10.762800,106.660300 10.762900,106.660400",
    numberOfLots: 5,
  },
  {
    id: "K002",
    code: "KV-B2",
    name: "Khu vực B2",
    regionName: "Vùng Trồng B",
    area: 8500,
    soilType: "Đất phù sa",
    terrain: ["Thấp", "Trũng"],
    gps: "10.763000,106.661000 10.763100,106.661100 10.763200,106.661200 10.763300,106.661300",
    numberOfLots: 3,
  },
  {
    id: "K003",
    code: "KV-C1",
    name: "Khu vực C1",
    regionName: "Vùng Trồng C",
    area: 6000,
    soilType: "Đất cát",
    terrain: ["Bằng phẳng"],
    gps: "10.764000,106.662000 10.764100,106.662100 10.764200,106.662200 10.764300,106.662300",
    numberOfLots: 4,
  },
  {
    id: "K004",
    code: "KV-D3",
    name: "Khu vực D3",
    regionName: "Vùng Trồng D",
    area: 12000,
    soilType: "Đất đỏ bazan",
    terrain: ["Cao", "Bằng phẳng"],
    gps: "10.765000,106.663000 10.765100,106.663100 10.765200,106.663200 10.765300,106.663300",
    numberOfLots: 6,
  },
  {
    id: "K005",
    code: "KV-E4",
    name: "Khu vực E4",
    regionName: "Vùng Trồng E",
    area: 9500,
    soilType: "Đất sét",
    terrain: ["Dốc", "Thấp"],
    gps: "10.766000,106.664000 10.766100,106.664100 10.766200,106.664200 10.766300,106.664300",
    numberOfLots: 4,
  },
  {
    id: "K006",
    code: "KV-F5",
    name: "Khu vực F5",
    regionName: "Vùng Trồng F",
    area: 7000,
    soilType: "Đất phù sa",
    terrain: ["Trũng"],
    gps: "10.767000,106.665000 10.767100,106.665100 10.767200,106.665200 10.767300,106.665300",
    numberOfLots: 3,
  },
  {
    id: "K007",
    code: "KV-G6",
    name: "Khu vực G6",
    regionName: "Vùng Trồng G",
    area: 11000,
    soilType: "Đất thịt",
    terrain: ["Cao", "Dốc"],
    gps: "10.768000,106.666000 10.768100,106.666100 10.768200,106.666200 10.768300,106.666300",
    numberOfLots: 5,
  },
  {
    id: "K008",
    code: "KV-H7",
    name: "Khu vực H7",
    regionName: "Vùng Trồng H",
    area: 8000,
    soilType: "Đất đỏ bazan",
    terrain: ["Bằng phẳng"],
    gps: "10.769000,106.667000 10.769100,106.667100 10.769200,106.667200 10.769300,106.667300",
    numberOfLots: 4,
  },
];
const MapManagementAreaPage = () => {
  const navigate = useNavigate();
  const onAreaDetail = () => {
    navigate(PATH.MAP_AREA_DETAIL);
  };
  const areaZoneColumns: MRT_ColumnDef<AreaZone>[] = [
    {
      accessorKey: "code",
      header: "Mã khu vực",
      Cell: ({ row }) => <Text fw={500}>{row.original.code}</Text>,
    },
    {
      accessorKey: "name",
      header: "Khu vực",
    },
    {
      accessorKey: "regionName",
      header: "Vùng",
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
      accessorKey: "numberOfLots",
      header: "Số lô",
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
  const onAddArea = () => {
    navigate(PATH.MAP_ADD_AREA);
  };
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Phân bổ khu vực
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
      <Group>
        <Select
          searchable
          radius={4}
          leftSection={<IconTree size={18} />}
          placeholder="Chọn cây trồng chính"
          data={[
            "Sầu riêng",
            "Xoài",
            "Chuối",
            "Cà phê",
            "Mít",
            "Bưởi",
            "Dừa",
            "Cam",
          ]}
        />
        <Select
          searchable
          radius={4}
          leftSection={<IconSandbox size={18} />}
          placeholder="Chọn loại đất"
          multiple
          data={[
            "Đất thịt",
            "Đất phù sa",
            "Đất cát",
            "Đất sét",
            "Đất đỏ bazan",
            "Đất mùn",
            "Đất kiềm",
            "Đất chua",
          ]}
        />
        <Select
          searchable
          radius={4}
          multiple
          leftSection={<IconBrandMetabrainz size={18} />}
          placeholder="Chọn địa hình"
          data={[
            "Cao",
            "Thấp",
            "Dốc",
            "Bằng phẳng",
            "Trũng",
            "Đồi núi",
            "Đồng bằng",
            "Ven sông",
          ]}
        />
      </Group>
      <Table columns={areaZoneColumns} data={areaZoneData} />
    </Stack>
  );
};
export default MapManagementAreaPage;
