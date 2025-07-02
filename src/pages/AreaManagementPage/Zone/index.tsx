import {
  ActionIcon,
  Autocomplete,
  Badge,
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
type Area = {
  code: string;
  name: string;
  regionName: string;
  orgUnit: string;
  employee: string;
  area: number;
  soilType: string;
  terrain: string[];
  mainCrop: string;
  gps: string;
  numberOfPlots: number;
};
const areaZoneList: Area[] = [
  {
    code: "KV001",
    name: "Khu vực phía Bắc",
    regionName: "Vùng trồng sầu riêng Đồng Nai",
    orgUnit: "Hộ nông dân Nguyễn Văn A",
    employee: "Nhân viên A",
    area: 4500,
    soilType: "Đất thịt",
    terrain: ["Cao"],
    mainCrop: "Sầu riêng",
    gps: "10.12,106.21;10.121,106.212",
    numberOfPlots: 3,
  },
  {
    code: "KV002",
    name: "Khu vực phía Nam",
    regionName: "Vùng trồng sầu riêng Đồng Nai",
    orgUnit: "Hộ nông dân Nguyễn Văn A",
    employee: "Nhân viên A",

    area: 5500,
    soilType: "Đất thịt",
    terrain: ["Dốc"],
    mainCrop: "Sầu riêng",
    gps: "10.14,106.23;10.141,106.232",
    numberOfPlots: 2,
  },
];

const AreaManagementZonePage = () => {
  const navigate = useNavigate();
  const onZoneDetail = () => {
    navigate(PATH.AREA_ZONE_DETAIL);
  };
  const areaZoneColumns: MRT_ColumnDef<Area>[] = [
    {
      accessorKey: "code",
      header: "Mã khu vực",
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
      accessorKey: "employee",
      header: "người quản lý",
    },
    {
      accessorKey: "area",
      header: "Diện tích (m²)",
      Cell: ({ row }) => `${row.original.area.toLocaleString()} m²`,
    },
    {
      accessorKey: "soilType",
      header: "Loại đất",
    },
    {
      accessorKey: "terrain",
      header: "Địa hình",
      Cell: ({ row }) => (
        <Group gap={4}>
          {row.original.terrain.map((t, i) => (
            <Badge key={i} size="xs" variant="light">
              {t}
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
      accessorKey: "numberOfPlots",
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
          Quản lý khu vực
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
      <Table columns={areaZoneColumns} data={areaZoneList} />
    </Stack>
  );
};
export default AreaManagementZonePage;
