import {
  ActionIcon,
  Button,
  Card,
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
import { useDisclosure } from "@mantine/hooks";
import AddEquipmentUsageForm from "./components/AddEquipmentUsageForm";
import { DatePickerInput } from "@mantine/dates";
type EquipmentUsageRecord = {
  id: string;
  machineId: string;
  material: string; // tên máy
  startTime: string; // ISO format: "2024-06-01T08:00:00"
  endTime: string; // ISO format
  usedBy: string;
  purpose: string;
  location: string;
};
const usageRecords: EquipmentUsageRecord[] = [
  {
    id: "USE001",
    machineId: "MC001",
    material: "Xe tải Hino 5 tấn",
    startTime: "2024-06-01T08:00:00",
    endTime: "2024-06-01T11:30:00",
    usedBy: "Nguyễn Văn Tâm",
    purpose: "Vận chuyển nguyên liệu từ kho A đến xưởng B",
    location: "Khu vực sản xuất 1",
  },
  {
    id: "USE002",
    machineId: "MC001",
    material: "Xe nâng điện",
    startTime: "2024-06-03T14:00:00",
    endTime: "2024-06-03T17:00:00",
    usedBy: "Trần Thị Hồng",
    purpose: "Chạy thử máy sau bảo trì",
    location: "Xưởng kiểm tra kỹ thuật",
  },
  {
    id: "USE003",
    machineId: "MC002",
    material: "Xe nâng điện",
    startTime: "2024-06-10T07:45:00",
    endTime: "2024-06-10T10:15:00",
    usedBy: "Lê Văn Khoa",
    purpose: "Cày đất chuẩn bị trồng",
    location: "Vùng trồng số 3",
  },
];
const MachineManagementUsageHistoryPage = () => {
  const [
    openedAddUsageMachine,
    { open: openAddUsageMachine, close: closeAddUsageMachine },
  ] = useDisclosure(false);
  const usageColumns: MRT_ColumnDef<EquipmentUsageRecord>[] = [
    {
      accessorKey: "id",
      header: "Mã sử dụng",
    },
    {
      accessorKey: "machineId",
      header: "Mã máy",
    },
    {
      accessorKey: "material",
      header: "Tên máy",
    },
    {
      accessorKey: "startTime",
      header: "Bắt đầu",
      Cell: ({ cell }) =>
        new Date(cell.getValue<string>()).toLocaleString("vi-VN"),
    },
    {
      accessorKey: "endTime",
      header: "Kết thúc",
      Cell: ({ cell }) =>
        new Date(cell.getValue<string>()).toLocaleString("vi-VN"),
    },
    {
      accessorKey: "usedBy",
      header: "Người sử dụng",
    },
    {
      accessorKey: "location",
      header: "Vị trí",
    },
    {
      accessorKey: "purpose",
      header: "Lí do sử dụng",
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
            <Menu.Item leftSection={<IconEye size={18} color="gray" />}>
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
          Lịch sử sử dụng
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openAddUsageMachine}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm lịch sử sử dụng</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc khoản thời gian, nhân viên
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
            <DatePickerInput
              radius={4}
              type="range"
              locale="vi"
              label="Khoản thời gian"
              description="Ví dụ: 15/5/2025 - 16/6/2025"
              placeholder="Chọn thông tin"
              leftSection={<IconCalendar size={16} />}
            />
            <MultiSelect
              label="Loại máy"
              description="Ví dụ: Máy xúc, Xe tải"
              data={["Máy xúc", "Máy ủi", "Máy đào"]}
              placeholder="Chọn thông tin"
              searchable
              clearable
              radius={4}
            />
            <MultiSelect
              label="Người sử dụng"
              description="Ví dụ: Nguyễn Văn A, Trần Thị B"
              data={["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"]}
              placeholder="Chọn thông tin"
              searchable
              clearable
              radius={4}
            />
          </SimpleGrid>
        </Stack>
      </Card>
      <Table columns={usageColumns} data={usageRecords} />
      <Modal
        opened={openedAddUsageMachine}
        onClose={closeAddUsageMachine}
        title={<Text fw={"bold"}>Tạo phiếu sử dụng</Text>}
      >
        <AddEquipmentUsageForm />
      </Modal>
    </Stack>
  );
};
export default MachineManagementUsageHistoryPage;
