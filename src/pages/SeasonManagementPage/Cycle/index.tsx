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
    name: "Chu kỳ sinh trưởng Sầu Riêng Dona",
    duration: 120,
    varietyId: "VRI-001",
    stages: [
      {
        id: "STG001",
        name: "Nảy mầm",
        duration: 15,
        conditionNote: "Đảm bảo độ ẩm đất trên 75%, che phủ gốc để giữ nhiệt",
      },
      {
        id: "STG002",
        name: "Sinh trưởng",
        duration: 40,
        conditionNote: "Ánh sáng tự nhiên 6–8h/ngày, tưới nhỏ giọt mỗi sáng",
      },
      {
        id: "STG003",
        name: "Ra hoa",
        duration: 25,
        conditionNote: "Bón phân Kali và Lân, tránh gió mạnh",
      },
      {
        id: "STG004",
        name: "Kết trái",
        duration: 40,
        conditionNote: "Duy trì độ ẩm 70%, tỉa bớt quả non",
      },
    ],
  },
  {
    id: "GC002",
    name: "Chu kỳ sinh trưởng Xoài Cát Chu",
    duration: 90,
    varietyId: "VRI-002",
    stages: [
      {
        id: "STG005",
        name: "Nảy mầm",
        duration: 10,
        conditionNote: "Đảm bảo đất tơi xốp, nhiệt độ 25–30°C",
      },
      {
        id: "STG006",
        name: "Sinh trưởng",
        duration: 30,
        conditionNote: "Ánh sáng tự nhiên, tưới phun sương ngày 2 lần",
      },
      {
        id: "STG007",
        name: "Ra hoa",
        duration: 20,
        conditionNote: "Bón phân NPK, phun thuốc phòng sâu bệnh",
      },
      {
        id: "STG008",
        name: "Kết trái",
        duration: 30,
      },
    ],
  },
  {
    id: "GC003",
    name: "Chu kỳ sinh trưởng Chuối Laba",
    duration: 150,
    varietyId: "VRI-003",
    stages: [
      {
        id: "STG009",
        name: "Sinh trưởng thân lá",
        duration: 50,
        conditionNote: "Bón phân hữu cơ, giữ ẩm thường xuyên",
      },
      {
        id: "STG010",
        name: "Ra hoa",
        duration: 40,
        conditionNote: "Tưới đẫm trước khi trổ buồng, tránh gió mạnh",
      },
      {
        id: "STG011",
        name: "Nuôi quả",
        duration: 60,
        conditionNote: "Tỉa bỏ nải lép, duy trì dinh dưỡng cao",
      },
    ],
  },
  {
    id: "GC004",
    name: "Chu kỳ sinh trưởng Cà Phê Robusta",
    duration: 180,
    varietyId: "VRI-004",
    stages: [
      {
        id: "STG012",
        name: "Ra lộc non",
        duration: 40,
        conditionNote: "Tưới bổ sung khi khô hạn, giữ độ ẩm đất 60%",
      },
      {
        id: "STG013",
        name: "Ra hoa",
        duration: 60,
        conditionNote: "Tưới đẫm trước ra hoa, bón phân Lân",
      },
      {
        id: "STG014",
        name: "Kết trái",
        duration: 50,
        conditionNote: "Giữ tán cây thông thoáng, phòng sâu đục quả",
      },
      {
        id: "STG015",
        name: "Chín và thu hoạch",
        duration: 30,
        conditionNote: "Thu hái khi quả đỏ trên 90%",
      },
    ],
  },
  {
    id: "GC005",
    name: "Chu kỳ sinh trưởng Bưởi Da Xanh",
    duration: 100,
    varietyId: "VRI-005",
    stages: [
      {
        id: "STG016",
        name: "Ra lộc",
        duration: 20,
        conditionNote: "Bón phân hữu cơ, phòng trừ sâu ăn lá",
      },
      {
        id: "STG017",
        name: "Ra hoa",
        duration: 35,
        conditionNote: "Bón Kali, phun thuốc phòng nấm",
      },
      {
        id: "STG018",
        name: "Kết trái",
        duration: 25,
      },
      {
        id: "STG019",
        name: "Chín và thu hoạch",
        duration: 20,
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
      header: "Chu kì",
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
              onClick={onCycleDetail}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item
              leftSection={<IconCopy size={18} color="gray" />}
              onClick={onAddCycle}
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
