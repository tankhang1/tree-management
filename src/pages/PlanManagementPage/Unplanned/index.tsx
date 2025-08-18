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
  name: string;
  assignDate: string;
  startDate: string;
  endDate: string;
  departments: string[];
  employees: string[];
  creator: string;
  supervisor: string;
  locationPath: string;
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
    departments: ["Phòng kỹ thuật"],
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
  const [keyword, setKeyword] = useState("");
  const onClearAll = () => {
    setKeyword("");
  };
  const onAddUnplanned = () => navigate(PATH.PLAN_ADD_UNPLANNED);
  const onUnplannedDetail = (name: string) => {
    console.log("Xem chi tiết:", name);
    navigate(PATH.PLAN_UNPLANNED_DETAIL); // thay bằng PATH có id nếu cần
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
        row.original.employees.map((d, i) => (
          <Badge key={i} size="xs" color="green" mr={4}>
            {d}
          </Badge>
        )),
    },
    { accessorKey: "creator", header: "Người tạo" },
    {
      accessorKey: "supervisor",
      header: "Người kiểm định",
      Cell: ({ row }) => row.original.supervisor || "--",
    },
    { accessorKey: "locationPath", header: "Vị trí thực hiện" },
    {
      accessorKey: "resources",
      header: "Tài sản",
      Cell: ({ row }) => (
        <Stack gap="xs">
          {row.original.resources.map((r, i) => (
            <Group key={i} gap={4}>
              <Text size="sm">
                - {r.name} ({r.quantity} {r.unit ?? ""})
              </Text>
            </Group>
          ))}
        </Stack>
      ),
    },
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
              onClick={() => onUnplannedDetail(row.original.name)}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item
              leftSection={<IconEdit size={18} color="green" />}
              onClick={() => console.log("Chỉnh sửa:", row.original.name)}
            >
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size={18} />}
              color="red"
              onClick={() => console.log("Xoá:", row.original.name)}
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

      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm công việc phát sinh</Title>
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

export default PlanManagementUnplannedPage;
