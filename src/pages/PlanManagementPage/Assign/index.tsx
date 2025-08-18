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
import { DatePickerInput } from "@mantine/dates";
import { useState } from "react";

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
    departments: ["Phòng kỹ thuật", "Phòng vận hành"],
    employees: ["Nguyễn Văn A", "Trần Thị B"],
    supervisor: "Phạm Văn Quản",
    creator: "Lê Thị Điều",
    manager: "Nguyễn Quản Lý",
    seasonPlan: "Kế hoạch mùa Xuân 2025",
  },
];

const PlanManagementAssignPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const onClearAll = () => setKeyword("");
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
    { accessorKey: "startDate", header: "Thời gian thực hiện dự kiến" },
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
      header: "Tuỳ chọn",
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
          Phân công việc
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
      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm công việc</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc khoản thời gian, phòng ban,...
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
            description="Ví dụ: Công việc tưới nước"
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
              label="Phòng ban"
              description="Ví dụ: Phòng kỹ thuật, Phòng vận hành"
              placeholder="Chọn thông tin"
              data={[
                { value: "dept1", label: "Phòng kỹ thuật" },
                { value: "dept2", label: "Phòng vận hành" },
                { value: "dept3", label: "Phòng nhân sự" },
              ]}
              searchable
              clearable
            />
            <MultiSelect
              radius={4}
              label="Nhân sự"
              description="Ví dụ: Nhân sự 1, Nhân sự 2"
              placeholder="Chọn thông tin"
              data={[
                { value: "staff1", label: "Nhân sự 1" },
                { value: "staff2", label: "Nhân sự 2" },
                { value: "staff3", label: "Nhân sự 3" },
              ]}
              searchable
              clearable
            />
            <MultiSelect
              radius={4}
              label="Người quản lý"
              description="Ví dụ: Quản lý 1, Quản lý 2"
              placeholder="Chọn thông tin"
              data={[
                { value: "manager1", label: "Quản lý 1" },
                { value: "manager2", label: "Quản lý 2" },
              ]}
              searchable
              clearable
            />
            <MultiSelect
              radius={4}
              label="Người kiểm định"
              description="Ví dụ: Kiểm định 1, Kiểm định 2"
              placeholder="Chọn thông tin"
              data={[
                { value: "inspector1", label: "Kiểm định 1" },
                { value: "inspector2", label: "Kiểm định 2" },
              ]}
              searchable
              clearable
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

      <Table columns={assignmentColumns} data={assignmentData} />
    </Stack>
  );
};

export default PlanManagementAssignPage;
