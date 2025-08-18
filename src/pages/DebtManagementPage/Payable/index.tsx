import {
  Button,
  Group,
  Stack,
  Text,
  Title,
  Badge,
  Menu,
  ActionIcon,
  Card,
  Tooltip,
  TextInput,
  SimpleGrid,
  MultiSelect,
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
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import { DateTimePicker } from "@mantine/dates";

type DebtPayable = {
  id: string; // Mã công nợ
  contactName: string; // Tên liên hệ
  contactPhone: string; // Số điện thoại liên hệ
  category: string; // Phân loại (Khách hàng, Đối tác, Nhà cung cấp, Ngân hàng)
  status: string; // Trạng thái (Chưa thanh toán, Đã thanh toán, Đang xử lý)
  totalDebt: number; // Tổng công nợ
  lastPaymentDate: string; // Thời gian thanh toán gần nhất (YYYY-MM-DD)
  invoices: Invoice[]; // Danh sách hóa đơn
};

type Invoice = {
  invoiceId: string; // Mã hóa đơn
  amount: number; // Số tiền
  paymentMethod: string; // Phương thức thanh toán
  transactionId: string; // Mã giao dịch
};
const debtPayableDataset: DebtPayable[] = [
  {
    id: "DEBT001",
    contactName: "Nguyễn Văn A",
    contactPhone: "0123456789",
    category: "Nhà cung cấp",
    status: "Chưa thanh toán",
    totalDebt: 5000000,
    lastPaymentDate: "2025-07-20",
    invoices: [
      {
        invoiceId: "INV001",
        amount: 2000000,
        paymentMethod: "Chuyển khoản",
        transactionId: "TXN001",
      },
      {
        invoiceId: "INV002",
        amount: 3000000,
        paymentMethod: "Tiền mặt",
        transactionId: "TXN002",
      },
    ],
  },
  {
    id: "DEBT002",
    contactName: "Công ty XYZ",
    contactPhone: "0987654321",
    category: "Ngân hàng",
    status: "Đã thanh toán",
    totalDebt: 10000000,
    lastPaymentDate: "2025-07-15",
    invoices: [
      {
        invoiceId: "INV003",
        amount: 10000000,
        paymentMethod: "Chuyển khoản",
        transactionId: "TXN003",
      },
    ],
  },
];
const DebtManagementPayablePage = () => {
  const navigate = useNavigate();
  const onAddPayable = () => {
    navigate(PATH.DEBT_PAYABLE_ADD);
  };

  const debtPayableColumns: MRT_ColumnDef<DebtPayable>[] = [
    { accessorKey: "id", header: "Mã công nợ" },
    { accessorKey: "contactName", header: "Tên liên hệ" },
    { accessorKey: "contactPhone", header: "Số điện thoại" },
    { accessorKey: "category", header: "Phân loại" },
    {
      accessorKey: "status",
      header: "Trạng thái",
      Cell: ({ cell }) => {
        const status = cell.getValue<string>();
        const color =
          status === "Đã thanh toán"
            ? "green"
            : status === "Chưa thanh toán"
            ? "red"
            : "yellow";

        return <Badge color={color}>{status}</Badge>;
      },
    },
    {
      accessorKey: "totalDebt",
      header: "Tổng công nợ",
      Cell: ({ cell }) => (
        <Text fw={500} color="blue">
          {cell.getValue<number>().toLocaleString("vi-VN")} đ
        </Text>
      ),
    },
    { accessorKey: "lastPaymentDate", header: "Thanh toán gần nhất" },
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
              onClick={onPayableDetail}
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
  const onPayableDetail = () => {
    navigate(PATH.DEBT_PAYABLE_DETAIL);
  };
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý công nợ phải trả
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddPayable}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm công nợ phải trả</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc đối tượng, trạng thái, khoản thời gian
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
            description="Ví dụ: 0RD001"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <DateTimePicker
              radius={4}
              label="Khoản thời gian"
              placeholder="Chọn thời gian"
              description="Ví dụ: 01/01/2023 - 01/01/2025"
              leftSection={<IconCalendar size={18} />}
            />
            <MultiSelect
              label="Phân loại"
              data={[
                { value: "category1", label: "Phân loại 1" },
                { value: "category2", label: "Phân loại 2" },
                { value: "category3", label: "Phân loại 3" },
              ]}
              placeholder="Chọn thông tin"
              searchable
              description="Ví dụ: Khách hàng, Đối tác, Nhà cung cấp"
              radius={4}
            />
            <MultiSelect
              label="Trạng thái"
              description="Ví dụ: Đã thanh toán, Chưa thanh toán, Đang xử lý"
              data={[
                { value: "pending", label: "Chưa thanh toán" },
                { value: "paid", label: "Đã thanh toán" },
                { value: "processing", label: "Đang xử lý" },
              ]}
              placeholder="Chọn trạng thái"
              radius={4}
            />
          </SimpleGrid>
        </Stack>
      </Card>
      <Table columns={debtPayableColumns} data={debtPayableDataset} />
    </Stack>
  );
};
export default DebtManagementPayablePage;
