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
    id: "MSV001",
    name: "Mùa vụ Hè 2025",
    estimatedDuration: 120,
    cropId: "CR001",
    cropName: "Sầu riêng Dona",
    growthCycleId: "GC001",
    growthCycleName: "Chu kỳ sinh trưởng 120 ngày",
  },
  {
    id: "MSV002",
    name: "Mùa vụ Xuân 2025",
    estimatedDuration: 90,
    cropId: "CR002",
    cropName: "Xoài Cát Chu",
    growthCycleId: "GC002",
    growthCycleName: "Chu kỳ sinh trưởng 90 ngày",
  },
  {
    id: "MSV003",
    name: "Mùa vụ Thu 2025",
    estimatedDuration: 150,
    cropId: "CR003",
    cropName: "Chuối Laba",
    growthCycleId: "GC003",
    growthCycleName: "Chu kỳ sinh trưởng 150 ngày",
  },
  {
    id: "MSV004",
    name: "Mùa vụ Đông 2025",
    estimatedDuration: 180,
    cropId: "CR004",
    cropName: "Cà phê Robusta",
    growthCycleId: "GC004",
    growthCycleName: "Chu kỳ sinh trưởng 180 ngày",
  },
  {
    id: "MSV005",
    name: "Mùa vụ Hè 2026",
    estimatedDuration: 120,
    cropId: "CR005",
    cropName: "Mít Thái",
    growthCycleId: "GC005",
    growthCycleName: "Chu kỳ sinh trưởng 120 ngày",
  },
  {
    id: "MSV006",
    name: "Mùa vụ Xuân 2026",
    estimatedDuration: 100,
    cropId: "CR006",
    cropName: "Bưởi Da Xanh",
    growthCycleId: "GC006",
    growthCycleName: "Chu kỳ sinh trưởng 100 ngày",
  },
  {
    id: "MSV007",
    name: "Mùa vụ Thu 2026",
    estimatedDuration: 140,
    cropId: "CR007",
    cropName: "Dừa Xiêm",
    growthCycleId: "GC007",
    growthCycleName: "Chu kỳ sinh trưởng 140 ngày",
  },
  {
    id: "MSV008",
    name: "Mùa vụ Đông 2026",
    estimatedDuration: 160,
    cropId: "CR008",
    cropName: "Cam Sành",
    growthCycleId: "GC008",
    growthCycleName: "Chu kỳ sinh trưởng 160 ngày",
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
      header: "Tên mùa vụ",
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
