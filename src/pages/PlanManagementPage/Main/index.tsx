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
  IconCalendar,
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
import { DatePickerInput } from "@mantine/dates";

type SeasonPlan = {
  id: string;
  name: string;
  seasonName: string;
  seasonId: string; // ID mùa vụ
  duration: number;
  zoneName: string;
  areaName: string;
  plotName: string;
  rowName: string;
  growthStageName: string;
  materialEstimate: string; // mô tả hoặc định danh vật tư
  equipmentEstimate: string;
  pesticideEstimate: string;
};
const seasonPlans: SeasonPlan[] = [
  {
    id: "SP001",
    name: "Kế hoạch trồng đậu nành vụ Xuân 2025",
    seasonName: "Mùa vụ Xuân 2025",
    seasonId: "MSV-2025",
    duration: 100,
    zoneName: "Vùng Đậu Nành A",
    areaName: "Khu vực DN-A1",
    plotName: "Lô DN-A1-L1",
    rowName: "Hàng DN-A1-L1-H1",
    growthStageName: "Sinh trưởng sinh dưỡng",
    materialEstimate: "Phân NPK: 60kg, Vôi bột: 15kg, Hạt giống DT84: 20kg",
    equipmentEstimate: "Máy gieo hạt, máy xới nhỏ, bình tưới phun sương",
    pesticideEstimate:
      "Thuốc trừ sâu Abamectin 1.8EC: 20ml, Thuốc rỉ sắt Tilt Super: 25ml",
  },
  {
    id: "SP002",
    name: "Kế hoạch chăm sóc đậu nành giữa vụ",
    seasonName: "Mùa vụ Xuân 2025",
    seasonId: "MSV-2025",
    duration: 30,
    zoneName: "Vùng Đậu Nành A",
    areaName: "Khu vực DN-A2",
    plotName: "Lô DN-A2-L1",
    rowName: "Hàng DN-A2-L1-H1",
    growthStageName: "Ra hoa",
    materialEstimate: "Phân Kali: 20kg, Phân Lân: 15kg",
    equipmentEstimate: "Máy phun phân bón lá, bình phun thuốc",
    pesticideEstimate:
      "Thuốc trừ sâu sinh học Neem 10ml, Thuốc nấm Mancozeb 80WP: 10g",
  },
  {
    id: "SP003",
    name: "Kế hoạch thu hoạch đậu nành",
    seasonName: "Mùa vụ Xuân 2025",
    seasonId: "MSV-2025",
    duration: 15,
    zoneName: "Vùng Đậu Nành A",
    areaName: "Khu vực DN-A3",
    plotName: "Lô DN-A3-L2",
    rowName: "Hàng DN-A3-L2-H2",
    growthStageName: "Chín và thu hoạch",
    materialEstimate: "Bao đựng 50 cái, dây buộc 5 cuộn",
    equipmentEstimate: "Máy gặt mini, xe kéo nhỏ",
    pesticideEstimate: "Không sử dụng thuốc BVTV trong giai đoạn này",
  },
];

const PlanManagementMainPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const onClearAll = () => {
    setKeyword("");
  };
  const onMainDetail = () => {
    navigate(PATH.PLAN_MAIN_DETAIL);
  };
  const onAddMain = () => {
    navigate(PATH.PLAN_ADD_MAIN);
  };
  const seasonPlanColumns: MRT_ColumnDef<SeasonPlan>[] = [
    {
      accessorKey: "name",
      header: "Kế hoạch",
    },

    {
      accessorKey: "duration",
      header: "Khoảng gian ước tính (ngày)",
      Cell: ({ row }) => `${row.original.duration} ngày`,
    },
    { accessorKey: "zoneName", header: "Vùng trồng" },
    { accessorKey: "areaName", header: "Khu vực" },
    { accessorKey: "plotName", header: "Lô" },
    { accessorKey: "seasonName", header: "Mùa vụ" },

    { accessorKey: "growthStageName", header: "Giai đoạn" },

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
              onClick={onMainDetail}
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
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý kế hoạch
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddMain}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm kế hoạch</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc vùng trồng, khu vực, lô, giai đoạn
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
            description="Ví dụ: Kế hoạch trồng cây đậu nành, vùng A,..."
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <DatePickerInput
              label="Khoảng thời gian"
              description="Ví dụ: 18/8/2025 - 20/8/2025"
              placeholder="Chọn thông tin"
              radius={4}
              type="range"
              locale="vi"
              leftSection={<IconCalendar size={18} />}
            />
            <MultiSelect
              radius={4}
              label="Vùng trồng"
              description="Ví dụ: Vùng A, Vùng B"
              placeholder="Chọn thông tin"
              data={[
                { value: "zoneA", label: "Vùng A" },
                { value: "zoneB", label: "Vùng B" },
                { value: "zoneC", label: "Vùng C" },
              ]}
            />
            <MultiSelect
              radius={4}
              label="Khu vực"
              description="Ví dụ: Khu vực 1, Khu vực 2"
              placeholder="Chọn thông tin"
              data={[
                { value: "area1", label: "Khu vực 1" },
                { value: "area2", label: "Khu vực 2" },
                { value: "area3", label: "Khu vực 3" },
              ]}
            />
            <MultiSelect
              radius={4}
              label="Lô"
              description="Ví dụ: Lô 1, Lô 2"
              placeholder="Chọn thông tin"
              data={[
                { value: "lot1", label: "Lô 1" },
                { value: "lot2", label: "Lô 2" },
                { value: "lot3", label: "Lô 3" },
              ]}
            />
            <MultiSelect
              radius={4}
              label="Giai đoạn"
              description="Ví dụ: Giai đoạn 1, Giai đoạn 2"
              placeholder="Chọn thông tin"
              data={[
                { value: "stage1", label: "Giai đoạn 1" },
                { value: "stage2", label: "Giai đoạn 2" },
                { value: "stage3", label: "Giai đoạn 3" },
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
      <Table columns={seasonPlanColumns} data={seasonPlans} />
    </Stack>
  );
};
export default PlanManagementMainPage;
