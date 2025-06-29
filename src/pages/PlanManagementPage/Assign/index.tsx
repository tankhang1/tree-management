import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Menu,
  Stack,
  Title,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
type Assignment = {
  id: string;
  name: string;
  assignDate: string;
  startDate: string;
  endDate: string;
  departments: string[];
  employees: string[];
  supervisor: string;
  creator: string;
  manager: string;
  seasonPlan: string;
  materials?: {
    name: string;
    quantity: number;
  }[];
  pesticides?: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  equipment?: {
    name: string;
    quantity: number;
  }[];
};
const assignmentData: Assignment[] = [
  {
    id: "A001",
    name: "Tưới nước đợt 1",
    assignDate: "2025-07-01",
    startDate: "2025-07-02",
    endDate: "2025-07-03",
    departments: ["Chăm sóc cây", "Bảo vệ thực vật"],
    employees: ["Nguyễn Văn A", "Trần Thị B"],
    supervisor: "Phạm Văn Quản",
    creator: "Lê Thị Điều",
    manager: "Nguyễn Quản Lý",
    seasonPlan: "Kế hoạch mùa Xuân 2025",
    materials: [
      { name: "Phân NPK", quantity: 10 },
      { name: "Vôi bột", quantity: 3 },
    ],
    pesticides: [{ name: "Confidor", quantity: 2, unit: "lít" }],
    equipment: [{ name: "Máy xịt thuốc", quantity: 1 }],
  },
];

const PlanManagementAssignPage = () => {
  const assignmentColumns: MRT_ColumnDef<Assignment>[] = [
    { accessorKey: "name", header: "Tên phiếu" },
    { accessorKey: "assignDate", header: "Ngày giao" },
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
        row.original.employees.map((e, i) => (
          <Badge key={i} size="xs" color="gray" mr={4}>
            {e}
          </Badge>
        )),
    },
    { accessorKey: "manager", header: "Quản lý" },
    { accessorKey: "supervisor", header: "Giám sát" },
    { accessorKey: "creator", header: "Người tạo" },
    { accessorKey: "seasonPlan", header: "Kế hoạch canh tác" },
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
            <Menu.Item leftSection={<IconEye size={18} color="gray" />}>
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
          <Button radius={4}>Thêm mới</Button>
        </Group>
      </Group>

      <Table columns={assignmentColumns} data={assignmentData} />
    </Stack>
  );
};
export default PlanManagementAssignPage;
