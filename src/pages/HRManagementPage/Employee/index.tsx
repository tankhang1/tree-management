import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Group,
  Menu,
  MultiSelect,
  Select,
  Stack,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconCalendar,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconHome,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
type Staff = {
  id: string; // Mã nhân sự
  username: string; // Tên đăng nhập / username
  fullName: string; // Họ tên đầy đủ
  birthDate: string; // Ngày sinh (ISO string)
  avatarUrl?: string; // URL hình ảnh đại diện
  role: string; // Vai trò (chọn từ XI.2)
  level: string; // Cấp bậc (chọn từ XI.3)
  department: string; // Phòng ban (XI.1)
  status: "active" | "inactive" | "probation"; // Trạng thái
  manager?: string; // Người quản lý (id hoặc tên)
};
const staffDataset: Staff[] = [
  {
    id: "EMP001",
    username: "nguyenvana",
    fullName: "Nguyễn Văn A",
    birthDate: "1990-05-10",
    avatarUrl: "https://example.com/avatar-a.jpg",
    role: "Kỹ sư canh tác",
    level: "Trưởng nhóm",
    department: "Phòng Nông Nghiệp",
    status: "active",
    manager: "Lê Thị B",
  },
  {
    id: "EMP002",
    username: "phamthib",
    fullName: "Phạm Thị B",
    birthDate: "1995-11-20",
    avatarUrl: "https://example.com/avatar-b.jpg",
    role: "Giám sát hiện trường",
    level: "Nhân viên",
    department: "Phòng Kỹ Thuật",
    status: "probation",
    manager: "Nguyễn Văn A",
  },
];

const HRManagementEmployeePage = () => {
  const navigate = useNavigate();

  const staffColumns: MRT_ColumnDef<Staff>[] = [
    {
      accessorKey: "avatarUrl",
      header: "Ảnh",
      Cell: ({ row }) => <Avatar src={row.original.avatarUrl} radius="xl" />,
      size: 60,
    },
    { accessorKey: "id", header: "Mã nhân sự" },
    { accessorKey: "username", header: "Tên nhân sự" },
    { accessorKey: "fullName", header: "Họ tên" },
    { accessorKey: "birthDate", header: "Ngày sinh" },
    { accessorKey: "role", header: "Vai trò" },
    { accessorKey: "level", header: "Cấp bậc" },
    { accessorKey: "department", header: "Phòng ban" },
    {
      accessorKey: "status",
      header: "Trạng thái",
      Cell: ({ row }) => {
        const value = row.original.status;
        const color =
          value === "active"
            ? "green"
            : value === "inactive"
            ? "gray"
            : "yellow";
        return <Badge color={color}>{value}</Badge>;
      },
    },
    { accessorKey: "manager", header: "Người quản lý" },
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
              onClick={onEmployeeDetail}
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
  const onAddEmployee = () => {
    navigate(PATH.HR_ADD_EMPLOYEE);
  };
  const onEmployeeDetail = () => {
    navigate(PATH.HR_EMPLOYEE_DETAIL);
  };
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý nhân viên
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddEmployee}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Group>
        <DateInput
          leftSection={<IconCalendar size={18} />}
          placeholder="Ngày tạo"
          radius={4}
        />
        <DateInput
          leftSection={<IconCalendar size={18} />}
          placeholder="Ngày kết thúc"
          radius={4}
        />
        <Select
          searchable
          clearable
          radius={4}
          leftSection={<IconHome size={18} />}
          placeholder="Chọn phòng ban"
          data={[
            "Phòng Nông Nghiệp",
            "Phòng Kỹ Thuật",
            "Phòng Nhân Sự",
            "Phòng Kế Toán",
            "Phòng Quản Lý",
          ]}
        />
        <Select
          searchable
          clearable
          radius={4}
          placeholder="Chọn vai trò"
          data={[
            "Kỹ sư canh tác",
            "Giám sát hiện trường",
            "Nhân viên hành chính",
            "Kế toán",
            "Quản lý",
          ]}
        />
        <MultiSelect
          searchable
          radius={4}
          placeholder="Trạng thái"
          data={[
            { value: "active", label: "Đang làm việc" },
            { value: "inactive", label: "Nghỉ việc" },
            { value: "probation", label: "Thử việc" },
          ]}
        />
      </Group>
      <Table columns={staffColumns} data={staffDataset} />
    </Stack>
  );
};
export default HRManagementEmployeePage;
