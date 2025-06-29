import {
  ActionIcon,
  Autocomplete,
  Button,
  Group,
  Menu,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconCalendar,
  IconChartArea,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconRainbow,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { DateInput } from "@mantine/dates";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";

type SeasonPlan = {
  id: string;
  seasonName: string;
  seasonId: string; // ID mùa vụ
  startDate: string;
  endDate: string;
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
    seasonName: "Mùa vụ Xuân 2025",
    seasonId: "MSV-2025",
    startDate: "2025-01-15",
    endDate: "2025-05-30",
    zoneName: "Vùng A",
    areaName: "Khu vực A1",
    plotName: "Lô A1-L1",
    rowName: "Hàng A1-L1-H1",
    growthStageName: "Ra hoa",
    materialEstimate: "Phân NPK: 50kg, Vôi bột: 10kg",
    equipmentEstimate: "Máy xịt, bình tưới",
    pesticideEstimate: "Confidor 10ml, Radiant 15ml",
  },
];
const PlanManagementMainPage = () => {
  const navigate = useNavigate();
  const onMainDetail = () => {
    navigate(PATH.PLAN_MAIN_DETAIL);
  };
  const onAddMain = () => {
    navigate(PATH.PLAN_ADD_MAIN);
  };
  const seasonPlanColumns: MRT_ColumnDef<SeasonPlan>[] = [
    { accessorKey: "seasonName", header: "Tên mùa vụ" },
    { accessorKey: "startDate", header: "Bắt đầu" },
    { accessorKey: "endDate", header: "Kết thúc" },
    { accessorKey: "zoneName", header: "Vùng trồng" },
    { accessorKey: "areaName", header: "Khu vực" },
    { accessorKey: "plotName", header: "Lô" },
    { accessorKey: "rowName", header: "Hàng" },
    { accessorKey: "growthStageName", header: "Giai đoạn" },
    {
      accessorKey: "materialEstimate",
      header: "Vật tư dự kiến",
      size: 200,
      Cell: ({ row }) => (
        <Stack gap={"xs"}>
          {row.original.materialEstimate
            .trim()
            .split(",")
            .map((item, index) => (
              <Text>
                {index + 1}: {item}
              </Text>
            ))}
        </Stack>
      ),
    },
    {
      accessorKey: "equipmentEstimate",
      header: "Thiết bị dự kiến",
      size: 160,
      Cell: ({ row }) => (
        <Stack gap={"xs"}>
          {row.original.equipmentEstimate
            .trim()
            .split(",")
            .map((item, index) => (
              <Text>
                {index + 1}: {item}
              </Text>
            ))}
        </Stack>
      ),
    },
    {
      accessorKey: "pesticideEstimate",
      header: "Thuốc bảo vệ thực vật",
      size: 200,
      Cell: ({ row }) => (
        <Stack gap={"xs"}>
          {row.original.pesticideEstimate
            .trim()
            .split(",")
            .map((item, index) => (
              <Text>
                {index + 1}: {item}
              </Text>
            ))}
        </Stack>
      ),
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
      <Group>
        <DateInput
          leftSection={<IconCalendar />}
          placeholder="Ngày bắt đầu"
          radius={4}
        />
        <DateInput
          leftSection={<IconCalendar />}
          placeholder="Ngày kết thúc"
          radius={4}
        />
        <Autocomplete
          radius={4}
          leftSection={<IconRainbow />}
          placeholder="Chọn mùa vụ"
          data={["Mùa vụ A"]}
        />
        <Autocomplete
          radius={4}
          leftSection={<IconChartArea />}
          placeholder="Chọn vùng trồng"
          data={["Mùa vụ A"]}
        />
      </Group>
      <Table columns={seasonPlanColumns} data={seasonPlans} />
    </Stack>
  );
};
export default PlanManagementMainPage;
