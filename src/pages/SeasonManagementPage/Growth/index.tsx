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
import {
  IconCopy,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconRefresh,
  IconSearch,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import { useState } from "react";

type CropSeason = {
  id: string;
  name: string;
  estimatedDuration: number; // in days
  cropId: string;
  cropName: string;
  growthCycleId: string;
  growthCycleName: string;
};
const cropSeasonData: CropSeason[] = [
  {
    id: "MSV2025XUAN",
    name: "Mùa vụ Xuân 2025",
    estimatedDuration: 95,
    cropId: "CR025XUAN01",
    cropName: "Đậu nành DT84",
    growthCycleId: "GC025XUAN01",
    growthCycleName: "Nảy mầm (5–7 ngày)",
  },
  {
    id: "MSV2025HE",
    name: "Mùa vụ Hè 2025",
    estimatedDuration: 105,
    cropId: "CR025HE01",
    cropName: "Đậu nành ĐX11",
    growthCycleId: "GC025HE01",
    growthCycleName: "Ra hoa (7–10 ngày)",
  },
  {
    id: "MSV2025THU",
    name: "Mùa vụ Thu 2025",
    estimatedDuration: 115,
    cropId: "CR025THU01",
    cropName: "Bắp LVN10",
    growthCycleId: "GC025THU01",
    growthCycleName: "Trỗ cờ/Phun râu (7–10 ngày)",
  },
  {
    id: "MSV2025DONG",
    name: "Mùa vụ Đông 2025",
    estimatedDuration: 120,
    cropId: "CR025DONG01",
    cropName: "Bắp NK66",
    growthCycleId: "GC025DONG01",
    growthCycleName: "Làm hạt (25–35 ngày)",
  },
  {
    id: "MSV2026XUAN",
    name: "Mùa vụ Xuân 2026",
    estimatedDuration: 100,
    cropId: "CR026XUAN01",
    cropName: "Đậu nành DT84",
    growthCycleId: "GC026XUAN01",
    growthCycleName: "Tạo hạt (25–35 ngày)",
  },
  {
    id: "MSV2026HE",
    name: "Mùa vụ Hè 2026",
    estimatedDuration: 110,
    cropId: "CR026HE01",
    cropName: "Đậu nành ĐX11",
    growthCycleId: "GC026HE01",
    growthCycleName: "Chín (10–15 ngày)",
  },
  {
    id: "MSV2026THU",
    name: "Mùa vụ Thu 2026",
    estimatedDuration: 125,
    cropId: "CR026THU01",
    cropName: "Bắp LVN10",
    growthCycleId: "GC026THU01",
    growthCycleName: "Trỗ cờ/Phun râu (7–10 ngày)",
  },
  {
    id: "MSV2026DONG",
    name: "Mùa vụ Đông 2026",
    estimatedDuration: 130,
    cropId: "CR026DONG01",
    cropName: "Bắp NK66",
    growthCycleId: "GC026DONG01",
    growthCycleName: "Chín sáp/Chín khô (20–30 ngày)",
  },
];

const SeasonManagementGrowthPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const onClearAll = () => {
    setKeyword("");
  };
  const onAddGrowth = () => {
    navigate(PATH.SEASON_ADD_GROWTH);
  };
  const onGrowthDetail = () => {
    navigate(PATH.SEASON_GROWTH_DETAIL);
  };
  const cropSeasonColumns: MRT_ColumnDef<CropSeason>[] = [
    {
      accessorKey: "id",
      header: "Mã mùa vụ",
    },
    {
      accessorKey: "name",
      header: "Mùa vụ",
    },
    {
      accessorKey: "estimatedDuration",
      header: "Thời gian ước tính (ngày)",
      Cell: ({ row }) => `${row.original.estimatedDuration} ngày`,
    },
    {
      accessorKey: "cropName",
      header: "Cây trồng",
    },
    {
      accessorKey: "growthCycleName",
      header: "Chu kỳ sinh trưởng",
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
              onClick={onGrowthDetail}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item
              leftSection={<IconCopy size={18} color="gray" />}
              onClick={onAddGrowth}
            >
              Sao chép
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
          Quản lý mùa vụ
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddGrowth}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm mùa vụ</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc cây trồng chính, chu kì sinh trưởng
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
            description="Ví dụ: Mùa vụ Xuân 2025"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <MultiSelect
              radius={4}
              label="Cây trồng chính"
              description="Ví dụ: Đậu Nành"
              placeholder="Chọn thông tin"
              data={[
                { value: "rice", label: "Lúa" },
                { value: "corn", label: "Ngô" },
                { value: "wheat", label: "Lúa mì" },
              ]}
            />
            <MultiSelect
              radius={4}
              label="Chu kỳ sinh trưởng"
              description="Ví dụ: Ra hoa, Đậu quả, Chín và thu hoạch"
              placeholder="Chọn thông tin"
              data={[
                { value: "flowering", label: "Ra hoa" },
                { value: "fruiting", label: "Đậu quả" },
                { value: "harvesting", label: "Chín và thu hoạch" },
              ]}
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
      <Table columns={cropSeasonColumns} data={cropSeasonData} />
    </Stack>
  );
};
export default SeasonManagementGrowthPage;
