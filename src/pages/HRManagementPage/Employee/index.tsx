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
  Modal,
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
  IconCheck,
  IconPlus,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import { useState, useMemo } from "react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useEmployeeStore, type Employee } from "../../zustand/employeeStore";

// IMPORT STORE

dayjs.extend(isBetween);

const HRManagementEmployeePage = () => {
  const navigate = useNavigate();

  // 1. KẾT NỐI STORE
  const { employees, deleteEmployee } = useEmployeeStore();

  // 2. STATES FILTER
  const [keyword, setKeyword] = useState("");
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  // Modal Delete
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 3. HANDLERS
  const onAddEmployee = () => navigate(PATH.HR_ADD_EMPLOYEE);
  const onEmployeeDetail = (id: string) =>
    navigate(`${PATH.HR_EMPLOYEE_DETAIL}/${id}`);
  const onEditEmployee = (id: string) =>
    navigate(`${PATH.HR_ADD_EMPLOYEE}/${id}`); // Giả định dùng chung form edit

  const confirmDelete = (id: string) => {
    setSelectedId(id);
    openDelete();
  };

  const handleDelete = () => {
    if (selectedId) {
      deleteEmployee(selectedId);
      notifications.show({
        title: "Thành công",
        message: "Đã xóa nhân sự khỏi hệ thống",
        color: "green",
        icon: <IconCheck />,
      });
      closeDelete();
      setSelectedId(null);
    }
  };

  const handleResetFilter = () => {
    setKeyword("");
    setSelectedDepts([]);
    setSelectedRoles([]);
    setSelectedStatus([]);
    setDateRange([null, null]);
  };

  // 4. FILTER LOGIC
  const filteredData = useMemo(() => {
    return employees.filter((emp) => {
      const kw = keyword.toLowerCase().trim();

      // Lọc từ khóa (Tên, username, ID)
      const matchKw =
        !kw ||
        emp.fullName.toLowerCase().includes(kw) ||
        emp.username.toLowerCase().includes(kw) ||
        emp.id.toLowerCase().includes(kw);

      // Lọc Phòng ban
      const matchDept =
        selectedDepts.length === 0 ||
        emp.departments.some((d) => selectedDepts.includes(d));

      // Lọc Vai trò
      const matchRole =
        selectedRoles.length === 0 || selectedRoles.includes(emp.role);

      // Lọc Trạng thái
      const matchStatus =
        selectedStatus.length === 0 || selectedStatus.includes(emp.status);

      // Lọc Thời gian (Ngày sinh hoặc Ngày tạo - ở đây ví dụ lọc theo Ngày tạo)
      let matchDate = true;
      if (dateRange[0] && dateRange[1]) {
        const targetDate = dayjs(emp.createdAt); // Hoặc emp.birthDate
        matchDate = targetDate.isBetween(
          dateRange[0],
          dateRange[1],
          "day",
          "[]"
        );
      }

      return matchKw && matchDept && matchRole && matchStatus && matchDate;
    });
  }, [
    employees,
    keyword,
    selectedDepts,
    selectedRoles,
    selectedStatus,
    dateRange,
  ]);

  // Dữ liệu Options cho Filter (Dynamic)
  const deptOptions = useMemo(
    () => Array.from(new Set(employees.flatMap((e) => e.departments))),
    [employees]
  );
  const roleOptions = useMemo(
    () => Array.from(new Set(employees.map((e) => e.role))),
    [employees]
  );

  // 5. TABLE COLUMNS
  const staffColumns: MRT_ColumnDef<Employee>[] = [
    {
      accessorKey: "avatarUrl",
      header: "Ảnh",
      Cell: ({ row }) => (
        <Avatar
          src={row.original.avatarUrl}
          radius="xl"
          size="md"
          color="blue"
          alt={row.original.fullName}
        >
          {row.original.fullName.charAt(0)}
        </Avatar>
      ),
      size: 60,
    },
    { accessorKey: "id", header: "Mã NV", size: 100 },
    { accessorKey: "username", header: "Username" },
    {
      accessorKey: "fullName",
      header: "Họ tên",
      Cell: ({ cell }) => <Text fw={500}>{cell.getValue<string>()}</Text>,
    },
    { accessorKey: "birthDate", header: "Ngày sinh" },
    { accessorKey: "role", header: "Vai trò" },
    { accessorKey: "level", header: "Cấp bậc" },
    {
      accessorKey: "departments",
      header: "Phòng ban",
      Cell: ({ row }) => (
        <Stack gap={2}>
          {row.original.departments.map((d, i) => (
            <Badge key={i} size="sm" variant="light">
              {d}
            </Badge>
          ))}
        </Stack>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      Cell: ({ row }) => {
        const value = row.original.status;
        let color = "gray";
        let label = value;

        if (value === "active") {
          color = "green";
          label = "Đang làm việc";
        }
        if (value === "inactive") {
          color = "red";
          label = "Nghỉ việc";
        }
        if (value === "probation") {
          color = "yellow";
          label = "Thử việc";
        }

        return (
          <Badge color={color} variant="dot">
            {label}
          </Badge>
        );
      },
    },
    { accessorKey: "manager", header: "Người quản lý" },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 60,
      Cell: ({ row }) => (
        <Menu shadow="md" position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="transparent" c={"gray"}>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            {/* <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={() => onEmployeeDetail(row.original.id)}
            >
              Chi tiết
            </Menu.Item> */}
            <Menu.Item
              leftSection={<IconEdit size={18} color="green" />}
              onClick={() => onEditEmployee(row.original.id)}
            >
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size={18} color="red" />}
              onClick={() => confirmDelete(row.original.id)}
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
      {/* HEADER */}
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý quản trị viên
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất Excel
          </Button>
          <Button
            radius={4}
            onClick={onAddEmployee}
            leftSection={<IconPlus size={18} />}
          >
            Thêm mới
          </Button>
        </Group>
      </Group>

      {/* FILTER CARD */}
      <Card withBorder shadow="sm" radius={4} p="md">
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm nhân sự</Title>
            <Text c="dimmed" size="sm">
              Lọc theo tên, mã, phòng ban, vai trò hoặc trạng thái
            </Text>
          </Stack>

          <Group>
            <Tooltip label="Xoá tất cả bộ lọc">
              <Button
                radius={4}
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={handleResetFilter}
              >
                Làm mới
              </Button>
            </Tooltip>
            <Button radius={4} leftSection={<IconSearch size={16} />}>
              Tìm kiếm
            </Button>
          </Group>
        </Group>

        <Stack gap="sm">
          <TextInput
            radius={4}
            label="Khung tìm kiếm"
            description="Nhập tên, mã nhân viên, username..."
            placeholder="VD: Nguyễn Văn A"
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="sm">
            <DatePickerInput
              leftSection={<IconCalendar size={18} />}
              label="Khoảng thời gian (Ngày tạo)"
              placeholder="Chọn khoảng ngày"
              radius={4}
              clearable
              type="range"
              value={dateRange}
              //@ts-expect-error no check
              onChange={setDateRange}
            />

            <MultiSelect
              searchable
              clearable
              radius={4}
              leftSection={<IconHome size={18} />}
              label="Phòng ban"
              placeholder="Chọn phòng ban"
              data={deptOptions}
              value={selectedDepts}
              onChange={setSelectedDepts}
            />

            <MultiSelect
              searchable
              clearable
              radius={4}
              label="Vai trò"
              placeholder="Chọn vai trò"
              data={roleOptions}
              value={selectedRoles}
              onChange={setSelectedRoles}
            />

            <MultiSelect
              searchable
              clearable
              radius={4}
              label="Trạng thái"
              placeholder="Chọn trạng thái"
              data={[
                { value: "active", label: "Đang làm việc" },
                { value: "inactive", label: "Nghỉ việc" },
                { value: "probation", label: "Thử việc" },
              ]}
              value={selectedStatus}
              onChange={setSelectedStatus}
            />
          </SimpleGrid>
        </Stack>
      </Card>

      {/* TABLE */}
      <Table
        // @ts-expect-error MRT type mismatch with custom data
        columns={staffColumns}
        //@ts-expect-error no check
        data={filteredData}
      />

      {/* DELETE MODAL */}
      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title="Xác nhận xóa"
        centered
        radius={4}
      >
        <Text>Bạn có chắc chắn muốn xóa nhân sự này không?</Text>
        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={closeDelete} radius={4}>
            Hủy
          </Button>
          <Button color="red" onClick={handleDelete} radius={4}>
            Xóa ngay
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
};
export default HRManagementEmployeePage;
