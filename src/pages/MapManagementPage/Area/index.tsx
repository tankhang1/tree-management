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
import { useMemo, useState } from "react";
import { useRegionStore } from "../../zustand/regionStore";
export type AreaZone = {
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
  const { regions } = useRegionStore();

  const areaZoneData = useMemo<AreaZone[]>(() => {
    if (!regions || regions.length === 0) return [];

    return regions.flatMap((regionEntity) => {
      const { region, areas } = regionEntity;

      return (areas || []).map<AreaZone>((area, idx) => ({
        id: area.code || `${regionEntity.id}-${idx + 1}`,
        code: area.code || `KV-${idx + 1}`,
        name: area.name || `Khu vực ${idx + 1}`,
        regionName: region.name,
        area: Number(area.area) || 0,
        soilType: area.soilType || region.soilType || "Chưa cập nhật",
        terrain:
          (area.terrain && area.terrain.length > 0
            ? area.terrain
            : region.terrain) || [],
        gps: area.gps || region.gps || "",
        numberOfLots: 0, // nếu sau này có store lô thì map thật
        mainCrop: area.mainCrop,
      }));
    });
  }, [regions]);
  const navigate = useNavigate();
  const [crop, setCrop] = useState<string[]>([]);
  const [soil, setSoil] = useState<string[]>([]);
  const [terrain, setTerrain] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");
  const [filteredData, setFilteredData] = useState(areaZoneData);
  const applyFilter = () => {
    let data = areaZoneData;

    // 1. keyword
    if (keyword.trim()) {
      const kw = keyword.toLowerCase();
      data = data.filter(
        (item) =>
          item.code.toLowerCase().includes(kw) ||
          item.name.toLowerCase().includes(kw) ||
          item.regionName.toLowerCase().includes(kw) ||
          item.soilType.toLowerCase().includes(kw)
      );
    }

    // 2. soil
    if (soil.length > 0) {
      data = data.filter((item) => soil.includes(item.soilType));
    }

    // 3. terrain
    if (terrain.length > 0) {
      data = data.filter((item) =>
        item.terrain.some((t) => terrain.includes(t))
      );
    }

    setFilteredData(data);
  };

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
    setFilteredData(areaZoneData);
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
            <Button
              radius={4}
              leftSection={<IconSearch size={16} />}
              onClick={applyFilter}
            >
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
            description="Ví dụ: KV-AG01, Vùng Trồng Đậu Nành, HTX Vàm Nao, An Giang…"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
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

      <Table columns={areaZoneColumns} data={filteredData} />
    </Stack>
  );
};
export default MapManagementAreaPage;
