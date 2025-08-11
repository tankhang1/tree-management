import { ActionIcon, Button, Group, Menu, Stack, Title } from "@mantine/core";
import {
  IconCopy,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";

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
    estimatedDuration: 90,
    cropId: "CR025XUAN01",
    cropName: "Xoài Cát Chu",
    growthCycleId: "GC025XUAN01",
    growthCycleName: "Ra hoa (30 ngày)",
  },
  {
    id: "MSV2025HE",
    name: "Mùa vụ Hè 2025",
    estimatedDuration: 120,
    cropId: "CR025HE01",
    cropName: "Sầu Riêng Dona",
    growthCycleId: "GC025HE01",
    growthCycleName: "Đậu quả (25 ngày)",
  },
  {
    id: "MSV2025THU",
    name: "Mùa vụ Thu 2025",
    estimatedDuration: 150,
    cropId: "CR025THU01",
    cropName: "Chuối Laba",
    growthCycleId: "GC025THU01",
    growthCycleName: "Ra hoa (50 ngày)",
  },
  {
    id: "MSV2025DONG",
    name: "Mùa vụ Đông 2025",
    estimatedDuration: 180,
    cropId: "CR025DONG01",
    cropName: "Cà Phê Robusta",
    growthCycleId: "GC025DONG01",
    growthCycleName: "Chín và thu hoạch (60 ngày)",
  },
  {
    id: "MSV2026XUAN",
    name: "Mùa vụ Xuân 2026",
    estimatedDuration: 100,
    cropId: "CR026XUAN01",
    cropName: "Bưởi Da Xanh",
    growthCycleId: "GC026XUAN01",
    growthCycleName: "Ra hoa (35 ngày)",
  },
  {
    id: "MSV2026HE",
    name: "Mùa vụ Hè 2026",
    estimatedDuration: 120,
    cropId: "CR026HE01",
    cropName: "Mít Thái",
    growthCycleId: "GC026HE01",
    growthCycleName: "Đậu quả (25 ngày)",
  },
  {
    id: "MSV2026THU",
    name: "Mùa vụ Thu 2026",
    estimatedDuration: 140,
    cropId: "CR026THU01",
    cropName: "Dừa Xiêm",
    growthCycleId: "GC026THU01",
    growthCycleName: "Ra hoa (50 ngày)",
  },
  {
    id: "MSV2026DONG",
    name: "Mùa vụ Đông 2026",
    estimatedDuration: 160,
    cropId: "CR026DONG01",
    cropName: "Cam Sành",
    growthCycleId: "GC026DONG01",
    growthCycleName: "Chín và thu hoạch (50 ngày)",
  },
];

const SeasonManagementGrowthPage = () => {
  const navigate = useNavigate();
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

      <Table columns={cropSeasonColumns} data={cropSeasonData} />
    </Stack>
  );
};
export default SeasonManagementGrowthPage;
