import { ActionIcon, Button, Group, Menu, Stack, Title } from "@mantine/core";
import {
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

type GrowthCycle = {
  id: string;
  name: string;
  duration: number;
  varietyId: string; // Giống cây
  stages: GrowthStage[];
};

type GrowthStage = {
  id: string;
  name: string;
  duration: number; // số ngày
  conditionNote?: string;
};
const growthCycleData: GrowthCycle[] = [
  {
    id: "GC001",
    name: "Chu kì sinh trưởng 1",
    duration: 100,
    varietyId: "VRI-001",
    stages: [
      {
        id: "STG01",
        name: "Nảy mầm",
        duration: 10,
        conditionNote: "Đảm bảo độ ẩm đất trên 70%",
      },
      {
        id: "STG02",
        name: "Sinh trưởng",
        duration: 30,
        conditionNote: "Ánh sáng tự nhiên tối thiểu 6h/ngày",
      },
      {
        id: "STG03",
        name: "Ra hoa",
        duration: 20,
        conditionNote: "Bón phân Kali tăng cường",
      },
      {
        id: "STG04",
        name: "Kết trái",
        duration: 40,
      },
    ],
  },
];

const SeasonManagementCyclePage = () => {
  const navigate = useNavigate();
  const onCycleDetail = () => {
    navigate(PATH.SEASON_CYCLE_DETAIL);
  };
  const onAddCycle = () => {
    navigate(PATH.SEASON_ADD_CYCLE);
  };
  const growthStageColumns: MRT_ColumnDef<GrowthCycle>[] = [
    {
      accessorKey: "name",
      header: "Mùa vụ",
    },
    {
      accessorKey: "duration",
      header: "Thời gian (ngày)",
    },
    {
      accessorKey: "stages",
      header: "Số giai đoạn",
      Cell: ({ row }) => row.original.stages.length,
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
              onClick={onCycleDetail}
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
  return (
    <Stack gap="lg">
      <Group justify="space-between" px={"sm"}>
        <Title flex={1} order={2}>
          Quản lý chu kì sinh trưởng
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddCycle}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={growthStageColumns} data={growthCycleData} />
    </Stack>
  );
};
export default SeasonManagementCyclePage;
