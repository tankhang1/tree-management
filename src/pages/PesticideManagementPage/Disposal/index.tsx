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
import { IconFileExcel, IconRefresh, IconSearch } from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import AddDisposalForm from "./components/AddDisposalForm";
import { DatePickerInput } from "@mantine/dates";

type PesticideDisposalDetail = {
  id: string;
  pesticideId: string; // Mã thuốc
  pesticide: string;
  disposalDate: string; // Ngày huỷ
  staffId: string; // Người thực hiện
  reason: string; // Lý do huỷ
  quantity: number; // Số lượng huỷ
  notes: string; // Ghi chú
};

const pesticideDisposalDetails: PesticideDisposalDetail[] = [
  {
    id: "PD001",
    pesticideId: "PST001",
    pesticide: "Thuốc trừ sâu SuperKiller",
    disposalDate: "2024-07-01T09:00:00",
    staffId: "EMP002",
    reason: "Thuốc hết hạn sử dụng",
    quantity: 12,
    notes: "12 chai thuốc trừ sâu hết hạn tháng 6/2024",
  },
  {
    id: "PD002",
    pesticideId: "PST003",
    pesticide: "Thuốc trừ bệnh BioShield",
    disposalDate: "2024-07-08T15:30:00",
    staffId: "EMP004",
    reason: "Bao bì rách, không đảm bảo chất lượng",
    quantity: 5,
    notes: "5 gói thuốc vi sinh bị thấm nước",
  },
];

const PesticideManagementDisposalPage = () => {
  const [
    openedAddDisposal,
    { open: openAddDisposal, close: closeAddDisposal },
  ] = useDisclosure(false);

  const columns: MRT_ColumnDef<PesticideDisposalDetail>[] = [
    {
      accessorKey: "id",
      header: "Mã phiếu huỷ",
    },
    {
      accessorKey: "pesticideId",
      header: "Mã thuốc",
    },
    {
      accessorKey: "pesticide",
      header: "Tên thuốc",
    },
    {
      accessorKey: "disposalDate",
      header: "Ngày huỷ",
      Cell: ({ cell }) =>
        new Date(cell.getValue<string>()).toLocaleString("vi-VN"),
    },
    {
      accessorKey: "staffId",
      header: "Người thực hiện",
    },
    {
      accessorKey: "reason",
      header: "Lý do huỷ",
    },
    {
      accessorKey: "quantity",
      header: "Số lượng",
      Cell: ({ cell }) => `${cell.getValue<number>()} đơn vị`,
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
          Danh sách thuốc huỷ
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
            <Title order={4}>Tìm kiếm lịch sử huỷ thuốc bảo vệ thực vật</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc khoản thời gian, loại thuốc
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
            description="Ví dụ: Thuốc trừ sâu SuperKiller"
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
              label="Loại thuốc"
              description="Ví dụ: Thuốc trừ sâu, Thuốc diệt cỏ"
              data={["Thuốc trừ sâu", "Thuốc diệt cỏ", "Phân bón"]}
              placeholder="Chọn thông tin"
              searchable
              clearable
              radius={4}
            />
          </SimpleGrid>
        </Stack>
      </Card>
      <Table columns={columns} data={pesticideDisposalDetails} />
      <Modal
        opened={openedAddDisposal}
        onClose={closeAddDisposal}
        title={<Text fw={"bold"}>Tạo phiếu huỷ thuốc</Text>}
      >
        <AddDisposalForm />
      </Modal>
    </Stack>
  );
};

export default PesticideManagementDisposalPage;
