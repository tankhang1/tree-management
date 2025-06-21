import {
  ActionIcon,
  Button,
  Group,
  Select,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import Table from "../../../components/Table";
import { type MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import {
  IconPencil,
  IconTrash,
  IconLock,
  IconUserCheck,
  IconFileExport,
} from "@tabler/icons-react";

type Employee = {
  code: string;
  name: string;
  email: string;
  department: string;
  role: string;
  phone: string;
  lastLogin: string;
  createdAt: string;
  status: "Hoạt động" | "Không hoạt động" | "Vô hiệu";
};

const employeeData: Employee[] = [
  {
    code: "01",
    name: "A",
    email: "DK@gmail.com",
    department: "Bán hàng",
    role: "Nhân viên",
    phone: "0347402927",
    lastLogin: "20/02/2025 14:30",
    createdAt: "20/02/2025 14:30",
    status: "Hoạt động",
  },
  {
    code: "01",
    name: "A",
    email: "DK@gmail.com",
    department: "Bán hàng",
    role: "Nhân viên",
    phone: "0347402928",
    lastLogin: "20/02/2025 15:00",
    createdAt: "20/02/2025 15:00",
    status: "Không hoạt động",
  },
  {
    code: "01",
    name: "A",
    email: "DK@gmail.com",
    department: "Kho",
    role: "Quản lý",
    phone: "0347402929",
    lastLogin: "20/02/2025 17:30",
    createdAt: "20/02/2025 17:30",
    status: "Vô hiệu",
  },
  {
    code: "01",
    name: "A",
    email: "DK@gmail.com",
    department: "Vận chuyển",
    role: "Nhân viên",
    phone: "0347402930",
    lastLogin: "20/02/2025 20:30",
    createdAt: "20/02/2025 20:30",
    status: "Hoạt động",
  },
  {
    code: "01",
    name: "A",
    email: "DK@gmail.com",
    department: "Marketing",
    role: "Nhân viên",
    phone: "0347402931",
    lastLogin: "20/02/2025 09:15",
    createdAt: "19/02/2025 09:00",
    status: "Không hoạt động",
  },
  {
    code: "01",
    name: "A",
    email: "DK@gmail.com",
    department: "Kỹ thuật",
    role: "Kỹ sư",
    phone: "0347402932",
    lastLogin: "19/02/2025 18:45",
    createdAt: "18/02/2025 12:00",
    status: "Hoạt động",
  },
  {
    code: "01",
    name: "A",
    email: "DK@gmail.com",
    department: "Hành chính",
    role: "Nhân viên",
    phone: "0347402933",
    lastLogin: "21/02/2025 08:00",
    createdAt: "20/02/2025 10:00",
    status: "Vô hiệu",
  },
];

const EmployeePage = () => {
  const handleEdit = (row: Employee) => console.log("Edit", row);
  const handleDelete = (row: Employee) => console.log("Delete", row);
  const handleLock = (row: Employee) => console.log("Lock", row);

  const columns = useMemo<MRT_ColumnDef<Employee>[]>(
    () => [
      { accessorKey: "code", header: "Mã NV" },
      { accessorKey: "name", header: "Họ tên" },
      { accessorKey: "role", header: "Vai trò" },
      { accessorKey: "department", header: "Phòng ban" },
      { accessorKey: "phone", header: "Số điện thoại" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "lastLogin", header: "Lần đăng nhập cuối" },
      { accessorKey: "createdAt", header: "Ngày tạo" },
      {
        accessorKey: "status",
        header: "Tình trạng",
        Cell: ({ cell }) => {
          const status = cell.getValue() as string;
          const color =
            status === "Hoạt động"
              ? "green"
              : status === "Vô hiệu hoạt"
              ? "gray"
              : "red";
          return (
            <Text size="sm" c={color} fw={500}>
              {status}
            </Text>
          );
        },
      },
      {
        id: "actions",
        header: "",
        enableColumnActions: false,
        enableColumnOrdering: false,
        enableColumnResizing: false,
        enableHiding: false,
        Cell: ({ row }) => (
          <Group gap="xs">
            <Tooltip label="Chỉnh sửa">
              <ActionIcon
                variant="subtle"
                color="green"
                onClick={() => handleEdit(row.original)}
              >
                <IconPencil size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Khóa">
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => handleLock(row.original)}
              >
                <IconLock size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Xóa">
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => handleDelete(row.original)}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ),
      },
    ],
    []
  );

  return (
    <Stack>
      <Group justify="space-between">
        <Text fz="h3" fw="bold">
          Danh sách nhân viên
        </Text>

        <Group>
          <Button
            variant="outline"
            radius={4}
            leftSection={<IconFileExport size={16} />}
          >
            Xuất file
          </Button>
          <Button radius={4} leftSection={<IconUserCheck size={16} />}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Group>
        <Select placeholder="Phòng ban" data={["Bán hàng", "Kỹ thuật"]} />
        <Select placeholder="vai trò" data={["Nhân viên", "Quản lý"]} />
        <Select
          placeholder="Tình trạng"
          data={["Hoạt động", "Không hoạt động", "Vô hiệu hoạt"]}
        />
      </Group>
      <Table columns={columns} data={employeeData} />
    </Stack>
  );
};

export default EmployeePage;
