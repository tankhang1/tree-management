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
import AddDisposalForm from "./components/AddDisposalForm";
import { DatePickerInput } from "@mantine/dates";

type DisposalDetail = {
  id: string;
  machineId: string; // Mã máy bị thanh lý
  material: string; // Tên máy
  disposalDate: string; // Ngày thanh lý
  staffId: string; // Người thực hiện
  reason: string; // Lý do thanh lý
  valueRecovered: number; // Giá trị thu hồi (nếu có)
  notes: string; // Ghi chú thêm
};

const disposalDetails: DisposalDetail[] = [
  {
    id: "DIS001",
    machineId: "MC001",
    material: "Xe tải Hino 5 tấn",
    disposalDate: "2024-07-01T09:00:00",
    staffId: "EMP005",
    reason: "Máy hỏng nặng, không thể sửa chữa",
    valueRecovered: 0,
    notes: "Đưa vào danh sách thanh lý tài sản cố định.",
  },
  {
    id: "DIS002",
    machineId: "MC003",
    material: "Xe nâng điện",
    disposalDate: "2024-07-10T14:00:00",
    staffId: "EMP007",
    reason: "Thanh lý do nâng cấp máy mới",
    valueRecovered: 3_000_000,
    notes: "Đã bán lại cho đối tác phụ tùng cũ.",
  },
];

const MachineManagementDisposalHistoryPage = () => {
  const [
    openedAddDisposal,
    { open: openAddDisposal, close: closeAddDisposal },
  ] = useDisclosure(false);

  const disposalDetailColumns: MRT_ColumnDef<DisposalDetail>[] = [
    {
      accessorKey: "id",
      header: "Mã phiếu",
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
      accessorKey: "disposalDate",
      header: "Ngày thanh lý",
      Cell: ({ cell }) =>
        new Date(cell.getValue<string>()).toLocaleString("vi-VN"),
    },
    {
      accessorKey: "staffId",
      header: "Người thực hiện",
    },
    {
      accessorKey: "reason",
      header: "Lý do",
    },
    {
      accessorKey: "valueRecovered",
      header: "Giá trị thu hồi",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
    },
    {
      accessorKey: "notes",
      header: "Ghi chú",
    },
  ];

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Lịch sử thanh lý máy móc
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openAddDisposal}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm lịch sử thanh lý máy móc</Title>
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
      <Table columns={disposalDetailColumns} data={disposalDetails} />
      <Modal
        opened={openedAddDisposal}
        onClose={closeAddDisposal}
        title={<Text fw={"bold"}>Tạo phiếu thanh lý</Text>}
      >
        <AddDisposalForm />
      </Modal>
    </Stack>
  );
};

export default MachineManagementDisposalHistoryPage;
