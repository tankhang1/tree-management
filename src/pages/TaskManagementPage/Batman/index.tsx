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
  IconCircleCheck,
  IconDotsVertical,
  IconFileExcel,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
type EmployeeTask = {
  employee: string;
  taskName: string;
  startDate: string; // ISO format: yyyy-mm-dd
  endDate: string;
  status: "Đã hoàn thành" | "Đang thực hiện" | "Chưa bắt đầu";
  reviewer: string;
};

const employeeTasks: EmployeeTask[] = [
  {
    employee: "Nguyễn Văn A",
    taskName: "Phun thuốc trừ sâu đợt 1",
    startDate: "2025-07-02",
    endDate: "2025-07-04",
    status: "Đang thực hiện",
    reviewer: "Lê Quang D",
  },
  {
    employee: "Trần Thị B",
    taskName: "Phun thuốc trừ sâu đợt 1",
    startDate: "2025-07-02",
    endDate: "2025-07-04",
    status: "Chưa bắt đầu",
    reviewer: "Ngô Thanh T",
  },
  {
    employee: "Nguyễn Văn C",
    taskName: "Thu hoạch khu vực B",
    startDate: "2025-07-10",
    endDate: "2025-07-12",
    status: "Đã hoàn thành",
    reviewer: "Phạm Minh H",
  },
];

const TaskManagementBatmanPage = () => {
  const columns: MRT_ColumnDef<EmployeeTask>[] = [
    { accessorKey: "employee", header: "Nhân viên" },
    { accessorKey: "taskName", header: "Tên công việc" },
    { accessorKey: "startDate", header: "Bắt đầu" },
    { accessorKey: "endDate", header: "Kết thúc" },
    {
      accessorKey: "status",
      header: "Trạng thái",
      Cell: ({ row }) => (
        <Badge
          color={
            row.original.status === "Đã hoàn thành"
              ? "green"
              : row.original.status === "Đang thực hiện"
              ? "blue"
              : "gray"
          }
          variant="filled"
        >
          {row.original.status}
        </Badge>
      ),
    },
    { accessorKey: "reviewer", header: "Người kiểm duyệt" },
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
              leftSection={<IconCircleCheck size={18} color="green" />}
            >
              Duyệt
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
          Quản lý công việc
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4}>Thêm mới</Button>
        </Group>
      </Group>

      <Table columns={columns} data={employeeTasks} />
    </Stack>
  );
};
export default TaskManagementBatmanPage;
