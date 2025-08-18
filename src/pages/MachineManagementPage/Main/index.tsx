import {
  ActionIcon,
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
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconRefresh,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
type MachineStatus = "Đang bảo trì" | "Đang vận hành" | "Đang trống";
type VehicleType = "Xe tải" | "Xe múc" | "Máy móc khác" | "Xe cày";
type Machine = {
  id: string; // Mã máy
  name: string;
  type: VehicleType;
  specs: string; // Thông số kỹ thuật
  price: number;
  status: MachineStatus;
  manualFile?: string; // URL hoặc path file sổ tay
  inspectionFile?: string; // URL hoặc path file biên bản đăng kiểm
  maintenanceHistoryIds: string[]; // Mã tham chiếu đến danh sách bảo trì
};
const machines: Machine[] = [
  {
    id: "MC001",
    name: "Xe tải Hino 5 tấn",
    type: "Xe tải",
    specs: "Động cơ diesel, 5 tấn, thùng kín",
    price: 780_000_000,
    status: "Đang vận hành",
    manualFile: "/files/MC001_manual.pdf",
    inspectionFile: "/files/MC001_inspection.pdf",
    maintenanceHistoryIds: ["MT001", "MT005"],
  },
  {
    id: "MC002",
    name: "Máy cày Kubota",
    type: "Xe cày",
    specs: "Máy cày 2 cầu, công suất 45HP",
    price: 320_000_000,
    status: "Đang bảo trì",
    manualFile: "/files/MC002_manual.pdf",
    inspectionFile: "/files/MC002_inspection.pdf",
    maintenanceHistoryIds: ["MT003"],
  },
];

const MachineManagementMainPage = () => {
  const navigate = useNavigate();
  const onAddMachine = () => {
    navigate(PATH.MACHINE_ADD_MAIN);
  };
  const onDetailMachine = () => {
    navigate(PATH.MACHINE_MAIN_DETAIL);
  };
  const machineColumns: MRT_ColumnDef<Machine>[] = [
    {
      accessorKey: "id",
      header: "Mã máy",
      size: 100,
    },
    {
      accessorKey: "name",
      header: "Tên máy móc",
      size: 180,
    },
    {
      accessorKey: "type",
      header: "Loại xe",
      size: 120,
    },
    {
      accessorKey: "specs",
      header: "Thông số kỹ thuật",
      size: 220,
    },
    {
      accessorKey: "price",
      header: "Giá",
      size: 120,
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
    },
    {
      accessorKey: "status",
      header: "Tình trạng",
      size: 140,
      Cell: ({ cell }) => {
        const value = cell.getValue<Machine["status"]>();
        const color =
          value === "Đang vận hành"
            ? "green"
            : value === "Đang bảo trì"
            ? "orange"
            : "gray";
        return <span style={{ color, fontWeight: "bold" }}>{value}</span>;
      },
    },
    {
      accessorKey: "manualFile",
      header: "Sổ tay hướng dẫn",
      size: 160,
      Cell: ({ cell }) => {
        const file = cell.getValue<string>();
        return file ? (
          <a href={file} target="_blank" rel="noopener noreferrer">
            📘 Xem file
          </a>
        ) : (
          "-"
        );
      },
    },
    {
      accessorKey: "inspectionFile",
      header: "Biên bản ĐK",
      size: 160,
      Cell: ({ cell }) => {
        const file = cell.getValue<string>();
        return file ? (
          <a href={file} target="_blank" rel="noopener noreferrer">
            📄 Tải file
          </a>
        ) : (
          "-"
        );
      },
    },
    {
      accessorKey: "maintenanceHistoryIds",
      header: "Lịch sử bảo trì",
      size: 140,
      Cell: ({ cell }) => {
        const ids = cell.getValue<string[]>();
        return ids.length ? `${ids.length} lần` : "Không có";
      },
    },
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
              onClick={onDetailMachine}
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
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý máy móc
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddMachine}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm máy móc</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc loại xe, trạng thái
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
            description="Ví dụ: Xe tải Hino"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <MultiSelect
              radius={4}
              label="Loại xe"
              description="Ví dụ: Xe tải, Xe ben"
              placeholder="Chọn thông tin"
              data={["Xe tải", "Xe ben", "Xe con"]}
            />
            <MultiSelect
              radius={4}
              label="Trạng thái"
              description="Ví dụ: Đang hoạt động, Bảo trì"
              placeholder="Chọn thông tin"
              data={["Đang hoạt động", "Bảo trì", "Ngừng hoạt động"]}
            />
          </SimpleGrid>
        </Stack>
      </Card>
      <Table columns={machineColumns} data={machines} />
    </Stack>
  );
};
export default MachineManagementMainPage;
