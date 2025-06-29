import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Menu,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconCalendar,
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
import { DateInput } from "@mantine/dates";
type Assignment = {
  name: string;
  assignDate: string;
  startDate: string;
  endDate: string;
  departments: string[]; // XI.1
  employees: string[]; // XI.4
  creator: string; // XI
  supervisor: string; // XI
  locationPath: string; // Vùng > Khu vực > Lô > Hàng > Cây
  resources: {
    type: "Vật tư" | "Thuốc BVTV" | "Thiết bị";
    name: string;
    quantity: number;
    unit?: string;
  }[];
};
const assignmentData: Assignment[] = [
  {
    name: "Phun thuốc sâu đợt 1",
    assignDate: "2025-07-10",
    startDate: "2025-07-11",
    endDate: "2025-07-12",
    departments: ["Chăm sóc cây", "Phòng bảo vệ thực vật"],
    employees: ["Nguyễn Văn A", "Lê Thị B"],
    creator: "Nguyễn Quản Lý",
    supervisor: "Lê Giám Sát",
    locationPath: "Vùng A > KV-01 > Lô A1 > Hàng 1 > Cây 15",
    resources: [
      { type: "Vật tư", name: "Phân Kali", quantity: 10 },
      { type: "Thuốc BVTV", name: "Thuốc trừ sâu X", quantity: 3, unit: "Lít" },
      { type: "Thiết bị", name: "Bình phun thuốc", quantity: 2 },
    ],
  },
];

const PlanManagementUnplannedPage = () => {
  const navigate = useNavigate();
  const onAddUnplanned = () => {
    navigate(PATH.PLAN_ADD_UNPLANNED);
  };
  const onUnplannedDetail = () => {
    navigate(PATH.PLAN_UNPLANNED_DETAIL);
  };
  const assignmentColumns: MRT_ColumnDef<Assignment>[] = [
    { accessorKey: "name", header: "Tên phiếu" },
    { accessorKey: "assignDate", header: "Ngày giao việc" },
    { accessorKey: "startDate", header: "Bắt đầu" },
    { accessorKey: "endDate", header: "Kết thúc" },
    {
      accessorKey: "departments",
      header: "Phòng ban",
      Cell: ({ row }) =>
        row.original.departments.map((d, i) => (
          <Badge key={i} size="xs" color="blue" mr={4}>
            {d}
          </Badge>
        )),
    },
    {
      accessorKey: "employees",
      header: "Nhân sự",
      Cell: ({ row }) =>
        row.original.employees.map((d, i) => (
          <Badge key={i} size="xs" color="green" mr={4}>
            {d}
          </Badge>
        )),
    },
    { accessorKey: "creator", header: "Người tạo" },
    { accessorKey: "supervisor", header: "Người giám sát" },
    { accessorKey: "locationPath", header: "Vị trí" },
    {
      accessorKey: "resources",
      header: "Tài nguyên",
      Cell: ({ row }) => (
        <Stack gap={"xs"}>
          {row.original.resources.map((r) => (
            <Group>
              -
              <Text>
                {r.name} ({r.quantity}
                {r.unit ? ` ${r.unit}` : ""})
              </Text>
            </Group>
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
              onClick={onUnplannedDetail}
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
          Quản lý công việc phát sinh
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddUnplanned}>
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
      </Group>
      <Table columns={assignmentColumns} data={assignmentData} />
    </Stack>
  );
};
export default PlanManagementUnplannedPage;
