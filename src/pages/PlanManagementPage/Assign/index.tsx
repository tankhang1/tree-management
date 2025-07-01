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
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  departments: string[];
  employees: string[];
  supervisor?: string;
  creator: string;
  manager?: string;
  seasonPlan: string;
};

const assignmentData: Assignment[] = [
  {
    id: "A001",
    name: "Tưới nước đợt 1",
    startDate: "2025-07-02",
    endDate: "2025-07-03",
    departments: ["Chăm sóc cây", "Bảo vệ thực vật"],
    employees: ["Nguyễn Văn A", "Trần Thị B"],
    supervisor: "Phạm Văn Quản",
    creator: "Lê Thị Điều",
    manager: "Nguyễn Quản Lý",
    seasonPlan: "Kế hoạch mùa Xuân 2025",
  },
];

const PlanManagementAssignPage = () => {
  const navigate = useNavigate();

  const onAddAssign = () => navigate(PATH.PLAN_ADD_ASSIGN);

  const onAssignDetail = (id: string) =>
    navigate(PATH.PLAN_ASSIGN_DETAIL.replace(":id", id));

  const onAssignEdit = (id: string) => {
    // Navigate to edit page (optional implementation)
    console.log("Chỉnh sửa", id);
  };

  const onAssignDelete = (id: string) => {
    // Gọi API hoặc mở xác nhận xoá
    console.log("Xoá", id);
  };

  const assignmentColumns: MRT_ColumnDef<Assignment>[] = [
    { accessorKey: "name", header: "Tên công việc" },
    { accessorKey: "startDate", header: "Thời gian thực hiện" },
    { accessorKey: "endDate", header: "Thời gian hoàn thành dự kiến" },
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
    {
      accessorKey: "manager",
      header: "Người quản lý",
      Cell: ({ row }) => row.original.manager || "--",
    },
    {
      accessorKey: "supervisor",
      header: "Người kiểm định",
      Cell: ({ row }) => row.original.supervisor || "--",
    },
    { accessorKey: "creator", header: "Người tạo" },
    { accessorKey: "seasonPlan", header: "Kế hoạch mùa vụ" },
    {
      accessorKey: "actions",
      header: "",
      enableColumnActions: false,
      size: 10,
      Cell: ({ row }) => (
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="transparent" c="gray">
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={() => onAssignDetail(row.original.id)}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item
              leftSection={<IconEdit size={18} color="green" />}
              onClick={() => onAssignEdit(row.original.id)}
            >
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size={18} />}
              color="red"
              onClick={() => onAssignDelete(row.original.id)}
            >
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
          Quản lý công việc
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddAssign}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Group>
        <DateInput
          leftSection={<IconCalendar />}
          placeholder="Từ ngày"
          radius={4}
        />
        <DateInput
          leftSection={<IconCalendar />}
          placeholder="Đến ngày"
          radius={4}
        />
      </Group>

      <Table columns={assignmentColumns} data={assignmentData} />
    </Stack>
  );
};

export default PlanManagementAssignPage;
