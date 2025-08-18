import {
  ActionIcon,
  Badge,
  Button,
  Card,
  CloseButton,
  Group,
  Menu,
  Modal,
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
  IconCircleCheck,
  IconDotsVertical,
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
import { useDisclosure } from "@mantine/hooks";
import UnPlannedDetail from "./components/UnPlannedDetail";
import { useState } from "react";
import { DatePickerInput } from "@mantine/dates";
type EmployeeTask = {
  employee: string;
  taskName: string;
  assignment: string;
  startDate: string; // ISO format: yyyy-mm-dd
  endDate: string;
  status: "Đã hoàn thành" | "Đang thực hiện" | "Chưa bắt đầu";
  reviewer: string;
};

const employeeTasks: EmployeeTask[] = [
  {
    employee: "Nguyễn Văn A",
    taskName: "Phun thuốc trừ sâu đợt 1",
    assignment: "Phiếu giao việc 001",
    startDate: "2025-07-02",
    endDate: "2025-07-04",
    status: "Đang thực hiện",
    reviewer: "Lê Quang D",
  },
  {
    employee: "Trần Thị B",
    taskName: "Phun thuốc trừ sâu đợt 1",
    startDate: "2025-07-02",
    assignment: "Phiếu giao việc 001",
    endDate: "2025-07-04",
    status: "Chưa bắt đầu",
    reviewer: "Ngô Thanh T",
  },
  {
    employee: "Nguyễn Văn C",
    taskName: "Thu hoạch khu vực B",
    assignment: "Phiếu giao việc 001",
    startDate: "2025-07-10",
    endDate: "2025-07-12",
    status: "Đã hoàn thành",
    reviewer: "Phạm Minh H",
  },
];

const TaskManagementMainPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const onClearAll = () => {
    setKeyword("");
  };
  const [openedPlan, { open: openPlan, close: closePlan }] =
    useDisclosure(false);
  const onMainDetail = () => {
    navigate(PATH.TASK_MAIN_DETAIL);
  };
  const onTaskAssign = () => {
    navigate(PATH.PLAN_ADD_UNPLANNED);
  };
  const columns: MRT_ColumnDef<EmployeeTask>[] = [
    { accessorKey: "employee", header: "Nhân viên" },
    { accessorKey: "taskName", header: "Tên công việc" },
    {
      accessorKey: "assignment",
      header: "Phiếu công việc",
      Cell: ({ row }) => (
        <Text c={"green"} onClick={openPlan}>
          {row.original.assignment}
        </Text>
      ),
    },
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
          Quản lý công việc phát sinh
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onTaskAssign}>
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
              Điền từ khóa hoặc chọn lọc trạng thái, thời gian, nhân viên,...
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
              label="Trạng thái"
              description="Ví dụ: Đang thực hiện, Đã hoàn thành"
              placeholder="Chọn thông tin"
              data={[
                { value: "in_progress", label: "Đang thực hiện" },
                { value: "completed", label: "Đã hoàn thành" },
              ]}
            />
            <MultiSelect
              radius={4}
              label="Nhân viên"
              description="Ví dụ: Nhân viên 1, Nhân viên 2"
              placeholder="Chọn thông tin"
              data={[
                { value: "staff1", label: "Nhân viên 1" },
                { value: "staff2", label: "Nhân viên 2" },
                { value: "staff3", label: "Nhân viên 3" },
              ]}
              searchable
              clearable
            />

            <MultiSelect
              radius={4}
              label="Người kiểm duyệt"
              description="Ví dụ: Kiểm duyệt viên 1, Kiểm duyệt viên 2"
              placeholder="Chọn thông tin"
              data={[
                { value: "inspector1", label: "Kiểm duyệt viên 1" },
                { value: "inspector2", label: "Kiểm duyệt viên 2" },
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
      <Table columns={columns} data={employeeTasks} />
      <Modal
        opened={openedPlan}
        onClose={closePlan}
        title={<Text fw={"500"}>Chi tiết kế hoạch phát sinh</Text>}
      >
        <UnPlannedDetail />
      </Modal>
    </Stack>
  );
};
export default TaskManagementMainPage;
