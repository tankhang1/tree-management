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
  employee: string;
  area: number; // diện tích (m²)
  soilType: string;
  terrain: string[];
  mainCrop: string;
  gps: string;
  numberOfLots: number;
};
const areaZoneData: AreaZone[] = [
  {
    id: "V001",
    code: "V-A1",
    name: "Khu vực A1",
    regionName: "Vùng Trồng A",
    employee: "Nguyễn Văn A",
    area: 10000,
    soilType: "Đất thịt",
    terrain: ["Cao", "Dốc"],
    mainCrop: "Sầu riêng",
    gps: "12.3456,78.9101 12.3457,78.9102 12.3458,78.9103 12.3459,78.9104",
    numberOfLots: 5,
  },
  {
    id: "V002",
    code: "V-B2",
    name: "Khu vực B2",
    regionName: "Vùng Trồng B",
    employee: "Trần Thị B",
    area: 8500,
    soilType: "Đất phù sa",
    terrain: ["Thấp", "Trũng"],
    mainCrop: "Xoài",
    gps: "13.1234,79.5678 13.1235,79.5679 13.1236,79.5680 13.1237,79.5681",
    numberOfLots: 3,
  },
  {
    id: "V003",
    code: "V-C1",
    name: "Khu vực C1",
    regionName: "Vùng Trồng C",
    employee: "Lê Văn C",
    area: 6000,
    soilType: "Đất cát",
    terrain: ["Bằng phẳng"],
    mainCrop: "Chuối",
    gps: "14.5678,80.1234 14.5679,80.1235 14.5680,80.1236 14.5681,80.1237",
    numberOfLots: 4,
  },
  {
    id: "V004",
    code: "V-D3",
    name: "Khu vực D3",
    regionName: "Vùng Trồng D",
    employee: "Phạm Thị D",
    area: 12000,
    soilType: "Đất đỏ bazan",
    terrain: ["Cao", "Bằng phẳng"],
    mainCrop: "Cà phê",
    gps: "15.6789,81.2345 15.6790,81.2346 15.6791,81.2347 15.6792,81.2348",
    numberOfLots: 6,
  },
  {
    id: "V005",
    code: "V-E4",
    name: "Khu vực E4",
    regionName: "Vùng Trồng E",
    employee: "Nguyễn Văn E",
    area: 9500,
    soilType: "Đất sét",
    terrain: ["Dốc", "Thấp"],
    mainCrop: "Mít",
    gps: "16.7890,82.3456 16.7891,82.3457 16.7892,82.3458 16.7893,82.3459",
    numberOfLots: 4,
  },
  {
    id: "V006",
    code: "V-F5",
    name: "Khu vực F5",
    regionName: "Vùng Trồng F",
    employee: "Hoàng Thị F",
    area: 7000,
    soilType: "Đất phù sa",
    terrain: ["Trũng"],
    mainCrop: "Bưởi",
    gps: "17.8901,83.4567 17.8902,83.4568 17.8903,83.4569 17.8904,83.4570",
    numberOfLots: 3,
  },
  {
    id: "V007",
    code: "V-G6",
    name: "Khu vực G6",
    regionName: "Vùng Trồng G",
    employee: "Vũ Văn G",
    area: 11000,
    soilType: "Đất thịt",
    terrain: ["Cao", "Dốc"],
    mainCrop: "Cam",
    gps: "18.9012,84.5678 18.9013,84.5679 18.9014,84.5680 18.9015,84.5681",
    numberOfLots: 5,
  },
  {
    id: "V008",
    code: "V-H7",
    name: "Khu vực H7",
    regionName: "Vùng Trồng H",
    employee: "Trần Văn H",
    area: 8000,
    soilType: "Đất đỏ bazan",
    terrain: ["Bằng phẳng"],
    mainCrop: "Dừa",
    gps: "19.0123,85.6789 19.0124,85.6790 19.0125,85.6791 19.0126,85.6792",
    numberOfLots: 4,
  },
];
const mainCrops = ["Sầu riêng", "Xoài", "Chuối", "Cà phê", "Mít", "Bưởi"];
const soilTypes = [
  "Đất thịt",
  "Đất phù sa",
  "Đất cát",
  "Đất sét",
  "Đất đỏ bazan",
];
const terrains = ["Cao", "Thấp", "Dốc", "Bằng phẳng", "Trũng"];
const AreaManagementRegionPage = () => {
  const navigate = useNavigate();
  const onRegionDetail = () => {
    navigate(PATH.AREA_REGION_DETAIL);
  };
  const areaZoneColumns: MRT_ColumnDef<AreaZone>[] = [
    // {
    //   accessorKey: "code",
    //   header: "Mã vùng",
    //   Cell: ({ row }) => <Text fw={500}>{row.original.code}</Text>,
    // },
    {
      accessorKey: "regionName",
      header: "Vùng",
    },
    {
      accessorKey: "areaName",
      header: "Khu vực",
    },
    {
      accessorKey: "plotName",
      header: "Lô",
    },
    {
      accessorKey: "area",
      header: "Diện tích canh tác (m²)",
      Cell: ({ row }) => <Text>{row.original.area.toLocaleString()} m²</Text>,
    },
    {
      accessorKey: "employee",
      header: "Người quản lý",
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
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Khu vực canh tác
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
        <Select
          searchable
          radius={4}
          leftSection={<IconTree size={18} />}
          placeholder="Chọn cây trồng chính"
          data={mainCrops}
        />
        <Select
          searchable
          radius={4}
          leftSection={<IconSandbox size={18} />}
          placeholder="Chọn loại đất"
          multiple
          data={soilTypes}
        />
        <Select
          searchable
          radius={4}
          multiple
          leftSection={<IconBrandMetabrainz size={18} />}
          placeholder="Chọn địa hình"
          data={terrains}
        />
      </Group>
      <Table columns={areaZoneColumns} data={areaZoneData} />
    </Stack>
  );
};
export default AreaManagementRegionPage;
