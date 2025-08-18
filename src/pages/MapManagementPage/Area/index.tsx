import {
  ActionIcon,
  Badge,
  Button,
  Card,
  CloseButton,
  Group,
  Menu,
  MultiSelect,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import Table from "../../../components/Table";
import type { MRT_ColumnDef } from "mantine-react-table";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconLeaf,
  IconMountain,
  IconRefresh,
  IconSandbox,
  IconSearch,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import { useState } from "react";
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
const CROP_OPTIONS = [
  "Lúa",
  "Cà phê",
  "Hồ tiêu",
  "Điều",
  "Mía",
  "Thanh long",
  "Sầu riêng",
  "Xoài",
  "Cam/Quýt",
  "Rau màu",
];

const SOIL_OPTIONS = [
  "Đất thịt",
  "Đất phù sa",
  "Đất cát",
  "Đất sét",
  "Đất đỏ bazan",
  "Đất mùn",
  "Đất kiềm",
  "Đất chua",
];

const TERRAIN_OPTIONS = [
  "Bằng phẳng",
  "Cao",
  "Thấp",
  "Dốc",
  "Trũng",
  "Đồi núi",
  "Đồng bằng",
  "Ven sông",
];
const MapManagementAreaPage = () => {
  const navigate = useNavigate();
  const [crop, setCrop] = useState<string[]>([]);
  const [soil, setSoil] = useState<string[]>([]);
  const [terrain, setTerrain] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");
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
  const clearAll = () => {
    setKeyword("");
    setCrop([]);
    setSoil([]);
    setTerrain([]);
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

      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm khu vực</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc lọc theo cây trồng chính, loại đất, địa hình
            </Text>
          </Stack>

          <Group>
            <Tooltip label="Xoá tất cả bộ lọc">
              <Button
                radius={4}
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={clearAll}
              >
                Làm mới
              </Button>
            </Tooltip>
            <Button radius={4} leftSection={<IconSearch size={16} />}>
              Lọc thông tin
            </Button>
          </Group>
        </Group>

        {/* Form */}
        <Stack gap="sm">
          {/* Khung tìm kiếm (keyword) */}
          <TextInput
            radius={4}
            label="Khung tìm kiếm"
            description="Ví dụ: KV-AG01, Vùng Trồng Lúa, HTX Vàm Nao, An Giang…"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <MultiSelect
              searchable
              label="Cây trồng chính"
              description="Ví dụ: Lúa, Ngô, Khoai Lang"
              placeholder="Chọn thông tin"
              clearable
              radius={4}
              leftSection={<IconLeaf size={18} />}
              data={CROP_OPTIONS}
              value={crop}
              onChange={setCrop}
            />

            <MultiSelect
              searchable
              clearable
              radius={4}
              label="Loại đất"
              description="Ví dụ: Đất phù sa, Đất đỏ bazan"
              leftSection={<IconSandbox size={18} />}
              placeholder="Chọn thông tin"
              data={SOIL_OPTIONS}
              value={soil}
              onChange={setSoil}
            />

            <MultiSelect
              searchable
              clearable
              radius={4}
              label="Địa hình"
              description="Ví dụ: Đồi núi, Bằng phẳng"
              leftSection={<IconMountain size={18} />}
              placeholder="Chọn thông tin"
              data={TERRAIN_OPTIONS}
              value={terrain}
              onChange={setTerrain}
            />
          </SimpleGrid>

          {/* Tóm tắt filter bằng chips (UI) */}
          {(keyword || crop.length || terrain.length || soil.length) && (
            <Group gap={8}>
              {keyword && (
                <Badge
                  variant="light"
                  rightSection={<CloseButton onClick={() => setKeyword("")} />}
                >
                  Từ khoá: {keyword}
                </Badge>
              )}
              {soil.length > 0 && (
                <Badge
                  variant="light"
                  rightSection={<CloseButton onClick={() => setSoil([])} />}
                >
                  Loại đất: {soil.join(", ")}
                </Badge>
              )}
              {terrain.length > 0 && (
                <Badge
                  variant="light"
                  rightSection={<CloseButton onClick={() => setTerrain([])} />}
                >
                  Địa hình: {terrain.join(", ")}
                </Badge>
              )}
              {crop.length > 0 && (
                <Badge
                  variant="light"
                  rightSection={<CloseButton onClick={() => setCrop([])} />}
                >
                  Cây trồng: {crop.join(", ")}
                </Badge>
              )}

              <ActionIcon
                variant="subtle"
                onClick={clearAll}
                title="Xoá tất cả"
              >
                <IconX size={16} />
              </ActionIcon>
            </Group>
          )}
        </Stack>
      </Card>

      <Table columns={areaZoneColumns} data={areaZoneData} />
    </Stack>
  );
};
export default MapManagementAreaPage;
