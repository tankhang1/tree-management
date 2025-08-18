import {
  Button,
  Card,
  Group,
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
  IconFileExcel,
  IconRefresh,
  IconSearch,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import AddMaintenanceForm from "./components/AddMaintenanceForm";
import { DatePickerInput } from "@mantine/dates";
type MaintenanceDetail = {
  id: string;
  machineId: string; // liên kết máy móc IV.1
  material: string; // tên máy
  startTime: string; // thời gian bảo trì
  endTime: string; // thời gian kết thúc
  staffId: string; // liên kết nhân viên (XI)
  reason: string; // lý do
  cost: number; // chi phí
  description: string; // nội dung bảo trì
};
const maintenanceDetails: MaintenanceDetail[] = [
  {
    id: "MD001",
    machineId: "MC001",
    material: "Xe tải Hino 5 tấn",
    startTime: "2024-06-01T08:00:00",
    endTime: "2024-06-01T10:30:00",
    staffId: "EMP001",
    reason: "Thay nhớt định kỳ",
    cost: 500_000,
    description: "Thay nhớt động cơ, kiểm tra lọc dầu, tổng vệ sinh máy.",
  },
  {
    id: "MD002",
    machineId: "MC002",
    material: "Xe nâng điện",
    startTime: "2024-06-03T13:00:00",
    endTime: "2024-06-03T15:45:00",
    staffId: "EMP003",
    reason: "Bảo trì hộp số",
    cost: 2_000_000,
    description: "Tháo và làm sạch hộp số, bôi trơn lại, thay bạc đạn.",
  },
];
const MachineManagementMaintenanceHistoryPage = () => {
  const [
    openedAddMaintenanceMachine,
    { open: openAddMaintenanceMachine, close: closeAddMaintenanceMachine },
  ] = useDisclosure(false);
  const maintenanceDetailColumns: MRT_ColumnDef<MaintenanceDetail>[] = [
    {
      accessorKey: "id",
      header: "Mã bảo trì",
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
      accessorKey: "staffId",
      header: "Nhân viên",
    },
    {
      accessorKey: "reason",
      header: "Lý do",
    },
    {
      accessorKey: "cost",
      header: "Chi phí",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
    },
    {
      accessorKey: "description",
      header: "Nội dung",
    },
  ];
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Lịch sử bảo trì
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openAddMaintenanceMachine}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm lịch sử bảo trì</Title>
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
              label="Nhân viên"
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
      <Table columns={maintenanceDetailColumns} data={maintenanceDetails} />
      <Modal
        opened={openedAddMaintenanceMachine}
        onClose={closeAddMaintenanceMachine}
        title={<Text fw={"bold"}>Tạo phiếu bảo trì</Text>}
      >
        <AddMaintenanceForm />
      </Modal>
    </Stack>
  );
};
export default MachineManagementMaintenanceHistoryPage;
