import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
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
import { DatePickerInput } from "@mantine/dates";
import {
  IconCalendar,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconHome,
  IconRefresh,
  IconSearch,
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
          Quản lý quản trị viên
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

      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm quản trị viên</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc khoản thời gian, phòng ban, vai trò,
              trạng thái
            </Text>
          </Stack>

          <Group>
            <Tooltip label="Xoá tất cả bộ lọc">
              <Button
                radius={4}
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={() => {}}
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
            description="Ví dụ: Nguyễn Văn A"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <DatePickerInput
              leftSection={<IconCalendar size={18} />}
              label="Khoảng thời gian"
              description="Ví dụ: 18/5/2025 - 18/6/2025"
              placeholder="Chọn thông tin"
              radius={4}
              clearable
              locale="vi"
              type="range"
            />

            <MultiSelect
              searchable
              clearable
              radius={4}
              leftSection={<IconHome size={18} />}
              label="Phòng ban"
              description="Ví dụ: Phòng Nông Nghiệp, Phòng Kỹ Thuật"
              placeholder="Chọn thông tin"
              data={[
                "Phòng Nông Nghiệp",
                "Phòng Kỹ Thuật",
                "Phòng Nhân Sự",
                "Phòng Kế Toán",
                "Phòng Quản Lý",
              ]}
            />
            <MultiSelect
              searchable
              clearable
              radius={4}
              label="Vai trò"
              description="Ví dụ: Kỹ sư canh tác, Giám sát hiện trường"
              placeholder="Chọn thông tin"
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
              label="Trạng thái"
              description="Ví dụ: Đang làm việc, Nghỉ việc"
              placeholder="Chọn thông tin"
              data={[
                { value: "active", label: "Đang làm việc" },
                { value: "inactive", label: "Nghỉ việc" },
                { value: "probation", label: "Thử việc" },
              ]}
            />
          </SimpleGrid>
        </Stack>
      </Card>
      <Table columns={staffColumns} data={staffDataset} />
    </Stack>
  );
};
export default HRManagementEmployeePage;
