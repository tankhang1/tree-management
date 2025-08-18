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
import AddMaterialUsageForm from "./components/AddMaterialUsageForm";
import { DatePickerInput } from "@mantine/dates";

type MaterialUsageRecord = {
  id: string;
  materialId: string;
  material: string;
  startTime: string; // ISO string
  endTime: string;
  usedBy: string;
  purpose: string;
  location: string;
};

const usageRecords: MaterialUsageRecord[] = [
  {
    id: "MATUSE001",
    materialId: "MAT001",
    material: "Bạt phủ nilon đen",
    startTime: "2024-06-01T08:00:00",
    endTime: "2024-06-01T09:30:00",
    usedBy: "Nguyễn Văn Thắng",
    purpose: "Phun phân bón lá cho lô 1",
    location: "Vùng trồng A1",
  },
  {
    id: "MATUSE002",
    materialId: "MAT002",
    material: "Bao tay vải",
    startTime: "2024-06-05T10:00:00",
    endTime: "2024-06-05T11:00:00",
    usedBy: "Lê Thị Mai",
    purpose: "Rải phân NPK",
    location: "Vùng trồng B2",
  },
  {
    id: "MATUSE003",
    materialId: "MAT003",
    material: "Bao lưới",
    startTime: "2024-06-10T14:00:00",
    endTime: "2024-06-10T15:00:00",
    usedBy: "Phạm Văn Duy",
    purpose: "Bón lót trước khi gieo",
    location: "Khu đất số 5",
  },
];

const SupplyManagementUsageHistoryPage = () => {
  const [
    openedAddMaterialUsage,
    { open: openAddMaterialUsage, close: closeAddMaterialUsage },
  ] = useDisclosure(false);

  const usageColumns: MRT_ColumnDef<MaterialUsageRecord>[] = [
    {
      accessorKey: "id",
      header: "Mã sử dụng",
    },
    {
      accessorKey: "materialId",
      header: "Mã vật tư",
    },
    {
      accessorKey: "material",
      header: "Tên vật tư",
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
      header: "Nhân viên",
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
          Lịch sử sử dụng vật tư
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openAddMaterialUsage}>
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
              Điền từ khóa hoặc chọn lọc loại vật tư, khoản thời gian, nhân viên
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
            description="Ví dụ: Bạt phủ nilon"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <DatePickerInput
              radius={4}
              leftSection={<IconCalendar size={18} />}
              label="Khoản thời gian"
              placeholder="Chọn thông tin"
              description="Ví dụ: 18/5/2025 - 20/5/2025"
            />
            <MultiSelect
              radius={4}
              label="Loại vật tư"
              description="Ví dụ: Vật tư A, Vật tư B"
              placeholder="Chọn thông tin"
              data={["Vật tư nông nghiệp", "Vật tư đóng gói", "Vật tư khác"]}
            />
            <MultiSelect
              radius={4}
              label="Nhân viên"
              description="Ví dụ: Nhân viên A, Nhân viên B"
              placeholder="Chọn thông tin"
              data={["Nhân viên 1", "Nhân viên 2", "Nhân viên 3"]}
            />
          </SimpleGrid>
        </Stack>
      </Card>
      <Table columns={usageColumns} data={usageRecords} />
      <Modal
        opened={openedAddMaterialUsage}
        onClose={closeAddMaterialUsage}
        title={<Text fw={"bold"}>Tạo phiếu sử dụng vật tư</Text>}
      >
        <AddMaterialUsageForm />
      </Modal>
    </Stack>
  );
};

export default SupplyManagementUsageHistoryPage;
