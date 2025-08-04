import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Menu,
  Modal,
  MultiSelect,
  Radio,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconCircleCheck,
  IconDotsVertical,
  IconFileExcel,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import CreateBatmanTaskForm from "./components/CreateBatmanTaskForm";
import { useState } from "react";
import { EmployeeCardList } from "../../HRManagementPage/Team/Add/components/EmployeeCardList";
import { DepartmentCardList } from "../../HRManagementPage/Team/Add/components/DepartmentCardList";
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
  const [
    openedFilterEmployee,
    { open: openFilterEmployee, close: closeFilterEmployee },
  ] = useDisclosure(false);
  const [mode, setMode] = useState("");
  const [openedAddTask, { open: openAddTask, close: closeAddTask }] =
    useDisclosure(false);
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
          Quản lý công việc BATMAN
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button onClick={openAddTask} radius={4}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={columns} data={employeeTasks} />
      <Modal
        opened={openedAddTask}
        onClose={closeAddTask}
        title={<Text fw={"500"}>Tạo mới công việc BATMAN</Text>}
      >
        <CreateBatmanTaskForm onFilter={openFilterEmployee} />
      </Modal>
      <Modal
        opened={openedFilterEmployee}
        onClose={closeFilterEmployee}
        size={"lg"}
        title={<Text fw={"bold"}>Lọc nhân sự</Text>}
      >
        <Stack gap={"xs"}>
          <Radio.Group
            label="Phương thức lọc"
            value={mode}
            onChange={(val) => setMode(val as "group" | "dept")}
          >
            <Radio value="group" mb={"xs"} label="Chọn theo đội nhóm" />
            <Radio value="dept" label="Chọn theo phòng ban và vai trò" />
          </Radio.Group>

          {mode === "group" && (
            <MultiSelect
              label="Chọn đội nhóm"
              radius={4}
              data={["Nhóm Canh tác", "Nhóm Vật tư"]}
            />
          )}

          {mode === "dept" && (
            <>
              <TextInput
                label="Phòng ban"
                placeholder="Tìm kiếm phòng ban liên quan"
                leftSection={<IconSearch size={16} />}
                radius={4}
              />
              <DepartmentCardList />
              <MultiSelect
                label="Chọn vai trò"
                radius={4}
                data={["Giám đốc", "Tổ trưởng", "Trưởng phòng"]}
              />
            </>
          )}
          <TextInput
            label="Tìm kiếm nhân viên (chọn nhiều)"
            placeholder="Chọn thành viên từ nhân sự"
            leftSection={<IconSearch size={16} />}
            radius={4}
          />
          <EmployeeCardList />
        </Stack>

        <Group mt="md" justify="flex-end">
          <Button
            radius={4}
            variant="outline"
            color="red"
            onClick={closeFilterEmployee}
          >
            Huỷ
          </Button>
          <Button radius={4}>Xác nhận</Button>
        </Group>
      </Modal>
    </Stack>
  );
};
export default TaskManagementBatmanPage;
