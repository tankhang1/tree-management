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
import AddFertilizerUsageForm from "./components/AddFertilizerUsageForm";
import { DatePickerInput } from "@mantine/dates";

type FertilizerUsageRecord = {
  id: string;
  fertilizerId: string;
  startTime: string; // ISO string
  endTime: string;
  usedBy: string;
  purpose: string;
  location: string;
};

const usageRecords: FertilizerUsageRecord[] = [
  {
    id: "FERUSE001",
    fertilizerId: "FER001",
    startTime: "2024-06-01T08:00:00",
    endTime: "2024-06-01T09:30:00",
    usedBy: "Nguyễn Văn Thắng",
    purpose: "Phun phân bón lá cho lô 1",
    location: "Vùng trồng A1",
  },
  {
    id: "FERUSE002",
    fertilizerId: "FER002",
    startTime: "2024-06-05T10:00:00",
    endTime: "2024-06-05T11:00:00",
    usedBy: "Lê Thị Mai",
    purpose: "Rải phân NPK",
    location: "Vùng trồng B2",
  },
  {
    id: "FERUSE003",
    fertilizerId: "FER003",
    startTime: "2024-06-10T14:00:00",
    endTime: "2024-06-10T15:00:00",
    usedBy: "Phạm Văn Duy",
    purpose: "Bón lót trước khi gieo",
    location: "Khu đất số 5",
  },
];

const FertilizerManagementUsageHistoryPage = () => {
  const [
    openedAddFertilizerUsage,
    { open: openAddFertilizerUsage, close: closeAddFertilizerUsage },
  ] = useDisclosure(false);

  const usageColumns: MRT_ColumnDef<FertilizerUsageRecord>[] = [
    {
      accessorKey: "id",
      header: "Mã sử dụng",
    },
    {
      accessorKey: "fertilizerId",
      header: "Mã phân bón",
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
          Lịch sử sử dụng phân bón
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openAddFertilizerUsage}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm lịch sử sử dụng phân bón</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc khoản thời gian, loại phân bón
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
            description="Ví dụ: Phân NPK"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <DatePickerInput
              type="range"
              radius={4}
              label="Khoảng thời gian"
              description="Ví dụ: 15/5/2025 - 18/5/2025"
              placeholder="Ví dụ: 15/5/2025 - 18/5/2025"
              clearable
            />
            <MultiSelect
              label="Loại phân bón"
              description="Ví dụ: Phân NPK, Phân hữu cơ"
              placeholder="Chọn thông tin"
              data={["Phân NPK", "Phân hữu cơ", "Phân vi sinh"]}
              searchable
              clearable
              radius={4}
            />
          </SimpleGrid>
        </Stack>
      </Card>
      <Table columns={usageColumns} data={usageRecords} />
      <Modal
        opened={openedAddFertilizerUsage}
        onClose={closeAddFertilizerUsage}
        title={<Text fw={"bold"}>Tạo phiếu sử dụng phân bón</Text>}
      >
        <AddFertilizerUsageForm />
      </Modal>
    </Stack>
  );
};

export default FertilizerManagementUsageHistoryPage;
