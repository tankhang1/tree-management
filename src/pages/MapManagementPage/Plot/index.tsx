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
const areaBlockList: TPlot[] = [
  {
    id: "L001",
    areaId: "KV001",
    code: "LO-A1",
    name: "Lô A1",
    zone: "Vùng A",
    area_name: "Khu vực A1",
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
    zone: "Vùng B",
    area_name: "Khu vực B1",
    area: 2000,
    contour: "Địa hình dốc nhẹ, từ 48m đến 56m",
    gps: "10.779,106.695 10.780,106.696 10.781,106.694",
    numberOfRows: 12,
  },
  {
    id: "L003",
    areaId: "KV003",
    code: "LO-C1",
    name: "Lô C1",
    zone: "Vùng c",
    area_name: "Khu vực C1",
    area: 1800,
    contour: "Địa hình bằng phẳng, cao độ 50m",
    gps: "10.782,106.693 10.783,106.692 10.784,106.694",
    numberOfRows: 10,
  },
  {
    id: "L004",
    areaId: "KV004",
    code: "LO-D1",
    name: "Lô D1",
    zone: "Vùng D",
    area_name: "Khu vực D1",
    area: 2500,
    contour: "Địa hình dốc mạnh, từ 60m đến 70m",
    gps: "10.785,106.691 10.786,106.690 10.787,106.692",
    numberOfRows: 15,
  },
  {
    id: "L005",
    areaId: "KV005",
    code: "LO-E1",
    name: "Lô E1",
    zone: "Vùng E",
    area_name: "Khu vực E1",
    area: 3000,
    contour: "Địa hình trũng, từ 40m đến 45m",
    gps: "10.788,106.689 10.789,106.688 10.790,106.690",
    numberOfRows: 20,
  },
  {
    id: "L006",
    areaId: "KV006",
    code: "LO-F1",
    name: "Lô F1",
    zone: "Vùng F",
    area_name: "Khu vực F1",
    area: 2200,
    contour: "Địa hình đồi núi, từ 55m đến 65m",
    gps: "10.791,106.687 10.792,106.686 10.793,106.688",
    numberOfRows: 18,
  },
  {
    id: "L007",
    areaId: "KV007",
    code: "LO-G1",
    zone: "Vùng G",
    area_name: "Khu vực G1",
    name: "Lô G1",
    area: 1700,
    contour: "Địa hình bằng phẳng, cao độ 52m",
    gps: "10.794,106.685 10.795,106.684 10.796,106.686",
    numberOfRows: 9,
  },
  {
    id: "L008",
    areaId: "KV008",
    code: "LO-H1",
    name: "Lô H1",
    zone: "Vùng H",
    area_name: "Khu vực H1",
    area: 2800,
    contour: "Địa hình dốc nhẹ, từ 50m đến 58m",
    gps: "10.797,106.683 10.798,106.682 10.799,106.684",
    numberOfRows: 14,
  },
];

const MapManagementPlotPage = () => {
  const navigate = useNavigate();
  const onBlockDetail = () => {
    navigate(PATH.MAP_PLOT_DETAIL);
  };
  const [keyword, setKeyword] = useState<string>("");

  const areaBlockColumns: MRT_ColumnDef<TPlot>[] = [
    { accessorKey: "code", header: "Mã lô" },
    { accessorKey: "name", header: "Lô" },
    { accessorKey: "area_name", header: "Khu vực" },
    { accessorKey: "zone", header: "Vùng" },
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
  const onClearAll = () => {
    setKeyword("");
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
              label="Vùng"
              description="Ví dụ: Khu vực A1, Khu vực B1"
              placeholder="Chọn thông tin"
              data={["Khu vực A1", "Khu vực B1", "Khu vực C1"]}
              radius={4}
              searchable
              clearable
            />
            <MultiSelect
              label="Khu vực"
              description="Ví dụ: Vùng A, Vùng B"
              placeholder="Chọn thông tin"
              data={["Vùng A", "Vùng B", "Vùng C"]}
              radius={4}
              searchable
              clearable
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
      <Table columns={areaBlockColumns} data={areaBlockList} />
    </Stack>
  );
};
export default MapManagementPlotPage;
