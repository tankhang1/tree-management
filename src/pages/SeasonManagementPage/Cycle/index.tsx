import {
  ActionIcon,
  Badge,
  Button,
  Card,
  CloseButton,
  Group,
  Menu,
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
    name: "Chu kỳ sinh trưởng Đậu nành DT84",
    duration: 100,
    varietyId: "VRI-SOY-DT84",
    stages: [
      {
        id: "STG001",
        name: "Nảy mầm",
        duration: 6,
        conditionNote: "Độ ẩm đất 70–80%, gieo mật độ 35–40 cây/m²",
      },
      {
        id: "STG002",
        name: "Sinh trưởng sinh dưỡng",
        duration: 32,
        conditionNote: "Giữ ẩm ổn định, làm cỏ sớm, bón NPK cân đối",
      },
      {
        id: "STG003",
        name: "Ra hoa",
        duration: 10,
        conditionNote: "Hạn chế khô hạn, theo dõi rụng hoa do thiếu ẩm",
      },
      {
        id: "STG004",
        name: "Tạo hạt – chín",
        duration: 52,
        conditionNote: "Theo dõi rỉ sắt, sâu cuốn lá; thu khi 85–90% lá vàng",
      },
    ],
  },
  {
    id: "GC002",
    name: "Chu kỳ sinh trưởng Đậu nành ĐX11",
    duration: 95,
    varietyId: "VRI-SOY-DX11",
    stages: [
      {
        id: "STG005",
        name: "Nảy mầm",
        duration: 5,
        conditionNote: "Nhiệt độ đất 25–30°C, hạt xử lý nấm trước gieo",
      },
      {
        id: "STG006",
        name: "Sinh trưởng sinh dưỡng",
        duration: 30,
        conditionNote: "Bón lót hữu cơ, tỉa dặm cây 5–7 ngày sau gieo",
      },
      {
        id: "STG007",
        name: "Ra hoa",
        duration: 9,
        conditionNote: "Giữ ẩm 70–80%, tránh ngập úng",
      },
      {
        id: "STG008",
        name: "Tạo hạt – chín",
        duration: 51,
        conditionNote: "Phòng sâu đục quả; thu khi hạt khô 12–13% ẩm",
      },
    ],
  },
  {
    id: "GC003",
    name: "Chu kỳ sinh trưởng Bắp LVN10",
    duration: 110,
    varietyId: "VRI-CORN-LVN10",
    stages: [
      {
        id: "STG009",
        name: "Nảy mầm – 3 lá",
        duration: 10,
        conditionNote: "Gieo 2–3 hạt/hốc, phủ đất mỏng, tưới giữ ẩm",
      },
      {
        id: "STG010",
        name: "Sinh trưởng thân lá (3–9 lá)",
        duration: 35,
        conditionNote: "Bón thúc đạm sớm, làm cỏ, vun gốc chống đổ",
      },
      {
        id: "STG011",
        name: "Trỗ cờ – phun râu – làm hạt",
        duration: 65,
        conditionNote: "Giữ ẩm đều; bổ sung Kali, phòng sâu keo mùa thu",
      },
    ],
  },
  {
    id: "GC004",
    name: "Chu kỳ sinh trưởng Bắp NK66",
    duration: 115,
    varietyId: "VRI-CORN-NK66",
    stages: [
      {
        id: "STG012",
        name: "Nảy mầm – 5 lá",
        duration: 14,
        conditionNote: "Nhiệt độ đất >18°C; tránh úng sau mưa lớn",
      },
      {
        id: "STG013",
        name: "Sinh trưởng mạnh (5–10 lá)",
        duration: 36,
        conditionNote: "Bón NPK cân đối, kiểm soát cỏ dại",
      },
      {
        id: "STG014",
        name: "Trỗ cờ – phun râu",
        duration: 10,
        conditionNote: "Đảm bảo ẩm; thiếu nước làm giảm thụ phấn",
      },
      {
        id: "STG015",
        name: "Làm hạt – chín",
        duration: 55,
        conditionNote: "Theo dõi sâu đục thân; thu khi ẩm hạt ~20–22%",
      },
    ],
  },
  {
    id: "GC005",
    name: "Chu kỳ sinh trưởng Đậu nành HL07-12",
    duration: 95,
    varietyId: "VRI-SOY-HL0712",
    stages: [
      {
        id: "STG016",
        name: "Nảy mầm",
        duration: 6,
        conditionNote: "Gieo hàng cách hàng 30–35cm; xử lý hạt giống",
      },
      {
        id: "STG017",
        name: "Sinh trưởng sinh dưỡng",
        duration: 28,
        conditionNote: "Bón thúc đợt 1 sau 12–15 ngày, giữ ẩm 65–75%",
      },
      {
        id: "STG018",
        name: "Ra hoa – đậu quả",
        duration: 20,
        conditionNote: "Phun phòng nấm, theo dõi rụng hoa/quả non",
      },
      {
        id: "STG019",
        name: "Tạo hạt – chín",
        duration: 41,
        conditionNote: "Ngừng tưới trước thu 5–7 ngày; phơi/sấy đạt chuẩn",
      },
    ],
  },
];

const SeasonManagementCyclePage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const onClearAll = () => {
    setKeyword("");
  };
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
      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm chu kì sinh trưởng</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa
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
            description="Ví dụ: Chu kì sinh trưởng đậu nành"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
          />

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
      <Table columns={growthStageColumns} data={growthCycleData} />
    </Stack>
  );
};
export default SeasonManagementCyclePage;
