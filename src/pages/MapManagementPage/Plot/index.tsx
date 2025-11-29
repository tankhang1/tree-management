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
  IconRefresh,
  IconSearch,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import { useState } from "react";
import { usePlotStore, type PlotEntity } from "../../zustand/plotStore";
type TPlot = {
  id: string;
  areaId: string; // Khu vực
  code: string;
  name: string;
  area: number;
  area_name: string;
  zone: string;
  gps: string;
  contour: string;
  numberOfRows: number;
};

const MapManagementPlotPage = () => {
  const { plots } = usePlotStore();
  const navigate = useNavigate();

  const onBlockDetail = () => {
    navigate(PATH.MAP_PLOT_DETAIL);
  };
  const [keyword, setKeyword] = useState<string>("");

  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const [filteredData, setFilteredData] = useState(plots);

  const applyFilter = () => {
    let data = plots;

    if (keyword.trim()) {
      const kw = keyword.toLowerCase();
      data = data.filter((item) => item.plot.name.toLowerCase().includes(kw));
    }

    if (selectedZones.length > 0) {
      data = data.filter((item) =>
        selectedZones.includes(item.plot.regionName)
      );
    }

    if (selectedAreas.length > 0) {
      data = data.filter((item) => selectedAreas.includes(item.plot.areaName));
    }

    setFilteredData(data);
  };

  const onClearAll = () => {
    setKeyword("");
    setSelectedZones([]);
    setSelectedAreas([]);
    setFilteredData(plots);
  };

  const areaBlockColumns: MRT_ColumnDef<PlotEntity>[] = [
    {
      accessorKey: "code",
      header: "Mã lô",
      Cell: ({ row }) => row.original.plot.code,
    },

    {
      accessorKey: "name",
      header: "Lô",
      Cell: ({ row }) => row.original.plot.name,
    },
    {
      accessorKey: "area_name",
      header: "Khu vực",
      Cell: ({ row }) => row.original.plot.areaName,
    },
    {
      accessorKey: "zone",
      header: "Vùng",
      Cell: ({ row }) => row.original.plot.regionName,
    },
    {
      accessorKey: "area",
      header: "Diện tích (m²)",
      Cell: ({ row }) => row.original.plot.area?.toLocaleString() + " m²",
    },

    {
      accessorKey: "contour",
      header: "Đường bình độ",
      Cell: ({ row }) => row.original.plot.contour,
    },
    {
      accessorKey: "numberOfRows",
      header: "Số hàng",
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
      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm lô</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc theo vùng, khu vực
            </Text>
          </Stack>

          <Group>
            <Tooltip label="Xoá tất cả bộ lọc">
              <Button
                radius={4}
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={onClearAll}
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
              label="Vùng"
              description="Ví dụ: Khu vực A1, Khu vực B1"
              placeholder="Chọn thông tin"
              data={[...new Set(plots.map((i) => i.plot.regionName))]}
              radius={4}
              searchable
              clearable
              value={selectedZones}
              onChange={setSelectedZones}
            />

            <MultiSelect
              label="Khu vực"
              description="Ví dụ: Vùng A, Vùng B"
              placeholder="Chọn thông tin"
              data={[...new Set(plots.map((i) => i.plot.areaName))]}
              radius={4}
              searchable
              clearable
              value={selectedAreas}
              onChange={setSelectedAreas}
            />
          </SimpleGrid>

          {/* Tóm tắt filter bằng chips (UI) */}
          {keyword && (
            <Group gap={8}>
              {keyword && (
                <Badge
                  variant="light"
                  rightSection={<CloseButton onClick={() => setKeyword("")} />}
                >
                  Từ khoá: {keyword}
                </Badge>
              )}

              <ActionIcon
                variant="subtle"
                onClick={onClearAll}
                title="Xoá tất cả"
              >
                <IconX size={16} />
              </ActionIcon>
            </Group>
          )}
        </Stack>
      </Card>
      <Table columns={areaBlockColumns} data={filteredData} />
    </Stack>
  );
};
export default MapManagementPlotPage;
